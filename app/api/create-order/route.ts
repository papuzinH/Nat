import { NextResponse } from 'next/server'
import { getProduct } from '@/lib/data/products'
import { computeUnitPrice } from '@/data/products'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { matchZone } from '@/lib/shipping'
import { PB_URL, pbAdminToken, uploadTokenFor } from '@/lib/pb-admin'

/**
 * Crea la orden EN EL SERVIDOR, que es la autoridad de precios. El cliente sólo
 * manda qué productos (slug/talle/marco/cantidad); los montos se recalculan
 * desde PocketBase. Cierra la manipulación de precios del checkout.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ClientItem {
  slug: string
  selectedSize: string | null
  hasFrame: boolean
  frameColor: string | null
  quantity: number
}

interface Body {
  customer: { name?: string; email?: string; phone?: string }
  delivery: { mode?: string; street?: string; city?: string; postalCode?: string; deliveryDay?: string }
  paymentMethod?: string
  items?: ClientItem[]
}

interface ServerItem {
  product_slug: string
  product_title: string
  selected_size: string | null
  has_frame: boolean
  unit_price: number
  quantity: number
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

export async function POST(req: Request) {
  try {
    return await handleCreateOrder(req)
  } catch (err) {
    console.error('[create-order] unhandled error:', err)
    return bad('Error interno al procesar el pedido. Intentá de nuevo.', 500)
  }
}

async function handleCreateOrder(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return bad('Formato inválido.')
  }

  const { customer = {}, delivery = {}, paymentMethod, items } = body

  // ── Validación de campos ──────────────────────────────────────────────
  if (!customer.name?.trim() || !customer.email?.trim() || !customer.phone?.trim()) {
    return bad('Faltan datos de contacto.')
  }
  if (!EMAIL_REGEX.test(customer.email)) return bad('Email inválido.')
  if (paymentMethod !== 'mercadopago' && paymentMethod !== 'transferencia') {
    return bad('Método de pago inválido.')
  }
  if (delivery.mode !== 'envio' && delivery.mode !== 'retiro') {
    return bad('Modalidad de entrega inválida.')
  }
  if (delivery.mode === 'envio') {
    if (!delivery.street?.trim() || !delivery.city?.trim() || !delivery.postalCode?.trim() || !delivery.deliveryDay?.trim()) {
      return bad('Faltan datos de envío.')
    }
  }
  if (!Array.isArray(items) || items.length === 0) return bad('El carrito está vacío.')

  // ── Recalcular precios desde el catálogo (server = autoridad) ─────────
  const serverItems: ServerItem[] = []
  for (const it of items) {
    const qty = Number(it?.quantity)
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return bad('Cantidad inválida.')
    if (typeof it?.slug !== 'string' || !it.slug) return bad('Producto inválido.')

    const product = await getProduct(it.slug)
    if (!product) return bad('Producto no encontrado.', 404)
    if (product.status !== 'active') return bad(`"${product.title}" no está disponible.`, 409)

    const size = it.selectedSize ?? null
    // El talle debe corresponder a una variante real (si el producto tiene variantes).
    if (product.variants && product.variants.length > 0) {
      if (!size || !product.variants.some((v) => v.label === size)) {
        return bad(`Elegí un tamaño válido para "${product.title}".`)
      }
    }
    // El marco sólo cuenta si el producto lo ofrece.
    const hasFrame = Boolean(it.hasFrame) && product.hasFrame
    // Sin existencias suficientes (null = ilimitado / on-demand).
    if (product.stock != null && product.stock < qty) {
      return bad(`No hay stock suficiente de "${product.title}".`, 409)
    }

    serverItems.push({
      product_slug:  product.slug,
      product_title: product.title,
      selected_size: size,
      has_frame:     hasFrame,
      unit_price:    computeUnitPrice(product, size, hasFrame),
      quantity:      qty,
    })
  }

  // ── Admin token (necesario para shipping_zones + crear orden) ────────
  const token = await pbAdminToken()
  if (!token) return bad('Servicio no disponible. Probá de nuevo.', 503)

  // ── Envío (server) ────────────────────────────────────────────────────
  let shippingCost = 0
  if (delivery.mode === 'envio') {
    const zonesRes = await fetch(
      `${PB_URL}/api/collections/shipping_zones/records?perPage=500&filter=${encodeURIComponent('active=true')}`,
      { headers: { Authorization: token }, cache: 'no-store' },
    )
    if (zonesRes.ok) {
      const data = (await zonesRes.json()) as { items: Array<{ active: boolean; price: number; postal_codes: string[]; name: string }> }
      const matched = matchZone(delivery.postalCode ?? '', data.items ?? [])
      shippingCost = matched ? matched.price : 0 // sin zona → 0 (a coordinar)
    }
  }

  const total = serverItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0) + shippingCost

  // ── Crear la orden con credenciales admin ─────────────────────────────

  const createRes = await fetch(`${PB_URL}/api/collections/orders/records`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status:         paymentMethod === 'mercadopago' ? 'pendiente' : 'pendiente_de_pago',
      customer_name:  customer.name.trim(),
      customer_email: customer.email.trim(),
      customer_phone: customer.phone.trim(),
      delivery_mode:  delivery.mode,
      street:         delivery.street ?? '',
      city:           delivery.city ?? '',
      postal_code:    delivery.postalCode ?? '',
      delivery_day:   delivery.deliveryDay ?? '',
      payment_method: paymentMethod,
      shipping_cost:  shippingCost,
      total,
      items:          serverItems,
    }),
  })

  if (!createRes.ok) {
    console.error('[create-order] PocketBase create failed:', createRes.status, await createRes.text().catch(() => ''))
    return bad('No se pudo crear el pedido. Intentá de nuevo.', 502)
  }

  const order = (await createRes.json()) as { id: string }

  // Descuento de stock best-effort (server, admin).
  await decrementStock(serverItems, token).catch((e) => console.error('[create-order] stock error:', e))

  return NextResponse.json({ orderId: order.id, uploadToken: uploadTokenFor(order.id) })
}

/** Resta el stock vendido de product_stock (ignora productos sin registro o ilimitados). */
async function decrementStock(items: ServerItem[], token: string): Promise<void> {
  const rows = await pbGetFullList<{ id: string; slug: string; stock: number | null }>(
    'product_stock',
    { fields: 'id,slug,stock' },
    { revalidate: 0 },
  )
  const bySlug = new Map(rows.map((r) => [r.slug, r]))
  for (const item of items) {
    const row = bySlug.get(item.product_slug)
    if (!row || row.stock == null) continue
    await fetch(`${PB_URL}/api/collections/product_stock/records/${row.id}`, {
      method: 'PATCH',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: Math.max(0, row.stock - item.quantity) }),
    })
  }
}

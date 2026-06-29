import { NextResponse } from 'next/server'
import { pbAdminToken, fetchOrder } from '@/lib/pb-admin'

interface OrderItem {
  product_slug: string
  product_title: string
  selected_size: string | null
  has_frame: boolean
  unit_price: number
  quantity: number
}

export async function POST(req: Request) {
  let payload: { orderId?: string }
  try {
    payload = (await req.json()) as { orderId?: string }
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'mp_not_configured' }, { status: 500 })
  }
  if (!payload.orderId) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  // El monto a cobrar sale de la orden guardada en el servidor (autoridad de
  // precios), nunca de valores enviados por el cliente.
  const adminToken = await pbAdminToken()
  if (!adminToken) {
    return NextResponse.json({ error: 'pb_unavailable' }, { status: 503 })
  }
  const order = await fetchOrder(payload.orderId, adminToken)
  if (!order) {
    return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
  }

  const orderItems = (order.items as OrderItem[] | undefined) ?? []
  const shippingCost = Number(order.shipping_cost ?? 0)

  const mpItems = orderItems.map((item) => ({
    id: item.product_slug,
    title: [item.product_title, item.selected_size, item.has_frame ? 'con marco' : null]
      .filter(Boolean)
      .join(' – '),
    quantity: item.quantity,
    unit_price: item.unit_price,
    currency_id: 'ARS',
  }))

  if (shippingCost > 0) {
    mpItems.push({
      id: 'envio',
      title: 'Costo de envío',
      quantity: 1,
      unit_price: shippingCost,
      currency_id: 'ARS',
    })
  }

  const siteUrl = process.env.SITE_URL ?? 'https://tatuajesnaty.com'
  const isPublicUrl = siteUrl.startsWith('https://')
  const isSandboxToken = token.startsWith('TEST-')
  const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString()

  const preference = {
    items: mpItems,
    // En sandbox no mandamos payer: si el email pertenece a una cuenta real
    // MP bloquea el pago con "una de las partes es de prueba".
    ...(!isSandboxToken && {
      payer: {
        name: String(order.customer_name ?? ''),
        email: String(order.customer_email ?? ''),
        phone: { number: String(order.customer_phone ?? '') },
      },
    }),
    back_urls: {
      success: `${siteUrl}/checkout/confirmacion?order=${payload.orderId}`,
      failure: `${siteUrl}/checkout/error?order=${payload.orderId}`,
      pending: `${siteUrl}/checkout/confirmacion?order=${payload.orderId}&pending=true`,
    },
    ...(isPublicUrl && { auto_return: 'approved' }),
    notification_url: isPublicUrl ? `${siteUrl}/api/mp-webhook` : undefined,
    external_reference: payload.orderId,
    expires: true,
    expiration_date_to: expiry,
    statement_descriptor: 'NATALIA HELLER ARTE',
  }

  try {
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(preference),
    })

    if (!mpRes.ok) {
      const err = await mpRes.text()
      console.error('[create-mp-preference] MP error:', err)
      return NextResponse.json({ error: 'mp_error' }, { status: 502 })
    }

    const mpData = (await mpRes.json()) as { init_point: string; sandbox_init_point: string; id: string }
    const initPoint = isSandboxToken ? mpData.sandbox_init_point : mpData.init_point
    console.log('[create-mp-preference] isSandbox:', isSandboxToken, '| URL:', initPoint)
    return NextResponse.json({ initPoint, preferenceId: mpData.id })
  } catch (err) {
    console.error('[create-mp-preference] fetch error:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

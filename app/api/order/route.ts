import { NextResponse } from 'next/server'
import { pbAdminToken, fetchOrder, verifyUploadToken } from '@/lib/pb-admin'

/**
 * Lectura pública pero autorizada de una orden, para la pantalla de
 * confirmación. La colección `orders` NO es de lectura pública (tiene datos
 * personales); en su lugar se autoriza con el `uploadToken` (HMAC del orderId)
 * que el server entregó al crear la orden. Devuelve sólo lo que la
 * confirmación necesita mostrar — nunca email/teléfono/dirección.
 */

function notFound() {
  // Mismo 404 para "no existe" y "token inválido": no filtra qué órdenes existen.
  return NextResponse.json({ error: 'not_found' }, { status: 404 })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id') ?? ''
  const token = url.searchParams.get('t') ?? ''

  if (!id || !verifyUploadToken(id, token)) return notFound()

  const adminToken = await pbAdminToken()
  if (!adminToken) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }

  const order = await fetchOrder(id, adminToken)
  if (!order) return notFound()

  // Sólo los campos que la confirmación renderiza (sin PII de contacto/envío).
  return NextResponse.json({
    id:             order.id,
    customer_name:  order.customer_name,
    delivery_mode:  order.delivery_mode,
    payment_method: order.payment_method,
    shipping_cost:  order.shipping_cost,
    total:          order.total,
    status:         order.status,
    payment_proof:  order.payment_proof ?? null,
    items:          order.items ?? [],
  })
}

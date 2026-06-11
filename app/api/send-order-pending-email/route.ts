import { NextResponse } from 'next/server'
import { pbAdminToken, fetchOrder } from '@/lib/pb-admin'
import { buildTransferPendingEmailHtml, sendBrevoEmail } from '@/lib/email/orderEmails'

/**
 * Envía el email de respaldo de una orden de transferencia recién creada
 * (estado pendiente de pago): repite los datos bancarios y enlaza de vuelta
 * al pedido para subir el comprobante. Best-effort: nunca rompe el checkout.
 */
export async function POST(req: Request) {
  let body: { orderId?: string } = {}
  try {
    body = (await req.json()) as { orderId?: string }
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const orderId = body.orderId
  if (!orderId) return NextResponse.json({ ok: false }, { status: 400 })

  const token = await pbAdminToken()
  if (!token) return NextResponse.json({ ok: false }, { status: 200 })

  const order = await fetchOrder(orderId, token)
  if (!order || String(order.payment_method) !== 'transferencia') {
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  const shortId = String(order.id ?? '').slice(0, 8).toUpperCase()
  await sendBrevoEmail({
    to: { email: String(order.customer_email ?? ''), name: String(order.customer_name ?? '') },
    subject: `Recibimos tu pedido · ${shortId}`,
    html: buildTransferPendingEmailHtml(order),
  }).catch((e) => console.error('[send-order-pending-email] error:', e))

  return NextResponse.json({ ok: true })
}

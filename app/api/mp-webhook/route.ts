import crypto from 'crypto'
import { PB_URL, pbAdminToken } from '@/lib/pb-admin'
import { buildOrderConfirmedEmailHtml, sendBrevoEmail } from '@/lib/email/orderEmails'

async function sendConfirmationEmail(order: Record<string, unknown>) {
  const shortId = String(order.id ?? '').slice(0, 8).toUpperCase()
  await sendBrevoEmail({
    to: { email: String(order.customer_email ?? ''), name: String(order.customer_name ?? '') },
    subject: `¡Tu pedido está confirmado! · ${shortId}`,
    html: buildOrderConfirmedEmailHtml(order),
  })
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  let paymentId = url.searchParams.get('id') ?? url.searchParams.get('data.id') ?? ''

  // Validar firma HMAC si hay secreto configurado
  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''
  const webhookSecret = process.env.MP_WEBHOOK_SECRET ?? ''

  // Leer body (puede venir vacío si el id está en query)
  let body: { type?: string; data?: { id?: string } } = {}
  try {
    body = (await req.json()) as { type?: string; data?: { id?: string } }
  } catch {
    body = {}
  }

  // Fail-closed: si hay secreto configurado, la firma es obligatoria y válida.
  if (webhookSecret) {
    if (!xSignature) return new Response('Unauthorized', { status: 401 })
    const parts: Record<string, string> = {}
    xSignature.split(',').forEach((p) => {
      const [k, v] = p.split('=')
      if (k && v) parts[k.trim()] = v.trim()
    })
    const manifest = `id:${paymentId};request-id:${xRequestId};ts:${parts['ts'] ?? ''};`
    const hmac = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex')
    const expected = Buffer.from(hmac)
    const received = Buffer.from(parts['v1'] ?? '')
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  if (!paymentId) {
    if (body.type !== 'payment') return new Response('ok', { status: 200 })
    paymentId = String(body.data?.id ?? '')
  }
  if (!paymentId) return new Response('ok', { status: 200 })

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) return new Response('ok', { status: 200 })

  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!paymentRes.ok) return new Response('ok', { status: 200 })

  const payment = (await paymentRes.json()) as { id: string; external_reference: string; status: string }
  const orderId = payment.external_reference
  const mpStatus = payment.status
  if (!orderId) return new Response('ok', { status: 200 })

  const token = await pbAdminToken()
  if (!token) {
    console.error('[mp-webhook] PocketBase admin auth failed')
    return new Response('ok', { status: 200 })
  }

  let newOrderStatus: string | null = null
  if (mpStatus === 'approved') newOrderStatus = 'pagado'
  if (mpStatus === 'rejected' || mpStatus === 'cancelled') newOrderStatus = 'cancelado'

  const patch: Record<string, string> = {
    mp_payment_id: String(payment.id),
    mp_payment_status: mpStatus,
  }
  if (newOrderStatus) patch.status = newOrderStatus

  await fetch(`${PB_URL}/api/collections/orders/records/${orderId}`, {
    method: 'PATCH',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })

  if (newOrderStatus === 'pagado') {
    const orderRes = await fetch(`${PB_URL}/api/collections/orders/records/${orderId}`, {
      headers: { Authorization: token },
    })
    if (orderRes.ok) {
      const order = (await orderRes.json()) as Record<string, unknown>
      await sendConfirmationEmail(order).catch((e) => console.error('[mp-webhook] email error:', e))
    }
  }

  return new Response('ok', { status: 200 })
}

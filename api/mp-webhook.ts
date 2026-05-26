import crypto from 'crypto'

async function pbAdminToken(): Promise<string | null> {
  const pbUrl = process.env.VITE_POCKETBASE_URL
  const email = process.env.PB_ADMIN_EMAIL
  const password = process.env.PB_ADMIN_PASSWORD
  if (!pbUrl || !email || !password) return null

  const res = await fetch(`${pbUrl}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { token?: string }
  return data.token ?? null
}

async function sendConfirmationEmail(order: Record<string, unknown>) {
  const brevoKey = process.env.BREVO_API_KEY
  if (!brevoKey) return

  const shortId = String(order.id ?? '').slice(0, 8).toUpperCase()
  const items = (order.items as Array<{
    product_title: string
    selected_size: string | null
    has_frame: boolean
    unit_price: number
    quantity: number
  }>) ?? []

  const formatARS = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

  const itemRows = items
    .map((i) => {
      const label = [
        i.product_title,
        i.selected_size,
        i.has_frame ? 'con marco' : null,
        i.quantity > 1 ? `×${i.quantity}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      return `<tr>
        <td style="padding:8px 0;font-size:13px;color:#2c2c2c;border-bottom:1px solid #ede4d5">${label}</td>
        <td style="padding:8px 0;font-size:13px;color:#2c2c2c;border-bottom:1px solid #ede4d5;text-align:right">${formatARS((i.unit_price ?? 0) * (i.quantity ?? 1))}</td>
      </tr>`
    })
    .join('')

  const shippingCost = Number(order.shipping_cost ?? 0)
  const total = Number(order.total ?? 0)
  const deliveryMode = String(order.delivery_mode ?? '')
  const customerName = String(order.customer_name ?? '')
  const customerEmail = String(order.customer_email ?? '')

  const shippingRow =
    shippingCost > 0
      ? `<tr><td style="padding:8px 0;font-size:13px;color:#5a5350">Envío</td><td style="padding:8px 0;font-size:13px;color:#5a5350;text-align:right">${formatARS(shippingCost)}</td></tr>`
      : ''

  const deliveryNote =
    deliveryMode === 'envio'
      ? 'Te avisamos por este mail cuando tu paquete esté en camino.'
      : 'Nos comunicaremos para coordinar el retiro respondiendo este mail.'

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf6f0;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fdfcfb;border:1px solid #ede4d5">
        <tr><td style="padding:36px 40px 28px;border-bottom:1px solid #ede4d5">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#2c2c2c;font-style:italic">natalia heller</p>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#7a9e7e">Pedido confirmado · ${shortId}</p>
          <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#2c2c2c">¡Hola, ${customerName.split(' ')[0]}!</h1>
          <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#5a5350">Tu pago fue acreditado. Acá está el resumen de tu pedido.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            ${itemRows}
            ${shippingRow}
            <tr>
              <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2c2c">Total</td>
              <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2c2c;text-align:right">${formatARS(total)}</td>
            </tr>
          </table>
          <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a5350">${deliveryNote}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#b8a898">Cualquier consulta, respondé este mail. · <a href="https://instagram.com/nataliaceller_art" style="color:#4a7c59">@nataliaceller_art</a></p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #ede4d5">
          <p style="margin:0;font-family:monospace;font-size:11px;color:#b8a898">Buenos Aires · Con turno previo</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Natalia Heller', email: 'noreply@tatuajesnaty.com' },
      to: [{ email: customerEmail, name: customerName }],
      replyTo: { email: 'nataliaceller.tattoo@gmail.com' },
      subject: `¡Tu pedido está confirmado! · ${shortId}`,
      htmlContent: html,
    }),
  })
}

export default async function handler(
  req: { method: string; url: string; headers: Record<string, string | string[] | undefined>; body: unknown },
  res: { status: (c: number) => { end: (s?: string) => void } },
) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  // Extract payment ID from query params
  const url = new URL(req.url, 'https://x')
  let paymentId = url.searchParams.get('id') ?? url.searchParams.get('data.id') ?? ''

  // Validate HMAC signature if secret is configured
  const xSignature = String(req.headers['x-signature'] ?? '')
  const xRequestId = String(req.headers['x-request-id'] ?? '')
  const webhookSecret = process.env.MP_WEBHOOK_SECRET ?? ''

  if (webhookSecret && xSignature) {
    const parts: Record<string, string> = {}
    xSignature.split(',').forEach((p) => {
      const [k, v] = p.split('=')
      if (k && v) parts[k.trim()] = v.trim()
    })
    const manifest = `id:${paymentId};request-id:${xRequestId};ts:${parts['ts'] ?? ''};`
    const hmac = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex')
    if (hmac !== parts['v1']) {
      res.status(401).end('Unauthorized')
      return
    }
  }

  // Parse body if paymentId not in query
  if (!paymentId) {
    try {
      const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as { type?: string; data?: { id?: string } }
      if (body.type !== 'payment') { res.status(200).end('ok'); return }
      paymentId = String(body.data?.id ?? '')
    } catch {
      res.status(200).end('ok')
      return
    }
  }

  if (!paymentId) { res.status(200).end('ok'); return }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) { res.status(200).end('ok'); return }

  // Fetch payment from MercadoPago
  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!paymentRes.ok) { res.status(200).end('ok'); return }

  const payment = (await paymentRes.json()) as { id: string; external_reference: string; status: string }
  const orderId = payment.external_reference
  const mpStatus = payment.status

  if (!orderId) { res.status(200).end('ok'); return }

  // Auth with PocketBase admin
  const token = await pbAdminToken()
  if (!token) {
    console.error('[mp-webhook] PocketBase admin auth failed')
    res.status(200).end('ok')
    return
  }

  const pbUrl = process.env.VITE_POCKETBASE_URL!

  // Map MP status to order status
  let newOrderStatus: string | null = null
  if (mpStatus === 'approved') newOrderStatus = 'pagado'
  if (mpStatus === 'rejected' || mpStatus === 'cancelled') newOrderStatus = 'cancelado'

  const patch: Record<string, string> = {
    mp_payment_id: String(payment.id),
    mp_payment_status: mpStatus,
  }
  if (newOrderStatus) patch.status = newOrderStatus

  await fetch(`${pbUrl}/api/collections/orders/records/${orderId}`, {
    method: 'PATCH',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })

  // Send confirmation email on approval
  if (newOrderStatus === 'pagado') {
    const orderRes = await fetch(`${pbUrl}/api/collections/orders/records/${orderId}`, {
      headers: { Authorization: token },
    })
    if (orderRes.ok) {
      const order = (await orderRes.json()) as Record<string, unknown>
      await sendConfirmationEmail(order).catch((e) =>
        console.error('[mp-webhook] email error:', e),
      )
    }
  }

  res.status(200).end('ok')
}

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts'

serve(async (req) => {
  // MP sends POST with query params ?id=...&topic=payment OR JSON body with type/data
  const url    = new URL(req.url)
  const topic  = url.searchParams.get('topic') ?? ''
  const dataId = url.searchParams.get('id') ?? url.searchParams.get('data.id') ?? ''

  // Validate HMAC signature
  const xSignature    = req.headers.get('x-signature') ?? ''
  const xRequestId    = req.headers.get('x-request-id') ?? ''
  const webhookSecret = Deno.env.get('MP_WEBHOOK_SECRET') ?? ''

  if (webhookSecret && xSignature) {
    // Extract ts and v1 from "ts=...,v1=..."
    const parts: Record<string, string> = {}
    xSignature.split(',').forEach((p) => {
      const [k, v] = p.split('=')
      parts[k.trim()] = v.trim()
    })
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${parts['ts']};`
    const hmac = createHmac('sha256', webhookSecret).update(manifest).digest('hex')
    if (hmac !== parts['v1']) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  // Only process payment notifications
  let paymentId = dataId
  if (!paymentId) {
    try {
      const body = await req.json()
      if (body.type !== 'payment') return new Response('ok', { status: 200 })
      paymentId = String(body.data?.id ?? '')
    } catch {
      return new Response('ok', { status: 200 })
    }
  }

  if (!paymentId) return new Response('ok', { status: 200 })

  const accessToken = Deno.env.get('MP_ACCESS_TOKEN')!

  // Fetch payment from MP
  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!paymentRes.ok) return new Response('ok', { status: 200 })

  const payment = await paymentRes.json()
  const orderId = payment.external_reference
  const mpStatus = payment.status  // approved | rejected | cancelled | pending | in_process | refunded

  if (!orderId) return new Response('ok', { status: 200 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { db: { schema: 'nat_ecommerce' } }
  )

  // Map MP status to order status
  let newOrderStatus: string | null = null
  if (mpStatus === 'approved') newOrderStatus = 'pagado'
  if (mpStatus === 'rejected' || mpStatus === 'cancelled') newOrderStatus = 'cancelado'
  // pending / in_process → only update mp fields, don't change order status

  const updatePayload: Record<string, string> = {
    mp_payment_id:     String(payment.id),
    mp_payment_status: mpStatus,
  }
  if (newOrderStatus) updatePayload.status = newOrderStatus

  const { data: updatedOrder } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId)
    .select('*, order_items(*)')
    .single()

  // Send confirmation email only on approval
  if (newOrderStatus === 'pagado' && updatedOrder) {
    await sendConfirmationEmail(updatedOrder)
  }

  return new Response('ok', { status: 200 })
})

// ─── Email ────────────────────────────────────────────────────────────────────

interface OrderRow {
  id: string
  customer_name: string
  customer_email: string
  delivery_mode: string
  shipping_cost: number
  total: number
  order_items: Array<{
    product_title: string
    selected_size: string | null
    has_frame: boolean
    unit_price: number
    quantity: number
  }>
}

async function sendConfirmationEmail(order: OrderRow) {
  const brevoKey = Deno.env.get('BREVO_API_KEY')
  if (!brevoKey) return

  const shortId = order.id.slice(0, 8).toUpperCase()
  const itemRows = order.order_items
    .map((i) => {
      const label = [
        i.product_title,
        i.selected_size,
        i.has_frame ? 'con marco' : null,
        i.quantity > 1 ? `×${i.quantity}` : null,
      ].filter(Boolean).join(' · ')
      const price = `$${(i.unit_price * i.quantity).toLocaleString('es-AR')}`
      return `<tr>
        <td style="padding:8px 0;font-size:13px;color:#2c2c2c;border-bottom:1px solid #ede4d5">${label}</td>
        <td style="padding:8px 0;font-size:13px;color:#2c2c2c;border-bottom:1px solid #ede4d5;text-align:right">${price}</td>
      </tr>`
    })
    .join('')

  const shippingRow = order.shipping_cost > 0
    ? `<tr><td style="padding:8px 0;font-size:13px;color:#5a5350">Envío</td><td style="padding:8px 0;font-size:13px;color:#5a5350;text-align:right">$${order.shipping_cost.toLocaleString('es-AR')}</td></tr>`
    : ''

  const deliveryNote = order.delivery_mode === 'envio'
    ? 'Te avisamos por este mail cuando tu paquete esté en camino.'
    : 'Coordinamos el punto de encuentro para el retiro respondiendo este mail.'

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
          <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#2c2c2c">¡Hola, ${order.customer_name.split(' ')[0]}!</h1>
          <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#5a5350">Tu pago fue acreditado. Acá está el resumen de tu pedido.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            ${itemRows}
            ${shippingRow}
            <tr><td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2c2c">Total</td>
                <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2c2c;text-align:right">$${order.total.toLocaleString('es-AR')}</td></tr>
          </table>
          <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a5350">${deliveryNote}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#b8a898">Cualquier consulta, respondé este mail. · <a href="https://instagram.com/nataliaceller_art" style="color:#4a7c59">@nataliaceller_art</a></p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #ede4d5">
          <p style="margin:0;font-family:monospace;font-size:11px;color:#b8a898">Desde el estudio · Buenos Aires · Con turno previo</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method:  'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender:      { name: 'Natalia Heller', email: 'hola@tatuajesnaty.com' },
      to:          [{ email: order.customer_email, name: order.customer_name }],
      replyTo:     { email: 'hola@tatuajesnaty.com' },
      subject:     `¡Tu pedido está confirmado! · ${shortId}`,
      htmlContent: html,
    }),
  })
}

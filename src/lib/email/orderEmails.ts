import 'server-only'
import { BANK_DETAILS, WHATSAPP_DISPLAY } from '@/lib/bankDetails'
import { uploadTokenFor } from '@/lib/pb-admin'

/**
 * Plantillas HTML y envío de emails transaccionales de órdenes (vía Brevo).
 * Reutilizado por el webhook de Mercado Pago y el endpoint de orden pendiente
 * de transferencia.
 */

interface EmailItem {
  product_title: string
  selected_size: string | null
  has_frame: boolean
  unit_price: number
  quantity: number
}

const SITE_URL = (process.env.SITE_URL ?? 'https://tatuajesnaty.com').replace(/\/$/, '')

export function formatARS(n: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

function itemRowsHtml(items: EmailItem[]): string {
  return items
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
}

/** Envoltorio HTML común (header con logo + cuerpo + footer). */
function emailShell(innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf6f0;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fdfcfb;border:1px solid #ede4d5">
        <tr><td style="padding:36px 40px 28px;border-bottom:1px solid #ede4d5">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#2c2c2c;font-style:italic">natalia heller</p>
        </td></tr>
        ${innerHtml}
        <tr><td style="padding:20px 40px;border-top:1px solid #ede4d5">
          <p style="margin:0;font-family:monospace;font-size:11px;color:#b8a898">Buenos Aires · Con turno previo</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

interface OrderLike {
  id?: unknown
  items?: unknown
  shipping_cost?: unknown
  total?: unknown
  delivery_mode?: unknown
  customer_name?: unknown
  customer_email?: unknown
}

function summaryTable(items: EmailItem[], shippingCost: number, total: number): string {
  const shippingRow =
    shippingCost > 0
      ? `<tr><td style="padding:8px 0;font-size:13px;color:#5a5350">Envío</td><td style="padding:8px 0;font-size:13px;color:#5a5350;text-align:right">${formatARS(shippingCost)}</td></tr>`
      : ''
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
    ${itemRowsHtml(items)}
    ${shippingRow}
    <tr>
      <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2c2c">Total</td>
      <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2c2c2c;text-align:right">${formatARS(total)}</td>
    </tr>
  </table>`
}

/** Email tras acreditarse el pago (Mercado Pago aprobado o transferencia confirmada). */
export function buildOrderConfirmedEmailHtml(order: OrderLike): string {
  const shortId = String(order.id ?? '').slice(0, 8).toUpperCase()
  const items = (order.items as EmailItem[]) ?? []
  const shippingCost = Number(order.shipping_cost ?? 0)
  const total = Number(order.total ?? 0)
  const deliveryMode = String(order.delivery_mode ?? '')
  const customerName = String(order.customer_name ?? '')
  const deliveryNote =
    deliveryMode === 'envio'
      ? 'Te avisamos por este mail cuando tu paquete esté en camino.'
      : 'Nos comunicaremos para coordinar el retiro respondiendo este mail.'

  const inner = `<tr><td style="padding:36px 40px">
    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#7a9e7e">Pedido confirmado · ${shortId}</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#2c2c2c">¡Hola, ${customerName.split(' ')[0]}!</h1>
    <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#5a5350">Tu pago fue acreditado. Acá está el resumen de tu pedido.</p>
    ${summaryTable(items, shippingCost, total)}
    <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a5350">${deliveryNote}</p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#b8a898">Cualquier consulta, respondé este mail. · <a href="https://instagram.com/nataliaceller_art" style="color:#4a7c59">@nataliaceller_art</a></p>
  </td></tr>`
  return emailShell(inner)
}

/** Email de respaldo al crear una orden de transferencia (pendiente de pago). */
export function buildTransferPendingEmailHtml(order: OrderLike): string {
  const orderId = String(order.id ?? '')
  const shortId = orderId.slice(0, 8).toUpperCase()
  const items = (order.items as EmailItem[]) ?? []
  const shippingCost = Number(order.shipping_cost ?? 0)
  const total = Number(order.total ?? 0)
  const customerName = String(order.customer_name ?? '')
  const orderUrl = `${SITE_URL}/checkout/confirmacion?order=${orderId}&t=${uploadTokenFor(orderId)}`

  const bankRows = [
    ['CVU', BANK_DETAILS.cbu],
    ['Alias', BANK_DETAILS.alias],
    ['Titular', BANK_DETAILS.titular],
    ['WhatsApp', WHATSAPP_DISPLAY],
    ['Monto exacto', formatARS(total)],
  ]
    .map(
      ([k, v]) => `<tr>
        <td style="padding:7px 0;font-family:Arial,sans-serif;font-size:12px;color:#7a716c;border-bottom:1px solid #ede4d5">${k}</td>
        <td style="padding:7px 0;font-family:Arial,sans-serif;font-size:13px;color:#2c2c2c;font-weight:600;text-align:right;border-bottom:1px solid #ede4d5">${v}</td>
      </tr>`,
    )
    .join('')

  const inner = `<tr><td style="padding:36px 40px">
    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#c08a3e">Pedido recibido · ${shortId}</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#2c2c2c">¡Hola, ${customerName.split(' ')[0]}!</h1>
    <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#5a5350">Recibimos tu pedido. Para confirmarlo, transferí el total a la cuenta de abajo y enviános el comprobante. Apenas lo acreditemos, te avisamos por este mail.</p>
    ${summaryTable(items, shippingCost, total)}
    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#7a716c">Datos para transferir</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">${bankRows}</table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:4px 0 28px">
      <a href="${orderUrl}" style="display:inline-block;background:#4a7c59;color:#fdfcfb;font-family:Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:999px">Subir comprobante</a>
    </td></tr></table>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#b8a898">Si cerraste la pestaña, podés volver a tu pedido con el botón de arriba. Cualquier consulta, respondé este mail. · <a href="https://instagram.com/nataliaceller_art" style="color:#4a7c59">@nataliaceller_art</a></p>
  </td></tr>`
  return emailShell(inner)
}

interface SendBrevoArgs {
  to: { email: string; name?: string }
  subject: string
  html: string
}

/** Envía un email vía Brevo. No-op (silencioso) si falta BREVO_API_KEY. */
export async function sendBrevoEmail({ to, subject, html }: SendBrevoArgs): Promise<void> {
  const brevoKey = process.env.BREVO_API_KEY
  if (!brevoKey) return

  // El sender debe estar verificado en Brevo (o su dominio autenticado);
  // si no, Brevo rechaza el envío con un evento `error`.
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@tatuajesnaty.com'

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Natalia Heller', email: senderEmail },
      to: [{ email: to.email, name: to.name ?? to.email }],
      replyTo: { email: 'nataliaceller.tattoo@gmail.com' },
      subject,
      htmlContent: html,
    }),
  })
}

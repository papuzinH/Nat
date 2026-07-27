import { NextResponse } from 'next/server'

const TOPIC_LABELS: Record<string, string> = {
  obra: 'Obra artística',
  tatuaje: 'Tatuaje',
  colaboracion: 'Colaboración',
  otro: 'Otro',
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface EmailData {
  customer_name: string
  customer_email: string
  customer_phone: string | null
  topic: string | null
  message: string
  design_title: string | null
  submitted_at: string
}

function renderEmailHtml(d: EmailData) {
  const COLORS = {
    bg: '#faf6f0', card: '#fdfcfb', border: '#ede4d5', ink: '#2c2c2c',
    inkSoft: '#5a5350', inkMuted: '#b8a898', sage: '#7a9e7e', sageDeep: '#4a7c59',
  }
  const FONT_DISPLAY = `'Georgia', 'Times New Roman', serif`
  const FONT_BODY = `'Helvetica Neue', Arial, sans-serif`

  const block = (num: string, label: string, inner: string) => `
    <tr><td style="padding:24px 40px 8px">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:auto;padding-right:12px;font-family:${FONT_BODY};font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${COLORS.sage};white-space:nowrap">${num} &nbsp; ${escapeHtml(label)}</td>
          <td style="width:100%;border-bottom:1px solid ${COLORS.border};height:1px;font-size:0;line-height:0">&nbsp;</td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:8px 40px 16px">${inner}</td></tr>
  `

  const row = (label: string, value: string) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
      <tr>
        <td style="width:140px;padding:6px 12px 6px 0;vertical-align:top;font-family:${FONT_BODY};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${COLORS.inkMuted}">${escapeHtml(label)}</td>
        <td style="padding:6px 0;vertical-align:top;font-family:${FONT_BODY};font-size:14px;line-height:1.55;color:${COLORS.ink}">${value}</td>
      </tr>
    </table>
  `

  const messageBlock = `<div style="padding:18px 22px;background:${COLORS.bg};border-left:3px solid ${COLORS.sage};font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${COLORS.ink};white-space:pre-wrap">${escapeHtml(d.message)}</div>`

  const sobreQuien = `
    ${row('Mail', `<a href="mailto:${escapeHtml(d.customer_email)}" style="color:${COLORS.sageDeep};text-decoration:none">${escapeHtml(d.customer_email)}</a>`)}
    ${d.customer_phone ? row('Teléfono', escapeHtml(d.customer_phone)) : ''}
    ${d.topic ? row('Tema', escapeHtml(d.topic)) : ''}
  `

  const elMensaje = `
    ${messageBlock}
    ${d.design_title ? `<div style="height:14px;font-size:0;line-height:0">&nbsp;</div>${row('Diseño de interés', escapeHtml(d.design_title))}` : ''}
  `

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Nuevo mensaje · ${escapeHtml(d.customer_name)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:${FONT_BODY};color:${COLORS.ink}">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden">Nuevo mensaje de contacto de ${escapeHtml(d.customer_name)} — ${escapeHtml(d.message.slice(0, 80))}</span>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${COLORS.bg}">
    <tr><td align="center" style="padding:48px 16px">
      <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;background:${COLORS.card};border:1px solid ${COLORS.border}">
        <tr><td style="padding:40px 40px 28px;border-bottom:1px solid ${COLORS.border}">
          <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${COLORS.sage}">Nuevo mensaje · contacto</p>
          <h1 style="margin:0 0 4px;font-family:${FONT_DISPLAY};font-size:30px;font-weight:400;line-height:1.15;color:${COLORS.ink};font-style:italic">${escapeHtml(d.customer_name)}</h1>
          <p style="margin:0;font-family:${FONT_BODY};font-size:12px;color:${COLORS.inkMuted}">Recibido ${escapeHtml(d.submitted_at)}</p>
        </td></tr>
        ${block('01', 'Sobre quién escribe', sobreQuien)}
        ${block('02', 'El mensaje', elMensaje)}
        <tr><td style="padding:24px 40px 36px">
          <a href="mailto:${escapeHtml(d.customer_email)}?subject=Re%3A%20Tu%20mensaje%20desde%20la%20web" style="display:inline-block;padding:12px 24px;background:${COLORS.sageDeep};color:${COLORS.card};font-family:${FONT_BODY};font-size:13px;text-decoration:none;border-radius:24px">
            Responder a ${escapeHtml(d.customer_name.split(' ')[0])}
          </a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid ${COLORS.border};background:${COLORS.bg}">
          <p style="margin:0;font-family:${FONT_BODY};font-size:11px;letter-spacing:.04em;color:${COLORS.inkMuted}">tatuajesnaty.com &nbsp;·&nbsp; Buenos Aires</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  topic?: string
  message?: string
  designId?: string
  designTitle?: string
}

export async function POST(req: Request) {
  const payload = (await req.json()) as ContactPayload

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!payload.name || payload.name.trim().length < 2) return NextResponse.json({ error: 'invalid_name' }, { status: 400 })
  if (!payload.email || !EMAIL_RE.test(payload.email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  if (!payload.message || payload.message.trim().length < 10) return NextResponse.json({ error: 'invalid_message' }, { status: 400 })

  const brevoKey = process.env.BREVO_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? process.env.BOOKING_TO_EMAIL ?? 'nataliaceller.tattoo@gmail.com'
  const toName = process.env.BOOKING_TO_NAME ?? 'Natalia Heller'
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@tatuajesnaty.com'
  const senderName = 'Web · Contacto'

  if (!brevoKey) {
    console.error('[send-contact-email] BREVO_API_KEY not set')
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 })
  }

  const data: EmailData = {
    customer_name: payload.name.trim(),
    customer_email: payload.email.trim().toLowerCase(),
    customer_phone: payload.phone?.trim() || null,
    topic: payload.topic ? (TOPIC_LABELS[payload.topic] ?? payload.topic) : null,
    message: payload.message.trim(),
    design_title: payload.designTitle?.trim() || null,
    submitted_at: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
  }

  const emailBody = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: toEmail, name: toName }],
    replyTo: { email: data.customer_email, name: data.customer_name },
    subject: `Nuevo mensaje · ${data.customer_name}${data.topic ? ` · ${data.topic}` : ''}`,
    htmlContent: renderEmailHtml(data),
  }

  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(emailBody),
  })

  if (!brevoRes.ok) {
    const txt = await brevoRes.text()
    console.error('[send-contact-email] brevo error', brevoRes.status, txt)
    return NextResponse.json({ error: 'email_send_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

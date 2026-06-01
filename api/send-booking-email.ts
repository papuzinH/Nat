import crypto from 'crypto'

const AREA_LABELS: Record<string, string> = {
  brazo: 'Brazo / antebrazo',
  mano: 'Mano / muñeca',
  hombro: 'Hombro',
  pierna: 'Pierna / muslo',
  tobillo: 'Tobillo / pie',
  espalda: 'Espalda',
  pecho: 'Pecho / esternón',
  costilla: 'Costilla',
  cuello: 'Cuello / nuca',
  otra: 'Otra',
}

const WORK_LABELS: Record<string, string> = {
  lineal: 'Lineal',
  sombras: 'Con sombras',
  rellenos: 'Con rellenos',
}

const DAY_LABELS: Record<string, string> = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
}

const TIME_LABELS: Record<string, string> = {
  manana: 'Mañana',
  tarde: 'Tarde',
  noche: 'Noche',
}

function labelize(map: Record<string, string>, values: string[]) {
  return values.map((v) => map[v] ?? v).join(' · ')
}


function sanitizeName(n: string) {
  return n.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
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
  customer_instagram: string | null
  idea: string
  size_cm: string
  area: string
  work_types: string
  days: string
  time_slots: string
  notes: string | null
  references_count: number
  submitted_at: string
}

function renderEmailHtml(d: EmailData) {
  const COLORS = {
    bg: '#faf6f0',
    card: '#fdfcfb',
    border: '#ede4d5',
    ink: '#2c2c2c',
    inkSoft: '#5a5350',
    inkMuted: '#b8a898',
    sage: '#7a9e7e',
    sageDeep: '#4a7c59',
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

  const ideaBlock = `<div style="padding:18px 22px;background:${COLORS.bg};border-left:3px solid ${COLORS.sage};font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${COLORS.ink};white-space:pre-wrap">${escapeHtml(d.idea)}</div>`

  const sobreVos = `
    ${row('Mail', `<a href="mailto:${escapeHtml(d.customer_email)}" style="color:${COLORS.sageDeep};text-decoration:none">${escapeHtml(d.customer_email)}</a>`)}
    ${d.customer_instagram ? row('Instagram', `<a href="https://instagram.com/${escapeHtml(d.customer_instagram.replace(/^@/, ''))}" style="color:${COLORS.sageDeep};text-decoration:none">${escapeHtml(d.customer_instagram)}</a>`) : ''}
  `

  const tuIdea = `
    ${ideaBlock}
    <div style="height:14px;font-size:0;line-height:0">&nbsp;</div>
    ${row('Tamaño', `${escapeHtml(d.size_cm)} cm`)}
    ${row('Zona', escapeHtml(d.area))}
    ${row('Tipo de trabajo', escapeHtml(d.work_types))}
    ${row('Referencias', d.references_count > 0 ? `${d.references_count} imagen${d.references_count === 1 ? '' : 'es'} adjunta${d.references_count === 1 ? '' : 's'} a este mail` : `<span style="color:${COLORS.inkMuted}">Sin referencias adjuntas</span>`)}
  `

  const cuando = `
    ${row('Días', escapeHtml(d.days))}
    ${row('Horarios', escapeHtml(d.time_slots))}
    ${d.notes ? row('Notas', `<span style="white-space:pre-wrap">${escapeHtml(d.notes)}</span>`) : ''}
  `

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Nueva consulta · ${escapeHtml(d.customer_name)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:${FONT_BODY};color:${COLORS.ink}">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden">Nueva consulta de tatuaje de ${escapeHtml(d.customer_name)} — ${escapeHtml(d.idea.slice(0, 80))}</span>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${COLORS.bg}">
    <tr><td align="center" style="padding:48px 16px">
      <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;background:${COLORS.card};border:1px solid ${COLORS.border}">
        <tr><td style="padding:40px 40px 28px;border-bottom:1px solid ${COLORS.border}">
          <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${COLORS.sage}">Nueva consulta · estudio</p>
          <h1 style="margin:0 0 4px;font-family:${FONT_DISPLAY};font-size:30px;font-weight:400;line-height:1.15;color:${COLORS.ink};font-style:italic">${escapeHtml(d.customer_name)}</h1>
          <p style="margin:0;font-family:${FONT_BODY};font-size:12px;color:${COLORS.inkMuted}">Recibida ${escapeHtml(d.submitted_at)}</p>
        </td></tr>
        ${block('01', 'Sobre quién escribe', sobreVos)}
        ${block('02', 'La idea', tuIdea)}
        ${block('03', 'Cuándo le queda', cuando)}
        <tr><td style="padding:24px 40px 36px">
          <a href="mailto:${escapeHtml(d.customer_email)}?subject=Re%3A%20Tu%20consulta%20de%20tatuaje" style="display:inline-block;padding:12px 24px;background:${COLORS.sageDeep};color:${COLORS.card};font-family:${FONT_BODY};font-size:13px;text-decoration:none;border-radius:24px">
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

// Exported only to satisfy TS — not used at runtime
export const _crypto = crypto

export default async function handler(req: { method: string; body: unknown }, res: { status: (c: number) => { end: () => void; json: (b: unknown) => void }; setHeader: (k: string, v: string) => void }) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const payload = req.body as {
    name?: string
    email?: string
    instagram?: string
    idea?: string
    sizeCm?: string
    area?: string
    workTypes?: string[]
    days?: string[]
    timeSlots?: string[]
    notes?: string
    attachments?: Array<{ name: string; mimeType: string; size: number; base64: string }>
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!payload.name || payload.name.trim().length < 3) { res.status(400).json({ error: 'invalid_name' }); return }
  if (!payload.email || !EMAIL_RE.test(payload.email)) { res.status(400).json({ error: 'invalid_email' }); return }
  if (!payload.idea || payload.idea.trim().length < 20) { res.status(400).json({ error: 'invalid_idea' }); return }
  if (!payload.area) { res.status(400).json({ error: 'invalid_area' }); return }
  if (!Array.isArray(payload.workTypes) || payload.workTypes.length === 0) { res.status(400).json({ error: 'invalid_workTypes' }); return }
  if (!Array.isArray(payload.days) || payload.days.length === 0) { res.status(400).json({ error: 'invalid_days' }); return }
  if (!Array.isArray(payload.timeSlots) || payload.timeSlots.length === 0) { res.status(400).json({ error: 'invalid_timeSlots' }); return }

  const brevoKey = process.env.BREVO_API_KEY
  const toEmail = process.env.BOOKING_TO_EMAIL ?? 'nataliaceller.tattoo@gmail.com'
  const toName = process.env.BOOKING_TO_NAME ?? 'Natalia Heller'
  const senderEmail = process.env.BOOKING_SENDER_EMAIL ?? 'noreply@tatuajesnaty.com'
  const senderName = process.env.BOOKING_SENDER_NAME ?? 'Web · Reservas'

  if (!brevoKey) {
    console.error('[send-booking-email] BREVO_API_KEY not set')
    res.status(500).json({ error: 'email_not_configured' })
    return
  }

  const data: EmailData = {
    customer_name: payload.name.trim(),
    customer_email: payload.email.trim().toLowerCase(),
    customer_instagram: payload.instagram?.trim() ? `@${payload.instagram.trim().replace(/^@/, '')}` : null,
    idea: payload.idea.trim(),
    size_cm: payload.sizeCm ?? '',
    area: AREA_LABELS[payload.area] ?? payload.area,
    work_types: labelize(WORK_LABELS, payload.workTypes),
    days: labelize(DAY_LABELS, payload.days),
    time_slots: labelize(TIME_LABELS, payload.timeSlots),
    notes: payload.notes?.trim() || null,
    references_count: payload.attachments?.length ?? 0,
    submitted_at: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
  }

  const attachment = (payload.attachments ?? []).map((a, i) => ({
    name: `ref-${i + 1}-${sanitizeName(a.name)}`,
    content: a.base64,
  }))

  const emailBody: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: toEmail, name: toName }],
    replyTo: { email: data.customer_email, name: data.customer_name },
    subject: `Nueva consulta · ${data.customer_name}`,
    htmlContent: renderEmailHtml(data),
  }
  if (attachment.length > 0) emailBody.attachment = attachment

  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(emailBody),
  })

  if (!brevoRes.ok) {
    const txt = await brevoRes.text()
    console.error('[send-booking-email] brevo error', brevoRes.status, txt)
    res.status(502).json({ error: 'email_send_failed' })
    return
  }

  res.status(200).json({ ok: true })
}

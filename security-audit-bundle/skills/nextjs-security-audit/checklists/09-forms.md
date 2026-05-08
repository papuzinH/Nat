# Checklist 09 — Formularios / endpoints públicos

## Validación

- [ ] Validación server-side con Zod/Valibot (cliente NO cuenta como seguridad)
- [ ] Tipos estrictos: `z.string().email().max(254)`, `z.string().min(1).max(2000)`, etc.
- [ ] Rechazar campos extra (Zod `.strict()`)
- [ ] Trim + normalize emails antes de comparar/almacenar

## Anti-spam / abuse

- [ ] CAPTCHA (hCaptcha o Cloudflare Turnstile, gratuitos y privacy-friendly)
- [ ] Honeypot field (`<input name="website" style="display:none">`) — bots lo llenan
- [ ] Rate limit: 5 envíos / 10min por IP
- [ ] Bloqueo de palabras clave de spam frecuentes (lista mínima)

## Rate limiting

```ts
// Ejemplo Upstash Redis + ip-based
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'),
})

// en el handler
const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anon'
const { success } = await ratelimit.limit(ip)
if (!success) return new Response('Too many requests', { status: 429 })
```

## Email outbound (notification al owner)

- [ ] No incluir input del usuario sin escape en headers (`Subject:`, `From:`) → email injection
- [ ] Plain text + HTML versions, ambas escapadas
- [ ] No reflejar email del usuario en `Reply-To` sin sanitizar (newline injection)
- [ ] SPF/DKIM/DMARC del dominio configurados

## Almacenamiento

- [ ] Mensaje guardado con timestamp + IP + user agent (auditoría)
- [ ] Retención definida (no guardar leads forever sin propósito legal)
- [ ] DSAR (right to erasure) implementable si aplica GDPR/AR Ley 25.326

## CSRF

- [ ] Si el form usa cookies de sesión → token CSRF
- [ ] Si es form público sin sesión → CAPTCHA + rate limit suficiente

## Caso NatArt — formulario de contacto

Issues actuales del proyecto:
- Submit simulado sin endpoint real → cuando lo conectes:
  - Endpoint `app/api/contact/route.ts` o equivalente Vite (mejor: Resend / Formspree / propio backend)
  - Validación Zod con max length por field
  - Rate limit (Vercel KV o Upstash, gratis tier)
  - hCaptcha en el form
  - Email outbound con escape de los campos
  - GTM event ya enviado al submit → asegurarse de no enviar PII (email completo) si es prohibido por tu política

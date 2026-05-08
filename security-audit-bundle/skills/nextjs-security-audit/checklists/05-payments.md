# Checklist 05 — Pagos (Stripe / Mercado Pago / PayPal)

## Reglas de oro

1. **El precio NUNCA viene del cliente.** Siempre se calcula en server con datos de DB.
2. **Webhooks SIEMPRE verifican firma.** Sin firma = no procesar.
3. **Idempotencia.** Webhooks pueden llegar 2+ veces; usar `event.id` como key.

## Stripe

- [ ] `STRIPE_SECRET_KEY` solo en server, nunca expuesto
- [ ] `STRIPE_WEBHOOK_SECRET` configurado y verificado en cada handler
- [ ] Precios calculados en server desde DB, no desde `req.body.amount`
- [ ] Checkout Session usa `line_items` con `price` (precio guardado en Stripe), no `price_data` con monto del cliente
- [ ] `success_url` y `cancel_url` en HTTPS y dentro de tu dominio
- [ ] Metadata sin info sensible (PII clientes va en `customer`, no en metadata)
- [ ] Webhook procesa `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`
- [ ] Idempotencia: tabla `processed_webhooks` con UNIQUE en `event_id`

```ts
// app/api/stripe/webhook/route.ts
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')!
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response('Bad signature', { status: 400 })
  }

  // Idempotencia
  const already = await db.processedWebhooks.findUnique({ where: { eventId: event.id } })
  if (already) return new Response('OK', { status: 200 })

  switch (event.type) {
    case 'checkout.session.completed':
      // procesar
      break
  }

  await db.processedWebhooks.create({ data: { eventId: event.id } })
  return new Response('OK', { status: 200 })
}
```

## Mercado Pago

- [ ] `MP_ACCESS_TOKEN` solo server (empieza con `APP_USR-...`)
- [ ] Webhook (`/notifications` o `/webhook`) verifica con `x-signature` header (MP firma con secret)
- [ ] Validar `data.id` del webhook fetcheando el pago real con la API: `mercadopago.payment.get(id)` — no confiar en el body
- [ ] `notification_url` en HTTPS y dentro de tu dominio
- [ ] Idempotencia con `payment.id`

## Frontend / Checkout

- [ ] Stripe Elements / Payment Element servido por el SDK oficial (no roll-your-own)
- [ ] PCI: NUNCA toques el número de tarjeta. Stripe.js tokeniza en su iframe.
- [ ] No loggear `card`, `cvv`, `exp` por accidente
- [ ] CSP permite el dominio de Stripe/MP en `script-src`, `frame-src`, `connect-src`

## Refunds y disputas

- [ ] Endpoint de refund requiere admin role + log de quién/cuándo/por qué
- [ ] No refund automático sin reglas claras
- [ ] Webhooks de `charge.dispute.created` notifican al admin

## Logs y PII

- [ ] No loggear `customer.email` en plaintext en logs persistentes
- [ ] No exponer `payment_intent.client_secret` en respuestas de API públicas

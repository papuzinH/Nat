# Wave 4 — Complete Purchase Flow Implementation

> **Stack:** Vite 7 + React 19 + TypeScript + React Router v7 + Tailwind CSS 3 + GSAP + Supabase (`nat_ecommerce` schema)
> **Execute prompts in order.** Each one is self-contained but builds on the previous.

---

## PROMPT 1 — Supabase Schema Migration

Read before writing anything:
- `src/lib/supabase.ts` — client uses schema `nat_ecommerce`
- `src/pages/admin/AdminOrders.tsx` — `Order` interface (existing columns)
- `src/pages/Checkout.tsx` — current `create_order` RPC call signature

---

Create file `supabase/migrations/20260430_wave4_purchase_flow.sql`.

### 1. New table `shipping_config`

```sql
CREATE TABLE IF NOT EXISTS nat_ecommerce.shipping_config (
  id           int PRIMARY KEY DEFAULT 1,
  price        int NOT NULL DEFAULT 0,
  label        text NOT NULL DEFAULT 'Envío a domicilio',
  description  text,
  updated_at   timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO nat_ecommerce.shipping_config (id, price, label, description)
VALUES (1, 0, 'Envío a domicilio', 'Coordinado con Ian. Envíos a todo el país.')
ON CONFLICT (id) DO NOTHING;
```

### 2. New columns on `orders`

```sql
ALTER TABLE nat_ecommerce.orders
  ADD COLUMN IF NOT EXISTS mp_preference_id     text,
  ADD COLUMN IF NOT EXISTS mp_payment_id        text,
  ADD COLUMN IF NOT EXISTS mp_payment_status    text,
  ADD COLUMN IF NOT EXISTS shipping_cost        int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tracking_number      text;
```

### 3. Update `create_order` RPC

Replace the existing `create_order` function with this version that adds `p_shipping_cost`, auto-decrements stock, returns `order_id`, and raises an error if any item is out of stock:

```sql
CREATE OR REPLACE FUNCTION nat_ecommerce.create_order(
  p_customer_name  text,
  p_customer_email text,
  p_customer_phone text,
  p_delivery_mode  text,
  p_street         text,
  p_city           text,
  p_postal_code    text,
  p_payment_method text,
  p_shipping_cost  int,
  p_total          int,
  p_items          jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item     jsonb;
  v_slug     text;
  v_qty      int;
  v_stock    int;
BEGIN
  -- Validate stock for all items first
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_slug := v_item->>'slug';
    v_qty  := (v_item->>'qty')::int;
    SELECT stock INTO v_stock
      FROM nat_ecommerce.product_stock
     WHERE slug = v_slug;
    IF v_stock IS NOT NULL AND v_stock < v_qty THEN
      RAISE EXCEPTION 'sin-stock:%', v_slug;
    END IF;
  END LOOP;

  -- Insert order
  INSERT INTO nat_ecommerce.orders (
    customer_name, customer_email, customer_phone,
    delivery_mode, street, city, postal_code,
    payment_method, shipping_cost, total, status
  ) VALUES (
    p_customer_name, p_customer_email, p_customer_phone,
    p_delivery_mode, p_street, p_city, p_postal_code,
    p_payment_method, p_shipping_cost, p_total, 'pendiente'
  )
  RETURNING id INTO v_order_id;

  -- Insert order items and decrement stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_slug := v_item->>'slug';
    v_qty  := (v_item->>'qty')::int;

    INSERT INTO nat_ecommerce.order_items (
      order_id, product_slug, product_title,
      selected_size, has_frame, unit_price, quantity
    ) VALUES (
      v_order_id,
      v_slug,
      v_item->>'title',
      NULLIF(v_item->>'size', ''),
      (v_item->>'has_frame')::boolean,
      (v_item->>'unit_price')::int,
      v_qty
    );

    -- Decrement stock if tracked
    UPDATE nat_ecommerce.product_stock
       SET stock = stock - v_qty
     WHERE slug = v_slug AND stock IS NOT NULL;

    -- Auto out-of-stock
    UPDATE nat_ecommerce.product_stock
       SET status = 'out-of-stock'
     WHERE slug = v_slug AND stock IS NOT NULL AND stock <= 0;
  END LOOP;

  RETURN v_order_id;
END;
$$;
```

### 4. `release_stock` function

```sql
CREATE OR REPLACE FUNCTION nat_ecommerce.release_stock(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item record;
BEGIN
  FOR v_item IN
    SELECT product_slug, quantity
      FROM nat_ecommerce.order_items
     WHERE order_id = p_order_id
  LOOP
    UPDATE nat_ecommerce.product_stock
       SET stock = stock + v_item.quantity
     WHERE slug = v_item.product_slug AND stock IS NOT NULL;

    -- Re-activate if stock is now positive
    UPDATE nat_ecommerce.product_stock
       SET status = 'active'
     WHERE slug = v_item.product_slug
       AND stock IS NOT NULL AND stock > 0
       AND status = 'out-of-stock';
  END LOOP;
END;
$$;
```

### 5. Trigger — auto-release stock on cancellation

```sql
CREATE OR REPLACE FUNCTION nat_ecommerce.handle_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'cancelado' AND OLD.status <> 'cancelado' THEN
    PERFORM nat_ecommerce.release_stock(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_status_change ON nat_ecommerce.orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON nat_ecommerce.orders
  FOR EACH ROW EXECUTE FUNCTION nat_ecommerce.handle_order_status_change();
```

### 6. RLS policies

```sql
-- shipping_config: public read
ALTER TABLE nat_ecommerce.shipping_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read shipping_config"
  ON nat_ecommerce.shipping_config FOR SELECT USING (true);
CREATE POLICY "service role write shipping_config"
  ON nat_ecommerce.shipping_config FOR ALL USING (auth.role() = 'service_role');

-- orders: public insert (checkout), service_role full access
ALTER TABLE nat_ecommerce.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert orders"
  ON nat_ecommerce.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "service role all orders"
  ON nat_ecommerce.orders FOR ALL USING (auth.role() = 'service_role');
```

**Verification:** Run `npm run build` after applying — no TypeScript changes in this prompt, just SQL.

---

## PROMPT 2 — Edge Function: `create-mp-preference`

Read before writing:
- `src/lib/supabase.ts` — schema is `nat_ecommerce`
- `src/context/CartContext.tsx` — `CartItem` shape: `{ slug, title, selectedSize, hasFrame, unitPrice, quantity }`
- `src/pages/Checkout.tsx` — understand the payload being sent

---

Create `supabase/functions/create-mp-preference/index.ts`.

This function: receives order data → calls `create_order` RPC → creates MP preference → saves `mp_preference_id` → returns `{ orderId, initPoint }`.

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body = await req.json()
    const { customer, delivery, items, shippingCost, total } = body

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { db: { schema: 'nat_ecommerce' } }
    )

    // 1. Create order in DB
    const { data: orderId, error: rpcError } = await supabase.rpc('create_order', {
      p_customer_name:  customer.name,
      p_customer_email: customer.email,
      p_customer_phone: customer.phone,
      p_delivery_mode:  delivery.mode,
      p_street:         delivery.street  ?? '',
      p_city:           delivery.city    ?? '',
      p_postal_code:    delivery.postalCode ?? '',
      p_payment_method: 'mercadopago',
      p_shipping_cost:  shippingCost,
      p_total:          total,
      p_items:          items,
    })

    if (rpcError) {
      const status = rpcError.message.includes('sin-stock') ? 409 : 500
      return new Response(JSON.stringify({ error: rpcError.message }), {
        status,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    // 2. Build MP preference
    const siteUrl   = Deno.env.get('SITE_URL')!
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN')!
    const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    const preference = {
      items: items.map((i: { title: string; unit_price: number; qty: number; slug: string }) => ({
        id:         i.slug,
        title:      i.title,
        quantity:   i.qty,
        unit_price: i.unit_price,   // ARS, integer (no decimals)
        currency_id: 'ARS',
      })),
      payer: {
        name:  customer.name,
        email: customer.email,
        phone: { number: customer.phone },
      },
      back_urls: {
        success: `${siteUrl}/checkout/confirmacion?order=${orderId}`,
        failure: `${siteUrl}/checkout/error?order=${orderId}`,
        pending: `${siteUrl}/checkout/confirmacion?order=${orderId}&pending=true`,
      },
      auto_return:          'approved',
      notification_url:     `${Deno.env.get('SUPABASE_URL')}/functions/v1/mp-webhook`,
      external_reference:   orderId,
      expires:              true,
      expiration_date_to:   expiry,
      statement_descriptor: 'NATALIA HELLER ARTE',
    }

    // Add shipping as extra item if > 0
    if (shippingCost > 0) {
      preference.items.push({
        id:          'envio',
        title:       'Costo de envío',
        quantity:    1,
        unit_price:  shippingCost,
        currency_id: 'ARS',
      })
    }

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    if (!mpRes.ok) {
      const mpErr = await mpRes.text()
      console.error('MP error:', mpErr)
      return new Response(JSON.stringify({ error: 'mp_error' }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const mpData = await mpRes.json()

    // 3. Save preference ID
    await supabase
      .from('orders')
      .update({ mp_preference_id: mpData.id })
      .eq('id', orderId)

    return new Response(
      JSON.stringify({ orderId, initPoint: mpData.init_point }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
```

**Required Supabase secrets** (set via `supabase secrets set` or dashboard):
```
MP_ACCESS_TOKEN        → from mercadopago.com/developers (use TEST token first)
SITE_URL               → https://tatuajesnaty.com (or http://localhost:5173 for local dev)
```
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

**Verification:** `supabase functions serve create-mp-preference` — test with a curl POST.

---

## PROMPT 3 — Edge Function: `mp-webhook`

Read before writing:
- `supabase/functions/create-mp-preference/index.ts` (just created)
- `src/pages/admin/AdminOrders.tsx` — understand status values: `pendiente | pagado | en-preparacion | enviado | entregado | cancelado`

---

Create `supabase/functions/mp-webhook/index.ts`.

This function: validates MP signature → fetches payment from MP API → updates order status → sends confirmation email via Brevo when approved.

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts'

serve(async (req) => {
  // MP sends POST with query params ?id=...&topic=payment OR JSON body with type/data
  const url    = new URL(req.url)
  const topic  = url.searchParams.get('topic') ?? ''
  const dataId = url.searchParams.get('id') ?? url.searchParams.get('data.id') ?? ''

  // Validate HMAC signature
  const xSignature  = req.headers.get('x-signature') ?? ''
  const xRequestId  = req.headers.get('x-request-id') ?? ''
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
```

**Required Supabase secrets:**
```
MP_WEBHOOK_SECRET   → generate from MP dashboard when registering the webhook URL
BREVO_API_KEY       → from brevo.com → SMTP & API → API Keys
```

**Webhook URL to register in MP dashboard:**
```
https://<project-ref>.supabase.co/functions/v1/mp-webhook
```
Events to subscribe: `payment` (created + updated).

**Verification:** Deploy both functions with `supabase functions deploy`. Check Supabase function logs after a test MP payment.

---

## PROMPT 4 — Hook `useShippingConfig` + Checkout Integration

Read before writing:
- `src/pages/Checkout.tsx` — full file, understand current `handleSubmit`, form structure, and the order summary sidebar
- `src/hooks/useCheckoutForm.ts` — `CheckoutFields`, `useCheckoutForm` signature
- `src/context/CartContext.tsx` — `subtotal` comes from context

---

### Step 1 — Create `src/hooks/useShippingConfig.ts`

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ShippingConfig {
  price:       number
  label:       string
  description: string | null
}

const FALLBACK: ShippingConfig = { price: 0, label: 'Envío a domicilio', description: null }

export function useShippingConfig() {
  const [config, setConfig]   = useState<ShippingConfig>(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('shipping_config')
      .select('price, label, description')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setConfig(data as ShippingConfig)
        setLoading(false)
      })
  }, [])

  return { config, loading }
}
```

### Step 2 — Modify `src/pages/Checkout.tsx`

Make the following surgical changes (do not rewrite the whole file):

**A. Add import:**
```typescript
import { useShippingConfig } from '@/hooks/useShippingConfig'
```

**B. Inside `Checkout` component, add after the existing hooks:**
```typescript
const { config: shippingConfig, loading: shippingLoading } = useShippingConfig()
const shippingCost = fields.deliveryMode === 'envio' ? shippingConfig.price : 0
const grandTotal   = subtotal + shippingCost
```

**C. Replace `handleSubmit` entirely** with this version that splits MP vs transferencia:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const valid = submit()
  if (!valid) {
    firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  setSubmitting(true)
  setStockError(null)

  const p_items = items.map((item) => ({
    slug:        item.slug,
    title:       item.title,
    size:        item.selectedSize ?? '',
    has_frame:   item.hasFrame,
    unit_price:  item.unitPrice,
    qty:         item.quantity,
  }))

  const basePayload = {
    customer: { name: fields.name, email: fields.email, phone: fields.phone },
    delivery: {
      mode:       fields.deliveryMode,
      street:     fields.street,
      city:       fields.city,
      postalCode: fields.postalCode,
    },
    items:        p_items,
    shippingCost: shippingCost,
    total:        grandTotal,
  }

  // ── Mercado Pago ────────────────────────────────────────────────
  if (fields.paymentMethod === 'mercadopago') {
    const { data, error } = await supabase.functions.invoke('create-mp-preference', {
      body: basePayload,
    })

    setSubmitting(false)

    if (error || !data?.initPoint) {
      setStockError(
        error?.message?.includes('sin-stock')
          ? 'Uno o más productos ya no tienen stock. Revisá tu carrito.'
          : 'No pudimos iniciar el pago. Intentá de nuevo.'
      )
      return
    }

    clearCart()
    window.location.href = data.initPoint
    return
  }

  // ── Transferencia bancaria ──────────────────────────────────────
  const { error } = await supabase.rpc('create_order', {
    p_customer_name:  fields.name,
    p_customer_email: fields.email,
    p_customer_phone: fields.phone,
    p_delivery_mode:  fields.deliveryMode,
    p_street:         fields.street,
    p_city:           fields.city,
    p_postal_code:    fields.postalCode,
    p_payment_method: 'transferencia',
    p_shipping_cost:  shippingCost,
    p_total:          grandTotal,
    p_items,
  })

  setSubmitting(false)

  if (error) {
    setStockError(
      error.message.includes('sin-stock')
        ? 'Uno o más productos ya no tienen stock. Revisá tu carrito.'
        : 'Error al procesar el pedido. Intentá de nuevo.'
    )
    return
  }

  clearCart()
  setConfirmed(true)
}
```

**D. Update the order summary sidebar** — find the total display and add shipping row. Locate the section that shows `subtotal` and replace it with:

```tsx
{/* Order summary — subtotal + shipping + total */}
<div className="flex flex-col gap-2 pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
  <div className="flex justify-between">
    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Subtotal</span>
    <span className="font-body text-[13px] text-ink">{formatARS(subtotal)}</span>
  </div>
  {fields.deliveryMode === 'envio' && (
    <div className="flex justify-between">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        {shippingConfig.label}
      </span>
      <span className="font-body text-[13px] text-ink">
        {shippingConfig.price === 0 ? 'Gratis' : formatARS(shippingConfig.price)}
      </span>
    </div>
  )}
  <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--line-soft)' }}>
    <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink font-semibold">Total</span>
    <span className="font-display text-[22px] text-sage-900">{formatARS(grandTotal)}</span>
  </div>
</div>
```

**E. Disable submit while shippingLoading:**
```tsx
// On the submit button, add shippingLoading to the disabled condition:
disabled={submitting || shippingLoading}
```

**F. Update the transferencia confirmation screen** — the `confirmed` state renders a thank-you. Add CBU data to it. Find the `if (confirmed)` block and add inside the existing content:

```tsx
{/* Bank transfer details */}
<div
  className="mt-8 p-6 rounded-sm text-left"
  style={{ background: 'var(--cream-200, #f5efe6)', border: '1px solid var(--line-soft)' }}
>
  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-4">
    Datos para la transferencia
  </p>
  {[
    ['Alias',    'natalia.arte'],
    ['CBU',      '0000003100062588008793'],
    ['Titular',  'Natalia Heller'],
  ].map(([label, value]) => (
    <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--line-soft)' }}>
      <span className="font-mono text-[11px] text-ink-soft">{label}</span>
      <span className="font-body text-[13px] text-ink font-semibold">{value}</span>
    </div>
  ))}
  <p className="font-body text-[13px] text-ink-soft mt-4 leading-relaxed">
    Una vez que realices la transferencia, te confirmamos el pedido por mail.
  </p>
</div>
```

**Verification:**
```bash
npm run build   # 0 TS errors
npm run dev     # checkout loads, shipping cost appears for envio mode
```

---

## PROMPT 5 — Pages: `/checkout/confirmacion` and `/checkout/error`

Read before writing:
- `src/App.tsx` — understand routing pattern, `Layout` wrapper usage
- `src/pages/admin/AdminOrders.tsx` — `Order` + `OrderItem` interfaces (copy them, don't import from admin)
- `src/components/shared/` — check what's exported (Button, etc.) to reuse

---

### 1. Create `src/pages/CheckoutConfirmacion.tsx`

```typescript
// Reads ?order=<uuid>&pending=true from URL
// If pending=true → show "payment processing" state
// Otherwise → fetch order from Supabase and show receipt
// If order not found → redirect to /tienda
```

Full implementation:

```tsx
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { formatARS } from '@/data/products'
import { Helmet } from 'react-helmet-async'

interface OrderItem {
  id: string
  product_title: string
  selected_size: string | null
  has_frame: boolean
  unit_price: number
  quantity: number
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  delivery_mode: string
  payment_method: string
  shipping_cost: number
  total: number
  status: string
  order_items?: OrderItem[]
}

const CheckoutConfirmacion: React.FC = () => {
  const [params]  = useSearchParams()
  const orderId   = params.get('order')
  const isPending = params.get('pending') === 'true'

  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!orderId) { setNotFound(true); setLoading(false); return }
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setOrder(data as Order)
        setLoading(false)
      })
  }, [orderId])

  if (loading) return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando…</p>
    </main>
  )

  if (notFound) return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-[22px] text-ink mb-4">Pedido no encontrado</p>
        <Link to="/tienda" className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 hover:text-sage-900 transition-colors">
          Volver a la tienda →
        </Link>
      </div>
    </main>
  )

  const shortId = orderId!.slice(0, 8).toUpperCase()

  if (isPending) return (
    <>
      <Helmet><title>Pago en proceso · Natalia Heller</title></Helmet>
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-700 mb-3">Pedido · {shortId}</p>
          <h1 className="font-display text-[32px] font-normal text-ink mb-4">Tu pago está siendo procesado</h1>
          <p className="font-body text-[15px] text-ink-soft leading-relaxed mb-8">
            Mercado Pago está verificando el pago. Te avisamos por mail cuando se acredite.
          </p>
          <Link to="/tienda" className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 hover:text-sage-900 transition-colors">
            Seguir comprando →
          </Link>
        </div>
      </main>
    </>
  )

  return (
    <>
      <Helmet><title>¡Pedido confirmado! · Natalia Heller</title></Helmet>
      <main className="min-h-screen bg-cream-50 px-6 py-12">
        <div className="max-w-[560px] mx-auto">

          {/* Header */}
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-700 mb-3">
            Pedido · {shortId}
          </p>
          <h1 className="font-display text-[40px] font-normal text-ink mb-3 leading-tight">
            {order!.payment_method === 'transferencia' ? '¡Pedido recibido!' : '¡Pago confirmado!'}
          </h1>
          <p className="font-body text-[15px] text-ink-soft leading-relaxed mb-10">
            {order!.payment_method === 'transferencia'
              ? `Hola ${order!.customer_name.split(' ')[0]}, recibimos tu pedido. Realizá la transferencia y te confirmamos por mail.`
              : `Hola ${order!.customer_name.split(' ')[0]}, tu pago fue acreditado. ¡Gracias!`
            }
          </p>

          {/* Order items */}
          <div className="mb-8 rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft px-5 py-3 bg-cream-100">
              Resumen del pedido
            </p>
            {order!.order_items?.map((item) => {
              const label = [item.product_title, item.selected_size, item.has_frame ? 'con marco' : null, item.quantity > 1 ? `×${item.quantity}` : null].filter(Boolean).join(' · ')
              return (
                <div key={item.id} className="flex justify-between items-baseline px-5 py-3" style={{ borderTop: '1px solid var(--line-soft)' }}>
                  <span className="font-body text-[13px] text-ink">{label}</span>
                  <span className="font-mono text-[12px] text-ink-soft">{formatARS(item.unit_price * item.quantity)}</span>
                </div>
              )
            })}
            {order!.shipping_cost > 0 && (
              <div className="flex justify-between items-baseline px-5 py-3" style={{ borderTop: '1px solid var(--line-soft)' }}>
                <span className="font-body text-[13px] text-ink-soft">Envío</span>
                <span className="font-mono text-[12px] text-ink-soft">{formatARS(order!.shipping_cost)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline px-5 py-3 bg-cream-100" style={{ borderTop: '1px solid var(--line-soft)' }}>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink">Total</span>
              <span className="font-display text-[20px] text-sage-900">{formatARS(order!.total)}</span>
            </div>
          </div>

          {/* Transfer details (transferencia only) */}
          {order!.payment_method === 'transferencia' && (
            <div className="mb-8 rounded-sm p-6" style={{ border: '1px solid var(--line-soft)', background: 'var(--cream-200, #f5efe6)' }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-4">
                Datos para transferir
              </p>
              {[['Alias', 'natalia.arte'], ['CBU', '0000003100062588008793'], ['Titular', 'Natalia Heller']].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--line-soft)' }}>
                  <span className="font-mono text-[11px] text-ink-soft">{k}</span>
                  <span className="font-body text-[13px] text-ink font-semibold">{v}</span>
                </div>
              ))}
              <p className="font-body text-[13px] text-ink-soft mt-4 leading-relaxed">
                Transferí el monto exacto y envianos el comprobante a <strong>hola@tatuajesnaty.com</strong>.
              </p>
            </div>
          )}

          <Link
            to="/tienda"
            className="inline-block bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
          >
            Seguir explorando la tienda →
          </Link>
        </div>
      </main>
    </>
  )
}

export default CheckoutConfirmacion
```

### 2. Create `src/pages/CheckoutError.tsx`

```tsx
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const CheckoutError: React.FC = () => {
  const [params] = useSearchParams()
  const orderId  = params.get('order')
  const shortId  = orderId ? orderId.slice(0, 8).toUpperCase() : null

  return (
    <>
      <Helmet><title>Pago no completado · Natalia Heller</title></Helmet>
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          {shortId && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-3">
              Pedido · {shortId}
            </p>
          )}
          <h1 className="font-display text-[32px] font-normal text-ink mb-4">
            El pago no se completó
          </h1>
          <p className="font-body text-[15px] text-ink-soft leading-relaxed mb-8">
            Tu pedido fue cancelado y el stock liberado. Podés intentarlo de nuevo o elegir transferencia bancaria.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/tienda"
              className="bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
            >
              Volver a la tienda
            </Link>
            <Link
              to="/contacto"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink transition-colors"
            >
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutError
```

### 3. Register routes in `src/App.tsx`

Add these two lazy imports alongside the existing ones:
```typescript
const CheckoutConfirmacion = lazy(() => import('./pages/CheckoutConfirmacion'))
const CheckoutError        = lazy(() => import('./pages/CheckoutError'))
```

Add routes inside the `/*` Layout block, alongside `/checkout`:
```tsx
<Route path="/checkout/confirmacion" element={<CheckoutConfirmacion />} />
<Route path="/checkout/error"        element={<CheckoutError />} />
```

**Verification:**
```bash
npm run build
# Navigate to /checkout/confirmacion?order=fake-id → shows "not found"
# Navigate to /checkout/error → shows error page
```

---

## PROMPT 6 — Admin Improvements

Read before writing:
- `src/pages/admin/AdminOrders.tsx` — full file (existing `Order` interface, `updateStatus`, expanded detail UI)
- `src/pages/admin/AdminStock.tsx` — full file (existing row pattern, `saveRow` pattern)
- `src/lib/supabase.ts`

---

### Part A — `AdminOrders.tsx`: three additions

**1. Extend `Order` interface** — add new columns from the migration:
```typescript
interface Order {
  // ...existing fields...
  shipping_cost:    number          // add
  tracking_number:  string | null   // add
  mp_payment_id:    string | null   // add
}
```

**2. Add `updateTracking` function** alongside `updateStatus`:
```typescript
const updateTracking = async (orderId: string, trackingNumber: string) => {
  await supabase.from('orders').update({ tracking_number: trackingNumber }).eq('id', orderId)
  setOrders((prev) =>
    prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNumber } : o))
  )
}
```

**3. Inside the expanded detail panel**, add two conditional UI blocks after the "Cambio de estado" section:

```tsx
{/* Confirm payment button — transferencia + pendiente only */}
{order.payment_method === 'transferencia' && order.status === 'pendiente' && (
  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
    <button
      type="button"
      onClick={() => updateStatus(order.id, 'pagado')}
      className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill bg-sage-700 text-cream-50 hover:bg-sage-900 transition-all"
    >
      Confirmar pago
    </button>
    <span className="font-mono text-[10px] text-ink-soft">
      Confirmar solo cuando el dinero esté acreditado
    </span>
  </div>
)}

{/* Tracking number input — enviado or changing to enviado */}
{(order.status === 'enviado' || order.status === 'entregado') && (
  <div className="pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
    <label
      htmlFor={`tracking-${order.id}`}
      className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-2"
    >
      Número de seguimiento
    </label>
    <div className="flex gap-3">
      <input
        id={`tracking-${order.id}`}
        type="text"
        defaultValue={order.tracking_number ?? ''}
        placeholder="OCA-123456789"
        className="flex-1 font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
        style={{ borderColor: 'var(--line)' }}
        onBlur={(e) => {
          if (e.target.value !== (order.tracking_number ?? '')) {
            updateTracking(order.id, e.target.value)
          }
        }}
      />
      <span className="font-mono text-[10px] text-ink-soft self-end pb-1">guarda al salir del campo</span>
    </div>
  </div>
)}
```

**4. Show shipping cost in order detail** — inside the "Entrega · Pago" section, add after the address:
```tsx
{order.shipping_cost > 0 && (
  <p className="font-body text-[12px] text-ink-soft mt-1">
    Envío: {formatARS(order.shipping_cost)}
  </p>
)}
```

---

### Part B — `AdminStock.tsx`: shipping config section

Add a new local state block and section at the bottom of the component, before the final `return`:

**State (add after existing `rows` state):**
```typescript
const [shippingPrice,       setShippingPrice]       = useState<number>(0)
const [shippingLabel,       setShippingLabel]       = useState<string>('Envío a domicilio')
const [shippingDesc,        setShippingDesc]        = useState<string>('')
const [shippingDirty,       setShippingDirty]       = useState(false)
const [shippingSaving,      setShippingSaving]      = useState(false)
const [shippingInitialized, setShippingInitialized] = useState(false)
```

**Load shipping config** — add inside the existing `useEffect` or create a new one:
```typescript
useEffect(() => {
  if (shippingInitialized) return
  supabase
    .from('shipping_config')
    .select('price, label, description')
    .eq('id', 1)
    .single()
    .then(({ data }) => {
      if (data) {
        setShippingPrice(data.price)
        setShippingLabel(data.label)
        setShippingDesc(data.description ?? '')
      }
      setShippingInitialized(true)
    })
}, [shippingInitialized])
```

**Save function:**
```typescript
const saveShipping = async () => {
  setShippingSaving(true)
  await supabase
    .from('shipping_config')
    .update({ price: shippingPrice, label: shippingLabel, description: shippingDesc, updated_at: new Date().toISOString() })
    .eq('id', 1)
  setShippingSaving(false)
  setShippingDirty(false)
}
```

**UI — add at the bottom of the returned JSX**, after the product table:
```tsx
{/* Shipping config */}
<div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line-soft)' }}>
  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-5">
    Costo de envío
  </p>
  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr_80px] gap-4 items-end">
    {/* Price */}
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
        Precio (ARS)
      </label>
      <input
        type="number"
        min={0}
        value={shippingPrice}
        onChange={(e) => { setShippingPrice(Number(e.target.value)); setShippingDirty(true) }}
        className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
        style={{ borderColor: 'var(--line)' }}
      />
    </div>
    {/* Label */}
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
        Etiqueta
      </label>
      <input
        type="text"
        value={shippingLabel}
        onChange={(e) => { setShippingLabel(e.target.value); setShippingDirty(true) }}
        className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
        style={{ borderColor: 'var(--line)' }}
      />
    </div>
    {/* Description */}
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
        Descripción (opcional)
      </label>
      <input
        type="text"
        value={shippingDesc}
        onChange={(e) => { setShippingDesc(e.target.value); setShippingDirty(true) }}
        className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
        style={{ borderColor: 'var(--line)' }}
        placeholder="Coordinado con Ian · todo el país"
      />
    </div>
    {/* Save */}
    <button
      type="button"
      disabled={!shippingDirty || shippingSaving}
      onClick={saveShipping}
      className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all disabled:opacity-30"
      style={{
        borderColor: shippingDirty ? 'var(--sage-700)' : 'var(--line)',
        color:       shippingDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
      }}
    >
      {shippingSaving ? '…' : 'Guardar'}
    </button>
  </div>
  <p className="font-mono text-[10px] text-ink-soft mt-3">
    Ponelo en 0 para mostrar "Gratis" en el checkout.
  </p>
</div>
```

**Verification:**
```bash
npm run build   # 0 TS errors
npm run dev     # admin/stock has shipping section, admin orders shows confirm + tracking
```

---

## PROMPT 7 — Admin: Send Confirmation Email on Manual Payment

Read before writing:
- `supabase/functions/mp-webhook/index.ts` — copy the `sendConfirmationEmail` function and `OrderRow` interface (you'll reuse the same logic)
- `src/pages/admin/AdminOrders.tsx` — current `updateStatus` function

---

Create `supabase/functions/send-confirmation-email/index.ts`.

This function is called from the admin when manually confirming a transfer payment. It fetches the order from DB and sends the same confirmation email as the MP webhook.

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const { orderId } = await req.json()
  if (!orderId) return new Response('missing orderId', { status: 400, headers: CORS })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { db: { schema: 'nat_ecommerce' } }
  )

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (error || !order) {
    return new Response(JSON.stringify({ error: 'order not found' }), { status: 404, headers: CORS })
  }

  // Reuse exact same sendConfirmationEmail logic from mp-webhook
  // Copy the function body here (same HTML template, same Brevo call)
  await sendConfirmationEmail(order)

  return new Response(JSON.stringify({ ok: true }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
})

// Paste sendConfirmationEmail function here — identical to mp-webhook/index.ts
```

Then modify `AdminOrders.tsx` — update the "Confirmar pago" button's `onClick` to also invoke the email function:

```typescript
// Replace the confirm payment button's onClick:
onClick={async () => {
  await updateStatus(order.id, 'pagado')
  await supabase.functions.invoke('send-confirmation-email', {
    body: { orderId: order.id },
  })
}}
```

**Verification:**
```bash
supabase functions deploy send-confirmation-email
# Click "Confirmar pago" on a transferencia order in dev → check email inbox
```

---

## PROMPT 8 — Environment Variables & Final Wiring

Read before writing:
- `src/lib/supabase.ts` — existing env vars
- `vite.config.ts` — check if any env var prefix config needed

---

### 1. Create `.env.local` additions

Add to `.env.local` (do NOT commit to git — add to `.gitignore` if not already there):
```
VITE_SITE_URL=http://localhost:5173
```

For production (Vercel or wherever deployed), set:
```
VITE_SITE_URL=https://tatuajesnaty.com
```

### 2. Supabase secrets — set via CLI

```bash
supabase secrets set MP_ACCESS_TOKEN="TEST-xxxx"         # sandbox token from mercadopago.com/developers
supabase secrets set MP_WEBHOOK_SECRET="your-secret"     # generate from MP webhook config panel
supabase secrets set BREVO_API_KEY="xkeysib-xxxx"        # from brevo.com → SMTP & API → API Keys
supabase secrets set SITE_URL="https://tatuajesnaty.com"
```

### 3. Verify `supabase/config.toml`

Ensure both functions are listed or that Supabase picks them up automatically. If using `supabase functions deploy` manually, run:
```bash
supabase functions deploy create-mp-preference
supabase functions deploy mp-webhook
supabase functions deploy send-confirmation-email
```

### 4. Register webhook in Mercado Pago

In the MP developer dashboard:
- URL: `https://<project-ref>.supabase.co/functions/v1/mp-webhook`
- Events: `Payments` (check "Created" and "Updated")
- Copy the generated secret → set as `MP_WEBHOOK_SECRET`

### 5. Final build verification

```bash
npm run build   # must be 0 TS errors
npm run lint    # must be 0 warnings
```

---

## PROMPT 9 — End-to-End Manual Test (Sandbox)

This is a verification prompt — read all the changed files and confirm the full flow works.

Read before verifying:
- All files modified across prompts 1–8
- `supabase/functions/` directory

---

### Pre-requisites
- Supabase migration applied
- All 3 Edge Functions deployed
- `MP_ACCESS_TOKEN` is the **TEST** token (starts with `TEST-`)
- Supabase function logs open in a second terminal: `supabase functions logs --follow`

### Test checklist

**Flow A — Mercado Pago:**
- [ ] Add a product with variants to cart
- [ ] Go to `/checkout`, fill form, select "Envío", select "Mercado Pago"
- [ ] Order summary shows correct subtotal + shipping + total
- [ ] Submit → page redirects to `sandbox.mercadopago.com.ar`
- [ ] Pay with a [MP test card](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards)
- [ ] Redirects to `/checkout/confirmacion?order=<uuid>` with order receipt
- [ ] In Supabase logs: `mp-webhook` fired, order status → `pagado`
- [ ] In `/admin`: order shows status "Pagado"
- [ ] Email received at the test email address

**Flow B — Transferencia:**
- [ ] Complete checkout with "Transferencia bancaria"
- [ ] Confirmation screen shows CBU, alias, and owner
- [ ] In `/admin`: order shows status "Pendiente", "Confirmar pago" button visible
- [ ] Click "Confirmar pago" → status changes to "Pagado" inline
- [ ] Confirmation email received

**Flow C — Stock integrity:**
- [ ] Set a product stock to 1 in Admin Stock
- [ ] Add 2 units to cart → checkout → submit → error "sin stock" appears correctly
- [ ] Cancel an order in Admin → verify stock is replenished in Admin Stock

**Flow D — Shipping config:**
- [ ] In Admin Stock, change shipping price to `5000`
- [ ] Go to checkout, select "Envío" → sidebar shows "Envío a domicilio · $5.000"
- [ ] Change to $0 → shows "Gratis"

**Flow E — Tracking:**
- [ ] Change order status to "Enviado"
- [ ] Tracking number input appears → type number → blur → verify saved in Supabase

---

## Summary — Files Created / Modified

| Prompt | Creates | Modifies |
|--------|---------|----------|
| 1 | `supabase/migrations/20260430_wave4_purchase_flow.sql` | — |
| 2 | `supabase/functions/create-mp-preference/index.ts` | — |
| 3 | `supabase/functions/mp-webhook/index.ts` | — |
| 4 | `src/hooks/useShippingConfig.ts` | `src/pages/Checkout.tsx` |
| 5 | `src/pages/CheckoutConfirmacion.tsx`, `src/pages/CheckoutError.tsx` | `src/App.tsx` |
| 6 | — | `src/pages/admin/AdminOrders.tsx`, `src/pages/admin/AdminStock.tsx` |
| 7 | `supabase/functions/send-confirmation-email/index.ts` | `src/pages/admin/AdminOrders.tsx` |
| 8 | — | `.env.local`, `supabase secrets` (CLI) |
| 9 | — | — (verification only) |

## Required Secrets Summary

| Secret | Where to get it |
|--------|----------------|
| `MP_ACCESS_TOKEN` | mercadopago.com/developers → Credenciales → TEST |
| `MP_WEBHOOK_SECRET` | MP dashboard → Webhooks → al registrar la URL |
| `BREVO_API_KEY` | brevo.com → SMTP & API → API Keys |
| `SITE_URL` | `https://tatuajesnaty.com` |
| `VITE_SITE_URL` | `.env.local` — `http://localhost:5173` (dev) |

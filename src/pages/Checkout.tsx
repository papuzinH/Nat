import React, { useRef, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatARS } from '@/data/products'
import InputField from '@/components/contacto/InputField'
import { useCheckoutForm } from '@/hooks/useCheckoutForm'
import { useShippingConfig } from '@/hooks/useShippingConfig'
import { supabase } from '@/lib/supabase'

const STUDIO_ADDRESS = 'Ciudad Autónoma de Buenos Aires · Coordinar punto de encuentro'

type DeliveryMode = 'envio' | 'retiro'
type PaymentMethod = 'mercadopago' | 'transferencia'

const pillBase =
  'px-4 py-1.5 rounded-pill text-sm font-body border transition-all duration-200 cursor-pointer'
const pillActive = 'bg-sage-700 text-cream-50 border-sage-700'
const pillInactive =
  'bg-transparent text-ink-soft border-[var(--line)] hover:border-sage-700 hover:text-sage-700'

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart()
  const { fields, errors, update, submit } = useCheckoutForm()
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stockError, setStockError] = useState<string | null>(null)
  const firstErrorRef = useRef<HTMLDivElement>(null)
  const { config: shippingConfig, loading: shippingLoading } = useShippingConfig()
  const shippingCost = fields.deliveryMode === 'envio' ? shippingConfig.price : 0
  const grandTotal   = subtotal + shippingCost

  if (items.length === 0 && !confirmed) return <Navigate to="/tienda" replace />

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

  if (confirmed) {
    return (
      <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--sage-200, #c8dcd0)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage-700, #4a7c59)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-[28px] text-ink font-normal mb-3">
            ¡Pedido recibido!
          </h1>
          <p className="font-body text-[15px] text-ink-soft leading-relaxed mb-8">
            Natalia se va a comunicar con vos a la brevedad para coordinar el pago y el envío.
            Gracias por tu compra.
          </p>
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
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center font-body font-semibold text-[14px] px-[22px] py-[13px] rounded-pill border transition-all duration-200 hover:bg-ink hover:text-cream-50"
            style={{
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              textDecoration: 'none',
            }}
          >
            Volver a la tienda
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-12">
        <h1
          className="font-display font-normal text-ink mb-10"
          style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Finalizar pedido
        </h1>

        <form onSubmit={handleSubmit} noValidate>

          {/* Resumen */}
          <section className="mb-10">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Resumen del pedido
            </h2>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div
                    className="flex-shrink-0 rounded-sm overflow-hidden bg-cream-200"
                    style={{ width: 48, height: 48 }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[14px] text-ink leading-snug">{item.title}</p>
                    <p className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.1em] mt-0.5">
                      {[item.selectedSize, item.hasFrame ? 'con marco' : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-body text-[13px] text-ink">{formatARS(item.unitPrice * item.quantity)}</p>
                    <p className="font-mono text-[10px] text-ink-soft">×{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
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
          </section>

          {/* Datos de contacto */}
          <section className="mb-10 pt-10" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Datos de contacto
            </h2>
            <div className="flex flex-col gap-6" ref={firstErrorRef}>
              <InputField
                id="name"
                name="name"
                type="text"
                label="Nombre completo"
                value={fields.name}
                placeholder="Tu nombre"
                required
                errorMsg={errors.name}
                onChange={(e) => update('name', e.target.value)}
              />
              <InputField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={fields.email}
                placeholder="tu@email.com"
                required
                errorMsg={errors.email}
                onChange={(e) => update('email', e.target.value)}
              />
              <InputField
                id="phone"
                name="phone"
                type="tel"
                label="Teléfono"
                value={fields.phone}
                placeholder="11 5555-1234"
                required
                errorMsg={errors.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>
          </section>

          {/* Modalidad de entrega */}
          <section className="mb-10 pt-10" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Modalidad de entrega
            </h2>
            <div className="flex gap-3 flex-wrap mb-4">
              {(['envio', 'retiro'] as DeliveryMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => update('deliveryMode', mode)}
                  className={`${pillBase} ${fields.deliveryMode === mode ? pillActive : pillInactive}`}
                >
                  {mode === 'envio' ? 'Envío a domicilio' : 'Retiro en persona'}
                </button>
              ))}
            </div>
            {errors.deliveryMode && (
              <p className="text-[#a8503f] text-xs font-body mb-4">{errors.deliveryMode}</p>
            )}

            <div
              style={{
                overflow: 'hidden',
                maxHeight: fields.deliveryMode === 'envio' ? 300 : 0,
                opacity: fields.deliveryMode === 'envio' ? 1 : 0,
                transition: 'max-height 0.3s ease, opacity 0.25s ease',
              }}
            >
              <div className="flex flex-col gap-6 pt-2">
                <InputField
                  id="street"
                  name="street"
                  type="text"
                  label="Calle y número"
                  value={fields.street}
                  placeholder="Av. Corrientes 1234"
                  required
                  errorMsg={errors.street}
                  onChange={(e) => update('street', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id="city"
                    name="city"
                    type="text"
                    label="Localidad"
                    value={fields.city}
                    placeholder="Buenos Aires"
                    required
                    errorMsg={errors.city}
                    onChange={(e) => update('city', e.target.value)}
                  />
                  <InputField
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    label="Código postal"
                    value={fields.postalCode}
                    placeholder="1043"
                    required
                    errorMsg={errors.postalCode}
                    onChange={(e) => update('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                overflow: 'hidden',
                maxHeight: fields.deliveryMode === 'retiro' ? 80 : 0,
                opacity: fields.deliveryMode === 'retiro' ? 1 : 0,
                transition: 'max-height 0.3s ease, opacity 0.25s ease',
              }}
            >
              <p className="font-body text-[14px] text-ink-soft leading-relaxed pt-2">
                {STUDIO_ADDRESS}
              </p>
            </div>
          </section>

          {/* Método de pago */}
          <section className="mb-10 pt-10" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Método de pago
            </h2>
            <div className="flex gap-3 flex-wrap">
              {(['mercadopago', 'transferencia'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => update('paymentMethod', method)}
                  className={`${pillBase} ${fields.paymentMethod === method ? pillActive : pillInactive}`}
                >
                  {method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia bancaria'}
                </button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-[#a8503f] text-xs font-body mt-3">{errors.paymentMethod}</p>
            )}
          </section>

          {/* CTA */}
          <div className="pt-2">
            {stockError && (
              <p className="text-[#a8503f] text-sm font-body mb-4 text-center">{stockError}</p>
            )}
            <button
              type="submit"
              disabled={submitting || shippingLoading}
              className="w-full bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ cursor: submitting ? 'not-allowed' : 'pointer', border: 'none' }}
            >
              {submitting ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}

export default Checkout

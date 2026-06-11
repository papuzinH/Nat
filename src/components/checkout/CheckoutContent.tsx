'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { formatARS } from '@/data/products'
import InputField from '@/components/contacto/InputField'
import { useCheckoutForm } from '@/hooks/useCheckoutForm'
import { usePublicShippingZones } from '@/hooks/useShippingZones'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { isCABA, matchZone } from '@/lib/shipping'

const STUDIO_ADDRESS = 'Parque Chacabuco, CABA. Nos pondremos en contacto para coordinar una vez confirmada la compra!'

const DELIVERY_DAYS = [
  { value: 'martes', label: 'Martes 17–21hs' },
  { value: 'viernes', label: 'Viernes 17–21hs' },
  { value: 'coordinar', label: 'A coordinar' },
]

type DeliveryMode = 'envio' | 'retiro'
type PaymentMethod = 'mercadopago' | 'transferencia'

const pillBase =
  'px-4 py-1.5 rounded-pill text-sm font-body border transition-all duration-200 cursor-pointer'
const pillActive = 'bg-sage-700 text-cream-50 border-sage-700'
const pillInactive =
  'bg-transparent text-ink-soft border-[var(--line)] hover:border-sage-700 hover:text-sage-700'

const CheckoutContent: React.FC = () => {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { fields, errors, update, updateMany, submit } = useCheckoutForm()
  const [submitting, setSubmitting] = useState(false)
  const [stockError, setStockError] = useState<string | null>(null)
  const firstErrorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { zones, loading: zonesLoading } = usePublicShippingZones()

  // Carrito vacío → volver a la tienda (reemplaza <Navigate> de react-router).
  // Al confirmar, la navegación se hace con window.location.href, que gana la
  // carrera contra este efecto (mismo patrón que el flujo de Mercado Pago).
  useEffect(() => {
    if (items.length === 0) router.replace('/tienda')
  }, [items.length, router])

  // Prefill del CP estimado en el carrito (continuidad carrito → checkout).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.sessionStorage.getItem('checkout_cp')
    if (saved) updateMany({ postalCode: saved, deliveryMode: 'envio' })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fields.deliveryMode !== 'envio' || !fields.postalCode) {
      if (fields.deliveryMode !== 'envio') {
        updateMany({ zoneId: null, zoneName: '', zonePrice: 0, shippingCoordinate: false })
      }
      return
    }
    const matched = matchZone(fields.postalCode, zones)
    if (matched) {
      updateMany({ zoneId: matched.id, zoneName: matched.name, zonePrice: matched.price, shippingCoordinate: false })
    } else {
      // CP sin tarifa fija (fuera de CABA o CABA sin zona): se coordina aparte.
      updateMany({ zoneId: null, zoneName: 'A coordinar', zonePrice: 0, shippingCoordinate: true })
    }
  }, [fields.postalCode, fields.deliveryMode, zones])  // eslint-disable-line react-hooks/exhaustive-deps

  const cpStatus: 'empty' | 'loading' | 'matched' | 'coordinate' = (() => {
    if (fields.deliveryMode !== 'envio') return 'empty'
    const cp = fields.postalCode ?? ''
    if (cp.length < 4) return 'empty'
    if (zonesLoading) return 'loading'
    return matchZone(cp, zones) ? 'matched' : 'coordinate'
  })()

  const shippingCost = fields.deliveryMode === 'envio' ? (fields.zonePrice ?? 0) : 0
  const grandTotal   = subtotal + shippingCost

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !shouldAnimate()) return
    const ctx = gsap.context(() => {
      const heading = container.querySelector('.checkout-heading')
      const sections = gsap.utils.toArray<HTMLElement>('.checkout-section')
      const cta = container.querySelector('.checkout-cta')
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      if (heading) tl.fromTo(heading, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 })
      if (sections.length)
        tl.fromTo(
          sections,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.25'
        )
      if (cta) tl.fromTo(cta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
    }, container)
    return () => ctx.revert()
  }, [])

  if (items.length === 0) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const valid = submit()
    if (!valid) {
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    setStockError(null)

    // El cliente sólo manda QUÉ productos; el servidor recalcula precios y
    // crea la orden (autoridad de precios). Nada de montos desde el cliente.
    const orderPayload = {
      customer: { name: fields.name, email: fields.email, phone: fields.phone },
      delivery: {
        mode:        fields.deliveryMode,
        street:      fields.street,
        city:        fields.city,
        postalCode:  fields.postalCode,
        deliveryDay: fields.deliveryDay,
      },
      paymentMethod: fields.paymentMethod,
      items: items.map((item) => ({
        slug:         item.slug,
        selectedSize: item.selectedSize ?? null,
        hasFrame:     item.hasFrame,
        frameColor:   item.frameColor,
        quantity:     item.quantity,
      })),
    }

    let orderId: string
    let uploadToken: string
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Error al procesar el pedido. Intentá de nuevo.')
      }
      const data = (await res.json()) as { orderId: string; uploadToken: string }
      orderId = data.orderId
      uploadToken = data.uploadToken
    } catch (err) {
      setSubmitting(false)
      setStockError(err instanceof Error ? err.message : 'Error al procesar el pedido. Intentá de nuevo.')
      return
    }

    // ── Mercado Pago ────────────────────────────────────────────────
    if (fields.paymentMethod === 'mercadopago') {
      const mpRes = await fetch('/api/create-mp-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = mpRes.ok ? (await mpRes.json() as { initPoint?: string }) : null

      setSubmitting(false)

      if (!data?.initPoint) {
        setStockError('No pudimos iniciar el pago. Intentá de nuevo.')
        return
      }

      clearCart()
      window.location.href = data.initPoint
      return
    }

    // ── Transferencia bancaria ──────────────────────────────────────
    // Email de respaldo con los datos bancarios (best-effort; keepalive para
    // que sobreviva a la navegación que sigue).
    void fetch('/api/send-order-pending-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
      keepalive: true,
    }).catch(() => {})

    clearCart()
    window.location.href = `/checkout/confirmacion?order=${orderId}&t=${uploadToken}`
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <div ref={containerRef} className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <h1
          className="checkout-heading font-display font-normal text-ink mb-10"
          style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Finalizar pedido
        </h1>

        <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-16 lg:items-start">

          <aside className="checkout-section mb-10 lg:mb-0 lg:sticky lg:top-24">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Resumen del pedido
            </h2>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="relative flex-shrink-0 rounded-sm overflow-hidden bg-cream-200" style={{ width: 48, height: 48 }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[14px] text-ink leading-snug">{item.title}</p>
                    <p className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.1em] mt-0.5">
                      {[item.selectedSize, item.hasFrame ? 'con marco' : null].filter(Boolean).join(' · ')}
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
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Envío</span>
                  <span className="font-body text-[13px] text-ink">
                    {fields.shippingCoordinate ? 'A coordinar' : shippingCost === 0 ? 'Gratis' : formatARS(shippingCost)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--line-soft)' }}>
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink font-semibold">Total</span>
                <span className="font-display text-[22px] text-sage-900">{formatARS(grandTotal)}</span>
              </div>
            </div>
          </aside>

        <form onSubmit={handleSubmit} noValidate>

          <section className="checkout-section mb-10">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Datos de contacto
            </h2>
            <div className="flex flex-col gap-6" ref={firstErrorRef}>
              <InputField id="name" name="name" type="text" label="Nombre completo" value={fields.name} placeholder="Tu nombre" required errorMsg={errors.name} onChange={(e) => update('name', e.target.value)} />
              <InputField id="email" name="email" type="email" label="Email" value={fields.email} placeholder="tu@email.com" required errorMsg={errors.email} onChange={(e) => update('email', e.target.value)} />
              <InputField id="phone" name="phone" type="tel" label="Teléfono" value={fields.phone} placeholder="11 5555-1234" required errorMsg={errors.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
          </section>

          <section className="checkout-section mb-10 pt-10" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Modalidad de entrega
            </h2>
            <div className="flex gap-3 flex-wrap mb-4">
              {(['envio', 'retiro'] as DeliveryMode[]).map((mode) => (
                <button key={mode} type="button" onClick={() => update('deliveryMode', mode)} className={`${pillBase} ${fields.deliveryMode === mode ? pillActive : pillInactive}`}>
                  {mode === 'envio' ? 'Envío a domicilio' : 'Retiro en persona'}
                </button>
              ))}
            </div>
            {errors.deliveryMode && (
              <p className="text-[#a8503f] text-xs font-body mb-4">{errors.deliveryMode}</p>
            )}

            <div style={{ overflow: 'hidden', maxHeight: fields.deliveryMode === 'envio' ? 700 : 0, opacity: fields.deliveryMode === 'envio' ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.25s ease' }}>
              <div className="flex flex-col gap-6 pt-2">
                <InputField id="street" name="street" type="text" label="Calle y número" value={fields.street} placeholder="Av. Corrientes 1234" required errorMsg={errors.street} onChange={(e) => update('street', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField id="city" name="city" type="text" label="Localidad" value={fields.city} placeholder="Buenos Aires" required errorMsg={errors.city} onChange={(e) => update('city', e.target.value)} />
                  <InputField id="postalCode" name="postalCode" type="text" label="Código postal" value={fields.postalCode} placeholder="1043" required errorMsg={errors.postalCode} onChange={(e) => update('postalCode', e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                      Día de entrega preferido <span aria-hidden="true">*</span>
                    </label>
                    {cpStatus === 'loading' && (
                      <span className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.1em]">Calculando…</span>
                    )}
                    {cpStatus === 'matched' && (
                      <span className="font-body text-[13px] text-ink">
                        {(fields.zonePrice ?? 0) > 0 ? `Envío: ${formatARS(fields.zonePrice ?? 0)}` : 'Envío gratis'}
                      </span>
                    )}
                    {cpStatus === 'coordinate' && (
                      <span className="font-body text-[13px] text-ink-soft">Envío a coordinar</span>
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {DELIVERY_DAYS.map((day) => (
                      <button key={day.value} type="button" onClick={() => update('deliveryDay', day.value)} className={`${pillBase} ${fields.deliveryDay === day.value ? pillActive : pillInactive}`}>
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {cpStatus === 'coordinate' && (
                    <p className="font-body text-[12px] text-ink-soft mt-1">
                      {isCABA(fields.postalCode) ? (
                        <>
                          Tu CP está en CABA pero todavía sin tarifa fija:{' '}
                          <strong className="text-ink">coordinamos el envío</strong> con vos por WhatsApp/email y acordamos el costo.
                        </>
                      ) : (
                        <>
                          Estás fuera de CABA:{' '}
                          <strong className="text-ink">coordinamos el envío</strong> por WhatsApp/email y acordamos el costo. También podés elegir{' '}
                          <strong className="text-ink">Retiro en persona</strong>.
                        </>
                      )}
                    </p>
                  )}
                  {errors.zoneId && <p className="text-[#a8503f] text-xs font-body">{errors.zoneId}</p>}
                  {errors.deliveryDay && <p className="text-[#a8503f] text-xs font-body">{errors.deliveryDay}</p>}
                </div>
              </div>
            </div>

            <div style={{ overflow: 'hidden', maxHeight: fields.deliveryMode === 'retiro' ? 100 : 0, opacity: fields.deliveryMode === 'retiro' ? 1 : 0, transition: 'max-height 0.3s ease, opacity 0.25s ease' }}>
              <p className="font-body text-[14px] text-ink-soft leading-relaxed pt-2">{STUDIO_ADDRESS}</p>
            </div>
          </section>

          <section className="checkout-section mb-10 pt-10" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-5">
              Método de pago
            </h2>
            <div className="flex gap-3 flex-wrap">
              {(['mercadopago', 'transferencia'] as PaymentMethod[]).map((method) => (
                <button key={method} type="button" onClick={() => update('paymentMethod', method)} className={`${pillBase} ${fields.paymentMethod === method ? pillActive : pillInactive}`}>
                  {method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia bancaria'}
                </button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-[#a8503f] text-xs font-body mt-3">{errors.paymentMethod}</p>
            )}
          </section>

          <div className="checkout-cta pt-2">
            {stockError && (
              <p className="text-[#a8503f] text-sm font-body mb-4 text-center">{stockError}</p>
            )}
            <button
              type="submit"
              disabled={submitting || zonesLoading}
              className="w-full bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ cursor: submitting ? 'not-allowed' : 'pointer', border: 'none' }}
            >
              {submitting ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </div>

        </form>
        </div>
      </div>
    </main>
  )
}

export default CheckoutContent

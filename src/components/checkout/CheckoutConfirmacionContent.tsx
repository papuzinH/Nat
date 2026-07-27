'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatARS } from '@/data/products'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { NHWreath } from '@/components/shared'
import BankTransferPanel from './BankTransferPanel'

interface OrderItem {
  id: string
  product_title: string
  selected_size: string | null
  has_frame: boolean
  unit_price: number
  quantity: number
}

interface Order {
  id:             string
  customer_name:  string
  delivery_mode:  string
  payment_method: string
  shipping_cost:  number
  total:          number
  status:         string
  payment_proof?: string
  items?:         OrderItem[]
}

function getBodyMessage(paymentMethod: string, deliveryMode: string, firstName: string): string {
  if (paymentMethod === 'mercadopago') {
    if (deliveryMode === 'retiro') {
      return `Hola ${firstName}, tu pago fue acreditado. Nos comunicaremos a la brevedad por email o WhatsApp para coordinar el retiro.`
    }
    return `Hola ${firstName}, tu pago fue acreditado. Nos comunicaremos a la brevedad por email o WhatsApp para informarte el estado del envío.`
  }
  if (deliveryMode === 'retiro') {
    return `Hola ${firstName}, recibimos tu pedido. Nos comunicaremos a la brevedad para confirmar el pago y coordinar el retiro.`
  }
  return `Hola ${firstName}, recibimos tu pedido. Nos comunicaremos a la brevedad para confirmar el pago e informarte sobre el envío.`
}

const CheckoutConfirmacionContent: React.FC = () => {
  const params      = useSearchParams()
  const orderId     = params.get('order')
  const uploadToken = params.get('t') ?? ''
  const isPending   = params.get('pending') === 'true'

  const [order,    setOrder]    = useState<Order | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || loading || notFound || !shouldAnimate()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const wreath = wrapper.querySelector('.confirm-wreath')
      const meta = wrapper.querySelector('.confirm-meta')
      const heading = wrapper.querySelector('.confirm-heading')
      const body = wrapper.querySelector('.confirm-body')
      const summary = wrapper.querySelector('.confirm-summary')
      const transferDetails = wrapper.querySelector('.confirm-transfer')
      const cta = wrapper.querySelector('.confirm-cta')

      // Solo el fade del contenedor: el brote de las hojas lo hace el CSS del motivo.
      if (wreath) tl.fromTo(wreath, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 })
      if (meta) tl.fromTo(meta, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.25')
      if (heading) tl.fromTo(heading, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.2')
      if (body) tl.fromTo(body, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
      if (summary) tl.fromTo(summary, { opacity: 0, y: 16, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.25')
      if (transferDetails) tl.fromTo(transferDetails, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      if (cta) tl.fromTo(cta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.25')
    }, wrapper)
    return () => ctx.revert()
  }, [loading, notFound])

  useEffect(() => {
    if (!orderId || !uploadToken) { setNotFound(true); setLoading(false); return }
    fetch(`/api/order?id=${encodeURIComponent(orderId)}&t=${encodeURIComponent(uploadToken)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('not_found'))))
      .then((data: Order) => { setOrder(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [orderId, uploadToken])

  if (loading) return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando…</p>
    </main>
  )

  if (notFound) return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-[22px] text-ink mb-4">Pedido no encontrado</p>
        <Link href="/tienda" className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 hover:text-sage-900 transition-colors">
          Volver a la tienda →
        </Link>
      </div>
    </main>
  )

  const shortId = orderId!.slice(0, 8).toUpperCase()

  if (isPending) return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-700 mb-3">Pedido · {shortId}</p>
        <h1 className="font-display text-[32px] font-normal text-ink mb-4">Tu pago está siendo procesado</h1>
        <p className="font-body text-[15px] text-ink-soft leading-relaxed mb-8">
          {order!.delivery_mode === 'retiro'
            ? 'Mercado Pago está verificando el pago. Recibirás la confirmación del pedido y nos comunicaremos para coordinar el retiro.'
            : 'Mercado Pago está verificando el pago. Recibirás la confirmación del pedido y nos comunicaremos para informarte el estado del envío.'}
        </p>
        <Link href="/tienda" className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 hover:text-sage-900 transition-colors">
          Seguir comprando →
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-cream-50 px-6 py-12">
      <div ref={wrapperRef} className="max-w-[560px] mx-auto">

        <div className="confirm-wreath mb-5">
          <NHWreath size={88} className="text-sage-700" />
        </div>

        <p className="confirm-meta font-mono text-[10px] uppercase tracking-[0.14em] text-sage-700 mb-3">
          Pedido · {shortId}
        </p>
        <h1 className="confirm-heading font-display text-[40px] font-normal text-ink mb-3 leading-tight">
          {order!.payment_method === 'transferencia' ? '¡Pedido recibido!' : '¡Pago confirmado!'}
        </h1>
        <p className="confirm-body font-body text-[15px] text-ink-soft leading-relaxed mb-10">
          {getBodyMessage(order!.payment_method, order!.delivery_mode, order!.customer_name.split(' ')[0])}
        </p>

        <div className="confirm-summary mb-8 rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft px-5 py-3 bg-cream-100">
            Resumen del pedido
          </p>
          {(order!.items ?? []).map((item, i) => {
            const label = [item.product_title, item.selected_size, item.has_frame ? 'con marco' : null, item.quantity > 1 ? `×${item.quantity}` : null].filter(Boolean).join(' · ')
            return (
              <div key={i} className="flex justify-between items-baseline px-5 py-3" style={{ borderTop: '1px solid var(--line-soft)' }}>
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

        {order!.payment_method === 'transferencia' && (
          <div className="confirm-transfer mb-8">
            <BankTransferPanel
              orderId={order!.id}
              uploadToken={uploadToken}
              shortId={shortId}
              total={order!.total}
              initialReceived={Boolean(order!.payment_proof) || order!.status === 'comprobante_recibido'}
            />
          </div>
        )}

        <Link
          href="/tienda"
          className="confirm-cta inline-block bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
        >
          Seguir explorando la tienda →
        </Link>
      </div>
    </main>
  )
}

export default CheckoutConfirmacionContent

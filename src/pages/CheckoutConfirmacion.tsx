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

  const [order,    setOrder]    = useState<Order | null>(null)
  const [loading,  setLoading]  = useState(true)
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

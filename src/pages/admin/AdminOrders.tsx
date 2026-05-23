import React, { useEffect, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { formatARS } from '@/data/products'

interface OrderItem {
  product_slug:  string
  product_title: string
  selected_size: string | null
  has_frame:     boolean
  unit_price:    number
  quantity:      number
}

interface Order {
  id:             string
  created:        string
  status:         string
  customer_name:  string
  customer_email: string
  customer_phone: string
  delivery_mode:  string
  street:         string | null
  city:           string | null
  postal_code:    string | null
  payment_method: string
  shipping_cost:  number
  tracking_number: string | null
  mp_payment_id:  string | null
  total:          number
  items?:         OrderItem[]
}

const STATUS_OPTIONS = [
  { value: 'pendiente',       label: 'Pendiente' },
  { value: 'pagado',          label: 'Pagado' },
  { value: 'en-preparacion',  label: 'En preparación' },
  { value: 'enviado',         label: 'Enviado' },
  { value: 'entregado',       label: 'Entregado' },
  { value: 'cancelado',       label: 'Cancelado' },
]

const STATUS_COLORS: Record<string, string> = {
  pendiente:        'bg-[#f5efe6] text-[#a87c3f]',
  pagado:           'bg-[#e6f0eb] text-[#4a7c59]',
  'en-preparacion': 'bg-[#eaf0f5] text-[#3f6a8a]',
  enviado:          'bg-[#f0eaf5] text-[#6a3f8a]',
  entregado:        'bg-[#e6f0eb] text-[#2d5c3e]',
  cancelado:        'bg-[#f5e6e6] text-[#a8503f]',
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const data = await pb.collection('orders').getFullList({ sort: '-created' })
    setOrders(data as unknown as Order[])
    setLoading(false)
  }

  const updateStatus = async (orderId: string, status: string) => {
    await pb.collection('orders').update(orderId, { status })
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const updateTracking = async (orderId: string, trackingNumber: string) => {
    await pb.collection('orders').update(orderId, { tracking_number: trackingNumber })
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNumber } : o)))
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando órdenes…</p>
  }

  if (orders.length === 0) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">No hay órdenes todavía.</p>
  }

  return (
    <div>
      <h1 className="font-display text-[22px] text-ink font-normal mb-6">Órdenes</h1>

      <div className="flex flex-col gap-2">
        {orders.map((order) => (
          <div key={order.id} className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
            {/* Fila principal */}
            <button
              type="button"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full text-left px-5 py-4 bg-cream-50 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-mono text-[11px] text-ink-soft w-[90px] flex-shrink-0">
                  {formatDate(order.created)}
                </span>
                <span className="font-body text-[14px] text-ink flex-1 min-w-[120px]">{order.customer_name}</span>
                <span className="font-body text-[13px] text-ink-soft hidden md:block flex-1">{order.customer_email}</span>
                <span className="font-mono text-[12px] text-ink flex-shrink-0">{formatARS(order.total)}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[order.status] ?? ''}`}>
                  {STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`flex-shrink-0 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} aria-hidden="true">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Detalle expandible */}
            {expanded === order.id && (
              <div className="px-5 py-5 flex flex-col gap-5" style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--cream-100, #f5f0eb)' }}>
                {/* Items */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-3">Productos</p>
                  <div className="flex flex-col gap-2">
                    {(order.items ?? []).map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline">
                        <span className="font-body text-[13px] text-ink">
                          {item.product_title}
                          {item.selected_size && ` · ${item.selected_size}`}
                          {item.has_frame && ' · con marco'}
                          {item.quantity > 1 && ` ×${item.quantity}`}
                        </span>
                        <span className="font-mono text-[12px] text-ink-soft">
                          {formatARS(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contacto y entrega */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-2">Contacto</p>
                    <p className="font-body text-[13px] text-ink">{order.customer_phone}</p>
                    <p className="font-body text-[13px] text-ink-soft">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-2">Entrega · Pago</p>
                    <p className="font-body text-[13px] text-ink capitalize">
                      {order.delivery_mode === 'envio' ? 'Envío' : 'Retiro'} ·{' '}
                      {order.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia'}
                    </p>
                    {order.delivery_mode === 'envio' && order.street && (
                      <p className="font-body text-[13px] text-ink-soft">
                        {order.street}, {order.city} {order.postal_code}
                      </p>
                    )}
                    {order.shipping_cost > 0 && (
                      <p className="font-body text-[12px] text-ink-soft mt-1">Envío: {formatARS(order.shipping_cost)}</p>
                    )}
                  </div>
                </div>

                {/* Cambio de estado */}
                <div className="flex items-center gap-3">
                  <label htmlFor={`status-${order.id}`} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft flex-shrink-0">Estado</label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700 transition-colors"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                {/* Confirmar pago — transferencia + pendiente */}
                {order.payment_method === 'transferencia' && order.status === 'pendiente' && (
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
                    <button
                      type="button"
                      onClick={() => updateStatus(order.id, 'pagado')}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill bg-sage-700 text-cream-50 hover:bg-sage-900 transition-all"
                    >
                      Confirmar pago
                    </button>
                    <span className="font-mono text-[10px] text-ink-soft">Confirmar solo cuando el dinero esté acreditado</span>
                  </div>
                )}

                {/* Tracking */}
                {(order.status === 'enviado' || order.status === 'entregado') && (
                  <div className="pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
                    <label htmlFor={`tracking-${order.id}`} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-2">Número de seguimiento</label>
                    <div className="flex gap-3">
                      <input
                        id={`tracking-${order.id}`}
                        type="text"
                        defaultValue={order.tracking_number ?? ''}
                        placeholder="OCA-123456789"
                        className="flex-1 font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
                        style={{ borderColor: 'var(--line)' }}
                        onBlur={(e) => {
                          if (e.target.value !== (order.tracking_number ?? '')) updateTracking(order.id, e.target.value)
                        }}
                      />
                      <span className="font-mono text-[10px] text-ink-soft self-end pb-1">guarda al salir del campo</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrders

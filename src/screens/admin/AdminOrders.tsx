import React, { useEffect, useMemo, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { formatARS } from '@/data/products'
import { useToast } from '@/context/ToastContext'
import { useTableFilter } from '@/hooks/useTableFilter'
import StatusBadge, { ORDER_STATUS_TONE } from '@/components/admin/shared/StatusBadge'

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
  created?:       string
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
  [key: string]: unknown
}

const STATUS_OPTIONS = [
  { value: 'pendiente',       label: 'Pendiente' },
  { value: 'pagado',          label: 'Pagado' },
  { value: 'en-preparacion',  label: 'En preparación' },
  { value: 'enviado',         label: 'Enviado' },
  { value: 'entregado',       label: 'Entregado' },
  { value: 'cancelado',       label: 'Cancelado' },
]

const DATE_RANGES = [
  { value: 'all',   label: 'Todo' },
  { value: '7d',    label: 'Últimos 7 días' },
  { value: '30d',   label: 'Últimos 30 días' },
]

const AdminOrders: React.FC = () => {
  const toast = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const result = await pb.collection('orders').getList(1, 500, { sort: '-id', requestKey: null })
      setOrders(result.items as unknown as Order[])
    } catch (e) {
      console.error('[AdminOrders] fetchOrders error:', e)
      toast.error('No se pudieron cargar las órdenes', { detail: e instanceof Error ? e.message : undefined })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filtros: search, estado, rango de fechas, "solo acción requerida"
  const { filtered, query, setQuery, filters, setFilter } = useTableFilter<Order>(orders, {
    searchFields: ['customer_name', 'customer_email', 'customer_phone', 'id'],
    customFilter: (row, f) => {
      if (f.status && row.status !== f.status) return false
      if (f.action === 'pendientes') {
        if (!['pendiente', 'pagado', 'en-preparacion'].includes(row.status)) return false
      }
      if (f.range && f.range !== 'all' && row.created) {
        const days = f.range === '7d' ? 7 : 30
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
        if (new Date(row.created).getTime() < cutoff) return false
      }
      return true
    },
  })

  const counts = useMemo(() => ({
    total:  orders.length,
    action: orders.filter((o) => ['pendiente', 'pagado', 'en-preparacion'].includes(o.status)).length,
  }), [orders])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await pb.collection('orders').update(orderId, { status })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
      toast.success('Estado actualizado')
    } catch (e) {
      toast.error('No se pudo actualizar el estado', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const updateTracking = async (orderId: string, trackingNumber: string) => {
    try {
      await pb.collection('orders').update(orderId, { tracking_number: trackingNumber })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNumber } : o)))
      toast.success('Tracking guardado')
    } catch (e) {
      toast.error('No se pudo guardar el tracking', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando órdenes…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <h1 className="font-display text-[22px] text-ink font-normal">Órdenes</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
          {filtered.length} de {counts.total} · {counts.action} pendientes de acción
        </p>
      </div>

      {/* Toolbar de filtros */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5 p-3 rounded-sm" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar nombre, email, teléfono…"
          className="flex-1 min-w-0 font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-3 py-1.5 outline-none focus:border-sage-700 transition-colors"
          style={{ borderColor: 'var(--line)' }}
          aria-label="Buscar órdenes"
        />
        <select
          value={filters.status ?? 'all'}
          onChange={(e) => setFilter('status', e.target.value)}
          className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
          style={{ borderColor: 'var(--line)' }}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={filters.range ?? 'all'}
          onChange={(e) => setFilter('range', e.target.value)}
          className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
          style={{ borderColor: 'var(--line)' }}
          aria-label="Filtrar por fecha"
        >
          {DATE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <label className="inline-flex items-center gap-2 font-mono text-[11px] text-ink whitespace-nowrap">
          <input
            type="checkbox"
            checked={filters.action === 'pendientes'}
            onChange={(e) => setFilter('action', e.target.checked ? 'pendientes' : '')}
            className="accent-sage-700 w-4 h-4"
          />
          Solo acción requerida
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft py-10 text-center">
          {orders.length === 0 ? 'No hay órdenes todavía.' : 'Ninguna orden coincide con los filtros.'}
        </p>
      ) : (

      <div className="flex flex-col gap-2">
        {filtered.map((order) => {
          const isOpen = expanded === order.id
          const tone = ORDER_STATUS_TONE[order.status] ?? 'draft'
          const statusLabel = STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status

          return (
            <div key={order.id} className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
              {/* Fila principal — desktop: horizontal; mobile: vertical stack */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : order.id)}
                aria-expanded={isOpen}
                className="w-full text-left px-4 md:px-5 py-3.5 bg-cream-50 hover:bg-cream-100 transition-colors"
              >
                {/* Desktop layout */}
                <div className="hidden md:flex items-center gap-4">
                  <span className="font-mono text-[11px] text-ink-soft w-[90px] flex-shrink-0">
                    {formatDate(order.created)}
                  </span>
                  <span className="font-body text-[14px] text-ink flex-1 min-w-[120px] truncate">{order.customer_name}</span>
                  <span className="font-body text-[13px] text-ink-soft hidden lg:block flex-1 truncate">{order.customer_email}</span>
                  <span className="font-mono text-[12px] text-ink flex-shrink-0">{formatARS(order.total)}</span>
                  <StatusBadge tone={tone}>{statusLabel}</StatusBadge>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-[14px] text-ink truncate flex-1">{order.customer_name}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-ink-soft">{formatDate(order.created)}</span>
                    <span className="font-mono text-[12px] text-ink">{formatARS(order.total)}</span>
                  </div>
                  <div><StatusBadge tone={tone}>{statusLabel}</StatusBadge></div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 md:px-5 py-5 flex flex-col gap-5" style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--cream-100, #f5f0eb)' }}>
                  {/* Items */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-3">Productos</p>
                    <div className="flex flex-col gap-2">
                      {(order.items ?? []).map((item, i) => (
                        <div key={i} className="flex justify-between items-baseline gap-2">
                          <span className="font-body text-[13px] text-ink">
                            {item.product_title}
                            {item.selected_size && ` · ${item.selected_size}`}
                            {item.has_frame && ' · con marco'}
                            {item.quantity > 1 && ` ×${item.quantity}`}
                          </span>
                          <span className="font-mono text-[12px] text-ink-soft flex-shrink-0">
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
                      <p className="font-body text-[13px] text-ink break-all">{order.customer_phone}</p>
                      <p className="font-body text-[13px] text-ink-soft break-all">{order.customer_email}</p>
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
                  <div className="flex flex-wrap items-center gap-3">
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
                    <div className="flex flex-wrap items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
                      <button
                        type="button"
                        onClick={() => updateStatus(order.id, 'pagado')}
                        className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill bg-sage-700 text-cream-50 hover:bg-sage-900 transition-all"
                      >
                        Confirmar pago
                      </button>
                      <span className="font-mono text-[10px] text-ink-soft">Solo cuando el dinero esté acreditado</span>
                    </div>
                  )}

                  {/* Tracking */}
                  {(order.status === 'enviado' || order.status === 'entregado') && (
                    <div className="pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
                      <label htmlFor={`tracking-${order.id}`} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-2">Número de seguimiento</label>
                      <input
                        id={`tracking-${order.id}`}
                        type="text"
                        defaultValue={order.tracking_number ?? ''}
                        placeholder="OCA-123456789"
                        className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
                        style={{ borderColor: 'var(--line)' }}
                        onBlur={(e) => {
                          if (e.target.value !== (order.tracking_number ?? '')) updateTracking(order.id, e.target.value)
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      )}
    </div>
  )
}

export default AdminOrders

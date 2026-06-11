'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { formatARS } from '@/data/products'
import { useToast } from '@/context/ToastContext'
import { useTableFilter } from '@/hooks/useTableFilter'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import Tabs from '@/components/admin/shared/Tabs'
import OrderActionMenu from '@/components/admin/orders/OrderActionMenu'
import {
  SEGMENTS,
  getPrimaryAction,
  getSecondaryActions,
  statusLabel,
  statusTone,
  PASSIVE_NOTE,
  type OrderStatus,
} from '@/data/orderStatus'

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
  payment_proof:  string | null
  total:          number
  items?:         OrderItem[]
  [key: string]: unknown
}

const DATE_RANGES = [
  { value: 'all',   label: 'Todo' },
  { value: '7d',    label: 'Últimos 7 días' },
  { value: '30d',   label: 'Últimos 30 días' },
]

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const AdminOrders: React.FC = () => {
  const toast = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const result = await pb.collection('orders').getList(1, 500, { sort: '-created', requestKey: null })
      setOrders(result.items as unknown as Order[])
    } catch (e) {
      console.error('[AdminOrders] fetchOrders error:', e)
      toast.error('No se pudieron cargar las órdenes', { detail: e instanceof Error ? e.message : undefined })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filtros: búsqueda, segmento (tab), rango de fechas + orden configurable.
  const { filtered, query, setQuery, filters, setFilter, sort, setSort } = useTableFilter<Order>(orders, {
    searchFields: ['customer_name', 'customer_email', 'customer_phone', 'id'],
    defaultFilters: { segment: 'accion' },
    defaultSort: { field: 'created', dir: 'desc' },
    customFilter: (row, f) => {
      const seg = SEGMENTS.find((s) => s.id === (f.segment ?? 'todas'))
      if (seg && !seg.match(row.status)) return false
      if (f.range && f.range !== 'all' && row.created) {
        const days = f.range === '7d' ? 7 : 30
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
        if (new Date(row.created).getTime() < cutoff) return false
      }
      return true
    },
  })

  // Contadores por segmento para los tabs.
  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const seg of SEGMENTS) counts[seg.id] = orders.filter((o) => seg.match(o.status)).length
    return counts
  }, [orders])

  const activeSegment = filters.segment ?? 'accion'
  const tabs = SEGMENTS.map((s) => ({ id: s.id, label: `${s.label} · ${segmentCounts[s.id] ?? 0}` }))

  const updateStatus = async (orderId: string, status: string) => {
    const prev = orders.find((o) => o.id === orderId)?.status
    // Optimista.
    setOrders((cur) => cur.map((o) => (o.id === orderId ? { ...o, status } : o)))
    try {
      await pb.collection('orders').update(orderId, { status })
      toast.success(`Estado: ${statusLabel(status)}`)
    } catch (e) {
      // Revertir en caso de error.
      if (prev) setOrders((cur) => cur.map((o) => (o.id === orderId ? { ...o, status: prev } : o)))
      toast.error('No se pudo actualizar el estado', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const updateTracking = async (orderId: string, trackingNumber: string) => {
    try {
      await pb.collection('orders').update(orderId, { tracking_number: trackingNumber })
      setOrders((cur) => cur.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNumber } : o)))
      toast.success('Tracking guardado')
    } catch (e) {
      toast.error('No se pudo guardar el tracking', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const formatWhen = (iso?: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isSameDay(d, new Date())) {
      return `Hoy ${d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
    }
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const toggleSort = (field: keyof Order) => {
    if (sort?.field === field) setSort({ field, dir: sort.dir === 'desc' ? 'asc' : 'desc' })
    else setSort({ field, dir: 'desc' })
  }

  const sortArrow = (field: keyof Order) => (sort?.field === field ? (sort.dir === 'desc' ? '↓' : '↑') : '')

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando órdenes…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <h1 className="font-display text-[22px] text-ink font-normal">Órdenes</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
          {filtered.length} de {orders.length} · {segmentCounts.accion ?? 0} requieren acción
        </p>
      </div>

      {/* Segmentación por etapa */}
      <div className="mb-4">
        <Tabs tabs={tabs} active={activeSegment} onChange={(id) => setFilter('segment', id)} />
      </div>

      {/* Toolbar: búsqueda + rango + orden */}
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
          value={filters.range ?? 'all'}
          onChange={(e) => setFilter('range', e.target.value)}
          className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
          style={{ borderColor: 'var(--line)' }}
          aria-label="Filtrar por fecha"
        >
          {DATE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft whitespace-nowrap">
          <span>Ordenar:</span>
          {([['created', 'Fecha'], ['total', 'Total']] as const).map(([field, label]) => (
            <button
              key={field}
              type="button"
              onClick={() => toggleSort(field as keyof Order)}
              className="px-2 py-1 rounded-pill border transition-all"
              style={{
                borderColor: sort?.field === field ? 'var(--sage-700)' : 'var(--line)',
                color:       sort?.field === field ? 'var(--sage-700)' : 'var(--ink-soft)',
              }}
            >
              {label} {sortArrow(field as keyof Order)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft py-10 text-center">
          {orders.length === 0 ? 'No hay órdenes todavía.' : 'Ninguna orden en este segmento.'}
        </p>
      ) : (

      <div className="flex flex-col gap-2">
        {filtered.map((order) => {
          const isOpen = expanded === order.id
          const tone = statusTone(order.status)
          const label = statusLabel(order.status)
          const shortId = order.id.slice(0, 8).toUpperCase()
          const primary = getPrimaryAction(order.status)
          const secondary = getSecondaryActions(order.status)
          const passiveNote = PASSIVE_NOTE[order.status as OrderStatus]
          const needsAction = SEGMENTS[0].match(order.status)
          const isTransfer = order.payment_method === 'transferencia'
          const payLabel = order.payment_method === 'mercadopago' ? 'MP' : 'Transf.'
          const hasProof = isTransfer && !!order.payment_proof

          const toggle = () => setExpanded(isOpen ? null : order.id)

          // Bloque de acciones reutilizado en desktop y mobile.
          const actions = (
            <div className="flex items-center gap-2 flex-shrink-0">
              {primary ? (
                <button
                  type="button"
                  onClick={() => updateStatus(order.id, primary.next)}
                  className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill bg-sage-700 text-cream-50 hover:bg-sage-900 transition-all whitespace-nowrap min-h-[40px]"
                >
                  {primary.label}
                </button>
              ) : passiveNote ? (
                <span className="font-mono text-[10px] text-ink-soft whitespace-nowrap hidden sm:inline">{passiveNote}</span>
              ) : null}
              <OrderActionMenu actions={secondary} onSelect={(next) => updateStatus(order.id, next)} />
            </div>
          )

          return (
            <div
              key={order.id}
              className="rounded-sm overflow-hidden"
              style={{ border: '1px solid var(--line-soft)', borderLeft: needsAction ? '3px solid var(--clay-700, #bc6c25)' : '1px solid var(--line-soft)' }}
            >
              {/* ── Header desktop ── */}
              <div className="hidden md:flex items-stretch bg-cream-50 hover:bg-cream-100 transition-colors">
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={isOpen}
                  className="flex-1 min-w-0 flex items-center gap-4 text-left px-4 lg:px-5 py-3.5"
                >
                  <span className="font-mono text-[11px] text-sage-700 w-[78px] flex-shrink-0">#{shortId}</span>
                  <span className="font-mono text-[11px] text-ink-soft w-[110px] flex-shrink-0">{formatWhen(order.created)}</span>
                  <span className="font-body text-[14px] text-ink flex-1 min-w-[110px] truncate">{order.customer_name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft w-[52px] flex-shrink-0">{payLabel}</span>
                  {hasProof && (
                    <span className="text-sage-700 flex-shrink-0" title="Comprobante adjunto" aria-label="Comprobante adjunto">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </span>
                  )}
                  <span className="font-mono text-[12px] text-ink flex-shrink-0 w-[90px] text-right">{formatARS(order.total)}</span>
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex items-center pr-3 pl-1 border-l" style={{ borderColor: 'var(--line-soft)' }}>
                  {actions}
                </div>
              </div>

              {/* ── Header mobile ── */}
              <div className="md:hidden bg-cream-50">
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={isOpen}
                  className="w-full text-left px-4 py-3.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-[14px] text-ink truncate flex-1">{order.customer_name}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-sage-700">#{shortId}</span>
                    <span className="font-mono text-[11px] text-ink-soft">{formatWhen(order.created)}</span>
                    <span className="font-mono text-[12px] text-ink">{formatARS(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge tone={tone}>{label}</StatusBadge>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">{payLabel}</span>
                    {hasProof && <span className="font-mono text-[10px] text-sage-700">📎 comprobante</span>}
                  </div>
                </button>
                <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-1">
                  {primary ? (
                    <button
                      type="button"
                      onClick={() => updateStatus(order.id, primary.next)}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 rounded-pill bg-sage-700 text-cream-50 hover:bg-sage-900 transition-all flex-1 min-h-[44px]"
                    >
                      {primary.label}
                    </button>
                  ) : (
                    <span className="font-mono text-[10px] text-ink-soft flex-1">{passiveNote ?? ''}</span>
                  )}
                  <OrderActionMenu actions={secondary} onSelect={(next) => updateStatus(order.id, next)} />
                </div>
              </div>

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

                  {/* Comprobante de transferencia */}
                  {isTransfer && (
                    <div className="pt-4" style={{ borderTop: '1px solid var(--line-soft)' }}>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-2">Comprobante</p>
                      {order.payment_proof ? (
                        <a
                          href={`${pb.baseUrl}/api/files/${String(order.collectionId)}/${order.id}/${order.payment_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-body text-[13px] text-sage-700 hover:text-sage-900 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          Ver comprobante
                        </a>
                      ) : (
                        <p className="font-body text-[13px] text-ink-soft">El cliente todavía no subió el comprobante.</p>
                      )}
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

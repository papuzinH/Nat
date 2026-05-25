import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pb } from '@/lib/pocketbase'
import { useProducts } from '@/hooks/useProducts'
import { formatARS } from '@/data/products'

interface RecentOrder {
  id: string
  customer_name: string
  total: number
  status: string
}

interface DashboardData {
  loading: boolean
  ordersToday: number
  pendingPayment: number
  toShip: number
  monthRevenue: number
  draftsCount: number
  recentOrders: RecentOrder[]
}


const Widget: React.FC<{
  label: string
  value: React.ReactNode
  hint?: string
  to?: string
  tone?: 'default' | 'warning' | 'success'
}> = ({ label, value, hint, to, tone = 'default' }) => {
  const toneStyle =
    tone === 'warning'
      ? { borderColor: '#e6c89c' }
      : tone === 'success'
        ? { borderColor: 'var(--sage-700)' }
        : { borderColor: 'var(--line-soft)' }

  const inner = (
    <div
      className="flex flex-col gap-2 p-5 rounded-sm bg-cream-50 hover:bg-cream-100 transition-colors h-full"
      style={{ border: '1px solid', ...toneStyle }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">{label}</p>
      <p className="font-display text-[28px] text-ink leading-none">{value}</p>
      {hint && <p className="font-mono text-[10px] text-ink-soft">{hint}</p>}
    </div>
  )

  if (to) return <Link to={to} className="block">{inner}</Link>
  return inner
}

const AdminDashboard: React.FC = () => {
  const { products, loading: productsLoading } = useProducts()
  const [data, setData] = useState<DashboardData>({
    loading: true,
    ordersToday: 0,
    pendingPayment: 0,
    toShip: 0,
    monthRevenue: 0,
    draftsCount: 0,
    recentOrders: [],
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [allOrders, pendingPayment, toShip, revenueOrders, drafts, recent] = await Promise.all([
          pb.collection('orders').getList(1, 1, { requestKey: null }),
          pb.collection('orders').getList(1, 1, { filter: 'status = "pendiente" && payment_method = "transferencia"', requestKey: null }),
          pb.collection('orders').getList(1, 1, { filter: '(status = "pagado" || status = "en-preparacion")', requestKey: null }),
          pb.collection('orders').getList(1, 500, {
            filter: 'status = "pagado" || status = "en-preparacion" || status = "enviado" || status = "entregado"',
            fields: 'total',
            requestKey: null,
          }),
          pb.collection('blog_posts').getList(1, 1, { filter: 'published = false', requestKey: null }),
          pb.collection('orders').getList(1, 5, { sort: '-id', fields: 'id,customer_name,total,status', requestKey: null }),
        ])

        setData({
          loading: false,
          ordersToday: allOrders.totalItems,
          pendingPayment: pendingPayment.totalItems,
          toShip: toShip.totalItems,
          monthRevenue: revenueOrders.items.reduce((acc, o) => acc + (((o as unknown as RecentOrder & { total: number }).total) ?? 0), 0),
          draftsCount: drafts.totalItems,
          recentOrders: recent.items as unknown as RecentOrder[],
        })
      } catch {
        setData((d) => ({ ...d, loading: false }))
      }
    }
    load()
  }, [])

  const lowStock = products.filter((p) => p.stock != null && p.stock <= 3)

  const todayLabel = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div>
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-display text-[22px] text-ink font-normal">Dashboard</h1>
        <p className="font-mono text-[11px] text-ink-soft uppercase tracking-[0.12em] capitalize">{todayLabel}</p>
      </div>

      {/* Grid de widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        <Widget
          label="Total órdenes"
          value={data.loading ? '…' : data.ordersToday}
          hint={data.ordersToday > 0 ? 'Todas las órdenes recibidas' : 'Sin órdenes todavía'}
          to="/admin/ordenes"
        />
        <Widget
          label="Pendientes de pago"
          value={data.loading ? '…' : data.pendingPayment}
          hint="Transferencia sin confirmar"
          to="/admin/ordenes"
          tone={data.pendingPayment > 0 ? 'warning' : 'default'}
        />
        <Widget
          label="Listas para enviar"
          value={data.loading ? '…' : data.toShip}
          hint="Pagadas o en preparación"
          to="/admin/ordenes"
          tone={data.toShip > 0 ? 'success' : 'default'}
        />
        <Widget
          label="Productos bajo stock"
          value={productsLoading ? '…' : lowStock.length}
          hint={lowStock.length > 0 ? `≤ 3 unidades · ${lowStock.slice(0, 2).map((p) => p.title).join(', ')}${lowStock.length > 2 ? '…' : ''}` : 'Todo el stock OK'}
          to="/admin/stock"
          tone={lowStock.length > 0 ? 'warning' : 'default'}
        />
        <Widget
          label="Posts en borrador"
          value={data.loading ? '…' : data.draftsCount}
          hint="Sin publicar"
          to="/admin/blog"
        />
        <Widget
          label="Ingresos totales"
          value={data.loading ? '…' : formatARS(data.monthRevenue)}
          hint="Órdenes pagadas/enviadas/entregadas"
        />
      </div>

      {/* Órdenes recientes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Últimas órdenes</p>
          <Link to="/admin/ordenes" className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage-700 hover:underline">
            Ver todas →
          </Link>
        </div>
        {data.loading ? (
          <p className="font-mono text-[11px] text-ink-soft">Cargando…</p>
        ) : data.recentOrders.length === 0 ? (
          <p className="font-mono text-[11px] text-ink-soft">No hay órdenes todavía.</p>
        ) : (
          <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
            {data.recentOrders.map((o, i) => (
              <Link
                key={o.id}
                to="/admin/ordenes"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-cream-50 hover:bg-cream-100 transition-colors"
                style={i > 0 ? { borderTop: '1px solid var(--line-soft)' } : undefined}
              >
                <span className="font-body text-[13px] text-ink truncate flex-1">{o.customer_name}</span>
                <span className="font-mono text-[12px] text-ink flex-shrink-0">{formatARS(o.total)}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft flex-shrink-0 hidden sm:inline">
                  {o.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

import React, { useEffect, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { useProducts } from '@/hooks/useProducts'

interface StockRow {
  slug:     string
  title:    string
  catLabel: string
  stock:    number | null
  status:   string
  dirty:    boolean
  saving:   boolean
}

const STATUS_OPTIONS = [
  { value: 'active',       label: 'Activo' },
  { value: 'coming-soon',  label: 'Próximamente' },
  { value: 'out-of-stock', label: 'Sin stock' },
]

const AdminStock: React.FC = () => {
  const { products, loading: productsLoading } = useProducts()
  const [rows, setRows] = useState<StockRow[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (productsLoading || initialized) return
    setRows(
      products.map((p) => ({
        slug:     p.slug,
        title:    p.title,
        catLabel: p.catLabel,
        stock:    p.stock ?? null,
        status:   p.status,
        dirty:    false,
        saving:   false,
      }))
    )
    setInitialized(true)
  }, [products, productsLoading, initialized])

  const updateRow = (slug: string, patch: Partial<StockRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, ...patch, dirty: true } : r))
    )
  }

  const saveRow = async (slug: string) => {
    const row = rows.find((r) => r.slug === slug)
    if (!row) return
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, saving: true } : r)))

    try {
      const existing = await pb.collection('product_stock').getFirstListItem(`slug = "${slug}"`)
      await pb.collection('product_stock').update(existing.id, { stock: row.stock, status: row.status })
    } catch {
      await pb.collection('product_stock').create({ slug: row.slug, stock: row.stock, status: row.status })
    }

    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, dirty: false, saving: false } : r))
    )
  }

  if (productsLoading || !initialized) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando stock…</p>
  }

  return (
    <div>
      <h1 className="font-display text-[22px] text-ink font-normal mb-6">Inventario</h1>

      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
        <div
          className="grid grid-cols-[1fr_100px_140px_80px] gap-4 px-5 py-3 bg-cream-100"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          {['Producto', 'Stock', 'Estado', ''].map((h) => (
            <span key={h} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
          ))}
        </div>

        {rows.map((row) => (
          <div
            key={row.slug}
            className="grid grid-cols-[1fr_100px_140px_80px] gap-4 px-5 py-3.5 items-center bg-cream-50"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            <div>
              <p className="font-body text-[13px] text-ink">{row.title}</p>
              <p className="font-mono text-[10px] text-ink-soft">{row.catLabel}</p>
            </div>

            <input
              type="number"
              min={0}
              value={row.stock ?? ''}
              placeholder="∞"
              onChange={(e) => updateRow(row.slug, { stock: e.target.value === '' ? null : Number(e.target.value) })}
              className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors w-full"
              style={{ borderColor: 'var(--line)' }}
            />

            <select
              value={row.status}
              onChange={(e) => updateRow(row.slug, { status: e.target.value })}
              className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700 transition-colors"
              style={{ borderColor: 'var(--line)' }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <button
              type="button"
              disabled={!row.dirty || row.saving}
              onClick={() => saveRow(row.slug)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all disabled:opacity-30 hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
              style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
            >
              {row.saving ? '…' : 'Guardar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminStock

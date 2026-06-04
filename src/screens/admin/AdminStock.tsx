import React, { useEffect, useMemo, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { useProducts } from '@/hooks/useProducts'
import { useToast } from '@/context/ToastContext'
import { useTableFilter } from '@/hooks/useTableFilter'

interface StockRow {
  slug:     string
  title:    string
  catLabel: string
  category: string
  image:    string | null
  stock:    number | null
  status:   string
  dirty:    boolean
  saving:   boolean
  [key: string]: unknown
}

const STATUS_OPTIONS = [
  { value: 'active',       label: 'Activo' },
  { value: 'coming-soon',  label: 'Próximamente' },
  { value: 'out-of-stock', label: 'Sin stock' },
]

const isLowStock = (s: number | null) => s !== null && s <= 3

const AdminStock: React.FC = () => {
  const { products, loading: productsLoading } = useProducts()
  const toast = useToast()
  const [rows, setRows] = useState<StockRow[]>([])
  const [initialized, setInitialized] = useState(false)
  const [batchSaving, setBatchSaving] = useState(false)

  useEffect(() => {
    if (productsLoading || initialized) return
    setRows(
      products.map((p) => ({
        slug:     p.slug,
        title:    p.title,
        catLabel: p.catLabel,
        category: p.category,
        image:    p.images?.[0] ?? null,
        stock:    p.stock ?? null,
        status:   p.status,
        dirty:    false,
        saving:   false,
      }))
    )
    setInitialized(true)
  }, [products, productsLoading, initialized])

  // Filtros: search, categoría, bajo stock
  const { filtered, query, setQuery, filters, setFilter } = useTableFilter<StockRow>(rows, {
    searchFields: ['title', 'slug', 'catLabel'],
    customFilter: (row, f) => {
      if (f.category && row.category !== f.category) return false
      if (f.low === 'on' && !isLowStock(row.stock)) return false
      return true
    },
  })

  const categories = useMemo(() => {
    const map = new Map<string, string>()
    rows.forEach((r) => map.set(r.category, r.catLabel || r.category))
    return Array.from(map.entries()).sort(([, a], [, b]) => a.localeCompare(b))
  }, [rows])

  const dirtyCount = rows.filter((r) => r.dirty).length

  const updateRow = (slug: string, patch: Partial<StockRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, ...patch, dirty: true } : r))
    )
  }

  const persistRow = async (row: StockRow): Promise<boolean> => {
    try {
      try {
        const existing = await pb.collection('product_stock').getFirstListItem(`slug = "${row.slug}"`)
        await pb.collection('product_stock').update(existing.id, { stock: row.stock, status: row.status })
      } catch {
        await pb.collection('product_stock').create({ slug: row.slug, stock: row.stock, status: row.status })
      }
      return true
    } catch {
      return false
    }
  }

  const saveRow = async (slug: string) => {
    const row = rows.find((r) => r.slug === slug)
    if (!row) return
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, saving: true } : r)))
    const ok = await persistRow(row)
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, dirty: !ok, saving: false } : r))
    )
    if (ok) toast.success('Stock guardado', { detail: row.title })
    else toast.error('No se pudo guardar', { detail: row.title })
  }

  const saveAll = async () => {
    const dirty = rows.filter((r) => r.dirty)
    if (dirty.length === 0) return
    setBatchSaving(true)
    setRows((prev) => prev.map((r) => (r.dirty ? { ...r, saving: true } : r)))

    let success = 0
    let failed  = 0
    // Procesar en chunks de 5 para no saturar PocketBase
    for (let i = 0; i < dirty.length; i += 5) {
      const chunk = dirty.slice(i, i + 5)
      const results = await Promise.all(chunk.map(persistRow))
      results.forEach((ok, idx) => {
        if (ok) success++
        else failed++
        const slug = chunk[idx].slug
        setRows((prev) =>
          prev.map((r) => (r.slug === slug ? { ...r, dirty: !ok, saving: false } : r))
        )
      })
    }
    setBatchSaving(false)

    if (failed === 0) toast.success(`${success} producto${success === 1 ? '' : 's'} guardado${success === 1 ? '' : 's'}`)
    else if (success === 0) toast.error(`No se pudo guardar ningún producto (${failed} fallos)`)
    else toast.info(`${success} guardados, ${failed} con error`)
  }

  if (productsLoading || !initialized) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando stock…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-[22px] text-ink font-normal">Inventario</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
            {filtered.length} de {rows.length}
            {dirtyCount > 0 && ` · ${dirtyCount} sin guardar`}
          </p>
        </div>
        <button
          type="button"
          disabled={dirtyCount === 0 || batchSaving}
          onClick={saveAll}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill transition-all disabled:opacity-30"
          style={{
            background: dirtyCount > 0 ? 'var(--sage-700)' : 'transparent',
            color: dirtyCount > 0 ? 'var(--cream-50)' : 'var(--ink-soft)',
            border: '1px solid var(--sage-700)',
          }}
        >
          {batchSaving ? 'Guardando…' : `Guardar ${dirtyCount > 0 ? dirtyCount : ''} cambios`}
        </button>
      </div>

      {/* Toolbar filtros */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5 p-3 rounded-sm" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto…"
          className="flex-1 min-w-0 font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-3 py-1.5 outline-none focus:border-sage-700 transition-colors"
          style={{ borderColor: 'var(--line)' }}
          aria-label="Buscar producto"
        />
        <select
          value={filters.category ?? 'all'}
          onChange={(e) => setFilter('category', e.target.value)}
          className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
          style={{ borderColor: 'var(--line)' }}
          aria-label="Filtrar por categoría"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 font-mono text-[11px] text-ink whitespace-nowrap">
          <input
            type="checkbox"
            checked={filters.low === 'on'}
            onChange={(e) => setFilter('low', e.target.checked ? 'on' : '')}
            className="accent-sage-700 w-4 h-4"
          />
          Solo bajo stock
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft py-10 text-center">
          Ningún producto coincide.
        </p>
      ) : (

      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
        {/* Header — solo desktop */}
        <div
          className="hidden md:grid grid-cols-[56px_1fr_120px_140px_92px] gap-4 px-5 py-3 bg-cream-100"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          {['', 'Producto', 'Stock', 'Estado', ''].map((h, i) => (
            <span key={i} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
          ))}
        </div>

        {filtered.map((row) => {
          const low = isLowStock(row.stock)
          const inconsistent = row.stock === 0 && row.status === 'active'

          return (
            <div
              key={row.slug}
              className="grid grid-cols-[48px_1fr_auto] md:grid-cols-[56px_1fr_120px_140px_92px] gap-3 md:gap-4 px-4 md:px-5 py-3 items-center bg-cream-50"
              style={{ borderBottom: '1px solid var(--line-soft)' }}
            >
              {/* Thumb */}
              <div className="w-12 h-12 md:w-12 md:h-12 rounded-sm overflow-hidden bg-cream-100 flex-shrink-0" style={{ border: '1px solid var(--line-soft)' }}>
                {row.image ? (
                  <img src={row.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-ink-soft">—</div>
                )}
              </div>

              {/* Producto */}
              <div className="min-w-0">
                <p className="font-body text-[13px] text-ink truncate">{row.title}</p>
                <p className="font-mono text-[10px] text-ink-soft truncate">{row.catLabel}</p>
                {inconsistent && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-status-warningFg mt-1">
                    Stock 0 pero activo
                  </p>
                )}
              </div>

              {/* Stock — desktop columna; mobile en línea con guardar */}
              <div className="hidden md:flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={row.stock ?? ''}
                  placeholder="∞"
                  onChange={(e) => updateRow(row.slug, { stock: e.target.value === '' ? null : Number(e.target.value) })}
                  className={`font-body text-[13px] bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors w-16 ${low ? 'text-status-cancelledFg font-semibold' : 'text-ink'}`}
                  style={{ borderColor: 'var(--line)' }}
                  aria-label={`Stock de ${row.title}`}
                />
                {low && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-status-cancelledFg">bajo</span>
                )}
              </div>

              {/* Estado — desktop */}
              <select
                value={row.status}
                onChange={(e) => updateRow(row.slug, { status: e.target.value })}
                className="hidden md:block font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700 transition-colors"
                style={{ borderColor: 'var(--line)' }}
                aria-label={`Estado de ${row.title}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {/* Mobile: stock + estado en columnas debajo del producto */}
              <div className="md:hidden col-span-3 flex flex-wrap items-center gap-3 -mt-1">
                <div className="flex items-center gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={row.stock ?? ''}
                    placeholder="∞"
                    onChange={(e) => updateRow(row.slug, { stock: e.target.value === '' ? null : Number(e.target.value) })}
                    className={`font-body text-[13px] bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors w-16 ${low ? 'text-status-cancelledFg font-semibold' : 'text-ink'}`}
                    style={{ borderColor: 'var(--line)' }}
                  />
                  {low && <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-status-cancelledFg">bajo</span>}
                </div>
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
              </div>

              {/* Botón guardar individual */}
              <button
                type="button"
                disabled={!row.dirty || row.saving}
                onClick={() => saveRow(row.slug)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all disabled:opacity-30 hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700 justify-self-end"
                style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
              >
                {row.saving ? '…' : 'Guardar'}
              </button>
            </div>
          )
        })}
      </div>

      )}
    </div>
  )
}

export default AdminStock

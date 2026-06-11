'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { triggerRevalidate } from '@/lib/revalidate-client'
import { useToast } from '@/context/ToastContext'
import { useTableFilter } from '@/hooks/useTableFilter'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import Tabs from '@/components/admin/shared/Tabs'
import {
  SEGMENTS,
  STATUS_OPTIONS,
  STOCK_LEVEL_META,
  rowLevel,
  statusLabel,
  statusTone,
  isInconsistent,
  type StockLevel,
} from '@/data/stockStatus'

interface StockRow {
  slug:      string
  productId: string      // id de PocketBase en `products` (para escribir on_demand)
  title:     string
  catLabel:  string
  category:  string
  image:     string | null
  stock:     number      // cantidad real (relevante solo si !onDemand)
  status:    string
  onDemand:  boolean     // products.on_demand → fuente de verdad del stock ilimitado
  dirty:     boolean
  saving:    boolean
  [key: string]: unknown
}

// ── Stepper de stock ────────────────────────────────────────────────────────
// Botones −/+ para ajuste rápido (cómodo al tacto) + input directo. El toggle ∞
// marca el producto como ilimitado (on-demand): se fabrica bajo pedido.

interface StepperProps {
  value: number
  infinite: boolean
  level: StockLevel
  onStep: (delta: number) => void
  onInput: (v: number) => void
  onToggleInfinite: () => void
  label: string
}

const StockStepper: React.FC<StepperProps> = ({ value, infinite, level, onStep, onInput, onToggleInfinite, label }) => {
  const numClass =
    level === 'out' ? 'text-status-dangerFg font-semibold'
    : level === 'low' ? 'text-status-warningFg font-semibold'
    : 'text-ink'
  return (
    <div className="inline-flex items-center rounded-pill border overflow-hidden flex-shrink-0" style={{ borderColor: 'var(--line)' }}>
      <button
        type="button"
        aria-label={infinite ? `Definir stock de ${label}` : `Marcar ${label} como ilimitado`}
        aria-pressed={infinite}
        title={infinite ? 'Ilimitado (bajo pedido) · click para definir cantidad' : 'Marcar como ilimitado (bajo pedido)'}
        onClick={onToggleInfinite}
        className="w-10 h-10 flex items-center justify-center text-[15px] transition-colors"
        style={{
          borderRight: '1px solid var(--line)',
          background: infinite ? 'var(--sage-700)' : 'transparent',
          color:      infinite ? 'var(--cream-50)' : 'var(--ink-soft)',
        }}
      >
        ∞
      </button>
      <button
        type="button"
        aria-label={`Restar stock de ${label}`}
        onClick={() => onStep(-1)}
        disabled={infinite || value <= 0}
        className="w-10 h-10 flex items-center justify-center text-[16px] text-ink-soft hover:bg-cream-100 transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
      >
        −
      </button>
      <input
        type="number"
        min={0}
        value={infinite ? '' : value}
        placeholder="∞"
        disabled={infinite}
        onChange={(e) => onInput(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
        aria-label={`Stock de ${label}`}
        className={`w-12 h-10 text-center bg-transparent outline-none font-body text-[13px] disabled:opacity-60 ${numClass}`}
        style={{ borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)' }}
      />
      <button
        type="button"
        aria-label={`Sumar stock de ${label}`}
        onClick={() => onStep(1)}
        disabled={infinite}
        className="w-10 h-10 flex items-center justify-center text-[16px] text-ink-soft hover:bg-cream-100 transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
      >
        +
      </button>
    </div>
  )
}

const AdminStock: React.FC = () => {
  const toast = useToast()
  const [rows, setRows] = useState<StockRow[]>([])
  const [loading, setLoading] = useState(true)
  const [batchSaving, setBatchSaving] = useState(false)

  // Carga propia (no usa mapProduct): necesitamos el id de products y la cantidad
  // numérica cruda de product_stock, sin la transformación on_demand → null.
  useEffect(() => {
    Promise.all([
      pb.collection('products').getFullList({ sort: 'sort_order', requestKey: null }),
      pb.collection('product_stock').getFullList({ fields: 'slug,stock,status', requestKey: null }),
    ])
      .then(([prods, stockData]) => {
        const stockMap: Record<string, { stock: number; status: string }> = {}
        for (const s of stockData) stockMap[s.slug as string] = { stock: (s.stock as number) ?? 0, status: s.status as string }
        setRows(
          prods.map((p) => ({
            slug:      p.slug as string,
            productId: p.id,
            title:     p.title as string,
            catLabel:  (p.cat_label as string) ?? '',
            category:  (p.category as string) ?? '',
            image:     (p.images as string[] | undefined)?.[0] ?? null,
            stock:     stockMap[p.slug as string]?.stock ?? 0,
            status:    stockMap[p.slug as string]?.status ?? 'active',
            onDemand:  Boolean(p.on_demand),
            dirty:     false,
            saving:    false,
          }))
        )
        setLoading(false)
      })
      .catch((e) => {
        console.error('[AdminStock] load error:', e)
        toast.error('No se pudo cargar el inventario')
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filtros: búsqueda, segmento (tab), categoría + orden configurable.
  const { filtered, query, setQuery, filters, setFilter, sort, setSort } = useTableFilter<StockRow>(rows, {
    searchFields: ['title', 'slug', 'catLabel'],
    defaultFilters: { segment: 'atencion' },
    customFilter: (row, f) => {
      const seg = SEGMENTS.find((s) => s.id === (f.segment ?? 'atencion'))
      if (seg && !seg.match(row)) return false
      if (f.category && row.category !== f.category) return false
      return true
    },
  })

  const categories = useMemo(() => {
    const map = new Map<string, string>()
    rows.forEach((r) => map.set(r.category, r.catLabel || r.category))
    return Array.from(map.entries()).sort(([, a], [, b]) => a.localeCompare(b))
  }, [rows])

  // Contadores por segmento para los tabs.
  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const seg of SEGMENTS) counts[seg.id] = rows.filter((r) => seg.match(r)).length
    return counts
  }, [rows])

  const activeSegment = filters.segment ?? 'atencion'
  const tabs = SEGMENTS.map((s) => ({ id: s.id, label: `${s.label} · ${segmentCounts[s.id] ?? 0}` }))

  const outCount  = useMemo(() => rows.filter((r) => rowLevel(r) === 'out').length, [rows])
  const lowCount  = useMemo(() => rows.filter((r) => rowLevel(r) === 'low').length, [rows])
  const dirtyCount = rows.filter((r) => r.dirty).length

  const updateRow = (slug: string, patch: Partial<StockRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, ...patch, dirty: true } : r))
    )
  }

  // Ajuste relativo del stepper (no aplica si es ilimitado).
  const stepStock = (row: StockRow, delta: number) => {
    updateRow(row.slug, { stock: Math.max(0, row.stock + delta) })
  }

  const persistRow = async (row: StockRow): Promise<boolean> => {
    // requestKey: null desactiva la auto-cancelación del SDK (igual que useProducts
    // y AdminOrders). Sin esto, las llamadas concurrentes de "Guardar todo" se
    // cancelan entre sí y caen al fallback de create, perdiendo el cambio en silencio.
    try {
      // 1) product_stock: cantidad real + estado de publicación.
      let existingId: string | null = null
      try {
        const existing = await pb
          .collection('product_stock')
          .getFirstListItem(`slug = "${row.slug}"`, { requestKey: null })
        existingId = existing.id
      } catch (e) {
        // 404 = el registro aún no existe (hay que crearlo). Cualquier otro error es real.
        if ((e as { status?: number })?.status !== 404) throw e
      }
      if (existingId) {
        await pb.collection('product_stock').update(existingId, { stock: row.stock, status: row.status }, { requestKey: null })
      } else {
        await pb.collection('product_stock').create({ slug: row.slug, stock: row.stock, status: row.status }, { requestKey: null })
      }

      // 2) products.on_demand: fuente de verdad del stock ilimitado.
      await pb.collection('products').update(row.productId, { on_demand: row.onDemand }, { requestKey: null })

      return true
    } catch (e) {
      console.error('[AdminStock] persistRow error:', row.slug, e)
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
    if (ok) {
      toast.success('Stock guardado', { detail: row.title })
      triggerRevalidate('products')
    } else toast.error('No se pudo guardar', { detail: row.title })
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
    if (success > 0) triggerRevalidate('products')

    if (failed === 0) toast.success(`${success} producto${success === 1 ? '' : 's'} guardado${success === 1 ? '' : 's'}`)
    else if (success === 0) toast.error(`No se pudo guardar ningún producto (${failed} fallos)`)
    else toast.info(`${success} guardados, ${failed} con error`)
  }

  const toggleSort = (field: keyof StockRow) => {
    if (sort?.field === field) setSort({ field, dir: sort.dir === 'desc' ? 'asc' : 'desc' })
    else setSort({ field, dir: 'asc' })
  }

  const sortArrow = (field: keyof StockRow) => (sort?.field === field ? (sort.dir === 'desc' ? '↓' : '↑') : '')

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando stock…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-[22px] text-ink font-normal">Inventario</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
            {filtered.length} de {rows.length}
            {outCount > 0 && ` · ${outCount} sin stock`}
            {lowCount > 0 && ` · ${lowCount} bajo`}
            {dirtyCount > 0 && ` · ${dirtyCount} sin guardar`}
          </p>
        </div>
        <button
          type="button"
          disabled={dirtyCount === 0 || batchSaving}
          onClick={saveAll}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 min-h-[40px] rounded-pill transition-all disabled:opacity-30"
          style={{
            background: dirtyCount > 0 ? 'var(--sage-700)' : 'transparent',
            color: dirtyCount > 0 ? 'var(--cream-50)' : 'var(--ink-soft)',
            border: '1px solid var(--sage-700)',
          }}
        >
          {batchSaving ? 'Guardando…' : `Guardar ${dirtyCount > 0 ? dirtyCount : ''} cambios`}
        </button>
      </div>

      {/* Segmentación por nivel de inventario */}
      <div className="mb-4">
        <Tabs tabs={tabs} active={activeSegment} onChange={(id) => setFilter('segment', id)} />
      </div>

      {/* Toolbar: búsqueda + categoría + orden */}
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
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft whitespace-nowrap">
          <span>Ordenar:</span>
          {([['stock', 'Stock'], ['title', 'Nombre']] as const).map(([field, label]) => (
            <button
              key={field}
              type="button"
              onClick={() => toggleSort(field as keyof StockRow)}
              className="px-2 py-1.5 rounded-pill border transition-all"
              style={{
                borderColor: sort?.field === field ? 'var(--sage-700)' : 'var(--line)',
                color:       sort?.field === field ? 'var(--sage-700)' : 'var(--ink-soft)',
              }}
            >
              {label} {sortArrow(field as keyof StockRow)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft py-10 text-center">
          {activeSegment === 'atencion' ? 'Nada requiere atención ✓' : 'Ningún producto coincide.'}
        </p>
      ) : (

      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
        {/* Header — solo desktop */}
        <div
          className="hidden md:grid grid-cols-[48px_minmax(0,1fr)_auto_150px_96px] gap-4 px-5 py-3 bg-cream-100"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          {['', 'Producto', 'Stock', 'Estado', ''].map((h, i) => (
            <span key={i} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
          ))}
        </div>

        {filtered.map((row) => {
          const level = rowLevel(row)
          const levelMeta = level === 'ok' ? null : STOCK_LEVEL_META[level]
          const inconsistent = isInconsistent(row)
          // Acento izquierdo: rojo para sin stock/inconsistente, ámbar para bajo.
          const accent =
            level === 'out' || inconsistent ? 'var(--amber-700, #BC6C25)'
            : level === 'low' ? 'var(--amber-400, #DDA15E)'
            : null

          return (
            <div
              key={row.slug}
              className="grid grid-cols-[48px_1fr_auto] md:grid-cols-[48px_minmax(0,1fr)_auto_150px_96px] gap-3 md:gap-4 px-4 md:px-5 py-3 items-center bg-cream-50"
              style={{
                borderBottom: '1px solid var(--line-soft)',
                borderLeft: accent ? `3px solid ${accent}` : '3px solid transparent',
              }}
            >
              {/* Thumb */}
              <div className="w-12 h-12 rounded-sm overflow-hidden bg-cream-100 flex-shrink-0" style={{ border: '1px solid var(--line-soft)' }}>
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
                  <span className="inline-flex items-center font-mono text-[9px] uppercase tracking-[0.08em] px-2 py-0.5 rounded-pill bg-status-warningBg text-status-warningFg mt-1">
                    Activo sin unidades
                  </span>
                )}
                {/* Estado: badge visible en mobile (en desktop va en su columna) */}
                <span className="md:hidden inline-flex mt-1 align-middle">
                  <StatusBadge tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusBadge>
                </span>
              </div>

              {/* Stock — desktop columna */}
              <div className="hidden md:flex items-center gap-2">
                <StockStepper
                  value={row.stock}
                  infinite={row.onDemand}
                  level={level}
                  label={row.title}
                  onStep={(d) => stepStock(row, d)}
                  onInput={(v) => updateRow(row.slug, { stock: v })}
                  onToggleInfinite={() => updateRow(row.slug, { onDemand: !row.onDemand })}
                />
                {levelMeta && (
                  <StatusBadge tone={levelMeta.tone}>{levelMeta.label}</StatusBadge>
                )}
              </div>

              {/* Estado — desktop columna: badge tonal + select para editar */}
              <div className="hidden md:flex md:flex-col gap-1.5 items-start">
                <StatusBadge tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusBadge>
                <select
                  value={row.status}
                  onChange={(e) => updateRow(row.slug, { status: e.target.value })}
                  className="w-full font-body text-[12px] text-ink-soft bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700 transition-colors"
                  style={{ borderColor: 'var(--line)' }}
                  aria-label={`Estado de ${row.title}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile: stock (stepper) + estado en fila secundaria */}
              <div className="md:hidden col-span-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <StockStepper
                    value={row.stock}
                    infinite={row.onDemand}
                    level={level}
                    label={row.title}
                    onStep={(d) => stepStock(row, d)}
                    onInput={(v) => updateRow(row.slug, { stock: v })}
                    onToggleInfinite={() => updateRow(row.slug, { onDemand: !row.onDemand })}
                  />
                  {levelMeta && (
                    <StatusBadge tone={levelMeta.tone}>{levelMeta.label}</StatusBadge>
                  )}
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateRow(row.slug, { status: e.target.value })}
                  className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-2 outline-none focus:border-sage-700 transition-colors"
                  style={{ borderColor: 'var(--line)' }}
                  aria-label={`Estado de ${row.title}`}
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
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 min-h-[40px] rounded-pill border transition-all disabled:opacity-30 hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700 justify-self-end self-start md:self-center"
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

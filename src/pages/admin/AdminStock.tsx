import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useProducts } from '@/hooks/useProducts'
import { useShippingZones, type ShippingZone } from '@/hooks/useShippingZones'

interface StockRow {
  slug: string
  title: string
  catLabel: string
  stock: number | null
  status: string
  dirty: boolean
  saving: boolean
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

  const { zones, loading: zonesLoading, addZone, updateZone, deleteZone } = useShippingZones()
  const [newZoneName,  setNewZoneName]  = useState('')
  const [newZonePrice, setNewZonePrice] = useState<number>(0)
  const [zoneAdding,   setZoneAdding]   = useState(false)
  const [zoneError,    setZoneError]    = useState<string | null>(null)
  const [editingZone,  setEditingZone]  = useState<Record<number, Partial<ShippingZone>>>({})

  const [shippingPrice,       setShippingPrice]       = useState<number>(0)
  const [shippingLabel,       setShippingLabel]       = useState<string>('Envío a domicilio')
  const [shippingDesc,        setShippingDesc]        = useState<string>('')
  const [shippingDirty,       setShippingDirty]       = useState(false)
  const [shippingSaving,      setShippingSaving]      = useState(false)
  const [shippingInitialized, setShippingInitialized] = useState(false)

  useEffect(() => {
    if (shippingInitialized) return
    supabase
      .from('shipping_config')
      .select('price, label, description')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setShippingPrice(data.price)
          setShippingLabel(data.label)
          setShippingDesc(data.description ?? '')
        }
        setShippingInitialized(true)
      })
  }, [shippingInitialized])

  useEffect(() => {
    if (productsLoading || initialized) return
    setRows(
      products.map((p) => ({
        slug: p.slug,
        title: p.title,
        catLabel: p.catLabel,
        stock: p.stock ?? null,
        status: p.status,
        dirty: false,
        saving: false,
      }))
    )
    setInitialized(true)
  }, [products, productsLoading, initialized])

  const updateRow = (slug: string, patch: Partial<StockRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, ...patch, dirty: true } : r))
    )
  }

  const saveShipping = async () => {
    setShippingSaving(true)
    await supabase
      .from('shipping_config')
      .update({ price: shippingPrice, label: shippingLabel, description: shippingDesc, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setShippingSaving(false)
    setShippingDirty(false)
  }

  const saveRow = async (slug: string) => {
    const row = rows.find((r) => r.slug === slug)
    if (!row) return
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, saving: true } : r)))
    await supabase
      .from('product_stock')
      .upsert({ slug: row.slug, stock: row.stock, status: row.status })
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, dirty: false, saving: false } : r))
    )
  }

  if (productsLoading || !initialized) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        Cargando stock…
      </p>
    )
  }

  return (
    <div>
      <h1 className="font-display text-[22px] text-ink font-normal mb-6">Inventario</h1>

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: '1px solid var(--line-soft)' }}
      >
        {/* Header tabla */}
        <div
          className="grid grid-cols-[1fr_100px_140px_80px] gap-4 px-5 py-3 bg-cream-100"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          {['Producto', 'Stock', 'Estado', ''].map((h) => (
            <span key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              {h}
            </span>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={row.slug}
            className="grid grid-cols-[1fr_100px_140px_80px] gap-4 items-center px-5 py-3 bg-cream-50 hover:bg-cream-100 transition-colors"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}
          >
            {/* Nombre */}
            <div>
              <p className="font-body text-[13px] text-ink leading-snug">{row.title}</p>
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.08em]">
                {row.catLabel}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={row.stock ?? ''}
                placeholder="∞"
                onChange={(e) =>
                  updateRow(row.slug, {
                    stock: e.target.value === '' ? null : parseInt(e.target.value, 10),
                  })
                }
                className="w-16 font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5 text-center"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>

            {/* Status */}
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

            {/* Guardar */}
            <button
              type="button"
              disabled={!row.dirty || row.saving}
              onClick={() => saveRow(row.slug)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all disabled:opacity-30"
              style={{
                borderColor: row.dirty ? 'var(--sage-700)' : 'var(--line)',
                color: row.dirty ? 'var(--sage-700)' : 'var(--ink-soft)',
              }}
            >
              {row.saving ? '…' : 'Guardar'}
            </button>
          </div>
        ))}
      </div>

      {/* Shipping config */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-5">
          Costo de envío
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr_80px] gap-4 items-end">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
              Precio (ARS)
            </label>
            <input
              type="number"
              min={0}
              value={shippingPrice}
              onChange={(e) => { setShippingPrice(Number(e.target.value)); setShippingDirty(true) }}
              className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
              Etiqueta
            </label>
            <input
              type="text"
              value={shippingLabel}
              onChange={(e) => { setShippingLabel(e.target.value); setShippingDirty(true) }}
              className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={shippingDesc}
              onChange={(e) => { setShippingDesc(e.target.value); setShippingDirty(true) }}
              className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
              style={{ borderColor: 'var(--line)' }}
              placeholder="Coordinado con Ian · todo el país"
            />
          </div>
          <button
            type="button"
            disabled={!shippingDirty || shippingSaving}
            onClick={saveShipping}
            className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all disabled:opacity-30"
            style={{
              borderColor: shippingDirty ? 'var(--sage-700)' : 'var(--line)',
              color:       shippingDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
            }}
          >
            {shippingSaving ? '…' : 'Guardar'}
          </button>
        </div>
        <p className="font-mono text-[10px] text-ink-soft mt-3">
          Ponelo en 0 para mostrar "Gratis" en el checkout.
        </p>
      </div>

      {/* Zonas de envío */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-5">
          Zonas de envío (por barrio)
        </p>

        {zonesLoading ? (
          <p className="font-mono text-[11px] text-ink-soft">Cargando zonas…</p>
        ) : (
          <>
            {/* Lista de zonas existentes */}
            {zones.length > 0 && (
              <div
                className="rounded-sm overflow-hidden mb-6"
                style={{ border: '1px solid var(--line-soft)' }}
              >
                <div
                  className="grid grid-cols-[1fr_120px_80px_60px] gap-3 px-4 py-2 bg-cream-100"
                  style={{ borderBottom: '1px solid var(--line-soft)' }}
                >
                  {['Barrio / Zona', 'Precio (ARS)', 'Activa', ''].map((h) => (
                    <span key={h} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
                  ))}
                </div>
                {zones.map((zone, i) => {
                  const edit = editingZone[zone.id] ?? {}
                  const name  = edit.name  !== undefined ? edit.name  : zone.name
                  const price = edit.price !== undefined ? edit.price : zone.price
                  const isDirty = edit.name !== undefined || edit.price !== undefined

                  return (
                    <div
                      key={zone.id}
                      className="grid grid-cols-[1fr_120px_80px_60px] gap-3 items-center px-4 py-2.5 bg-cream-50 hover:bg-cream-100 transition-colors"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}
                    >
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], name: e.target.value } }))}
                        className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5"
                        style={{ borderColor: 'var(--line)' }}
                      />
                      <input
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], price: Number(e.target.value) } }))}
                        className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5 text-center"
                        style={{ borderColor: 'var(--line)' }}
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id={`zone-active-${zone.id}`}
                          checked={edit.active !== undefined ? edit.active : zone.active}
                          onChange={(e) => setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], active: e.target.checked } }))}
                          className="accent-sage-700 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor={`zone-active-${zone.id}`} className="font-mono text-[10px] text-ink-soft cursor-pointer">
                          {(edit.active !== undefined ? edit.active : zone.active) ? 'Sí' : 'No'}
                        </label>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={!isDirty && edit.active === undefined}
                          onClick={async () => {
                            await updateZone(zone.id, { name, price, active: edit.active !== undefined ? edit.active : zone.active })
                            setEditingZone((prev) => { const n = { ...prev }; delete n[zone.id]; return n })
                          }}
                          className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all disabled:opacity-30"
                          style={{ borderColor: isDirty || edit.active !== undefined ? 'var(--sage-700)' : 'var(--line)', color: isDirty || edit.active !== undefined ? 'var(--sage-700)' : 'var(--ink-soft)' }}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteZone(zone.id)}
                          className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all hover:border-red-400 hover:text-red-400"
                          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                          aria-label={`Eliminar zona ${zone.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Formulario agregar zona */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-4 items-end">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
                  Barrio / Zona nueva
                </label>
                <input
                  type="text"
                  value={newZoneName}
                  onChange={(e) => { setNewZoneName(e.target.value); setZoneError(null) }}
                  placeholder="ej. Caballito, Parque Chacabuco…"
                  className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
                  style={{ borderColor: 'var(--line)' }}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
                  Precio (ARS)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newZonePrice}
                  onChange={(e) => setNewZonePrice(Number(e.target.value))}
                  className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
                  style={{ borderColor: 'var(--line)' }}
                />
              </div>
              <button
                type="button"
                disabled={zoneAdding || !newZoneName.trim()}
                onClick={async () => {
                  if (!newZoneName.trim()) { setZoneError('Ingresá el nombre del barrio'); return }
                  setZoneAdding(true)
                  const ok = await addZone(newZoneName, newZonePrice)
                  setZoneAdding(false)
                  if (ok) { setNewZoneName(''); setNewZonePrice(0) }
                  else setZoneError('No se pudo agregar la zona')
                }}
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-1.5 rounded-pill border transition-all disabled:opacity-30"
                style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
              >
                {zoneAdding ? '…' : '+ Agregar zona'}
              </button>
            </div>
            {zoneError && <p className="font-body text-[12px] text-red-500 mt-2">{zoneError}</p>}
            <p className="font-mono text-[10px] text-ink-soft mt-3">
              Precio 0 = envío gratis en esa zona. Las zonas inactivas no aparecen en el checkout.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminStock

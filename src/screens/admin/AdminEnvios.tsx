'use client'

import React, { useMemo, useState } from 'react'
import { useShippingZones, type ShippingZone } from '@/hooks/useShippingZones'
import { useToast } from '@/context/ToastContext'
import ConfirmDeleteInline from '@/components/admin/shared/ConfirmDeleteInline'

const AdminEnvios: React.FC = () => {
  const { zones, loading, addZone, updateZone, deleteZone, addPostalCode, removePostalCode } = useShippingZones()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [onlyActive, setOnlyActive] = useState(false)

  const [newZoneName,  setNewZoneName]  = useState('')
  const [newZonePrice, setNewZonePrice] = useState<number>(0)
  const [zoneAdding,   setZoneAdding]   = useState(false)
  const [editingZone,  setEditingZone]  = useState<Record<string, Partial<ShippingZone>>>({})

  const [expandedZone, setExpandedZone] = useState<string | null>(null)
  const [newCP,        setNewCP]        = useState<Record<string, string>>({})
  const [cpAdding,     setCpAdding]     = useState<Record<string, boolean>>({})

  const filteredZones = useMemo(() => {
    const q = query.trim().toLowerCase()
    return zones.filter((z) => {
      if (onlyActive && !z.active) return false
      if (!q) return true
      if (z.name.toLowerCase().includes(q)) return true
      if (z.postal_codes.some((cp) => cp.toLowerCase().includes(q))) return true
      return false
    })
  }, [zones, query, onlyActive])

  const handleAddCP = async (zoneId: string) => {
    const code = (newCP[zoneId] ?? '').trim()
    if (!code) return
    setCpAdding((p) => ({ ...p, [zoneId]: true }))
    const ok = await addPostalCode(zoneId, code)
    setCpAdding((p) => ({ ...p, [zoneId]: false }))
    if (!ok) toast.error('CP duplicado o error al guardar')
    else {
      setNewCP((p) => ({ ...p, [zoneId]: '' }))
      toast.success(`CP ${code} agregado`)
    }
  }

  const handleRemoveCP = async (zoneId: string, code: string) => {
    const ok = await removePostalCode(zoneId, code)
    if (!ok) toast.error('No se pudo eliminar el CP')
    else toast.success(`CP ${code} eliminado`)
  }

  const handleDeleteZone = async (zone: ShippingZone) => {
    const ok = await deleteZone(zone.id)
    if (ok) toast.success(`Zona "${zone.name}" eliminada`)
    else toast.error('No se pudo eliminar la zona')
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando zonas…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-[22px] text-ink font-normal">Envíos</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
            {filteredZones.length} de {zones.length} zonas
          </p>
        </div>
      </div>

      {/* Toolbar */}
      {zones.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5 p-3 rounded-sm" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar zona o CP…"
            className="flex-1 min-w-0 font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-3 py-1.5 outline-none focus:border-sage-700 transition-colors"
            style={{ borderColor: 'var(--line)' }}
            aria-label="Buscar zona o código postal"
          />
          <label className="inline-flex items-center gap-2 font-mono text-[11px] text-ink whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
              className="accent-sage-700 w-4 h-4"
            />
            Solo activas
          </label>
        </div>
      )}

      {filteredZones.length > 0 && (
        <div className="rounded-sm overflow-hidden mb-6" style={{ border: '1px solid var(--line-soft)' }}>
          {/* Header — solo desktop */}
          <div
            className="hidden md:grid grid-cols-[1fr_120px_90px_110px_120px] gap-3 px-4 py-2 bg-cream-100"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            {['Zona', 'Precio (ARS)', 'Activa', 'CPs', ''].map((h, i) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
            ))}
          </div>

          {filteredZones.map((zone, i) => {
            const edit  = editingZone[zone.id] ?? {}
            const name  = edit.name  !== undefined ? edit.name  : zone.name
            const price = edit.price !== undefined ? edit.price : zone.price
            const active = edit.active !== undefined ? edit.active : zone.active
            const isDirty = edit.name !== undefined || edit.price !== undefined || edit.active !== undefined

            const saveEdits = async () => {
              const ok = await updateZone(zone.id, { name, price, active })
              if (ok) {
                setEditingZone((prev) => {
                  const n = { ...prev }
                  delete n[zone.id]
                  return n
                })
                toast.success('Zona actualizada')
              } else {
                toast.error('No se pudo actualizar la zona')
              }
            }

            return (
              <div key={zone.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}>
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1fr_120px_90px_110px_120px] gap-3 items-center px-4 py-2.5 bg-cream-50 hover:bg-cream-100 transition-colors">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], name: e.target.value } }))
                    }
                    className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5"
                    style={{ borderColor: 'var(--line)' }}
                    aria-label={`Nombre de zona ${zone.name}`}
                  />
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], price: Number(e.target.value) } }))
                    }
                    className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5 text-right"
                    style={{ borderColor: 'var(--line)' }}
                    aria-label={`Precio de ${zone.name}`}
                  />
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], active: e.target.checked } }))
                    }
                    className="accent-sage-700 w-4 h-4 cursor-pointer justify-self-start"
                    aria-label={`Zona ${zone.name} activa`}
                  />
                  <button
                    type="button"
                    onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                    aria-expanded={expandedZone === zone.id}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all justify-self-start"
                    style={{
                      borderColor: expandedZone === zone.id ? 'var(--sage-700)' : 'var(--line)',
                      color:       expandedZone === zone.id ? 'var(--sage-700)' : 'var(--ink-soft)',
                    }}
                  >
                    CPs ({zone.postal_codes.length})
                  </button>
                  <div className="flex gap-2 items-center justify-self-end">
                    <button
                      type="button"
                      disabled={!isDirty}
                      onClick={saveEdits}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-pill border transition-all disabled:opacity-30 min-w-[44px]"
                      style={{
                        borderColor: isDirty ? 'var(--sage-700)' : 'var(--line)',
                        color:       isDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
                      }}
                      aria-label="Guardar cambios"
                    >
                      Guardar
                    </button>
                    <ConfirmDeleteInline onConfirm={() => handleDeleteZone(zone)} label="✕" question="¿Borrar?" />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="md:hidden p-4 bg-cream-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], name: e.target.value } }))
                      }
                      className="flex-1 font-body text-[14px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1"
                      style={{ borderColor: 'var(--line)' }}
                      aria-label="Nombre"
                    />
                    <ConfirmDeleteInline onConfirm={() => handleDeleteZone(zone)} label="Eliminar" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                      Precio
                      <input
                        type="number"
                        min={0}
                        value={price}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], price: Number(e.target.value) } }))
                        }
                        className="ml-2 w-20 font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-0.5"
                        style={{ borderColor: 'var(--line)' }}
                      />
                    </label>
                    <label className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) =>
                          setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], active: e.target.checked } }))
                        }
                        className="accent-sage-700 w-4 h-4 cursor-pointer"
                      />
                      Activa
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                      aria-expanded={expandedZone === zone.id}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all flex-1"
                      style={{
                        borderColor: expandedZone === zone.id ? 'var(--sage-700)' : 'var(--line)',
                        color:       expandedZone === zone.id ? 'var(--sage-700)' : 'var(--ink-soft)',
                      }}
                    >
                      CPs ({zone.postal_codes.length})
                    </button>
                    <button
                      type="button"
                      disabled={!isDirty}
                      onClick={saveEdits}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-pill border transition-all disabled:opacity-30 flex-1"
                      style={{
                        borderColor: isDirty ? 'var(--sage-700)' : 'var(--line)',
                        color:       isDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                </div>

                {/* CPs expandido */}
                {expandedZone === zone.id && (
                  <div className="px-4 md:px-5 pb-4 pt-2 bg-cream-100" style={{ borderTop: '1px solid var(--line-soft)' }}>
                    {zone.postal_codes.length === 0 ? (
                      <p className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.1em] mb-3">
                        Sin códigos postales asignados
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {zone.postal_codes.map((cp) => (
                          <span key={cp} className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-pill" style={{ border: '1px solid var(--line)', color: 'var(--ink)' }}>
                            {cp}
                            <button
                              type="button"
                              onClick={() => handleRemoveCP(zone.id, cp)}
                              className="text-ink-soft hover:text-ink transition-colors ml-0.5"
                              aria-label={`Eliminar CP ${cp}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCP[zone.id] ?? ''}
                        onChange={(e) => setNewCP((p) => ({ ...p, [zone.id]: e.target.value.toUpperCase() }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddCP(zone.id) }}
                        placeholder="ej. C1414"
                        className="w-28 font-mono text-[12px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5"
                        style={{ borderColor: 'var(--line)' }}
                      />
                      <button
                        type="button"
                        disabled={!newCP[zone.id]?.trim() || !!cpAdding[zone.id]}
                        onClick={() => handleAddCP(zone.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-pill border transition-all disabled:opacity-30"
                        style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
                      >
                        {cpAdding[zone.id] ? '…' : 'Agregar'}
                      </button>
                    </div>
                    <p className="font-mono text-[9px] text-ink-soft uppercase tracking-[0.1em] mt-2">
                      Formato CPA: C1414, C1425… · Un CP pertenece a una sola zona.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {filteredZones.length === 0 && zones.length > 0 && (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft py-10 text-center mb-6">
          Ninguna zona coincide.
        </p>
      )}

      {/* Formulario agregar zona */}
      <div className="rounded-sm p-4" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-3">Agregar zona nueva</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-end">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
              Barrio / Zona
            </label>
            <input
              type="text"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder="ej. Caballito, Parque Chacabuco…"
              className="w-full font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-3 py-1.5 outline-none focus:border-sage-700 transition-colors"
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
              onFocus={(e) => e.target.select()}
              onChange={(e) => setNewZonePrice(Number(e.target.value))}
              className="w-full font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-3 py-1.5 outline-none focus:border-sage-700 transition-colors"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
          <button
            type="button"
            disabled={zoneAdding || !newZoneName.trim()}
            onClick={async () => {
              if (!newZoneName.trim()) { toast.error('Ingresá el nombre del barrio'); return }
              setZoneAdding(true)
              const ok = await addZone(newZoneName, newZonePrice)
              setZoneAdding(false)
              if (ok) {
                toast.success(`Zona "${newZoneName.trim()}" creada`)
                setNewZoneName(''); setNewZonePrice(0)
              } else {
                toast.error('No se pudo agregar la zona. Verificá que estés logueada.')
              }
            }}
            className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all disabled:opacity-30 hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
            style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
          >
            {zoneAdding ? '…' : '+ Agregar'}
          </button>
        </div>

        <p className="font-mono text-[10px] text-ink-soft mt-3">
          Precio 0 = envío gratis en esa zona. Las zonas inactivas no aparecen en el checkout.
        </p>
      </div>
    </div>
  )
}

export default AdminEnvios

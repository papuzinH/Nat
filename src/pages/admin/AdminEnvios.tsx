import React, { useState } from 'react'
import { useShippingZones, type ShippingZone } from '@/hooks/useShippingZones'

const AdminEnvios: React.FC = () => {
  const { zones, loading, addZone, updateZone, deleteZone, addPostalCode, removePostalCode } = useShippingZones()
  const [newZoneName,  setNewZoneName]  = useState('')
  const [newZonePrice, setNewZonePrice] = useState<number>(0)
  const [zoneAdding,   setZoneAdding]   = useState(false)
  const [zoneError,    setZoneError]    = useState<string | null>(null)
  const [editingZone,  setEditingZone]  = useState<Record<number, Partial<ShippingZone>>>({})

  const [expandedZone, setExpandedZone] = useState<number | null>(null)
  const [newCP,        setNewCP]        = useState<Record<number, string>>({})
  const [cpAdding,     setCpAdding]     = useState<Record<number, boolean>>({})
  const [cpError,      setCpError]      = useState<Record<number, string | null>>({})

  const handleAddCP = async (zoneId: number) => {
    const code = (newCP[zoneId] ?? '').trim()
    if (!code) return
    setCpAdding((p) => ({ ...p, [zoneId]: true }))
    setCpError((p) => ({ ...p, [zoneId]: null }))
    const ok = await addPostalCode(zoneId, code)
    if (!ok) setCpError((p) => ({ ...p, [zoneId]: 'CP duplicado o error al guardar' }))
    else setNewCP((p) => ({ ...p, [zoneId]: '' }))
    setCpAdding((p) => ({ ...p, [zoneId]: false }))
  }

  const handleRemoveCP = async (zoneId: number, code: string) => {
    const ok = await removePostalCode(zoneId, code)
    if (!ok) setCpError((p) => ({ ...p, [zoneId]: 'Error al eliminar CP' }))
  }

  if (loading) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        Cargando zonas…
      </p>
    )
  }

  return (
    <div>
      <h1 className="font-display text-[22px] text-ink font-normal mb-6">Envíos</h1>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-5">
        Zonas de envío (por barrio)
      </p>

      {zones.length > 0 && (
        <div
          className="rounded-sm overflow-hidden mb-6"
          style={{ border: '1px solid var(--line-soft)' }}
        >
          <div
            className="grid grid-cols-[1fr_100px_80px_80px_80px] gap-3 px-4 py-2 bg-cream-100"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            {['Zona', 'Precio', 'Activa', 'CPs', ''].map((h, i) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
            ))}
          </div>

          {zones.map((zone, i) => {
            const edit  = editingZone[zone.id] ?? {}
            const name  = edit.name  !== undefined ? edit.name  : zone.name
            const price = edit.price !== undefined ? edit.price : zone.price
            const isDirty = edit.name !== undefined || edit.price !== undefined || edit.active !== undefined

            return (
              <div
                key={zone.id}
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}
              >
                <div
                  className="grid grid-cols-[1fr_100px_80px_80px_80px] gap-3 items-center px-4 py-2.5 bg-cream-50 hover:bg-cream-100 transition-colors"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], name: e.target.value } }))
                    }
                    className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5"
                    style={{ borderColor: 'var(--line)' }}
                  />
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], price: Number(e.target.value) } }))
                    }
                    className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5 text-center"
                    style={{ borderColor: 'var(--line)' }}
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id={`zone-active-${zone.id}`}
                      checked={edit.active !== undefined ? edit.active : zone.active}
                      onChange={(e) =>
                        setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], active: e.target.checked } }))
                      }
                      className="accent-sage-700 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={`zone-active-${zone.id}`} className="font-mono text-[10px] text-ink-soft cursor-pointer">
                      {(edit.active !== undefined ? edit.active : zone.active) ? 'Sí' : 'No'}
                    </label>
                  </div>

                  {/* Botón CPs */}
                  <button
                    type="button"
                    onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                    aria-expanded={expandedZone === zone.id}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all"
                    style={{
                      borderColor: expandedZone === zone.id ? 'var(--sage-700)' : 'var(--line)',
                      color:       expandedZone === zone.id ? 'var(--sage-700)' : 'var(--ink-soft)',
                    }}
                  >
                    CPs ({zone.postal_codes.length})
                  </button>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={!isDirty}
                      onClick={async () => {
                        await updateZone(zone.id, {
                          name,
                          price,
                          active: edit.active !== undefined ? edit.active : zone.active,
                        })
                        setEditingZone((prev) => {
                          const n = { ...prev }
                          delete n[zone.id]
                          return n
                        })
                      }}
                      className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all disabled:opacity-30"
                      style={{
                        borderColor: isDirty ? 'var(--sage-700)' : 'var(--line)',
                        color:       isDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
                      }}
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

                {expandedZone === zone.id && (
                  <div
                    className="px-5 pb-4 pt-2 bg-cream-100"
                    style={{ borderTop: '1px solid var(--line-soft)' }}
                  >
                    {zone.postal_codes.length === 0 ? (
                      <p className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.1em] mb-3">
                        Sin códigos postales asignados
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {zone.postal_codes.map((cp) => (
                          <span
                            key={cp}
                            className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-pill"
                            style={{ border: '1px solid var(--line)', color: 'var(--ink)' }}
                          >
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
                    {cpError[zone.id] && (
                      <p className="font-mono text-[10px] text-red-600 mt-1">{cpError[zone.id]}</p>
                    )}
                    <p className="font-mono text-[9px] text-ink-soft uppercase tracking-[0.1em] mt-2">
                      Formato CPA: C1414, C1425… · Un CP puede pertenecer a una sola zona.
                    </p>
                  </div>
                )}
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
            onFocus={(e) => e.target.select()}
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
            else setZoneError('No se pudo agregar la zona. Verificá que estés logueado.')
          }}
          className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-1.5 rounded-pill border transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
        >
          {zoneAdding ? '…' : '+ Agregar zona'}
        </button>
      </div>

      {zoneError && (
        <p className="font-body text-[12px] text-red-500 mt-2">{zoneError}</p>
      )}

      <p className="font-mono text-[10px] text-ink-soft mt-3">
        Precio 0 = envío gratis en esa zona. Las zonas inactivas no aparecen en el checkout.
      </p>
    </div>
  )
}

export default AdminEnvios

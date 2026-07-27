'use client'

import React, { useState } from 'react'
import { useShippingZones, type ShippingZone } from '@/hooks/useShippingZones'
import { useToast } from '@/context/ToastContext'
import ConfirmDeleteInline from '@/components/admin/shared/ConfirmDeleteInline'

/**
 * Envíos con precio único CABA: acá se administra la tarifa (idealmente una
 * sola activa). Fuera de CABA el checkout ofrece coordinar el envío aparte,
 * así que no hay nada más que configurar.
 */
const AdminEnvios: React.FC = () => {
  const { zones, loading, addZone, updateZone, deleteZone } = useShippingZones()
  const toast = useToast()

  const [newZoneName,  setNewZoneName]  = useState('')
  const [newZonePrice, setNewZonePrice] = useState<number>(0)
  const [zoneAdding,   setZoneAdding]   = useState(false)
  const [editingZone,  setEditingZone]  = useState<Record<string, Partial<ShippingZone>>>({})

  const activeCount = zones.filter((z) => z.active).length

  const handleDeleteZone = async (zone: ShippingZone) => {
    const ok = await deleteZone(zone.id)
    if (ok) toast.success(`Tarifa "${zone.name}" eliminada`)
    else toast.error('No se pudo eliminar la tarifa')
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando tarifas…</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[22px] text-ink font-normal">Envíos</h1>
        <p className="font-body text-[13px] text-ink-soft mt-2 leading-relaxed max-w-xl">
          El envío a domicilio tiene un <strong className="text-ink">precio único dentro de CABA</strong> (CP 1000–1499).
          Fuera de CABA, el checkout le avisa al cliente que el envío se coordina aparte por WhatsApp/email.
          Dejá <strong className="text-ink">una sola tarifa activa</strong> con el precio vigente.
        </p>
      </div>

      {activeCount > 1 && (
        <p
          className="font-body text-[13px] mb-5 p-3 rounded-sm"
          style={{ background: '#faf3ec', border: '1px solid #e3c9a8', color: '#8a5a2b' }}
        >
          Hay {activeCount} tarifas activas: en el checkout se cobra la más barata. Desactivá o borrá las que sobren.
        </p>
      )}

      {zones.length > 0 && (
        <div className="rounded-sm overflow-hidden mb-6" style={{ border: '1px solid var(--line-soft)' }}>
          {/* Header — solo desktop */}
          <div
            className="hidden md:grid grid-cols-[1fr_120px_90px_120px] gap-3 px-4 py-2 bg-cream-100"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            {['Tarifa', 'Precio (ARS)', 'Activa', ''].map((h, i) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
            ))}
          </div>

          {zones.map((zone, i) => {
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
                toast.success('Tarifa actualizada')
              } else {
                toast.error('No se pudo actualizar la tarifa')
              }
            }

            return (
              <div key={zone.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}>
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1fr_120px_90px_120px] gap-3 items-center px-4 py-2.5 bg-cream-50 hover:bg-cream-100 transition-colors">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], name: e.target.value } }))
                    }
                    className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5"
                    style={{ borderColor: 'var(--line)' }}
                    aria-label={`Nombre de tarifa ${zone.name}`}
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
                    aria-label={`Tarifa ${zone.name} activa`}
                  />
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
                    <button
                      type="button"
                      disabled={!isDirty}
                      onClick={saveEdits}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-pill border transition-all disabled:opacity-30 ml-auto"
                      style={{
                        borderColor: isDirty ? 'var(--sage-700)' : 'var(--line)',
                        color:       isDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Formulario agregar tarifa */}
      <div className="rounded-sm p-4" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-3">Agregar tarifa nueva</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-end">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder="ej. CABA"
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
              if (!newZoneName.trim()) { toast.error('Ingresá el nombre de la tarifa'); return }
              setZoneAdding(true)
              const ok = await addZone(newZoneName, newZonePrice)
              setZoneAdding(false)
              if (ok) {
                toast.success(`Tarifa "${newZoneName.trim()}" creada`)
                setNewZoneName(''); setNewZonePrice(0)
              } else {
                toast.error('No se pudo agregar la tarifa. Verificá que estés logueada.')
              }
            }}
            className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all disabled:opacity-30 hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
            style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
          >
            {zoneAdding ? '…' : '+ Agregar'}
          </button>
        </div>

        <p className="font-mono text-[10px] text-ink-soft mt-3">
          Precio 0 = envío gratis. Las tarifas inactivas no se usan en el checkout.
        </p>
      </div>
    </div>
  )
}

export default AdminEnvios

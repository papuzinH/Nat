'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { ClientResponseError } from 'pocketbase'
import { compressImage } from '@/lib/imageCompression'
import { triggerRevalidate } from '@/lib/revalidate-client'
import { useToast } from '@/context/ToastContext'
import ConfirmDeleteInline from '@/components/admin/shared/ConfirmDeleteInline'
import type { SiteImageSection } from '@/lib/data/site-images'

interface AdminImage {
  id: string
  section: SiteImageSection
  url: string
  alt: string
  caption: string
  sortOrder: number
  focalX: number
  focalY: number
  active: boolean
}

const SECTIONS: { value: SiteImageSection; label: string }[] = [
  { value: 'home_hero',       label: 'Hero (home)' },
  { value: 'home_teaser',     label: 'Especialmente para vos' },
  { value: 'estudio_tattoos', label: 'Tatuajes (estudio)' },
  { value: 'estudio_espacio', label: 'El espacio' },
]

function fileUrl(record: Record<string, unknown>): string {
  return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.image}`
}

function rawToAdminImage(r: Record<string, unknown>): AdminImage {
  return {
    id: r.id as string,
    section: r.section as SiteImageSection,
    url: fileUrl(r),
    alt: (r.alt as string) ?? '',
    caption: (r.caption as string) ?? '',
    sortOrder: typeof r.sort_order === 'number' ? r.sort_order : 0,
    focalX: typeof r.focal_x === 'number' ? r.focal_x : 50,
    focalY: typeof r.focal_y === 'number' ? r.focal_y : 50,
    active: Boolean(r.active),
  }
}

const AdminImages: React.FC = () => {
  const toast = useToast()
  const [rows, setRows] = useState<AdminImage[]>([])
  const [loading, setLoading] = useState(true)
  const [collectionMissing, setCollectionMissing] = useState(false)
  const [activeSection, setActiveSection] = useState<SiteImageSection>('home_hero')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag reorder (dentro de la sección activa)
  const [dragId, setDragId] = useState<string | null>(null)
  // Edición inline de alt/caption
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ alt: string; caption: string }>({ alt: '', caption: '' })

  useEffect(() => {
    const load = async () => {
      try {
        // Consultamos metadatos de colecciones para evitar requests 404 a /records.
        const collections = await pb.collections.getFullList({ requestKey: null })
        const hasSiteImages = collections.some((c) => c.name === 'site_images')
        if (!hasSiteImages) {
          setCollectionMissing(true)
          setRows([])
          setLoading(false)
          return
        }

        setCollectionMissing(false)
        const data = await pb.collection('site_images').getFullList({ sort: 'section,sort_order', requestKey: null })
        setRows(data.map(rawToAdminImage))
        setLoading(false)
      } catch (e) {
        setLoading(false)
        if (!(e instanceof ClientResponseError && e.status === 404)) {
          toast.error('No se pudieron cargar las imágenes', { detail: e instanceof Error ? e.message : undefined })
        }
      }
    }

    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sectionRows = useMemo(
    () => rows.filter((r) => r.section === activeSection).sort((a, b) => a.sortOrder - b.sortOrder),
    [rows, activeSection]
  )

  const nextSortOrder = useMemo(
    () => sectionRows.reduce((max, r) => Math.max(max, r.sortOrder), 0) + 1,
    [sectionRows]
  )

  const handleFiles = async (files: FileList | null) => {
    if (collectionMissing) {
      toast.error('Falta la colección site_images en PocketBase')
      return
    }
    if (!files || files.length === 0) return
    setUploading(true)
    let order = nextSortOrder
    let anySuccess = false
    for (const original of Array.from(files)) {
      try {
        const optimized = await compressImage(original)
        const fd = new FormData()
        fd.append('image', optimized)
        fd.append('section', activeSection)
        fd.append('alt', original.name.replace(/\.[^.]+$/, ''))
        fd.append('caption', '')
        fd.append('sort_order', String(order))
        fd.append('focal_x', '50')
        fd.append('focal_y', '50')
        fd.append('active', 'true')
        const rec = await pb.collection('site_images').create(fd)
        setRows((prev) => [...prev, rawToAdminImage(rec as Record<string, unknown>)])
        order += 1
        anySuccess = true
      } catch (e) {
        toast.error(`Error al subir ${original.name}`, { detail: e instanceof Error ? e.message : undefined })
      }
    }
    setUploading(false)
    if (anySuccess) triggerRevalidate('site_images')
  }

  const toggleActive = async (img: AdminImage) => {
    if (collectionMissing) {
      toast.error('Falta la colección site_images en PocketBase')
      return
    }
    try {
      await pb.collection('site_images').update(img.id, { active: !img.active })
      setRows((prev) => prev.map((r) => (r.id === img.id ? { ...r, active: !img.active } : r)))
      triggerRevalidate('site_images')
    } catch (e) {
      toast.error('No se pudo actualizar', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const remove = async (id: string) => {
    if (collectionMissing) {
      toast.error('Falta la colección site_images en PocketBase')
      return
    }
    try {
      await pb.collection('site_images').delete(id)
      setRows((prev) => prev.filter((r) => r.id !== id))
      toast.success('Imagen eliminada')
      triggerRevalidate('site_images')
    } catch (e) {
      toast.error('No se pudo eliminar', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  // Traduce el patch de PB (snake_case) al shape de AdminImage (camelCase)
  function mapPatch(data: Record<string, unknown>): Partial<AdminImage> {
    const out: Partial<AdminImage> = {}
    if ('alt' in data) out.alt = data.alt as string
    if ('caption' in data) out.caption = data.caption as string
    if ('focal_x' in data) out.focalX = data.focal_x as number
    if ('focal_y' in data) out.focalY = data.focal_y as number
    if ('sort_order' in data) out.sortOrder = data.sort_order as number
    return out
  }

  const persist = async (id: string, data: Record<string, unknown>) => {
    if (collectionMissing) {
      throw new Error('Falta la colección site_images en PocketBase')
    }
    await pb.collection('site_images').update(id, data)
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...mapPatch(data) } : r)))
    triggerRevalidate('site_images')
  }

  const handleReorder = async (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); return }
    const ordered = [...sectionRows]
    const from = ordered.findIndex((r) => r.id === dragId)
    const to = ordered.findIndex((r) => r.id === targetId)
    if (from < 0 || to < 0) { setDragId(null); return }
    const [moved] = ordered.splice(from, 1)
    ordered.splice(to, 0, moved)
    setDragId(null)
    // Reasignar sort_order secuencial y persistir los que cambiaron
    const updates = ordered.map((r, i) => ({ id: r.id, sort_order: i + 1 }))
    // Snapshot pre-actualización: para comparar contra el orden viejo y revertir si PB falla.
    const prevRows = rows
    const prevSectionRows = sectionRows
    setRows((prev) => prev.map((r) => {
      const u = updates.find((x) => x.id === r.id)
      return u ? { ...r, sortOrder: u.sort_order } : r
    }))
    try {
      await Promise.all(
        updates
          .filter((u) => prevSectionRows.find((r) => r.id === u.id)?.sortOrder !== u.sort_order)
          .map((u) => pb.collection('site_images').update(u.id, { sort_order: u.sort_order }))
      )
      triggerRevalidate('site_images')
    } catch {
      setRows(prevRows) // rollback: PB conserva el orden viejo, el estado local también.
      toast.error('No se pudo guardar el orden')
    }
  }

  const setFocalFromClick = (img: AdminImage, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    const clampedX = Math.min(100, Math.max(0, x))
    const clampedY = Math.min(100, Math.max(0, y))
    setRows((prev) => prev.map((r) => (r.id === img.id ? { ...r, focalX: clampedX, focalY: clampedY } : r)))
    persist(img.id, { focal_x: clampedX, focal_y: clampedY }).catch(() => toast.error('No se pudo guardar el foco'))
  }

  const startEdit = (img: AdminImage) => { setEditingId(img.id); setDraft({ alt: img.alt, caption: img.caption }) }
  const saveEdit = async (id: string) => {
    try {
      await persist(id, { alt: draft.alt.trim(), caption: draft.caption.trim() })
      setEditingId(null)
      toast.success('Imagen actualizada')
    } catch (e) {
      toast.error('No se pudo guardar', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando imágenes…</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[22px] text-ink font-normal">Galerías</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
          Imágenes del sitio por sección
        </p>
      </div>

      {/* Pestañas de sección */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {SECTIONS.map((s) => {
          const isActive = s.value === activeSection
          const count = rows.filter((r) => r.section === s.value).length
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setActiveSection(s.value)}
              className={`font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border whitespace-nowrap transition-all ${
                isActive ? 'bg-sage-900 text-cream-50 border-sage-900' : 'text-ink-soft border-[var(--line)] hover:border-sage-500'
              }`}
            >
              {s.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Subir */}
      <div className="mb-6">
        {collectionMissing && (
          <div
            className="mb-4 rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em]"
            style={{ border: '1px solid #d3ab00', color: '#6b5200', background: '#fff8db' }}
          >
            Falta la coleccion site_images en PocketBase. Ejecuta scripts/create-site-images.mjs para crearla.
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={collectionMissing}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
        <button
          type="button"
          disabled={uploading || collectionMissing}
          onClick={() => fileInputRef.current?.click()}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700 disabled:opacity-50"
          style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
        >
          {uploading ? 'Subiendo…' : '+ Subir imágenes'}
        </button>
      </div>

      {/* Lista de la sección activa */}
      {sectionRows.length === 0 ? (
        <p className="font-mono text-[11px] text-ink-soft py-8 text-center rounded-sm" style={{ border: '1px solid var(--line-soft)' }}>
          No hay imágenes en esta sección. Subí la primera arriba.
        </p>
      ) : (
        <>
          {sectionRows.length > 1 && (
            <p className="font-mono text-[10px] text-ink-soft mb-2">Arrastrá para reordenar · click en la imagen para fijar el punto focal</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectionRows.map((img) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => setDragId(img.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleReorder(img.id)}
                className="rounded-sm overflow-hidden"
                style={{ border: `1px solid ${dragId === img.id ? 'var(--sage-700)' : 'var(--line-soft)'}`, cursor: 'grab' }}
              >
                {/* Click en la imagen = fijar punto focal */}
                <button
                  type="button"
                  onClick={(e) => setFocalFromClick(img, e)}
                  title="Click para fijar el punto focal"
                  className="relative block w-full aspect-[4/3] bg-cream-200 p-0 border-0 cursor-crosshair"
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: `${img.focalX}% ${img.focalY}%`, opacity: img.active ? 1 : 0.4 }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute w-3 h-3 rounded-full border-2 border-cream-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${img.focalX}%`, top: `${img.focalY}%`, background: 'var(--sage-700)' }}
                  />
                </button>

                <div className="p-2 flex flex-col gap-2">
                  {editingId === img.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={draft.alt}
                        onChange={(e) => setDraft((d) => ({ ...d, alt: e.target.value }))}
                        placeholder="Texto alternativo (alt)"
                        className="font-body text-[12px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700"
                        style={{ borderColor: 'var(--line)' }}
                        autoFocus
                      />
                      <input
                        value={draft.caption}
                        onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
                        placeholder="Caption (opcional, visible en el hero)"
                        className="font-body text-[12px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700"
                        style={{ borderColor: 'var(--line)' }}
                      />
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => saveEdit(img.id)} className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-sm" style={{ background: 'var(--sage-700)', color: '#fdfcfb' }}>Guardar</button>
                        <button type="button" onClick={() => setEditingId(null)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-body text-[12px] text-ink truncate" title={img.alt}>{img.alt || 'sin alt'}</p>
                      {img.caption && <p className="font-mono text-[10px] text-ink-soft truncate">{img.caption}</p>}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <button type="button" onClick={() => startEdit(img)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors">Editar</button>
                        <button type="button" onClick={() => toggleActive(img)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors">{img.active ? 'Ocultar' : 'Mostrar'}</button>
                        <ConfirmDeleteInline onConfirm={() => remove(img.id)} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminImages

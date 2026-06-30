'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { pb } from '@/lib/pocketbase'
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
  const [activeSection, setActiveSection] = useState<SiteImageSection>('home_hero')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    pb.collection('site_images')
      .getFullList({ sort: 'section,sort_order', requestKey: null })
      .then((data) => {
        setRows(data.map(rawToAdminImage))
        setLoading(false)
      })
      .catch((e) => {
        // La colección puede no existir aún → lista vacía, sin romper.
        setLoading(false)
        if (!(e instanceof Error && /404/.test(e.message))) {
          toast.error('No se pudieron cargar las imágenes', { detail: e instanceof Error ? e.message : undefined })
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sectionRows = useMemo(
    () => rows.filter((r) => r.section === activeSection).sort((a, b) => a.sortOrder - b.sortOrder),
    [rows, activeSection]
  )

  const nextSortOrder = useMemo(
    () => (sectionRows.length ? Math.max(...sectionRows.map((r) => r.sortOrder)) + 1 : 1),
    [sectionRows]
  )

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    let order = nextSortOrder
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
      } catch (e) {
        toast.error(`Error al subir ${original.name}`, { detail: e instanceof Error ? e.message : undefined })
      }
    }
    setUploading(false)
    triggerRevalidate('site_images')
  }

  const toggleActive = async (img: AdminImage) => {
    try {
      await pb.collection('site_images').update(img.id, { active: !img.active })
      setRows((prev) => prev.map((r) => (r.id === img.id ? { ...r, active: !img.active } : r)))
      triggerRevalidate('site_images')
    } catch (e) {
      toast.error('No se pudo actualizar', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const remove = async (id: string) => {
    try {
      await pb.collection('site_images').delete(id)
      setRows((prev) => prev.filter((r) => r.id !== id))
      toast.success('Imagen eliminada')
      triggerRevalidate('site_images')
    } catch (e) {
      toast.error('No se pudo eliminar', { detail: e instanceof Error ? e.message : undefined })
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
        <button
          type="button"
          disabled={uploading}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sectionRows.map((img) => (
            <div key={img.id} className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
              <div className="relative aspect-[4/3] bg-cream-200">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${img.focalX}% ${img.focalY}%`, opacity: img.active ? 1 : 0.4 }}
                />
              </div>
              <div className="p-2 flex flex-col gap-2">
                <p className="font-body text-[12px] text-ink truncate" title={img.alt}>{img.alt || 'sin alt'}</p>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleActive(img)}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors"
                  >
                    {img.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <ConfirmDeleteInline onConfirm={() => remove(img.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminImages

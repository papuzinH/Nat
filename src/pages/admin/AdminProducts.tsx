import React, { useEffect, useRef, useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import { pb } from '@/lib/pocketbase'
import { compressImage } from '@/lib/imageCompression'
import {
  formatARS,
  normalizeDescription,
  EMPTY_DESCRIPTION,
} from '@/data/products'
import type { ProductCategory, ProductSpec, ProductTone } from '@/data/products'
import TipTapEditor from '@/components/admin/blog/TipTapEditor'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface VariantRow {
  size: string
  priceMultiplier: number
}

interface ProductRow {
  slug: string
  title: string
  category: string
  cat_label: string
  base_price: number
  size: string
  tone: string
  tall: number
  description: JSONContent
  specs: ProductSpec[]
  images: string[]
  tags: string[]
  tagsInput: string
  variants: VariantRow[]
  has_frame: boolean
  frame_price: number
  on_demand: boolean
  sort_order: number
  isNew?: boolean
  dirty: boolean
  saving: boolean
  confirmDelete: boolean
}

// ─── Opciones ─────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'laminas',     label: 'Láminas' },
  { value: 'ceramica',    label: 'Cerámica' },
  { value: 'acuarela',    label: 'Acuarelas' },
  { value: 'gouache',     label: 'Gouache' },
  { value: 'textil',      label: 'Textiles' },
  { value: 'ilustracion', label: 'Ilustraciones' },
  { value: 'mixta',       label: 'Técnica mixta' },
  { value: 'stickers',    label: 'Stickers' },
  { value: 'mandalas',    label: 'Mandalas' },
  { value: 'abanicos',    label: 'Abanicos' },
]

const TONE_OPTIONS: { value: ProductTone; label: string }[] = [
  { value: 'a', label: 'A — crema cálido' },
  { value: 'b', label: 'B — verde suave' },
  { value: 'c', label: 'C — arena' },
  { value: 'd', label: 'D — salvia' },
  { value: 'e', label: 'E — lino' },
  { value: 'f', label: 'F — hueso' },
]

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false)
  return (
    <span
      className="relative inline-flex items-center ml-1.5 cursor-default"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        className="inline-flex items-center justify-center rounded-full font-mono text-[9px] w-3.5 h-3.5 flex-shrink-0"
        style={{ background: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        ?
      </span>
      {show && (
        <span
          className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-52 font-body text-[12px] leading-snug rounded-sm px-3 py-2 shadow-md"
          style={{ background: '#2c2c2c', color: '#fdfcfb', whiteSpace: 'normal' }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

// ─── Upload de imágenes a la colección media de PocketBase ───────────────────

async function uploadToMedia(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const record = await pb.collection('media').create(formData)
    return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record['file']}`
  } catch { return null }
}

const ImageUploader: React.FC<{
  slug: string
  images: string[]
  onChange: (urls: string[]) => void
}> = ({ slug, images, onChange }) => {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (!slug) {
      setUploadError('Ingresá el slug del producto antes de subir imágenes')
      return
    }
    setUploading(true)
    setUploadError(null)
    const newUrls: string[] = []

    for (const original of Array.from(files)) {
      const optimized = await compressImage(original)
      const url = await uploadToMedia(optimized)
      if (!url) {
        setUploadError(`Error al subir ${original.name}`)
        continue
      }
      newUrls.push(url)
    }

    onChange([...images, ...newUrls])
    setUploading(false)
  }

  const removeImage = (url: string) => {
    onChange(images.filter((u) => u !== url))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Zona drag & drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-8 rounded-sm cursor-pointer transition-colors"
        style={{
          border: `1.5px dashed ${dragging ? 'var(--sage-700)' : 'var(--line)'}`,
          background: dragging ? 'var(--cream-200, #ede8e0)' : 'var(--cream-50)',
        }}
      >
        {uploading ? (
          <span className="font-mono text-[11px] text-ink-soft uppercase tracking-[0.1em]">Subiendo…</span>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="font-body text-[13px] text-ink-soft">
              Arrastrá imágenes o <span style={{ color: 'var(--sage-700)' }}>hacé click</span> para seleccionar
            </span>
            <span className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.08em]">
              JPG, PNG, WEBP
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>

      {uploadError && (
        <p className="font-mono text-[11px]" style={{ color: '#a8503f' }}>{uploadError}</p>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative group flex-shrink-0">
              <img
                src={url}
                alt=""
                className="w-20 h-20 object-cover rounded-sm"
                style={{ border: '1px solid var(--line-soft)' }}
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: '#a8503f', color: '#fff', fontSize: 12, lineHeight: 1 }}
                aria-label="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Editor de variantes ───────────────────────────────────────────────────────

const VariantsEditor: React.FC<{
  variants: VariantRow[]
  basePrice: number
  onChange: (variants: VariantRow[]) => void
}> = ({ variants, basePrice, onChange }) => {
  const add = () => onChange([...variants, { size: '', priceMultiplier: 1 }])
  const remove = (i: number) => onChange(variants.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof VariantRow, value: string | number) =>
    onChange(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)))

  return (
    <div className="flex flex-col gap-3">
      {variants.length === 0 ? (
        <p className="font-body text-[13px] text-ink-soft italic">
          Sin variantes — el producto tiene un único precio.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_140px_100px_32px] gap-3 px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Tamaño</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Multiplicador</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Precio</span>
            <span />
          </div>

          {variants.map((v, i) => {
            const price = basePrice && v.priceMultiplier ? Math.round(basePrice * v.priceMultiplier) : null
            return (
              <div key={i} className="grid grid-cols-[1fr_140px_100px_32px] gap-3 items-center">
                <input
                  type="text"
                  value={v.size}
                  placeholder="A4"
                  onChange={(e) => update(i, 'size', e.target.value)}
                  className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                  style={{ borderColor: 'var(--line)' }}
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min={0.1}
                    value={v.priceMultiplier}
                    onChange={(e) => update(i, 'priceMultiplier', parseFloat(e.target.value) || 1)}
                    className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                    style={{ borderColor: 'var(--line)' }}
                  />
                  <span className="font-mono text-[10px] text-ink-soft">×</span>
                </div>
                <span className="font-mono text-[12px] text-ink-soft">
                  {price ? formatARS(price) : '—'}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#f5e6e6] transition-colors"
                  style={{ color: '#a8503f' }}
                  aria-label="Eliminar variante"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="self-start font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all hover:border-sage-700 hover:text-sage-700"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        + Agregar tamaño
      </button>

      {variants.length > 0 && (
        <p className="font-mono text-[10px] text-ink-soft">
          El multiplicador 1 = precio base. 0.75 = 75% del precio base. 1.6 = 60% más caro.
        </p>
      )}
    </div>
  )
}

// ─── Editor de características (specs dinámicos) ─────────────────────────────

const SpecsEditor: React.FC<{
  specs: ProductSpec[]
  onChange: (specs: ProductSpec[]) => void
}> = ({ specs, onChange }) => {
  const add = () => onChange([...specs, { label: '', value: '' }])
  const remove = (i: number) => onChange(specs.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof ProductSpec, value: string) =>
    onChange(specs.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  return (
    <div className="flex flex-col gap-3">
      {specs.length === 0 ? (
        <p className="font-body text-[13px] text-ink-soft italic">
          Sin características — agregá las que necesites (ej. Técnica, Edición, Origen).
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[180px_1fr_32px] gap-3 px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Nombre</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Valor</span>
            <span />
          </div>

          {specs.map((s, i) => (
            <div key={i} className="grid grid-cols-[180px_1fr_32px] gap-3 items-center">
              <input
                type="text"
                value={s.label}
                placeholder="Técnica"
                onChange={(e) => update(i, 'label', e.target.value)}
                className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                style={{ borderColor: 'var(--line)' }}
              />
              <input
                type="text"
                value={s.value}
                placeholder="Impresión giclée sobre papel Hahnemühle 308g"
                onChange={(e) => update(i, 'value', e.target.value)}
                className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                style={{ borderColor: 'var(--line)' }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#f5e6e6] transition-colors"
                style={{ color: '#a8503f' }}
                aria-label="Eliminar característica"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="self-start font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all hover:border-sage-700 hover:text-sage-700"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        + Agregar característica
      </button>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyRow(): ProductRow {
  return {
    slug: '', title: '', category: 'laminas', cat_label: '',
    base_price: 0, size: '', tone: 'a', tall: 1.3,
    description: EMPTY_DESCRIPTION, specs: [],
    images: [], tags: [], tagsInput: '', variants: [],
    has_frame: false, frame_price: 0, on_demand: false, sort_order: 0,
    isNew: true, dirty: true, saving: false, confirmDelete: false,
  }
}

function rawToRow(p: Record<string, unknown>): ProductRow {
  let variants: VariantRow[] = []
  if (Array.isArray(p.variants)) {
    variants = (p.variants as VariantRow[]).filter(
      (v) => typeof v === 'object' && 'size' in v && 'priceMultiplier' in v
    )
  }

  // Specs: usa el array si existe; si no, reconstruye desde medium/edition legacy.
  let specs: ProductSpec[] = []
  if (Array.isArray(p.specs)) {
    specs = (p.specs as ProductSpec[]).filter(
      (s) => typeof s === 'object' && 'label' in s && 'value' in s
    )
  } else if (typeof p.specs === 'string' && p.specs.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(p.specs)
      if (Array.isArray(parsed)) specs = parsed.filter((s) => s?.label && s?.value)
    } catch { /* ignore */ }
  }
  if (specs.length === 0) {
    if (p.medium) specs.push({ label: 'Técnica', value: String(p.medium) })
    if (p.edition) specs.push({ label: 'Edición', value: String(p.edition) })
  }

  return {
    slug: p.slug as string,
    title: p.title as string,
    category: p.category as string,
    cat_label: p.cat_label as string,
    base_price: p.base_price as number,
    size: p.size as string,
    tone: p.tone as string,
    tall: p.tall as number,
    description: normalizeDescription(p.description),
    specs,
    images: (p.images as string[]) ?? [],
    tags: (p.tags as string[]) ?? [],
    tagsInput: ((p.tags as string[]) ?? []).join(', '),
    variants,
    has_frame: p.has_frame as boolean,
    frame_price: p.frame_price as number,
    on_demand: p.on_demand as boolean,
    sort_order: p.sort_order as number,
    dirty: false, saving: false, confirmDelete: false,
  }
}

// ─── Input con label ──────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string
  tooltip?: string
  children: React.ReactNode
}> = ({ label, tooltip, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft flex items-center">
      {label}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    {children}
  </div>
)

const inputCls = "font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1.5 transition-colors"
const inputStyle = { borderColor: 'var(--line)' }

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminProducts: React.FC = () => {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    pb.collection('products')
      .getFullList({ sort: 'sort_order' })
      .then((data) => {
        setRows(data.map((p) => rawToRow(p as Record<string, unknown>)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getKey = (row: ProductRow) => row.isNew ? '__new__' : row.slug

  const patch = (key: string, field: keyof ProductRow, value: unknown) => {
    setRows((prev) =>
      prev.map((r) => {
        const matches = key === '__new__' ? !!r.isNew : r.slug === key
        return matches ? { ...r, [field]: value, dirty: true } : r
      })
    )
  }

  const addNew = () => {
    if (rows.some((r) => r.isNew)) return
    setRows((prev) => [emptyRow(), ...prev])
    setExpanded('__new__')
  }

  const save = async (row: ProductRow) => {
    const key = getKey(row)
    setSaveErrors((prev) => { const n = { ...prev }; delete n[key]; return n })

    const matchRow = (r: ProductRow) => key === '__new__' ? !!r.isNew : r.slug === key
    setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, saving: true } : r))

    const cleanSpecs = row.specs
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label && s.value)

    const payload = {
      slug: row.slug,
      title: row.title,
      category: row.category,
      cat_label: row.cat_label,
      base_price: row.base_price,
      size: row.size,
      tone: row.tone,
      tall: row.tall,
      description: row.description,
      specs: cleanSpecs,
      images: row.images,
      tags: row.tags,
      variants: row.variants.length > 0 ? row.variants : null,
      has_frame: row.has_frame,
      frame_price: row.frame_price,
      on_demand: row.on_demand,
      sort_order: row.sort_order,
    }

    // Log temporal de diagnóstico: ver qué se envía y qué devuelve PB
    console.log('[AdminProducts] payload.description =', JSON.stringify(payload.description))
    console.log('[AdminProducts] payload.specs       =', JSON.stringify(payload.specs))

    try {
      let recordId: string
      try {
        const existing = await pb.collection('products').getFirstListItem(`slug = "${row.slug}"`)
        const updated = await pb.collection('products').update(existing.id, payload)
        recordId = updated.id
      } catch (e: unknown) {
        if ((e as { status?: number })?.status === 404 || (e as { status?: number })?.status === 0) {
          const created = await pb.collection('products').create(payload)
          recordId = created.id
        } else {
          throw e
        }
      }

      // Verificación post-save: re-leer el record y comprobar que description quedó persistido.
      const fresh = await pb.collection('products').getOne(recordId)
      console.log('[AdminProducts] fresh.description  =', JSON.stringify(fresh.description))
      console.log('[AdminProducts] fresh.specs        =', JSON.stringify(fresh.specs))

      const descSaved = fresh.description
      const descIsEmpty =
        descSaved == null ||
        descSaved === '' ||
        (typeof descSaved === 'object' &&
          Array.isArray((descSaved as { content?: unknown[] }).content) &&
          (descSaved as { content: unknown[] }).content.length === 0)

      // Si el TipTap tenía contenido pero PocketBase devuelve vacío,
      // el campo de la colección no está aceptando el payload.
      const localHasContent =
        Array.isArray(row.description?.content) && row.description.content.length > 0
      if (localHasContent && descIsEmpty) {
        setSaveErrors((prev) => ({
          ...prev,
          [key]: 'PocketBase no persistió la descripción. Verificá que el campo "description" exista en la colección products y sea de tipo JSON (no Text). Revisá la consola para más detalle.',
        }))
        setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, saving: false } : r))
        return
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar'
      console.error('[AdminProducts] save error', e)
      setSaveErrors((prev) => ({ ...prev, [key]: msg }))
      setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, saving: false } : r))
      return
    }

    setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, dirty: false, saving: false, isNew: false } : r))
    if (row.isNew) setExpanded(row.slug)
  }

  const deleteRow = async (slug: string) => {
    try {
      const record = await pb.collection('products').getFirstListItem(`slug = "${slug}"`)
      await pb.collection('products').delete(record.id)
    } catch {}
    setRows((prev) => prev.filter((r) => r.slug !== slug))
    if (expanded === slug) setExpanded(null)
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando productos…</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[22px] text-ink font-normal">Productos</h1>
        <button
          type="button"
          onClick={addNew}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
          style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
        >
          + Nuevo
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => {
          const key = getKey(row)
          const isOpen = expanded === key

          return (
            <div
              key={key}
              className="rounded-sm overflow-hidden"
              style={{ border: '1px solid var(--line-soft)' }}
            >
              {/* Fila resumen */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full text-left px-5 py-4 bg-cream-50 hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono text-[11px] text-ink-soft w-[90px] flex-shrink-0 uppercase tracking-[0.08em]">
                    {row.isNew ? '— nuevo —' : row.slug}
                  </span>
                  <span className="font-body text-[14px] text-ink flex-1 min-w-[120px]">
                    {row.title || <span className="text-ink-soft italic text-[13px]">sin título</span>}
                  </span>
                  <span className="font-mono text-[11px] text-ink-soft hidden md:block">
                    {CATEGORY_OPTIONS.find((c) => c.value === row.category)?.label ?? row.category}
                  </span>
                  <span className="font-mono text-[12px] text-ink flex-shrink-0">
                    {row.base_price ? formatARS(row.base_price) : '—'}
                  </span>
                  {row.images.length > 0 && (
                    <span className="font-mono text-[10px] text-ink-soft hidden md:block">
                      {row.images.length} foto{row.images.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {row.dirty && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: '#a87c3f' }}>
                      sin guardar
                    </span>
                  )}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Formulario expandido */}
              {isOpen && (
                <div
                  className="px-5 py-6 flex flex-col gap-6"
                  style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--cream-100, #f5f0eb)' }}
                >

                  {/* Sección: identificación */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Identificación</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Slug (ID único)" tooltip="Identificador permanente del producto en la URL. Solo letras minúsculas, números y guiones. Ejemplo: helecho-i. No se puede cambiar una vez creado.">
                        <input
                          type="text"
                          value={row.slug}
                          disabled={!row.isNew}
                          placeholder="helecho-i"
                          onChange={(e) => patch(key, 'slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          className={`${inputCls} disabled:opacity-50`}
                          style={inputStyle}
                        />
                      </Field>
                      <Field label="Título">
                        <input type="text" value={row.title} placeholder="Helecho I"
                          onChange={(e) => patch(key, 'title', e.target.value)}
                          className={inputCls} style={inputStyle} />
                      </Field>
                    </div>
                  </div>

                  {/* Sección: categoría y precios */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Categoría y precio</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Categoría">
                        <select value={row.category} onChange={(e) => patch(key, 'category', e.target.value)}
                          className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
                          style={{ borderColor: 'var(--line)' }}>
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Etiqueta de categoría" tooltip="Texto que aparece en la ficha del producto. Ejemplo: 'Lámina — Giclée', 'Cerámica — Gres esmaltado'.">
                        <input type="text" value={row.cat_label} placeholder="Lámina — Giclée"
                          onChange={(e) => patch(key, 'cat_label', e.target.value)}
                          className={inputCls} style={inputStyle} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Field label="Precio base (ARS)" tooltip="Precio del tamaño estándar (A4 o pieza única). Si el producto tiene variantes de tamaño, los otros precios se calculan automáticamente a partir de este.">
                        <input type="number" min={0} value={row.base_price || ''}
                          placeholder="8500"
                          onChange={(e) => patch(key, 'base_price', parseInt(e.target.value, 10) || 0)}
                          className={inputCls} style={inputStyle} />
                      </Field>
                      <Field label="Medidas / tamaño">
                        <input type="text" value={row.size} placeholder="A4 · 21×29,7 cm"
                          onChange={(e) => patch(key, 'size', e.target.value)}
                          className={inputCls} style={inputStyle} />
                      </Field>
                    </div>
                  </div>

                  {/* Sección: variantes de tamaño */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-1 flex items-center">
                      Variantes de tamaño
                      <Tooltip text="Usá variantes si el producto existe en varios tamaños con distintos precios (ej. láminas A6, A5, A4, A3). Dejalo vacío si es una sola versión." />
                    </p>
                    <VariantsEditor
                      variants={row.variants}
                      basePrice={row.base_price}
                      onChange={(v) => patch(key, 'variants', v)}
                    />
                  </div>

                  {/* Sección: descripción */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Descripción y detalles</p>
                    <div className="flex flex-col gap-5">
                      <Field
                        label="Descripción"
                        tooltip="Texto rico con formato (negrita, listas, enlaces, etc.) que aparece en la ficha del producto."
                      >
                        <TipTapEditor
                          value={row.description}
                          onChange={(v) => patch(key, 'description', v)}
                          placeholder="Contá la historia del producto, materiales, inspiración…"
                        />
                      </Field>

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-3 flex items-center">
                          Características
                          <Tooltip text="Pares nombre/valor que aparecen en la tabla de detalles del producto. Agregá las que quieras: Técnica, Edición, Origen, Cuidados, etc." />
                        </p>
                        <SpecsEditor
                          specs={row.specs}
                          onChange={(s) => patch(key, 'specs', s)}
                        />
                      </div>

                      <Field label="Tags" tooltip="Palabras clave separadas por coma, usadas internamente para búsqueda y filtros. Ejemplo: botanica, tinta, papel, serie-2025">
                        <input type="text"
                          value={row.tagsInput}
                          placeholder="botanica, tinta, papel"
                          onChange={(e) => patch(key, 'tagsInput', e.target.value)}
                          onBlur={(e) => {
                            const parsed = e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                            patch(key, 'tags', parsed)
                            patch(key, 'tagsInput', parsed.join(', '))
                          }}
                          className={inputCls} style={inputStyle} />
                      </Field>
                    </div>
                  </div>

                  {/* Sección: marco */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Marco</p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id={`frame-${key}`} checked={row.has_frame}
                          onChange={(e) => patch(key, 'has_frame', e.target.checked)}
                          className="accent-sage-700 w-4 h-4 cursor-pointer" />
                        <label htmlFor={`frame-${key}`} className="font-body text-[13px] text-ink cursor-pointer">
                          Ofrece opción de enmarcado
                        </label>
                      </div>
                      {row.has_frame && (
                        <Field label="Precio del marco (ARS)">
                          <input type="number" min={0} value={row.frame_price || ''}
                            placeholder="12000"
                            onChange={(e) => patch(key, 'frame_price', parseInt(e.target.value, 10) || 0)}
                            className={`${inputCls} max-w-[160px]`} style={inputStyle} />
                        </Field>
                      )}
                    </div>
                  </div>

                  {/* Sección: imágenes */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Imágenes</p>
                    <ImageUploader
                      slug={row.slug}
                      images={row.images}
                      onChange={(urls) => patch(key, 'images', urls)}
                    />
                  </div>

                  {/* Sección: opciones avanzadas */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Opciones avanzadas</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Field label="Tono placeholder" tooltip="Color del fondo de espera mientras carga la imagen. Usá el tono que más se parezca a los colores del producto.">
                        <select value={row.tone} onChange={(e) => patch(key, 'tone', e.target.value)}
                          className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
                          style={{ borderColor: 'var(--line)' }}>
                          {TONE_OPTIONS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Proporción imagen" tooltip="Controla la altura del placeholder de imagen. 1.3 = más alto que ancho (cuadros verticales). 1 = cuadrado. 0.9 = más ancho que alto.">
                        <input type="number" step="0.05" min={0.5} max={2.5}
                          value={row.tall}
                          onChange={(e) => patch(key, 'tall', parseFloat(e.target.value) || 1.3)}
                          className={inputCls} style={inputStyle} />
                      </Field>
                      <Field label="Orden en tienda" tooltip="Número que define el orden de aparición. Menor número = aparece primero. Usá múltiplos de 10 para poder intercalar fácilmente.">
                        <input type="number" min={0} value={row.sort_order}
                          onChange={(e) => patch(key, 'sort_order', parseInt(e.target.value, 10) || 0)}
                          className={inputCls} style={inputStyle} />
                      </Field>
                      <div className="flex items-center gap-3 mt-5">
                        <input type="checkbox" id={`demand-${key}`} checked={row.on_demand}
                          onChange={(e) => patch(key, 'on_demand', e.target.checked)}
                          className="accent-sage-700 w-4 h-4 cursor-pointer" />
                        <label htmlFor={`demand-${key}`}
                          className="font-body text-[13px] text-ink cursor-pointer flex items-center">
                          Bajo pedido
                          <Tooltip text="Marcá esto si el producto no está físicamente disponible pero se puede encargar con anticipación." />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {saveErrors[key] && (
                    <p className="font-mono text-[11px]" style={{ color: '#a8503f' }}>{saveErrors[key]}</p>
                  )}
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid var(--line-soft)' }}
                  >
                    <div className="flex items-center gap-3">
                      {!row.isNew && !row.confirmDelete && (
                        <button
                          type="button"
                          onClick={() => setRows((prev) => prev.map((r) => r.slug === row.slug ? { ...r, confirmDelete: true } : r))}
                          className="font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:underline"
                          style={{ color: '#a8503f' }}
                        >
                          Eliminar
                        </button>
                      )}
                      {row.confirmDelete && (
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-ink-soft">¿Segura?</span>
                          <button type="button" onClick={() => deleteRow(row.slug)}
                            className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline"
                            style={{ color: '#a8503f' }}>
                            Sí, eliminar
                          </button>
                          <button type="button"
                            onClick={() => setRows((prev) => prev.map((r) => r.slug === row.slug ? { ...r, confirmDelete: false } : r))}
                            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink">
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={!row.dirty || row.saving || !row.slug || !row.title}
                      onClick={() => save(row)}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] px-5 py-2 rounded-pill transition-all disabled:opacity-40"
                      style={{
                        background: row.dirty && row.slug && row.title ? 'var(--sage-700)' : 'transparent',
                        color: row.dirty && row.slug && row.title ? 'var(--cream-50)' : 'var(--ink-soft)',
                        border: '1px solid var(--sage-700)',
                      }}
                    >
                      {row.saving ? 'Guardando…' : 'Guardar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminProducts

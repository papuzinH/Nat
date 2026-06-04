import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import { pb } from '@/lib/pocketbase'
import { compressImage } from '@/lib/imageCompression'
import {
  formatARS,
  normalizeDescription,
  EMPTY_DESCRIPTION,
} from '@/data/products'
import type { ProductSpec, ProductTone } from '@/data/products'
import TipTapEditor from '@/components/admin/blog/TipTapEditor'
import Tooltip from '@/components/admin/shared/Tooltip'
import ConfirmDeleteInline from '@/components/admin/shared/ConfirmDeleteInline'
import AdminCategoriesModal from '@/components/admin/shared/AdminCategoriesModal'
import Tabs from '@/components/admin/shared/Tabs'
import { useToast } from '@/context/ToastContext'
import { useTableFilter } from '@/hooks/useTableFilter'
import { useCategories } from '@/hooks/useCategories'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface VariantRow {
  label: string
  price: number | null  // null = mismo precio que el base
}

interface FrameVariantRow {
  label: string        // coincide con VariantRow.label
  price: number
  image: string | null
  uploading?: boolean
}

interface FrameOptionRow {
  label: string
  image: string | null
  uploading?: boolean
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
  frame_variants: FrameVariantRow[]
  frame_options: FrameOptionRow[]
  on_demand: boolean
  sort_order: number
  isNew?: boolean
  dirty: boolean
  saving: boolean
  confirmDelete: boolean
  [key: string]: unknown
}

// ─── Opciones ─────────────────────────────────────────────────────────────────

const TONE_OPTIONS: { value: ProductTone; label: string }[] = [
  { value: 'a', label: 'A — crema cálido' },
  { value: 'b', label: 'B — verde suave' },
  { value: 'c', label: 'C — arena' },
  { value: 'd', label: 'D — salvia' },
  { value: 'e', label: 'E — lino' },
  { value: 'f', label: 'F — hueso' },
]

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
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const removeImage = (url: string) => onChange(images.filter((u) => u !== url))

  const promoteToMain = (i: number) => {
    if (i === 0) return
    const next = [...images]
    const [moved] = next.splice(i, 1)
    next.unshift(moved)
    onChange(next)
  }

  const handleReorderDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null); setHoverIndex(null); return
    }
    const next = [...images]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(target, 0, moved)
    onChange(next)
    setDragIndex(null); setHoverIndex(null)
  }

  const getClosestIndex = (e: React.DragEvent): number => {
    if (!containerRef.current) return images.length
    const items = Array.from(containerRef.current.children) as HTMLElement[]
    let closest = dragIndex ?? 0
    let closestDist = Infinity
    items.forEach((item, i) => {
      if (i === dragIndex) return
      const rect = item.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    return closest
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Zona drag & drop para upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-8 rounded-sm cursor-pointer transition-colors"
        style={{
          border: `1.5px dashed ${dragOver ? 'var(--sage-700)' : 'var(--line)'}`,
          background: dragOver ? 'var(--cream-200, #ede8e0)' : 'var(--cream-50)',
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

      {/* Previews + drag-to-sort + principal */}
      {images.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft mb-2">
            Arrastrá para reordenar · la primera es la principal en la tienda
          </p>
          <div
            ref={containerRef}
            className="flex flex-wrap gap-3"
            onDragOver={(e) => { e.preventDefault(); if (dragIndex !== null) setHoverIndex(getClosestIndex(e)) }}
            onDrop={(e) => { e.preventDefault(); if (hoverIndex !== null) handleReorderDrop(hoverIndex) }}
          >
            {images.map((url, i) => {
              const isMain = i === 0
              const isHover = hoverIndex === i && dragIndex !== null && dragIndex !== i
              return (
                <div
                  key={url}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragEnd={() => { setDragIndex(null); setHoverIndex(null) }}
                  className={`relative group flex-shrink-0 transition-opacity ${dragIndex === i ? 'opacity-40' : 'opacity-100'}`}
                  style={isHover ? { outline: '2px solid var(--sage-700)', outlineOffset: 2, borderRadius: 4 } : undefined}
                >
                  <img
                    src={url}
                    alt={isMain ? 'Imagen principal' : ''}
                    className="w-20 h-20 object-cover rounded-sm cursor-move"
                    style={{ border: '1px solid var(--line-soft)' }}
                  />
                  {isMain && (
                    <span
                      className="absolute top-1 left-1 font-mono text-[8px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm pointer-events-none"
                      style={{ background: 'var(--sage-700)', color: 'var(--cream-50)' }}
                    >
                      Principal
                    </span>
                  )}
                  {!isMain && (
                    <button
                      type="button"
                      onClick={() => promoteToMain(i)}
                      className="absolute top-1 left-1 font-mono text-[8px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(44,44,44,0.85)', color: '#fdfcfb' }}
                      title="Marcar como principal"
                    >
                      Hacer principal
                    </button>
                  )}
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
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Subida de imagen individual ─────────────────────────────────────────────

const SingleImageField: React.FC<{
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}> = ({ value, onChange, disabled }) => {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    try {
      const optimized = await compressImage(file)
      const url = await uploadToMedia(optimized)
      if (url) onChange(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        disabled={disabled || uploading}
      />
      {value ? (
        <>
          <img
            src={value}
            alt="preview"
            className="w-12 h-12 object-cover rounded-sm border flex-shrink-0"
            style={{ borderColor: 'var(--line)' }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 border rounded-sm transition-colors hover:border-sage-700 hover:text-sage-700"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', cursor: 'pointer' }}
          >
            {uploading ? '…' : 'Cambiar'}
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={uploading}
            className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-[#f5e6e6] transition-colors flex-shrink-0"
            style={{ color: '#a8503f', cursor: 'pointer', border: 'none', background: 'none' }}
            aria-label="Eliminar imagen"
          >
            ×
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 border rounded-sm transition-colors hover:border-sage-700 hover:text-sage-700"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', cursor: 'pointer' }}
        >
          {uploading ? 'Subiendo…' : '+ Subir imagen'}
        </button>
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
  const add = () => onChange([...variants, { label: '', price: null }])
  const remove = (i: number) => onChange(variants.filter((_, idx) => idx !== i))
  const updateLabel = (i: number, value: string) =>
    onChange(variants.map((v, idx) => (idx === i ? { ...v, label: value } : v)))
  const updatePrice = (i: number, value: number | null) =>
    onChange(variants.map((v, idx) => (idx === i ? { ...v, price: value } : v)))

  return (
    <div className="flex flex-col gap-3">
      {variants.length === 0 ? (
        <p className="font-body text-[13px] text-ink-soft italic">
          Sin variantes — el producto tiene un único precio.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_1fr_32px] gap-3 px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Variante</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Precio</span>
            <span />
          </div>

          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-3 items-center">
              <input
                type="text"
                value={v.label}
                placeholder="Ej: A4, Azul, Tela"
                onChange={(e) => updateLabel(i, e.target.value)}
                className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                style={{ borderColor: 'var(--line)' }}
              />
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={v.price === null}
                    onChange={(e) => updatePrice(i, e.target.checked ? null : (basePrice || 0))}
                    className="accent-sage-700"
                  />
                  <span className="font-mono text-[10px] text-ink-soft">
                    {v.price === null ? `Mismo precio (${basePrice ? formatARS(basePrice) : '—'})` : 'Mismo precio'}
                  </span>
                </label>
                {v.price !== null && (
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={v.price}
                    onChange={(e) => updatePrice(i, parseFloat(e.target.value) || 0)}
                    className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                    style={{ borderColor: 'var(--line)' }}
                  />
                )}
              </div>
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
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="self-start font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all hover:border-sage-700 hover:text-sage-700"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
      >
        + Agregar variante
      </button>
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
    has_frame: false, frame_price: 0,
    frame_variants: [], frame_options: [],
    on_demand: false, sort_order: 0,
    isNew: true, dirty: true, saving: false, confirmDelete: false,
  }
}

function rawToRow(p: Record<string, unknown>): ProductRow {
  let variants: VariantRow[] = []
  if (Array.isArray(p.variants)) {
    const basePrice = Number(p.base_price ?? 0)
    variants = (p.variants as Record<string, unknown>[])
      .filter((v) => typeof v === 'object' && v !== null)
      .map((v) => {
        if (typeof v.label === 'string') {
          return { label: v.label, price: v.price as number | null }
        }
        // Formato legacy {size, priceMultiplier}
        const legacyLabel = String(v.size ?? '')
        const multiplier = Number(v.priceMultiplier ?? 1)
        const computedPrice = multiplier === 1 ? null : Math.round(basePrice * multiplier)
        return { label: legacyLabel, price: computedPrice }
      })
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

  // Normalizar frame_variants
  let frameVariants: FrameVariantRow[] = []
  if (Array.isArray(p.frame_variants)) {
    frameVariants = (p.frame_variants as Record<string, unknown>[])
      .filter((v) => typeof v === 'object' && v !== null && typeof v.label === 'string' && v.label)
      .map((v) => ({
        label: String(v.label),
        price: Number(v.price ?? 0),
        image: typeof v.image === 'string' && v.image ? v.image : null,
      }))
  }

  // Normalizar frame_options
  let frameOptions: FrameOptionRow[] = []
  if (Array.isArray(p.frame_options)) {
    frameOptions = (p.frame_options as Record<string, unknown>[])
      .filter((v) => typeof v === 'object' && v !== null && typeof v.label === 'string' && v.label)
      .map((v) => ({
        label: String(v.label),
        image: typeof v.image === 'string' && v.image ? v.image : null,
      }))
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
    frame_variants: frameVariants,
    frame_options: frameOptions,
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

const PRODUCT_TABS = [
  { id: 'basico',    label: 'Básico' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'imagenes',  label: 'Imágenes' },
  { id: 'avanzado',  label: 'Avanzado' },
]

const AdminProducts: React.FC = () => {
  const toast = useToast()
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Record<string, string>>({})
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})
  const [showCatModal, setShowCatModal] = useState(false)

  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories()

  useEffect(() => {
    pb.collection('products')
      .getFullList({ sort: 'sort_order', requestKey: null })
      .then((data) => {
        setRows(data.map((p) => rawToRow(p as Record<string, unknown>)))
        setLoading(false)
      })
      .catch((e) => {
        toast.error('No se pudieron cargar los productos', { detail: e instanceof Error ? e.message : undefined })
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filtros: search, categoría, sin-imágenes
  const { filtered, query, setQuery, filters, setFilter } = useTableFilter(rows, {
    searchFields: ['title', 'slug'],
    customFilter: (row, f) => {
      if (f.category && row.category !== f.category) return false
      if (f.images === 'none' && row.images.length > 0) return false
      // Búsqueda extra por tags
      return true
    },
  })

  const filteredWithTags = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return filtered
    // Si la búsqueda no matcheó título/slug, probamos también con tags
    return filtered.length > 0
      ? filtered
      : rows.filter((r) =>
          r.tags.some((t) => t.toLowerCase().includes(q)) &&
          (!filters.category || r.category === filters.category)
        )
  }, [filtered, rows, query, filters.category])

  const dirtyCount = rows.filter((r) => r.dirty).length

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
      frame_variants: row.frame_variants.length > 0
        ? row.frame_variants.map(({ label, price, image }) => ({ label, price, image }))
        : null,
      frame_options: row.frame_options.length > 0
        ? row.frame_options.map(({ label, image }) => ({ label, image }))
        : null,
      on_demand: row.on_demand,
      sort_order: row.sort_order,
    }

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
        const msg = 'PocketBase no persistió la descripción. Verificá que el campo "description" sea JSON en la colección products.'
        setSaveErrors((prev) => ({ ...prev, [key]: msg }))
        setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, saving: false } : r))
        toast.error('No se guardó la descripción', { detail: msg })
        return
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar'
      setSaveErrors((prev) => ({ ...prev, [key]: msg }))
      setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, saving: false } : r))
      toast.error('No se pudo guardar', { detail: msg })
      return
    }

    setRows((prev) => prev.map((r) => matchRow(r) ? { ...r, dirty: false, saving: false, isNew: false } : r))
    if (row.isNew) setExpanded(row.slug)
    toast.success(row.isNew ? 'Producto creado' : 'Producto actualizado', { detail: row.title })
  }

  const deleteRow = async (slug: string, title: string) => {
    try {
      const record = await pb.collection('products').getFirstListItem(`slug = "${slug}"`)
      await pb.collection('products').delete(record.id)
      setRows((prev) => prev.filter((r) => r.slug !== slug))
      if (expanded === slug) setExpanded(null)
      toast.success('Producto eliminado', { detail: title })
    } catch (e) {
      toast.error('No se pudo eliminar', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const duplicateRow = (row: ProductRow) => {
    if (rows.some((r) => r.isNew)) {
      toast.info('Guardá o descartá el producto nuevo antes de duplicar')
      return
    }

    const baseTitle = row.title.replace(/\s+\(\d+\)$/, '')
    const baseSlug  = row.slug.replace(/-\d+$/, '')

    let n = 2
    while (rows.some((r) => r.slug === `${baseSlug}-${n}` || r.title === `${baseTitle} (${n})`)) {
      n++
    }

    const newRow: ProductRow = {
      ...row,
      slug:          `${baseSlug}-${n}`,
      title:         `${baseTitle} (${n})`,
      tagsInput:     row.tags.join(', '),
      isNew:         true,
      dirty:         true,
      saving:        false,
      confirmDelete: false,
    }

    setRows((prev) => [newRow, ...prev])
    setExpanded('__new__')
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando productos…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-[22px] text-ink font-normal">Productos</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
            {filteredWithTags.length} de {rows.length}
            {dirtyCount > 0 && ` · ${dirtyCount} sin guardar`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCatModal(true)}
            className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-cream-100"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            title="Gestionar categorías"
          >
            Categorías
          </button>
          <button
            type="button"
            onClick={addNew}
            className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
            style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Toolbar filtros */}
      {rows.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5 p-3 rounded-sm" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar título, slug o tag…"
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
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 font-mono text-[11px] text-ink whitespace-nowrap">
            <input
              type="checkbox"
              checked={filters.images === 'none'}
              onChange={(e) => setFilter('images', e.target.checked ? 'none' : '')}
              className="accent-sage-700 w-4 h-4"
            />
            Sin imágenes
          </label>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filteredWithTags.map((row) => {
          const key = getKey(row)
          const isOpen = expanded === key

          return (
            <div
              key={key}
              className="rounded-sm overflow-hidden"
              style={{ border: '1px solid var(--line-soft)' }}
            >
              {/* Fila resumen — incluye thumbnail */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="w-full text-left px-3 md:px-5 py-3 bg-cream-50 hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-sm overflow-hidden bg-cream-100 flex-shrink-0" style={{ border: '1px solid var(--line-soft)' }}>
                    {row.images.length > 0 ? (
                      <img src={row.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-ink-soft">—</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-[14px] text-ink truncate min-w-0">
                        {row.title || <span className="text-ink-soft italic text-[13px]">sin título</span>}
                      </span>
                      {row.dirty && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] flex-shrink-0" style={{ color: '#a87c3f' }}>
                          sin guardar
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.08em] truncate">
                        {row.isNew ? '— nuevo —' : row.slug}
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft hidden sm:inline">
                        · {categories.find((c) => c.slug === row.category)?.label ?? row.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[12px] text-ink flex-shrink-0">
                    {row.base_price ? formatARS(row.base_price) : '—'}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Formulario expandido con tabs */}
              {isOpen && (
                <div
                  className="flex flex-col"
                  style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--cream-100, #f5f0eb)' }}
                >
                  <div className="px-3 md:px-5 pt-2">
                    <Tabs
                      tabs={PRODUCT_TABS}
                      active={activeTab[key] ?? 'basico'}
                      onChange={(id) => setActiveTab((prev) => ({ ...prev, [key]: id }))}
                    />
                  </div>

                  <div className="px-4 md:px-5 py-6 flex flex-col gap-6">
                  {/* TAB · BÁSICO */}
                  {(activeTab[key] ?? 'basico') === 'basico' && (
                    <>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Identificación</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field label={row.isNew ? 'Slug (ID único)' : 'Slug · 🔒 fijo'} tooltip="Identificador permanente del producto en la URL. Solo letras minúsculas, números y guiones. No se puede cambiar una vez creado.">
                            <input
                              type="text"
                              value={row.slug}
                              disabled={!row.isNew}
                              placeholder="helecho-i"
                              onChange={(e) => patch(key, 'slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                              className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
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

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Categoría y precio</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field label="Categoría">
                            <select value={row.category} onChange={(e) => patch(key, 'category', e.target.value)}
                              className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
                              style={{ borderColor: 'var(--line)' }}>
                              {categories.map((c) => (
                                <option key={c.slug} value={c.slug}>{c.label}</option>
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
                          <Field label="Precio base (ARS)" tooltip="Precio del tamaño estándar. Las variantes se calculan con multiplicadores.">
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

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-1 flex items-center">
                          Variantes
                          <Tooltip text="Usá variantes si el producto existe en varias opciones (tamaño, color, material, etc.) con precios iguales o distintos. Dejalo vacío si es una sola versión." />
                        </p>
                        <VariantsEditor
                          variants={row.variants}
                          basePrice={row.base_price}
                          onChange={(v) => patch(key, 'variants', v)}
                        />
                      </div>

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Marco</p>
                        <div className="flex flex-col gap-5">
                          {/* Checkbox */}
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id={`frame-${key}`} checked={row.has_frame}
                              onChange={(e) => patch(key, 'has_frame', e.target.checked)}
                              className="accent-sage-700 w-4 h-4 cursor-pointer" />
                            <label htmlFor={`frame-${key}`} className="font-body text-[13px] text-ink cursor-pointer">
                              Ofrece opción de enmarcado
                            </label>
                          </div>

                          {row.has_frame && (
                            <>
                              {/* Precio base del marco */}
                              <Field label="Precio base del marco (ARS)" tooltip="Se usa cuando no hay precio específico por variante de tamaño.">
                                <input type="number" min={0} value={row.frame_price || ''}
                                  placeholder="12000"
                                  onChange={(e) => patch(key, 'frame_price', parseInt(e.target.value, 10) || 0)}
                                  className={`${inputCls} max-w-[160px]`} style={inputStyle} />
                              </Field>

                              {/* Precio e imagen por variante de tamaño */}
                              {row.variants.length > 0 && (
                                <div>
                                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft mb-3 flex items-center">
                                    Precio e imagen por tamaño
                                    <Tooltip text="Configura precio e imagen del marco para cada variante de tamaño del producto. Sobreescribe el precio base." />
                                  </p>
                                  <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-[100px_120px_1fr] gap-3 px-1">
                                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Tamaño</span>
                                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Precio marco</span>
                                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Imagen enmarcada</span>
                                    </div>
                                    {row.variants.map((variant) => {
                                      const fv = row.frame_variants.find((v) => v.label === variant.label)
                                      const fvPrice = fv?.price ?? row.frame_price
                                      const fvImage = fv?.image ?? null
                                      const updateFv = (field: 'price' | 'image', val: number | string | null) => {
                                        const updated = row.frame_variants.filter((v) => v.label !== variant.label)
                                        updated.push({ label: variant.label, price: field === 'price' ? (val as number) : fvPrice, image: field === 'image' ? (val as string | null) : fvImage })
                                        patch(key, 'frame_variants', updated)
                                      }
                                      return (
                                        <div key={variant.label} className="grid grid-cols-[100px_120px_1fr] gap-3 items-center">
                                          <span className="font-body text-[13px] text-ink">{variant.label}</span>
                                          <input
                                            type="number" min={0} step={100}
                                            value={fvPrice || ''}
                                            placeholder={String(row.frame_price || '')}
                                            onChange={(e) => updateFv('price', parseInt(e.target.value, 10) || 0)}
                                            className={inputCls} style={inputStyle}
                                          />
                                          <SingleImageField
                                            value={fvImage}
                                            onChange={(url) => updateFv('image', url)}
                                          />
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Opciones del marco (color, estilo, etc.) */}
                              <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft mb-3 flex items-center">
                                  Opciones del marco
                                  <Tooltip text="Variantes del marco como color o estilo. No afectan el precio. Cada opción puede tener su propia imagen de previsualización." />
                                </p>
                                <div className="flex flex-col gap-3">
                                  {row.frame_options.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                      <div className="grid grid-cols-[1fr_140px_32px] gap-3 px-1">
                                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Etiqueta</span>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Imagen</span>
                                        <span />
                                      </div>
                                      {row.frame_options.map((opt, idx) => (
                                        <div key={idx} className="grid grid-cols-[1fr_140px_32px] gap-3 items-center">
                                          <input
                                            type="text"
                                            value={opt.label}
                                            placeholder="Negro, Madera, Blanco…"
                                            onChange={(e) => {
                                              const updated = row.frame_options.map((o, i) => i === idx ? { ...o, label: e.target.value } : o)
                                              patch(key, 'frame_options', updated)
                                            }}
                                            className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1 transition-colors"
                                            style={{ borderColor: 'var(--line)' }}
                                          />
                                          <SingleImageField
                                            value={opt.image}
                                            onChange={(url) => {
                                              const updated = row.frame_options.map((o, i) => i === idx ? { ...o, image: url } : o)
                                              patch(key, 'frame_options', updated)
                                            }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => patch(key, 'frame_options', row.frame_options.filter((_, i) => i !== idx))}
                                            className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#f5e6e6] transition-colors"
                                            style={{ color: '#a8503f', cursor: 'pointer', border: 'none', background: 'none' }}
                                            aria-label="Eliminar opción"
                                          >×</button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => patch(key, 'frame_options', [...row.frame_options, { label: '', image: null }])}
                                    className="self-start font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all hover:border-sage-700 hover:text-sage-700"
                                    style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', cursor: 'pointer' }}
                                  >
                                    + Agregar opción
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB · CONTENIDO */}
                  {activeTab[key] === 'contenido' && (
                    <>
                      <Field
                        label="Descripción"
                        tooltip="Texto rico con formato que aparece en la ficha del producto."
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
                          <Tooltip text="Pares nombre/valor que aparecen en la tabla de detalles. Ej: Técnica, Edición, Origen, Cuidados." />
                        </p>
                        <SpecsEditor
                          specs={row.specs}
                          onChange={(s) => patch(key, 'specs', s)}
                        />
                      </div>

                      <Field label="Tags" tooltip="Palabras clave separadas por coma. Ej: botanica, tinta, papel, serie-2025.">
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
                    </>
                  )}

                  {/* TAB · IMÁGENES */}
                  {activeTab[key] === 'imagenes' && (
                    <ImageUploader
                      slug={row.slug}
                      images={row.images}
                      onChange={(urls) => patch(key, 'images', urls)}
                    />
                  )}

                  {/* TAB · AVANZADO */}
                  {activeTab[key] === 'avanzado' && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-4">Opciones avanzadas</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field label="Tono placeholder" tooltip="Color del fondo de espera mientras carga la imagen.">
                          <select value={row.tone} onChange={(e) => patch(key, 'tone', e.target.value)}
                            className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
                            style={{ borderColor: 'var(--line)' }}>
                            {TONE_OPTIONS.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Proporción imagen" tooltip="1.3 = vertical · 1 = cuadrado · 0.9 = horizontal.">
                          <input type="number" step="0.05" min={0.5} max={2.5}
                            value={row.tall}
                            onChange={(e) => patch(key, 'tall', parseFloat(e.target.value) || 1.3)}
                            className={inputCls} style={inputStyle} />
                        </Field>
                        <Field label="Orden en tienda" tooltip="Menor número = aparece primero. Usá múltiplos de 10.">
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
                            <Tooltip text="Marcá esto si el producto no está físicamente disponible pero se puede encargar." />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {saveErrors[key] && (
                    <p className="font-mono text-[11px]" style={{ color: '#a8503f' }}>{saveErrors[key]}</p>
                  )}
                  </div>

                  {/* Action bar sticky bottom */}
                  <div
                    className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 px-4 md:px-5 py-3 z-10"
                    style={{ background: 'var(--cream-100, #f5f0eb)', borderTop: '1px solid var(--line-soft)' }}
                  >
                    <div className="flex items-center gap-3">
                      {!row.isNew && (
                        <>
                          <ConfirmDeleteInline onConfirm={() => deleteRow(row.slug, row.title)} />
                          <button
                            type="button"
                            onClick={() => duplicateRow(row)}
                            className="font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:underline"
                            style={{ color: 'var(--ink-soft)' }}
                          >
                            Duplicar
                          </button>
                        </>
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

      <AdminCategoriesModal
        open={showCatModal}
        onClose={() => setShowCatModal(false)}
        categories={categories}
        onCreateCategory={createCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  )
}

export default AdminProducts

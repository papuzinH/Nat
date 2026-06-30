# SPEC 2 — Imágenes de galerías por PocketBase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer editables desde el admin (PocketBase) las imágenes artísticas que hoy son placeholders hardcodeados (carrusel del home, teaser de tatuajes, masonry del estudio, "El espacio").

**Architecture:** Una colección `site_images` (con campo `section`) leída por fetchers server con ISR y pasada como props a los componentes client; un admin "Galerías" para subir/ordenar/editar (alt, caption, punto focal, activo) con revalidación on-demand.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 3.4, PocketBase SDK 0.26, GSAP, `next/image`.

## Global Constraints

- **No hay test harness en el proyecto.** Verificación de cada tarea: `rtk next build` + `rtk lint` + chequeo visual. **No** escribir tests ni introducir un framework.
- **Comandos:** prefijar con `rtk` (si `rtk` no está, usar `npx next build` / `npx eslint .`).
- **Regla de animaciones:** contenido visible por defecto; nunca `opacity:0` inline; animaciones solo si `shouldAnimate()`.
- **Colección `site_images` (PocketBase) — secciones exactas:** `home_hero`, `home_teaser`, `estudio_tattoos`, `estudio_espacio`.
- **Read público obligatorio** en `site_images` (List/View con regla vacía), o el front anónimo ve vacío.
- **Punto focal NO destructivo:** se guardan `focal_x`/`focal_y` (0–100, default 50) y el front usa `object-cover` + `object-position`. No se recorta el archivo.
- **Comportamiento con galería vacía:** `home_hero` → placeholders actuales; `home_teaser` → sección oculta; `estudio_espacio` → oculta; `estudio_tattoos` → se mantiene la cajita "Mi portfolio completo", el grid aparece con imágenes.
- **Rama:** crear una rama de feature al ejecutar (ej. `spec2-imagenes-galerias`); commits frecuentes por tarea.

---

## Task 1: Capa de datos (fetcher + mapper + tag de revalidación)

**Files:**
- (Manual, PocketBase) Colección `site_images`
- Create: `src/lib/data/site-images.ts`
- Create: `src/lib/data/site-images-mappers.ts`
- Modify: `app/api/revalidate/route.ts:14`
- Modify: `src/lib/revalidate-client.ts:6`

**Interfaces:**
- Produces: `SiteImageSection` (union), `SiteImage` (`{ id, url, alt, caption, focalX, focalY }`), `SITE_IMAGES_TAG = 'site_images'`, `getSiteImages(section): Promise<SiteImage[]>`, `rowToSiteImage(row)`.

- [ ] **Step 0: Crear la colección `site_images` en PocketBase (prerequisito manual)**

En `https://nat.lhstudio.com.ar/_/`, crear colección **base** `site_images` con campos:
- `section` — Select (single), required, valores: `home_hero`, `home_teaser`, `estudio_tattoos`, `estudio_espacio`.
- `image` — File (single), required, mime types de imagen.
- `alt` — Plain text, required.
- `caption` — Plain text, opcional.
- `sort_order` — Number, default 0.
- `focal_x` — Number, default 50.
- `focal_y` — Number, default 50.
- `active` — Bool, default true.

**API Rules:** List/Search y View = **regla vacía (pública)**; Create/Update/Delete = solo superuser (igual que `product_categories`).

> Si no se crea, el resto compila y el sitio degrada a "vacío" (el fetcher captura el error). La verificación visual completa requiere la colección creada.

- [ ] **Step 1: Crear el mapper**

Crear `src/lib/data/site-images-mappers.ts`:

```ts
import { pbFileUrl } from '@/lib/pocketbase-server'
import type { SiteImage } from './site-images'

/** Mapea un record REST de site_images al tipo público SiteImage. */
export function rowToSiteImage(row: Record<string, any>): SiteImage {
  return {
    id: row.id as string,
    url: pbFileUrl(row.collectionId as string, row.id as string, row.image as string),
    alt: (row.alt as string) ?? '',
    caption: (row.caption as string) ?? '',
    focalX: typeof row.focal_x === 'number' ? row.focal_x : 50,
    focalY: typeof row.focal_y === 'number' ? row.focal_y : 50,
  }
}
```

- [ ] **Step 2: Crear el fetcher**

Crear `src/lib/data/site-images.ts`:

```ts
import 'server-only'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { rowToSiteImage } from './site-images-mappers'

// Tag de cache para revalidación on-demand desde el admin (/api/revalidate).
export const SITE_IMAGES_TAG = 'site_images'

export type SiteImageSection =
  | 'home_hero'
  | 'home_teaser'
  | 'estudio_tattoos'
  | 'estudio_espacio'

export interface SiteImage {
  id: string
  url: string
  alt: string
  caption: string
  focalX: number
  focalY: number
}

/**
 * Imágenes activas de una sección, ordenadas por sort_order, cacheadas con ISR.
 * Devuelve [] si la colección no existe todavía o el fetch falla (degradación).
 */
export async function getSiteImages(section: SiteImageSection): Promise<SiteImage[]> {
  try {
    const rows = await pbGetFullList<Record<string, any>>(
      'site_images',
      { filter: `section="${section}" && active=true`, sort: 'sort_order' },
      { tags: [SITE_IMAGES_TAG] },
    )
    return rows.map(rowToSiteImage)
  } catch {
    return []
  }
}
```

- [ ] **Step 3: Permitir el tag en `/api/revalidate`**

En `app/api/revalidate/route.ts:14`:

```ts
// Antes
const ALLOWED_TAGS = new Set(['products', 'blog_posts'])
// Después
const ALLOWED_TAGS = new Set(['products', 'blog_posts', 'site_images'])
```

- [ ] **Step 4: Extender el tipo de `triggerRevalidate`**

En `src/lib/revalidate-client.ts:6`:

```ts
// Antes
export async function triggerRevalidate(tag: 'products' | 'blog_posts'): Promise<void> {
// Después
export async function triggerRevalidate(tag: 'products' | 'blog_posts' | 'site_images'): Promise<void> {
```

- [ ] **Step 5: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: 0 errores nuevos.

- [ ] **Step 6: Commit**

```bash
rtk git add src/lib/data/site-images.ts src/lib/data/site-images-mappers.ts app/api/revalidate/route.ts src/lib/revalidate-client.ts
rtk git commit -m "feat(site-images): fetcher server + mapper + tag de revalidacion"
```

---

## Task 2: Admin "Galerías" (pantalla completa + nav)

**Files:**
- Modify: `app/admin/(panel)/layout.tsx:9-16` (NAV_ITEMS)
- Create: `app/admin/(panel)/galerias/page.tsx`
- Create: `src/screens/admin/AdminImages.tsx`

**Interfaces:**
- Consumes: `SiteImageSection` de `@/lib/data/site-images`; `triggerRevalidate('site_images')`; `compressImage`; `pb` (browser); shared admin `ConfirmDeleteInline`, `useToast`.
- Produces: pantalla CRUD de `site_images` por sección.

- [ ] **Step 1: Agregar "Galerías" al nav del admin**

En `app/admin/(panel)/layout.tsx`, en `NAV_ITEMS` (después de Productos):

```tsx
const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard', end: true },
  { to: '/admin/ordenes',   label: 'Órdenes' },
  { to: '/admin/stock',     label: 'Stock' },
  { to: '/admin/envios',    label: 'Envíos' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/galerias',  label: 'Galerías' },
  { to: '/admin/blog',      label: 'Blog' },
]
```

- [ ] **Step 2: Crear el shell de la ruta**

Crear `app/admin/(panel)/galerias/page.tsx`:

```tsx
import AdminImages from '@/screens/admin/AdminImages'

export default function GaleriasPage() {
  return <AdminImages />
}
```

- [ ] **Step 3: Crear `AdminImages.tsx` (scaffold: carga + pestañas + lista)**

Crear `src/screens/admin/AdminImages.tsx`:

```tsx
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

function fileUrl(record: Record<string, any>): string {
  return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.image}`
}

function rawToAdminImage(r: Record<string, any>): AdminImage {
  return {
    id: r.id,
    section: r.section,
    url: fileUrl(r),
    alt: r.alt ?? '',
    caption: r.caption ?? '',
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
        setRows((prev) => [...prev, rawToAdminImage(rec)])
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
```

- [ ] **Step 4: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: 0 errores nuevos.

- [ ] **Step 5: Verificación visual (admin)**

En `/admin/galerias`: aparece "Galerías" en el nav; las 4 pestañas; subir una imagen de prueba (si la colección existe) la agrega a la sección activa, se ve la miniatura; "Ocultar/Mostrar" cambia opacidad; eliminar la quita. (Si la colección PB no existe aún, la pantalla carga vacía sin romper.)

- [ ] **Step 6: Commit**

```bash
rtk git add "app/admin/(panel)/layout.tsx" "app/admin/(panel)/galerias/page.tsx" src/screens/admin/AdminImages.tsx
rtk git commit -m "feat(admin): pantalla Galerias con tabs, subida, ocultar y eliminar"
```

---

## Task 3: Admin Galerías — reordenar, editar alt/caption y punto focal

**Files:**
- Modify: `src/screens/admin/AdminImages.tsx`

**Interfaces:**
- Consumes: el `AdminImages` de la Task 2.
- Produces: drag-reorder por sección, edición inline de alt/caption, picker de punto focal por click.

- [ ] **Step 1: Agregar estado de drag, edición y handlers**

Dentro del componente `AdminImages`, agregar tras los estados existentes:

```tsx
  // Drag reorder (dentro de la sección activa)
  const [dragId, setDragId] = useState<string | null>(null)
  // Edición inline de alt/caption
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ alt: string; caption: string }>({ alt: '', caption: '' })

  const persist = async (id: string, data: Record<string, unknown>) => {
    await pb.collection('site_images').update(id, data)
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...mapPatch(data) } : r)))
    triggerRevalidate('site_images')
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
    setRows((prev) => prev.map((r) => {
      const u = updates.find((x) => x.id === r.id)
      return u ? { ...r, sortOrder: u.sort_order } : r
    }))
    try {
      await Promise.all(
        updates
          .filter((u) => sectionRows.find((r) => r.id === u.id)?.sortOrder !== u.sort_order)
          .map((u) => pb.collection('site_images').update(u.id, { sort_order: u.sort_order }))
      )
      triggerRevalidate('site_images')
    } catch {
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
```

- [ ] **Step 2: Reemplazar el render de cada card por la versión con drag, foco y edición**

Reemplazar el bloque `{sectionRows.map((img) => ( ... ))}` (la card de la Task 2) por:

```tsx
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
```

Y agregar, encima del grid, una ayuda de reordenado (cuando hay ≥2):

```tsx
      {sectionRows.length > 1 && (
        <p className="font-mono text-[10px] text-ink-soft mb-2">Arrastrá para reordenar · click en la imagen para fijar el punto focal</p>
      )}
```

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: 0 errores nuevos.

- [ ] **Step 4: Verificación visual (admin)**

En `/admin/galerias` (con la colección creada): arrastrar reordena y persiste; click en una imagen mueve el punto focal (el puntito sage) y se guarda; "Editar" permite cambiar alt/caption; todo dispara revalidación.

- [ ] **Step 5: Commit**

```bash
rtk git add src/screens/admin/AdminImages.tsx
rtk git commit -m "feat(admin): galerias con reordenar, editar alt/caption y punto focal"
```

---

## Task 4: Home — hero y teaser desde site_images

**Files:**
- Modify: `src/components/home/HomeHeroSection.tsx`
- Modify: `src/components/home/TattooTeaserSection.tsx`
- Modify: `app/(home)/page.tsx`

**Interfaces:**
- Consumes: `getSiteImages`, `SiteImage` de `@/lib/data/site-images`.
- Produces: `HomeHeroSection` y `TattooTeaserSection` que aceptan `images: SiteImage[]`.

- [ ] **Step 1: `HomeHeroSection` acepta `images` y renderiza reales o placeholders**

En `src/components/home/HomeHeroSection.tsx`:

1. Imports (arriba):

```tsx
import Image from 'next/image'
import type { SiteImage } from '@/lib/data/site-images'
```

2. Renombrar la constante `SLIDES` existente a `PLACEHOLDER_SLIDES` (solo el nombre; el array queda igual). Actualizar sus usos internos (ver paso 3).

3. Definir un modelo unificado y derivar las slides desde props. Cambiar la firma del componente y agregar al inicio del cuerpo:

```tsx
type HeroSlide =
  | { kind: 'image'; url: string; alt: string; caption: string; focalX: number; focalY: number }
  | { kind: 'placeholder'; label: string; tone: string }

const HomeHeroSection: React.FC<{ images?: SiteImage[] }> = ({ images = [] }) => {
  const slides: HeroSlide[] = images.length > 0
    ? images.map((img) => ({ kind: 'image', url: img.url, alt: img.alt, caption: img.caption, focalX: img.focalX, focalY: img.focalY }))
    : PLACEHOLDER_SLIDES.map((s) => ({ kind: 'placeholder', label: s.label, tone: s.tone }))
  // ...resto del cuerpo existente, reemplazando TODA referencia a `SLIDES` por `slides`
```

4. Reemplazar **todas** las referencias internas a `SLIDES` por `slides` (en `MobileTouchCarousel` pasarlas como prop o moverlas al scope del componente: lo más simple es pasar `slides` como prop a `MobileTouchCarousel`). Reemplazar el componente `Slide` y el render de cada slide por una versión que distingue `kind`:

```tsx
const SlideMedia: React.FC<{ slide: HeroSlide; priority?: boolean }> = ({ slide, priority }) => {
  if (slide.kind === 'image') {
    return (
      <Image
        src={slide.url}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="(max-width: 767px) 100vw, 55vw"
        className="object-cover"
        style={{ objectPosition: `${slide.focalX}% ${slide.focalY}%` }}
      />
    )
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: TONE_COLORS[slide.tone] ?? '#ece2d1' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)' }} />
      <span className="relative font-mono text-[10px] uppercase tracking-[0.1em] text-center px-3 py-1 rounded-sm" style={{ color: 'var(--ink-soft, #5a5350)', background: 'rgba(253,252,251,0.85)' }}>
        {slide.label}
      </span>
    </div>
  )
}
```

Usar `<SlideMedia slide={slide} priority={i === 0} />` dentro del contenedor de cada slide (desktop y mobile). El contador, dots, flechas y crossfade siguen leyendo `slides.length` y `currentSlide` igual que antes (sin cambios de lógica).

> Nota: el caption del slide (`slide.caption`) puede mostrarse opcionalmente como la etiqueta inferior que hoy existe; si la imagen no trae caption, no se muestra etiqueta.

- [ ] **Step 2: `TattooTeaserSection` acepta `images` (primeras 3)**

En `src/components/home/TattooTeaserSection.tsx`:

1. Imports: `import Image from 'next/image'` y `import type { SiteImage } from '@/lib/data/site-images'`.
2. Firma: `const TattooTeaserSection: React.FC<{ images?: SiteImage[] }> = ({ images = [] }) => {`.
3. Tomar las 3 primeras: `const mosaic = images.slice(0, 3)`.
4. En las 3 `teaser-card` del mosaico, renderizar la imagen real correspondiente cuando exista (`mosaic[0]`, `[1]`, `[2]`), con `next/image fill` + `object-cover` + `style={{ objectPosition: \`${img.focalX}% ${img.focalY}%\` }}`. Si en una card no hay imagen (menos de 3), mantener el fondo de degradado actual de esa card. (Las etiquetas ya fueron removidas en SPEC 1.)

Ejemplo para la primera card (replicar el patrón en las tres, con su índice):

```tsx
{mosaic[0] ? (
  <Image src={mosaic[0].url} alt={mosaic[0].alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" style={{ objectPosition: `${mosaic[0].focalX}% ${mosaic[0].focalY}%` }} />
) : (
  <div className="teaser-card-bg absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)' }} />
)}
```

(El contenedor de cada card ya es `relative` con aspect ratio fijo, así que `fill` funciona.)

- [ ] **Step 3: Cablear el home page (async + fetch + props + teaser condicional)**

En `app/(home)/page.tsx`:

```tsx
import { getSiteImages } from '@/lib/data/site-images'
// ...imports existentes...

export default async function HomePage() {
  const [heroImages, teaserImages] = await Promise.all([
    getSiteImages('home_hero'),
    getSiteImages('home_teaser'),
  ])
  return (
    <>
      <JsonLd data={homeSchema} />
      <HomeHeroSection images={heroImages} />
      <NHDivider label="Tienda" />
      <FeaturedProductsSection />
      {teaserImages.length > 0 && (
        <>
          <NHDivider label="Arte en la piel" />
          <TattooTeaserSection images={teaserImages} />
        </>
      )}
      <QuoteStripSection />
    </>
  )
}
```

(El divider "Arte en la piel" se oculta junto con el teaser cuando está vacío.)

- [ ] **Step 4: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: 0 errores nuevos.

- [ ] **Step 5: Verificación visual (home)**

Sin imágenes cargadas: el hero muestra los placeholders actuales y la sección teaser **no aparece**. Con imágenes (subidas en `/admin/galerias`): el hero muestra las imágenes reales (primera con prioridad) y el teaser aparece con hasta 3 imágenes. El punto focal se respeta.

- [ ] **Step 6: Commit**

```bash
rtk git add src/components/home/HomeHeroSection.tsx src/components/home/TattooTeaserSection.tsx "app/(home)/page.tsx"
rtk git commit -m "feat(home): hero y teaser de tatuajes desde site_images (con fallback)"
```

---

## Task 5: Estudio — galería de tatuajes (masonry)

**Files:**
- Modify: `src/components/estudio/MasonryGallery.tsx`
- Modify: `app/(site)/estudio/page.tsx`

**Interfaces:**
- Consumes: `getSiteImages`, `SiteImage`.
- Produces: `MasonryGallery` que acepta `images: SiteImage[]`.

- [ ] **Step 1: `MasonryGallery` renderiza imágenes reales; cajita de portfolio siempre**

En `src/components/estudio/MasonryGallery.tsx`:

1. Imports: agregar `import type { SiteImage } from '@/lib/data/site-images'`. (Ya importa `Image` de `next/image`.)
2. Firma: `const MasonryGallery: React.FC<{ images?: SiteImage[] }> = ({ images = [] }) => {`.
3. Reemplazar el `.map(TATTOO_CARDS)` por `.map(images)`: cada imagen se renderiza con `next/image fill` + `object-cover` + `objectPosition` del foco, dentro de un contenedor `relative` con `aspect-ratio` (usar un ratio fijo, p.ej. derivar alturas variadas con un patrón estable por índice, o aspect `1 / 1.3`). Quitar la dependencia de render de `TATTOO_CARDS`/`TONE_BG` para datos reales.
4. **Mantener siempre** la cajita "Mi portfolio completo" (el bloque `.masonry-card` central con el CTA a Instagram), tanto con imágenes como sin ellas. Cuando `images.length === 0`, renderizar solo esa cajita centrada (sin grid detrás): envolver el grid en `{images.length > 0 && ( ...grid... )}` y dejar la cajita fuera de esa condición.

Ejemplo del item del grid:

```tsx
{images.map((img, i) => (
  <div key={img.id} className="masonry-card relative break-inside-avoid mb-3 md:mb-4 rounded-[4px] overflow-hidden hover:-translate-y-0.5 hover:scale-[1.015] transition-transform duration-[260ms] ease-out" style={{ willChange: 'transform' }}>
    <div className="relative w-full" style={{ aspectRatio: i % 3 === 0 ? '1 / 1.35' : '1 / 1' }}>
      <Image src={img.url} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" style={{ objectPosition: `${img.focalX}% ${img.focalY}%` }} />
    </div>
  </div>
))}
```

- [ ] **Step 2: Cablear el estudio page (async + fetch tattoos)**

En `app/(site)/estudio/page.tsx`, convertir a async y pasar las imágenes a `MasonryGallery`:

```tsx
import { getSiteImages } from '@/lib/data/site-images'
// ...
export default async function EstudioPage() {
  const tattooImages = await getSiteImages('estudio_tattoos')
  return (
    <div className="min-h-screen bg-cream-100">
      <JsonLd data={estudioSchema} />
      <EstudioHero />
      <MasonryGallery images={tattooImages} />
      <NHDivider label="el proceso" />
      <ProcessSteps />
      <NHDivider label="contacto" />
      <ContactEstudioSection />
    </div>
  )
}
```

(La sección "El espacio" sigue deshabilitada en esta tarea; se reactiva en la Task 6.)

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: 0 errores nuevos.

- [ ] **Step 4: Verificación visual (estudio)**

Sin imágenes en `estudio_tattoos`: `/estudio` muestra solo la cajita "Mi portfolio completo" (sin grid). Con imágenes: el masonry muestra las imágenes reales y la cajita sigue presente.

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/estudio/MasonryGallery.tsx "app/(site)/estudio/page.tsx"
rtk git commit -m "feat(estudio): masonry de tatuajes desde site_images (cajita portfolio siempre)"
```

---

## Task 6: Estudio — "El espacio" (re-habilitar condicional)

**Files:**
- Modify: `src/components/estudio/StudioPhotosGallery.tsx`
- Modify: `app/(site)/estudio/page.tsx`

**Interfaces:**
- Consumes: `getSiteImages`, `SiteImage`.
- Produces: `StudioPhotosGallery` que acepta `images: SiteImage[]`.

- [ ] **Step 1: `StudioPhotosGallery` usa imágenes reales**

En `src/components/estudio/StudioPhotosGallery.tsx`:

1. Imports: `import type { SiteImage } from '@/lib/data/site-images'`.
2. Firma: `const StudioPhotosGallery: React.FC<{ images?: SiteImage[] }> = ({ images = [] }) => {`.
3. Reemplazar el `STUDIO_PHOTOS`/`TONE_PLACEHOLDERS`: construir las slides desde `images` (`src=img.url`, `alt=img.alt`, con `object-position` del foco). El `Lightbox` (ya importado) usa `images.map((p) => ({ src: p.url }))`. Eliminar el estado de placeholders "Pronto" y `hasPhotos` (ahora siempre hay fotos cuando el componente se renderiza, porque la página lo condiciona).
4. Cada `<img>` del carrusel: `style={{ objectPosition: \`${img.focalX}% ${img.focalY}%\` }}` con `object-cover`.

- [ ] **Step 2: Re-habilitar la sección en el estudio page (condicional)**

En `app/(site)/estudio/page.tsx`, importar el componente de nuevo y fetchear la sección; renderizar el divider + galería **solo si hay imágenes**:

```tsx
import StudioPhotosGallery from '@/components/estudio/StudioPhotosGallery'
import { getSiteImages } from '@/lib/data/site-images'
// ...
export default async function EstudioPage() {
  const [tattooImages, espacioImages] = await Promise.all([
    getSiteImages('estudio_tattoos'),
    getSiteImages('estudio_espacio'),
  ])
  return (
    <div className="min-h-screen bg-cream-100">
      <JsonLd data={estudioSchema} />
      <EstudioHero />
      {espacioImages.length > 0 && (
        <>
          <NHDivider label="el espacio" />
          <StudioPhotosGallery images={espacioImages} />
        </>
      )}
      <MasonryGallery images={tattooImages} />
      <NHDivider label="el proceso" />
      <ProcessSteps />
      <NHDivider label="contacto" />
      <ContactEstudioSection />
    </div>
  )
}
```

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: 0 errores nuevos.

- [ ] **Step 4: Verificación visual (estudio)**

Sin imágenes en `estudio_espacio`: la sección "El espacio" **no aparece** (estado actual). Con imágenes: aparece el divider "el espacio" + el carrusel con lightbox, respetando el punto focal.

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/estudio/StudioPhotosGallery.tsx "app/(site)/estudio/page.tsx"
rtk git commit -m "feat(estudio): re-habilitar El espacio desde site_images (condicional)"
```

---

## Self-Review (completado al escribir el plan)

**Cobertura del spec:**
- §1 Modelo `site_images` → Task 1 Step 0 (manual) + tipos en Task 1.
- §2 Capa server (`getSiteImages`, mapper, tag) → Task 1.
- §3 Cableado por página → Task 4 (home), Tasks 5–6 (estudio).
- §4 Cambios por componente → Hero/Teaser (Task 4), Masonry (Task 5), StudioPhotos (Task 6); fallback/auto-ocultar cubiertos.
- §5 Admin "Galerías" (tabs, upload, reorder, alt/caption, focal, active/delete, revalidate, nav) → Tasks 2–3.
- §6 Revalidación (tag site_images) → Task 1 Steps 3–4.
- §7 Errores/estados (fetch tolerante, animaciones) → Task 1 Step 2 (try/catch), Global Constraints.
- §8 Verificación → pasos de verificación visual por tarea + Global Constraints (build/lint).
- §9 Fuera de alcance → respetado (sin precarga, sin tocar productos/blog, punto focal no destructivo).

**Placeholders:** sin TBD/TODO de plan; código completo en cada paso. (El "404" en el catch del admin es una verificación de error real, no un placeholder.)

**Consistencia de tipos:** `SiteImage` (`url/alt/caption/focalX/focalY`) y `SiteImageSection` usados igual en fetcher (Task 1) y consumidores (Tasks 4–6). El admin usa `AdminImage` (snake↔camel vía `rawToAdminImage`/`mapPatch`) — consistente dentro de Tasks 2–3. `triggerRevalidate('site_images')` coincide con la union extendida (Task 1 Step 4) y el tag permitido (Step 3). Secciones (`home_hero`/`home_teaser`/`estudio_tattoos`/`estudio_espacio`) idénticas entre Step 0, fetcher y admin `SECTIONS`.

**Riesgos:**
- Task 1 Step 0 (colección PB) es manual; sin ella todo compila pero el front degrada a vacío y el admin carga sin filas.
- Task 4 (Hero) es el cambio más invasivo (componente con carrusel + animación): renombrar `SLIDES`→`PLACEHOLDER_SLIDES` y enrutar todo por `slides`/`SlideMedia` sin romper la lógica de crossfade ni introducir `opacity:0` que viole la regla de animaciones.

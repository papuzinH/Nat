import type { JSONContent } from '@tiptap/core'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ProductTone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

export type ProductCategory = string

export type ProductStatus = 'active' | 'coming-soon' | 'out-of-stock'

export interface ProductVariant {
  label: string       // libre: 'A4', 'Azul marino', 'Tela', etc.
  price: number | null // null = usa el basePrice del producto
}

export interface FrameVariant {
  label: string        // coincide con ProductVariant.label ('A4', 'A3', etc.)
  price: number        // precio del marco para este tamaño específico
  image: string | null // URL de imagen del producto enmarcado en este tamaño
}

export interface FrameOption {
  label: string        // 'Negro', 'Madera natural', 'Blanco', etc.
  image: string | null // imagen del producto con ese color de marco
}

export interface ProductSpec {
  label: string            // 'Técnica', 'Edición', 'Origen', etc.
  value: string            // 'Impresión giclée sobre papel Hahnemühle 308g'
}

export interface Product {
  slug: string
  title: string
  category: ProductCategory
  catLabel: string         // 'Lámina — Giclée', 'Cerámica — Gres esmaltado', etc.
  basePrice: number        // en ARS, precio del tamaño base (A4 o unidad)
  size: string             // descripción de medidas: 'A4 · 21×29,7 cm', '∅ 14 cm', etc.
  tone: ProductTone
  tall: number             // aspect ratio tall para placeholder: 1.3 = 1:1.3
  description: JSONContent // contenido rico TipTap (párrafos, listas, formato)
  specs: ProductSpec[]     // características dinámicas: [{label,value}, …]
  images: string[]         // paths a imágenes reales (vacío → placeholder)
  tags: string[]
  variants: ProductVariant[] | null
  hasFrame: boolean
  framePrice: number       // precio del addon de marco en ARS (fallback cuando no hay frame_variants)
  frameVariants: FrameVariant[] | null  // precio e imagen del marco por tamaño
  frameOptions: FrameOption[] | null    // opciones del marco (ej. color) con imagen opcional
  onDemand: boolean
  status: ProductStatus
  stock?: number | null    // de product_stock (null = ilimitado)
  createdAt?: string | null
  /** @deprecated Reemplazado por specs[]. Conservado solo para lectura de datos legacy. */
  medium?: string
  /** @deprecated Reemplazado por specs[]. Conservado solo para lectura de datos legacy. */
  edition?: string
}

export interface ProductCategoryMeta {
  slug: string
  label: string
}

// ─── Tokens de color por tono ────────────────────────────────────────────────
// Nota: el catálogo completo (PRODUCTS) ahora vive en Supabase (nat_ecommerce.products).
// Usar el hook useProducts() para acceder a productos en tiempo real.

export const TONE_COLORS: Record<ProductTone, string> = {
  a: '#ece2d1',
  b: '#dde2d1',
  c: '#e5d9c7',
  d: '#d5ddcf',
  e: '#e8dfd0',
  f: '#dfdfd1',
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  { slug: 'todos',       label: 'Todos' },
  { slug: 'laminas',     label: 'Láminas' },
  { slug: 'ceramica',    label: 'Cerámica' },
  { slug: 'acuarela',    label: 'Acuarelas' },
  { slug: 'gouache',     label: 'Gouache' },
  { slug: 'textil',      label: 'Textiles' },
  { slug: 'ilustracion', label: 'Ilustraciones' },
  { slug: 'mixta',       label: 'Técnica mixta' },
  { slug: 'stickers',    label: 'Stickers' },
  { slug: 'mandalas',    label: 'Mandalas' },
  { slug: 'abanicos',    label: 'Abanicos' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Precio del marco según el tamaño elegido. Fallback a framePrice si no hay variante específica. */
export function getFramePrice(product: Product, size: string | null): number {
  if (product.frameVariants && size) {
    const fv = product.frameVariants.find((v) => v.label === size)
    if (fv) return fv.price
  }
  return product.framePrice
}

/**
 * Imagen que muestra el producto enmarcado.
 * Prioridad: imagen del color seleccionado → imagen del tamaño seleccionado → null.
 */
export function getFrameImage(
  product: Product,
  size: string | null,
  color: string | null
): string | null {
  if (color && product.frameOptions) {
    const opt = product.frameOptions.find((o) => o.label === color)
    if (opt?.image) return opt.image
  }
  if (size && product.frameVariants) {
    const fv = product.frameVariants.find((v) => v.label === size)
    if (fv?.image) return fv.image
  }
  return null
}

export function getVariantPrice(product: Product, label: string | null): number {
  if (!product.variants || !label) return product.basePrice
  const variant = product.variants.find((v) => v.label === label)
  if (!variant) return product.basePrice
  return variant.price ?? product.basePrice
}

export function formatARS(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}

// ─── Descripción rica (TipTap JSONContent) ───────────────────────────────────

export const EMPTY_DESCRIPTION: JSONContent = { type: 'doc', content: [] }

/**
 * Normaliza la descripción que viene de PocketBase: puede ser
 * un objeto JSONContent (nuevo), un string JSON serializado, o un
 * string plano (legacy). Devuelve siempre un JSONContent válido.
 */
export function normalizeDescription(raw: unknown): JSONContent {
  if (!raw) return EMPTY_DESCRIPTION
  if (typeof raw === 'object') return raw as JSONContent
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return EMPTY_DESCRIPTION
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed && typeof parsed === 'object') return parsed as JSONContent
      } catch { /* cae al wrap como texto plano */ }
    }
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: trimmed }] }],
    }
  }
  return EMPTY_DESCRIPTION
}

/** Extrae texto plano de un JSONContent para meta tags, schema.org, etc. */
export function descriptionToPlainText(doc: JSONContent): string {
  const out: string[] = []
  const walk = (node: JSONContent | undefined) => {
    if (!node) return
    if (node.type === 'text' && typeof node.text === 'string') out.push(node.text)
    if (Array.isArray(node.content)) {
      node.content.forEach(walk)
      // separa bloques con espacio para que no se peguen palabras
      if (node.type === 'paragraph' || node.type?.startsWith('heading') || node.type === 'listItem') {
        out.push(' ')
      }
    }
  }
  walk(doc)
  return out.join('').replace(/\s+/g, ' ').trim()
}

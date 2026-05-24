import type { JSONContent } from '@tiptap/core'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ProductTone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

export type ProductCategory =
  | 'laminas'
  | 'ceramica'
  | 'acuarela'
  | 'textil'
  | 'gouache'
  | 'abanicos'
  | 'stickers'
  | 'mandalas'
  | 'ilustracion'
  | 'mixta'

export type ProductStatus = 'active' | 'coming-soon' | 'out-of-stock'

export interface ProductVariant {
  size: string            // 'A6' | 'A5' | 'A4' | 'A3'
  priceMultiplier: number // 0.55 | 0.75 | 1 | 1.6
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
  framePrice: number       // precio del addon de marco en ARS
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

export function getVariantPrice(product: Product, size: string | null): number {
  if (!product.variants || !size) return product.basePrice
  const variant = product.variants.find((v) => v.size === size)
  return variant ? Math.round(product.basePrice * variant.priceMultiplier) : product.basePrice
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

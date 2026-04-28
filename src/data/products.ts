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

export interface Product {
  slug: string
  title: string
  category: ProductCategory
  catLabel: string         // 'Lámina — Giclée', 'Cerámica — Gres esmaltado', etc.
  basePrice: number        // en ARS, precio del tamaño base (A4 o unidad)
  size: string             // descripción de medidas: 'A4 · 21×29,7 cm', '∅ 14 cm', etc.
  tone: ProductTone
  tall: number             // aspect ratio tall para placeholder: 1.3 = 1:1.3
  medium: string           // 'Impresión giclée sobre papel Hahnemühle 308g'
  edition: string          // 'Edición abierta · firmada', 'Pieza única', etc.
  description: string      // párrafo descriptivo, copy aprobado
  images: string[]         // paths a imágenes reales (vacío → placeholder)
  tags: string[]
  variants: ProductVariant[] | null
  hasFrame: boolean
  framePrice: number       // precio del addon de marco en ARS
  onDemand: boolean
  status: ProductStatus
  stock?: number | null    // de product_stock (null = ilimitado)
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

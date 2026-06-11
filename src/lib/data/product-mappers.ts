import {
  normalizeDescription,
  type FrameOption,
  type FrameVariant,
  type Product,
  type ProductCategory,
  type ProductSpec,
  type ProductStatus,
  type ProductTone,
  type ProductVariant,
} from '@/data/products'

// Funciones puras de normalización de productos (sin React). Compartidas entre
// el fetcher server (src/lib/data/products.ts) y el hook client (useProducts).

export function normalizeFrameVariants(raw: unknown): FrameVariant[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const result = (raw as Record<string, unknown>[])
    .filter((v) => typeof v === 'object' && v !== null && typeof v.label === 'string' && v.label)
    .map((v) => ({
      label: String(v.label),
      price: Number(v.price ?? 0),
      image: typeof v.image === 'string' && v.image ? v.image : null,
    }))
  return result.length > 0 ? result : null
}

export function normalizeFrameOptions(raw: unknown): FrameOption[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const result = (raw as Record<string, unknown>[])
    .filter((v) => typeof v === 'object' && v !== null && typeof v.label === 'string' && v.label)
    .map((v) => ({
      label: String(v.label),
      image: typeof v.image === 'string' && v.image ? v.image : null,
    }))
  return result.length > 0 ? result : null
}

export function normalizeVariants(raw: unknown, basePrice: number): ProductVariant[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  return raw.map((v: Record<string, unknown>) => {
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

export function buildSpecs(p: Record<string, unknown>): ProductSpec[] {
  const raw = p.specs
  let specs: ProductSpec[] = []
  if (Array.isArray(raw)) {
    specs = (raw as ProductSpec[]).filter(
      (s) => s && typeof s === 'object' && typeof s.label === 'string' && typeof s.value === 'string'
    )
  } else if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        specs = parsed.filter((s) => s?.label && s?.value)
      }
    } catch { /* ignore */ }
  }
  if (specs.length === 0) {
    if (p.medium) specs.push({ label: 'Técnica', value: String(p.medium) })
    if (p.edition) specs.push({ label: 'Edición', value: String(p.edition) })
  }
  return specs
}

export interface StockEntry {
  stock: number | null
  status: string
}

/** Mapea un record de PocketBase (+ su stock) al tipo de dominio Product. */
export function mapProduct(
  p: Record<string, any>,
  stock?: StockEntry,
): Product {
  return {
    slug:        p.slug,
    title:       p.title,
    category:    p.category as ProductCategory,
    catLabel:    p.cat_label,
    basePrice:   p.base_price,
    size:        p.size,
    tone:        p.tone as ProductTone,
    tall:        p.tall,
    description: normalizeDescription(p.description),
    specs:       buildSpecs(p),
    medium:      p.medium ?? undefined,
    edition:     p.edition ?? undefined,
    images:      p.images ?? [],
    tags:        p.tags ?? [],
    variants:    normalizeVariants(p.variants, p.base_price),
    hasFrame:       p.has_frame,
    framePrice:     p.frame_price,
    frameVariants:  normalizeFrameVariants(p.frame_variants),
    frameOptions:   normalizeFrameOptions(p.frame_options),
    onDemand:       p.on_demand,
    status:      (stock?.status ?? 'active') as ProductStatus,
    // on_demand es la fuente de verdad del stock ilimitado: se lee como null
    // (infinito) sin importar la cantidad numérica guardada en product_stock.
    stock:       p.on_demand ? null : (stock?.stock ?? null),
    createdAt:   p.created ?? null,
  }
}

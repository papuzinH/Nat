import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
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

function normalizeFrameVariants(raw: unknown): FrameVariant[] | null {
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

function normalizeFrameOptions(raw: unknown): FrameOption[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const result = (raw as Record<string, unknown>[])
    .filter((v) => typeof v === 'object' && v !== null && typeof v.label === 'string' && v.label)
    .map((v) => ({
      label: String(v.label),
      image: typeof v.image === 'string' && v.image ? v.image : null,
    }))
  return result.length > 0 ? result : null
}

function normalizeVariants(raw: unknown, basePrice: number): ProductVariant[] | null {
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

function buildSpecs(p: Record<string, unknown>): ProductSpec[] {
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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      pb.collection('products').getFullList({ sort: 'sort_order', requestKey: null }),
      pb.collection('product_stock').getFullList({ fields: 'slug,stock,status', requestKey: null }),
    ]).then(([rawProducts, stockData]) => {
      const stockMap: Record<string, { stock: number | null; status: string }> = {}
      for (const row of stockData) stockMap[row.slug] = { stock: row.stock, status: row.status }

      setProducts(
        rawProducts.map((p) => {
          const s = stockMap[p.slug]
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
            specs:       buildSpecs(p as Record<string, unknown>),
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
            status:      (s?.status ?? 'active') as ProductStatus,
            stock:       s?.stock ?? null,
            createdAt:   p.created ?? null,
          }
        })
      )
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getProduct = (slug: string): Product | undefined =>
    products.find((p) => p.slug === slug)

  return { products, loading, getProduct }
}

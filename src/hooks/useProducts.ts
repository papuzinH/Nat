import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductCategory, ProductStatus, ProductTone, ProductVariant } from '@/data/products'

type RawProduct = {
  slug: string
  title: string
  category: string
  cat_label: string
  base_price: number
  size: string
  tone: string
  tall: number
  medium: string
  edition: string
  description: string
  images: string[]
  tags: string[]
  variants: ProductVariant[] | null
  has_frame: boolean
  frame_price: number
  on_demand: boolean
  sort_order: number
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('product_stock').select('slug, stock, status'),
    ]).then(([{ data: rawProducts }, { data: stockData }]) => {
      const stockMap: Record<string, { stock: number | null; status: string }> = {}
      if (stockData) {
        for (const row of stockData) stockMap[row.slug] = { stock: row.stock, status: row.status }
      }

      if (rawProducts) {
        setProducts(
          (rawProducts as RawProduct[]).map((p) => {
            const s = stockMap[p.slug]
            return {
              slug: p.slug,
              title: p.title,
              category: p.category as ProductCategory,
              catLabel: p.cat_label,
              basePrice: p.base_price,
              size: p.size,
              tone: p.tone as ProductTone,
              tall: p.tall,
              medium: p.medium,
              edition: p.edition,
              description: p.description,
              images: p.images ?? [],
              tags: p.tags ?? [],
              variants: p.variants ?? null,
              hasFrame: p.has_frame,
              framePrice: p.frame_price,
              onDemand: p.on_demand,
              status: (s?.status ?? 'active') as ProductStatus,
              stock: s?.stock ?? null,
            }
          })
        )
      }
      setLoading(false)
    })
  }, [])

  const getProduct = (slug: string): Product | undefined =>
    products.find((p) => p.slug === slug)

  return { products, loading, getProduct }
}

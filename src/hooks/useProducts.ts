import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import type { Product, ProductCategory, ProductStatus, ProductTone, ProductVariant } from '@/data/products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      pb.collection('products').getFullList({ sort: 'sort_order' }),
      pb.collection('product_stock').getFullList({ fields: 'slug,stock,status' }),
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
            medium:      p.medium,
            edition:     p.edition,
            description: p.description,
            images:      p.images ?? [],
            tags:        p.tags ?? [],
            variants:    (p.variants as ProductVariant[] | null) ?? null,
            hasFrame:    p.has_frame,
            framePrice:  p.frame_price,
            onDemand:    p.on_demand,
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

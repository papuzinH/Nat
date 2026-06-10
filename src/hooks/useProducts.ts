import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { mapProduct, type StockEntry } from '@/lib/data/product-mappers'
import { type Product } from '@/data/products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      pb.collection('products').getFullList({ sort: 'sort_order', requestKey: null }),
      pb.collection('product_stock').getFullList({ fields: 'slug,stock,status', requestKey: null }),
    ]).then(([rawProducts, stockData]) => {
      const stockMap: Record<string, StockEntry> = {}
      for (const row of stockData) stockMap[row.slug] = { stock: row.stock, status: row.status }

      setProducts(rawProducts.map((p) => mapProduct(p as Record<string, unknown>, stockMap[p.slug])))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getProduct = (slug: string): Product | undefined =>
    products.find((p) => p.slug === slug)

  return { products, loading, getProduct }
}

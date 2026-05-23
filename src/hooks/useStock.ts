import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import type { ProductStatus } from '@/data/products'

interface StockEntry {
  stock: number | null
  status: ProductStatus
}

type StockMap = Record<string, StockEntry>

export function useStock() {
  const [stockMap, setStockMap] = useState<StockMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection('product_stock')
      .getFullList({ fields: 'slug,stock,status' })
      .then((data) => {
        const map: StockMap = {}
        for (const row of data) {
          map[row.slug] = { stock: row.stock, status: row.status as ProductStatus }
        }
        setStockMap(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStock = (slug: string): StockEntry | undefined => stockMap[slug]

  return { stockMap, getStock, loading }
}

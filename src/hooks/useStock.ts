import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
    supabase
      .from('product_stock')
      .select('slug, stock, status')
      .then(({ data }) => {
        if (data) {
          const map: StockMap = {}
          for (const row of data) {
            map[row.slug] = { stock: row.stock, status: row.status as ProductStatus }
          }
          setStockMap(map)
        }
        setLoading(false)
      })
  }, [])

  const getStock = (slug: string): StockEntry | undefined => stockMap[slug]

  return { stockMap, getStock, loading }
}

import 'server-only'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { mapProduct, type StockEntry } from '@/lib/data/product-mappers'
import type { Product } from '@/data/products'

// Tag de cache para revalidación on-demand desde el admin (/api/revalidate).
export const PRODUCTS_TAG = 'products'

/** Trae todos los productos (con stock) desde PocketBase, cacheados con ISR. */
export async function getProducts(): Promise<Product[]> {
  const [rawProducts, stockData] = await Promise.all([
    pbGetFullList<Record<string, any>>(
      'products',
      { sort: 'sort_order' },
      { tags: [PRODUCTS_TAG] },
    ),
    pbGetFullList<{ slug: string; stock: number | null; status: string }>(
      'product_stock',
      { fields: 'slug,stock,status' },
      { tags: [PRODUCTS_TAG] },
    ),
  ])

  const stockMap: Record<string, StockEntry> = {}
  for (const row of stockData) stockMap[row.slug] = { stock: row.stock, status: row.status }

  return rawProducts.map((p) => mapProduct(p, stockMap[p.slug]))
}

/** Trae un producto por slug (o undefined si no existe). */
export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug)
}

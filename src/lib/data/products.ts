import 'server-only'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { mapProduct, type ProductRow, type StockEntry } from '@/lib/data/product-mappers'
import { getImageRatios } from '@/lib/data/image-dimensions'
import type { Product } from '@/data/products'

// Tag de cache para revalidación on-demand desde el admin (/api/revalidate).
export const PRODUCTS_TAG = 'products'

/** Trae todos los productos (con stock) desde PocketBase, cacheados con ISR. */
export async function getProducts(): Promise<Product[]> {
  const [rawProducts, stockData] = await Promise.all([
    pbGetFullList<ProductRow>(
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

  const products = rawProducts.map((p) => mapProduct(p, stockMap[p.slug]))

  // La proporción real de cada obra, para que la galería no tenga que imponer una.
  // Solo lee la cabecera de cada archivo y las URLs de PocketBase son inmutables,
  // así que con el cache de fetch esto se resuelve una vez y no por request.
  await Promise.all(
    products.map(async (product) => {
      if (product.images.length === 0) return
      product.imageRatios = await getImageRatios(product.images)
    })
  )

  return products
}

/** Trae un producto por slug (o undefined si no existe). */
export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug)
}

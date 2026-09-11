import 'server-only'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { PRODUCTS_TAG } from './products'
import { BLOG_TAG } from './blog'
import type { ProductCategoryMeta } from '@/data/products'

async function getCategories(collection: string, tag: string): Promise<ProductCategoryMeta[]> {
  try {
    const rows = await pbGetFullList<{ slug: string; label: string }>(
      collection,
      { sort: 'sort_order,label' },
      { tags: [tag] },
    )
    return rows.map(({ slug, label }) => ({ slug, label }))
  } catch {
    return []
  }
}

export const getProductCategories = () => getCategories('product_categories', PRODUCTS_TAG)
export const getBlogCategories = () => getCategories('blog_categories', BLOG_TAG)

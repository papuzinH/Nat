import { useState, useEffect, useCallback } from 'react'
import { pb } from '@/lib/pocketbase'

export interface Category {
  id: string
  slug: string
  label: string
  sort_order: number
}

export interface CategoriesConfig {
  /** Colección de categorías administradas. */
  categoriesCollection: string
  /** Colección de items que referencian una categoría (para contar/guardar el borrado). */
  itemsCollection: string
  /** Campo del item que guarda la categoría. */
  itemsCategoryField: string
  /** Si los items guardan el `slug` o el `label` de la categoría. */
  matchBy: 'slug' | 'label'
}

/** Config por defecto: productos (preserva el comportamiento previo). */
export const PRODUCT_CATEGORIES_CONFIG: CategoriesConfig = {
  categoriesCollection: 'product_categories',
  itemsCollection: 'products',
  itemsCategoryField: 'category',
  matchBy: 'slug',
}

function sortCategories(cats: Category[]): Category[] {
  return [...cats].sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label, 'es'))
}

export function useCategories(config: CategoriesConfig = PRODUCT_CATEGORIES_CONFIG) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await pb.collection(config.categoriesCollection).getFullList({
        sort: 'sort_order,label',
        requestKey: null,
      })
      setCategories(
        data.map((r) => ({
          id: r.id,
          slug: r.slug as string,
          label: r.label as string,
          sort_order: (r.sort_order as number) ?? 0,
        }))
      )
    } catch {
      // La colección puede no existir aún; se queda en lista vacía
    } finally {
      setLoading(false)
    }
  }, [config.categoriesCollection])

  useEffect(() => {
    load()
  }, [load])

  const countByCategory = useCallback(
    async (cat: Category): Promise<number> => {
      const value = config.matchBy === 'slug' ? cat.slug : cat.label
      const res = await pb.collection(config.itemsCollection).getList(1, 1, {
        filter: `${config.itemsCategoryField}="${value}"`,
        requestKey: null,
      })
      return res.totalItems
    },
    [config.itemsCollection, config.itemsCategoryField, config.matchBy]
  )

  const createCategory = async (slug: string, label: string, sort_order = 0): Promise<Category> => {
    const record = await pb.collection(config.categoriesCollection).create({ slug, label, sort_order })
    const cat: Category = {
      id: record.id,
      slug: record.slug as string,
      label: record.label as string,
      sort_order: (record.sort_order as number) ?? 0,
    }
    setCategories((prev) => sortCategories([...prev, cat]))
    return cat
  }

  const updateCategory = async (
    id: string,
    data: Partial<Pick<Category, 'label' | 'sort_order'>>
  ): Promise<Category> => {
    const record = await pb.collection(config.categoriesCollection).update(id, data)
    const updated: Category = {
      id: record.id,
      slug: record.slug as string,
      label: record.label as string,
      sort_order: (record.sort_order as number) ?? 0,
    }
    setCategories((prev) => sortCategories(prev.map((c) => (c.id === id ? updated : c))))
    return updated
  }

  const deleteCategory = async (id: string): Promise<void> => {
    const cat = categories.find((c) => c.id === id)
    if (!cat) throw new Error('Categoría no encontrada')

    const count = await countByCategory(cat)
    if (count > 0) {
      throw new Error(`Hay ${count} item${count > 1 ? 's' : ''} con esta categoría`)
    }

    await pb.collection(config.categoriesCollection).delete(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return { categories, loading, reload: load, createCategory, updateCategory, deleteCategory, countByCategory }
}

import { useState, useEffect, useCallback } from 'react'
import { pb } from '@/lib/pocketbase'

export interface Category {
  id: string
  slug: string
  label: string
  sort_order: number
}

function sortCategories(cats: Category[]): Category[] {
  return [...cats].sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label, 'es'))
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await pb.collection('product_categories').getFullList({
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
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const createCategory = async (slug: string, label: string, sort_order = 0): Promise<Category> => {
    const record = await pb.collection('product_categories').create({ slug, label, sort_order })
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
    const record = await pb.collection('product_categories').update(id, data)
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

    const res = await pb.collection('products').getList(1, 1, {
      filter: `category="${cat.slug}"`,
      requestKey: null,
    })
    if (res.totalItems > 0) {
      throw new Error(
        `Hay ${res.totalItems} producto${res.totalItems > 1 ? 's' : ''} con esta categoría`
      )
    }

    await pb.collection('product_categories').delete(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return { categories, loading, reload: load, createCategory, updateCategory, deleteCategory }
}

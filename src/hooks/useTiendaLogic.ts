import { useState, useMemo } from 'react'
import type { Product, ProductCategoryMeta } from '@/data/products'

export function useTiendaLogic(products: Product[], dbCategories: ProductCategoryMeta[]) {
  const [activeCategory, setActiveCategory] = useState('todos')

  const categories: ProductCategoryMeta[] = useMemo(
    () => [{ slug: 'todos', label: 'Todos' }, ...dbCategories],
    [dbCategories]
  )

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'todos'
        ? products.filter((p) => p.status === 'active')
        : products.filter((p) => p.status === 'active' && p.category === activeCategory),
    [activeCategory, products]
  )

  function countForCategory(slug: string): number {
    if (slug === 'todos') return products.filter((p) => p.status === 'active').length
    return products.filter((p) => p.status === 'active' && p.category === slug).length
  }

  return {
    filteredProducts,
    activeCategory,
    setActiveCategory,
    categories,
    countForCategory,
  }
}

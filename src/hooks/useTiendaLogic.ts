import { useState, useMemo } from 'react'
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from '@/data/products'

export function useTiendaLogic(products: Product[]) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'todos'>('todos')

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
    categories: PRODUCT_CATEGORIES,
    countForCategory,
  }
}

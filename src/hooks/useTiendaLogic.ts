import { useState, useMemo } from 'react'
import { PRODUCTS, PRODUCT_CATEGORIES, type ProductCategory } from '@/data/products'

export function useTiendaLogic() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'todos'>('todos')

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'todos'
        ? PRODUCTS.filter((p) => p.status === 'active')
        : PRODUCTS.filter((p) => p.status === 'active' && p.category === activeCategory),
    [activeCategory]
  )

  function countForCategory(slug: string): number {
    if (slug === 'todos') return PRODUCTS.filter((p) => p.status === 'active').length
    return PRODUCTS.filter((p) => p.status === 'active' && p.category === slug).length
  }

  return {
    filteredProducts,
    activeCategory,
    setActiveCategory,
    categories: PRODUCT_CATEGORIES,
    countForCategory,
  }
}

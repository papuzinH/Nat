import { useState, useMemo, useEffect, useCallback } from 'react'
import type { Product, ProductCategoryMeta } from '@/data/products'

const CATEGORY_PARAM = 'cat'

export function useTiendaLogic(products: Product[], dbCategories: ProductCategoryMeta[]) {
  const [activeCategory, setActiveCategoryState] = useState('todos')

  const categories: ProductCategoryMeta[] = useMemo(
    () => [{ slug: 'todos', label: 'Todos' }, ...dbCategories],
    [dbCategories]
  )

  // /tienda?cat=<slug> (lo arma el breadcrumb del detalle). Se lee al montar y no
  // con useSearchParams: en esta página estática exige un Suspense que saca la
  // grilla del HTML del servidor. Así el HTML trae el catálogo completo y el
  // filtro se aplica al hidratar.
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get(CATEGORY_PARAM)
    if (cat && dbCategories.some((c) => c.slug === cat)) setActiveCategoryState(cat)
  }, [dbCategories])

  // Mantiene ?cat= en sincronía con el filtro: si no, recargar después de volver
  // a "Todos" restauraba la categoría vieja. replaceState para no llenar el historial.
  const setActiveCategory = useCallback((slug: string) => {
    setActiveCategoryState(slug)
    const url = new URL(window.location.href)
    if (slug === 'todos') url.searchParams.delete(CATEGORY_PARAM)
    else url.searchParams.set(CATEGORY_PARAM, slug)
    window.history.replaceState(null, '', url)
  }, [])

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

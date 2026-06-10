'use client'

import React from 'react'
import type { Product } from '@/data/products'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import TiendaHero from './TiendaHero'
import FilterBar from './FilterBar'
import ProductGrid from './ProductGrid'
import TiendaEmptyState from './TiendaEmptyState'

// Client island de la tienda: recibe los productos ya cargados desde el Server
// Component (ISR) y maneja el filtrado por categoría en el cliente. El HTML
// inicial ya trae todos los productos activos → indexable para SEO.
interface TiendaContentProps {
  products: Product[]
}

const TiendaContent: React.FC<TiendaContentProps> = ({ products }) => {
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic(products)

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug)
    requestAnimationFrame(() => {
      document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <TiendaHero productCount={filteredProducts.length} />

      <FilterBar
        categories={categories}
        active={activeCategory}
        onSelect={handleCategorySelect}
        countForCategory={countForCategory}
      />

      {products.length === 0 && <TiendaEmptyState variant="global" />}

      {products.length > 0 && filteredProducts.length === 0 && (
        <TiendaEmptyState variant="filtered" onReset={() => setActiveCategory('todos')} />
      )}

      {filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} activeCategory={activeCategory} />
      )}
    </main>
  )
}

export default TiendaContent

'use client'

import React from 'react'
import type { Product, ProductCategoryMeta } from '@/data/products'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import TiendaHero from './TiendaHero'
import FilterBar from './FilterBar'
import ProductGrid from './ProductGrid'
import TiendaEmptyState from './TiendaEmptyState'
import CeramicaNotice, { CERAMICA_SLUG } from './CeramicaNotice'
import { SectionContainer } from '@/components/shared'

// El <main> lo pone el layout de (site): acá va un <div> para no anidar landmarks.

// Client island de la tienda: recibe los productos ya cargados desde el Server
// Component (ISR) y maneja el filtrado por categoría en el cliente. El HTML
// inicial ya trae todos los productos activos → indexable para SEO.
interface TiendaContentProps {
  products: Product[]
  categories: ProductCategoryMeta[]
}

const TiendaContent: React.FC<TiendaContentProps> = ({ products, categories: dbCategories }) => {
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic(products, dbCategories)

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug)
    requestAnimationFrame(() => {
      document.getElementById('tienda-resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="min-h-screen bg-cream-50">
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
        <SectionContainer>
          {/* Destino del scroll al filtrar: el margen deja el aviso y la grilla
              debajo del header y de la barra de filtros, que son sticky. */}
          <div id="tienda-resultados" style={{ scrollMarginTop: 'calc(var(--header-h, 72px) + 96px)' }}>
            {activeCategory === CERAMICA_SLUG && (
              <CeramicaNotice className="mb-8 md:mb-10 max-w-3xl" />
            )}
            <ProductGrid products={filteredProducts} activeCategory={activeCategory} withSection={false} />
          </div>
        </SectionContainer>
      )}
    </div>
  )
}

export default TiendaContent

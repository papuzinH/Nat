import React from 'react'
import { SEOMeta } from '@/components/shared'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import { useProducts } from '@/hooks/useProducts'
import { descriptionToPlainText } from '@/data/products'
import { TiendaHero, FilterBar, ProductGrid } from '@/components/tienda'
import TiendaSkeleton from '@/components/tienda/TiendaSkeleton'
import TiendaEmptyState from '@/components/tienda/TiendaEmptyState'

const BASE_URL = 'https://tatuajesnaty.com'

const Tienda: React.FC = () => {
  const { products, loading } = useProducts()
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic(products)

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug)
    requestAnimationFrame(() => {
      document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const activeProducts = products.filter((p) => p.status === 'active')

  const tiendaSchema = {
    '@type': 'CollectionPage',
    name: 'Tienda de Arte — Natalia Heller',
    description:
      'Obra original de Natalia Heller: láminas giclée, cerámicas, acuarelas, stickers y abanicos.',
    url: `${BASE_URL}/tienda`,
    numberOfItems: activeProducts.length,
    itemListElement: activeProducts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.title,
        url: `${BASE_URL}/tienda/${p.slug}`,
        description: descriptionToPlainText(p.description),
        category: p.catLabel,
      },
    })),
  }

  return (
    <>
      <SEOMeta
        title="Tienda de Arte — Natalia Heller | Prints, Stickers, Cerámicas y más"
        description="Comprá obra original de Natalia Heller: prints, cerámicas, acuarelas, stickers y abanicos. A domicilio - Retiro en persona."
        canonical={`${BASE_URL}/tienda`}
        ogImage={`${BASE_URL}/og-tienda.webp`}
        schema={tiendaSchema}
      />

      <main className="min-h-screen bg-cream-50">
        <TiendaHero productCount={filteredProducts.length} />

        <FilterBar
          categories={categories}
          active={activeCategory}
          onSelect={handleCategorySelect}
          countForCategory={countForCategory}
        />

        {loading && <TiendaSkeleton />}

        {!loading && products.length === 0 && (
          <TiendaEmptyState variant="global" />
        )}

        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <TiendaEmptyState variant="filtered" onReset={() => setActiveCategory('todos')} />
        )}

        {!loading && filteredProducts.length > 0 && (
          <ProductGrid products={filteredProducts} activeCategory={activeCategory} />
        )}
      </main>
    </>
  )
}

export default Tienda

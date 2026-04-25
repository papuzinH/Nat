import React from 'react'
import { SEOMeta } from '@/components/shared'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import { TiendaHero, FilterBar, ProductGrid } from '@/components/tienda'
import { PRODUCTS } from '@/data/products'

const BASE_URL = 'https://tatuajesnaty.com'

const Tienda: React.FC = () => {
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic()

  const activeProducts = PRODUCTS.filter((p) => p.status === 'active')

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
        description: p.description,
        category: p.catLabel,
      },
    })),
  }

  return (
    <>
      <SEOMeta
        title="Tienda de Arte — Natalia Heller | Prints, Stickers, Cerámicas y más"
        description="Comprá obra original de Natalia Heller: prints, cerámicas, acuarelas, stickers y abanicos. Envíos a todo el país."
        canonical={`${BASE_URL}/tienda`}
        ogImage={`${BASE_URL}/og-tienda.webp`}
        schema={tiendaSchema}
      />

      <main className="min-h-screen bg-cream-50">
        <TiendaHero productCount={filteredProducts.length} />

        <FilterBar
          categories={categories}
          active={activeCategory}
          onSelect={(slug) => setActiveCategory(slug as Parameters<typeof setActiveCategory>[0])}
          countForCategory={countForCategory}
        />

        <ProductGrid products={filteredProducts} activeCategory={activeCategory} />

      </main>
    </>
  )
}

export default Tienda

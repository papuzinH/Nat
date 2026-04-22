import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import { TiendaHero, FilterBar, ProductGrid, ComingSoonSection } from '@/components/tienda'
import SchemaMarkup from '@/components/shared/SchemaMarkup'
import { PRODUCTS } from '@/data/products'

const BASE_URL = 'https://tatuajesnaty.com'

const Tienda: React.FC = () => {
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic()

  const activeProducts = PRODUCTS.filter((p) => p.status === 'active')

  const tiendaSchema = {
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
      <Helmet>
        <title>Tienda de Arte — Natalia Heller | Prints, Stickers, Cerámicas y más</title>
        <meta
          name="description"
          content="Comprá obra original de Natalia Heller: láminas giclée, cerámicas, acuarelas, stickers y abanicos. Cada pieza sale del estudio con nota escrita a mano. Envíos a todo el país."
        />
        <meta
          property="og:title"
          content="Tienda de Arte — Natalia Heller | Prints, Stickers, Cerámicas y más"
        />
        <meta
          property="og:description"
          content="Comprá obra original de Natalia Heller: láminas giclée, cerámicas, acuarelas, stickers y abanicos. Cada pieza sale del estudio con nota escrita a mano. Envíos a todo el país."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/tienda`} />
        <meta property="og:image" content={`${BASE_URL}/og-tienda.webp`} />
        <link rel="canonical" href={`${BASE_URL}/tienda`} />
      </Helmet>

      <SchemaMarkup type="CollectionPage" data={tiendaSchema} />

      <main className="min-h-screen bg-cream-50">
        <TiendaHero productCount={filteredProducts.length} />


        <FilterBar
          categories={categories}
          active={activeCategory}
          onSelect={(slug) => setActiveCategory(slug as Parameters<typeof setActiveCategory>[0])}
          countForCategory={countForCategory}
        />


        <ProductGrid products={filteredProducts} activeCategory={activeCategory} />


        {/* Próximamente */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <ComingSoonSection />
        </div>
      </main>
    </>
  )
}

export default Tienda

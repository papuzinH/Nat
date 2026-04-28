import React from 'react'
import { SEOMeta } from '@/components/shared'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import { useProducts } from '@/hooks/useProducts'
import { TiendaHero, FilterBar, ProductGrid } from '@/components/tienda'

const BASE_URL = 'https://tatuajesnaty.com'

const Tienda: React.FC = () => {
  const { products, loading } = useProducts()
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic(products)

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

        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft text-center py-20">
            Cargando productos…
          </p>
        ) : (
          <>
            <FilterBar
              categories={categories}
              active={activeCategory}
              onSelect={(slug) => setActiveCategory(slug as Parameters<typeof setActiveCategory>[0])}
              countForCategory={countForCategory}
            />
            <ProductGrid products={filteredProducts} activeCategory={activeCategory} />
          </>
        )}
      </main>
    </>
  )
}

export default Tienda

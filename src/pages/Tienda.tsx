import React, { useLayoutEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { useTiendaLogic } from '@/hooks/useTiendaLogic'
import { FilterBar, ProductGrid, ComingSoonSection } from '@/components/tienda'
import SchemaMarkup from '@/components/shared/SchemaMarkup'
import { PRODUCTS } from '@/data/products'

const BASE_URL = 'https://tatuajesnaty.com'

const Tienda: React.FC = () => {
  const { filteredProducts, activeCategory, setActiveCategory, categories, countForCategory } =
    useTiendaLogic()

  const mainRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  // Page enter animation
  useLayoutEffect(() => {
    if (!shouldAnimate()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [eyebrowRef.current, h1Ref.current, subtitleRef.current],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      )
    }, mainRef)
    return () => ctx.revert()
  }, [])

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

      <main ref={mainRef} className="min-h-screen bg-cream-50">
        {/* Hero header */}
        <section
          aria-label="Catálogo"
          className="bg-cream-100 px-6 md:px-12 pt-[56px] pb-8"
        >
          <div className="max-w-5xl mx-auto">
            <p
              ref={eyebrowRef}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-4"
            >
              Tienda · {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'pieza' : 'piezas'}
            </p>
            <h1
              ref={h1Ref}
              className="font-display font-normal text-ink"
              style={{
                fontSize: 'clamp(38px, 8vw, 72px)',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
              }}
            >
              Obra disponible
            </h1>
            <p
              ref={subtitleRef}
              className="font-body text-ink-soft mt-4 max-w-[540px]"
              style={{ fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.6 }}
            >
              Piezas únicas y ediciones firmadas. Cada obra sale del estudio con
              envoltorio en papel reciclado y una nota escrita a mano.
            </p>
          </div>
        </section>

        {/* Filtros sticky */}
        <FilterBar
          categories={categories}
          active={activeCategory}
          onSelect={(slug) => setActiveCategory(slug as Parameters<typeof setActiveCategory>[0])}
          countForCategory={countForCategory}
        />

        {/* Grid */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <ProductGrid products={filteredProducts} activeCategory={activeCategory} />
        </section>

        {/* Próximamente */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <ComingSoonSection />
        </div>
      </main>
    </>
  )
}

export default Tienda

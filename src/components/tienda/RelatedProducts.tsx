import React, { useLayoutEffect, useRef, useMemo } from 'react'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'
import { PRODUCTS, type ProductCategory } from '@/data/products'
import ProductCard from './ProductCard'

interface RelatedProductsProps {
  currentSlug: string
  category: ProductCategory
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentSlug, category }) => {
  const gridRef = useRef<HTMLDivElement>(null)

  const related = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          p.slug !== currentSlug &&
          p.status === 'active' &&
          p.category === category
      ).slice(0, 3),
    [currentSlug, category]
  )

  useLayoutEffect(() => {
    if (!shouldAnimate() || !gridRef.current || related.length === 0) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.related-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
          ),
        start: 'top 88%',
      })
    }, gridRef)
    return () => ctx.revert()
  }, [related.length])

  if (related.length === 0) return null

  return (
    <section aria-label="Productos relacionados" className="mt-20 md:mt-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3">
        En la misma técnica
      </p>
      <h2
        className="font-display font-normal text-ink mb-10"
        style={{ fontSize: 'clamp(24px, 4vw, 34px)', lineHeight: 1.1 }}
      >
        También te puede interesar
      </h2>

      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
      >
        {related.map((product) => (
          <div key={product.slug} className="related-card">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts

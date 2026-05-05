import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/tienda'
import { SectionContainer, SectionTitle } from '@/components/shared'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { splitReveal, splitWords } from '@/lib/animations'

const FeaturedProductsSection: React.FC = () => {
  const { products } = useProducts()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const featuredProducts = products
    .filter((p) => p.status === 'active')
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0
      if (!a.createdAt) return 1
      if (!b.createdAt) return -1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 6)

  useLayoutEffect(() => {
    const title = titleRef.current
    const cta = ctaRef.current
    const section = sectionRef.current
    if (!title || !section || !shouldAnimate()) return

    const cleanup = splitReveal(title, {
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    })

    const ctaCtx = gsap.context(() => {
      if (!cta) return
      gsap.fromTo(
        cta,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.35,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        }
      )
    }, section)

    return () => {
      cleanup()
      ctaCtx.revert()
    }
  }, [])

  const titleText = 'Piezas que acaban de salir del estudio'

  return (
    <SectionContainer aria-labelledby="featured-products-heading">
      <div ref={sectionRef} className="flex items-start justify-between mb-10 md:mb-14">
        <div className="overflow-hidden">
          <SectionTitle id="featured-products-heading">
            <span ref={titleRef} style={{ display: 'inline-block' }}>
              {splitWords(titleText).map((token, i) =>
                /^\s+$/.test(token) ? (
                  <span key={i}>{token}</span>
                ) : (
                  <span
                    key={i}
                    data-split-word
                    style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                  >
                    {token}
                  </span>
                )
              )}
            </span>
          </SectionTitle>
        </div>
        <Link
          ref={ctaRef}
          to="/tienda"
          className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink hover:text-sage-700 transition-colors duration-200 mt-2 shrink-0 hidden md:block"
          style={{ textDecoration: 'none', opacity: 0 }}
        >
          Ver todo →
        </Link>
      </div>

      <ProductGrid
        products={featuredProducts}
        activeCategory="featured"
        withSection={false}
        gridId="featured-product-grid"
        ariaLabel="Productos destacados"
        gridClassName="gap-4 md:gap-7"
      />

      <div className="mt-8 text-center md:hidden">
        <Link
          to="/tienda"
          className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink hover:text-sage-700 transition-colors duration-200"
          style={{ textDecoration: 'none' }}
        >
          Ver todo →
        </Link>
      </div>
    </SectionContainer>
  )
}

export default FeaturedProductsSection

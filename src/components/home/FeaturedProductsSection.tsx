'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import type { Product } from '@/data/products'
// Import directo y no del barrel de tienda: el barrel arrastra el detalle de
// producto (lightbox + su CSS) al bundle del home.
import ProductGrid from '@/components/tienda/ProductGrid'
import FeaturedProductsCarousel from './FeaturedProductsCarousel'
import { SectionContainer, SectionTitle } from '@/components/shared'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { splitReveal, splitWords } from '@/lib/animations'

const FeaturedProductsSection: React.FC<{ products: Product[] }> = ({ products: featuredProducts }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

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
        { y: 8 },
        {
          y: 0,
          duration: 0.5,
          delay: 0.35,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        }
      )
    }, section)

    return () => {
      cleanup()
      ctaCtx.revert()
    }
  }, [])

  const titleText = 'Últimas creaciones'

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
                    style={{ display: 'inline-block' }}
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
          href="/tienda"
          className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink hover:text-sage-700 transition-colors duration-200 mt-2 shrink-0 hidden md:block"
          style={{ textDecoration: 'none' }}
        >
          Ver todo →
        </Link>
      </div>

      {/* Mobile: slider de a un producto */}
      <div className="md:hidden">
        <FeaturedProductsCarousel products={featuredProducts} />
      </div>
      {/* Desktop: grid de 3 columnas */}
      <div className="hidden md:block">
        <ProductGrid
          products={featuredProducts}
          activeCategory="featured"
          withSection={false}
          gridId="featured-product-grid"
          ariaLabel="Productos destacados"
          gridClassName="gap-4 md:gap-7"
        />
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/tienda"
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

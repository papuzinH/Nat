'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'
import { type Product } from '@/data/products'
import ProductCard from './ProductCard'
import { SectionContainer } from '@/components/shared'

interface ProductGridProps {
  products: Product[]
  activeCategory?: string
  withSection?: boolean
  sectionClassName?: string
  containerClassName?: string
  gridClassName?: string
  gridId?: string
  ariaLabel?: string
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory = 'all',
  withSection = true,
  sectionClassName = '',
  containerClassName = '',
  gridClassName = '',
  gridId = 'product-grid',
  ariaLabel = 'Catálogo filtrado',
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const mergedGridClassName = ['grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-start', gridClassName]
    .filter(Boolean)
    .join(' ')

  // Scroll reveal inicial
  useLayoutEffect(() => {
    if (!shouldAnimate() || !gridRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.product-card', {
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
  }, [])  

  // Animación al cambiar filtro
  useLayoutEffect(() => {
    if (!shouldAnimate() || !gridRef.current) return
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.product-card') ?? []
      if (cards.length === 0) return
      gsap.fromTo(
        Array.from(cards),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [activeCategory])

  if (products.length === 0) {
    const emptyContent = (
      <div
        id={gridId}
        className="py-20 text-center"
        role="region"
        aria-label={ariaLabel}
      >
        <p className="font-display italic text-[24px] text-ink-soft">
          Nada nuevo por acá todavía
        </p>
        <p className="font-body text-[14px] text-ink-soft mt-3">
          Sumate al newsletter para enterarte primero.
        </p>
      </div>
    )

    if (!withSection) {
      return emptyContent
    }

    return (
      <SectionContainer className={sectionClassName} containerClassName={containerClassName}>
        {emptyContent}
      </SectionContainer>
    )
  }

  const gridContent = (
    <div
      ref={gridRef}
      id={gridId}
      role="region"
      aria-label={ariaLabel}
      className={mergedGridClassName}
    >
      {products.map((product, i) => (
        <ProductCard key={product.slug} product={product} priority={i < 3} />
      ))}
    </div>
  )

  if (!withSection) {
    return gridContent
  }

  return (
    <SectionContainer className={sectionClassName} containerClassName={containerClassName}>
      {gridContent}
    </SectionContainer>
  )
}

export default ProductGrid

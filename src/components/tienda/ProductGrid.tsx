import React, { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'
import { type Product } from '@/data/products'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  activeCategory: string
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, activeCategory }) => {
  const gridRef = useRef<HTMLDivElement>(null)

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    return (
      <div
        id="product-grid"
        className="py-20 text-center"
        role="region"
        aria-label="Catálogo filtrado"
      >
        <p className="font-display italic text-[24px] text-ink-soft">
          Nada nuevo por acá todavía
        </p>
        <p className="font-body text-[14px] text-ink-soft mt-3">
          Sumate al newsletter para enterarte primero.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      id="product-grid"
      role="region"
      aria-label="Catálogo filtrado"
      className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
    >
      {products.map((product, i) => (
        <ProductCard key={product.slug} product={product} priority={i < 3} />
      ))}
    </div>
  )
}

export default ProductGrid

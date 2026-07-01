'use client'

import React, { useEffect, useRef, useState } from 'react'
import { type Product } from '@/data/products'
import ProductCard from '@/components/tienda/ProductCard'
import { shouldAnimate } from '@/lib/gsap'

interface FeaturedProductsCarouselProps {
  products: Product[]
}

const AUTOPLAY_MS = 2500

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const [isPaused, setIsPaused] = useState(false)

  // Sync dot indicator con la posición de scroll
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const slideWidth = track.clientWidth
      if (!slideWidth) return
      const idx = Math.round(track.scrollLeft / slideWidth)
      activeIndexRef.current = idx
      setActiveIndex(idx)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * track.clientWidth, behavior: shouldAnimate() ? 'smooth' : 'auto' })
  }

  // Autoplay — pausa al interactuar y respeta prefers-reduced-motion
  useEffect(() => {
    if (products.length <= 1 || isPaused || !shouldAnimate()) return
    const id = setInterval(() => {
      goTo((activeIndexRef.current + 1) % products.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [products.length, isPaused])

  if (products.length === 0) return null

  const pause = () => setIsPaused(true)
  const resume = () => setIsPaused(false)
  // En touch reanudamos tras un pequeño delay para que asiente el scroll por inercia
  const resumeDeferred = () => window.setTimeout(resume, 600)

  return (
    <div
      className="relative w-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resumeDeferred}
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="region"
        aria-label="Carrusel de últimas creaciones"
        aria-roledescription="carousel"
      >
        {products.map((product, i) => (
          <div
            key={product.slug}
            className="flex-shrink-0 w-full snap-center"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${products.length}: ${product.title}`}
          >
            <ProductCard product={product} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Dots — el wrapper extiende el área táctil a 44px */}
      {products.length > 1 && (
        <div className="mt-4 flex justify-center items-center" role="tablist" aria-label="Selector de producto">
          {products.map((product, i) => (
            <button
              key={product.slug}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Ir a ${product.title}`}
              className="inline-flex items-center justify-center min-w-[44px] h-[44px] bg-transparent border-0 cursor-pointer p-0"
            >
              <span
                aria-hidden="true"
                className="block transition-all duration-300 rounded-pill"
                style={{
                  width: i === activeIndex ? 22 : 6,
                  height: 6,
                  background:
                    i === activeIndex
                      ? 'var(--sage-700, #4a7c59)'
                      : 'var(--taupe-500, #b8a898)',
                  opacity: i === activeIndex ? 1 : 0.4,
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FeaturedProductsCarousel

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'

interface TiendaHeroProps {
  productCount: number
}

const TiendaHero: React.FC<TiendaHeroProps> = ({ productCount }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!shouldAnimate()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(containerRef.current?.children ?? []),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      aria-label="Catálogo"
      className="bg-cream-100 px-6 md:px-12 py-16 md:py-20"
    >
      <div ref={containerRef} className="mx-auto max-w-7xl">
        <HeroEyebrow className="mb-4">
          Tienda · {productCount}{' '}
          {productCount === 1 ? 'pieza' : 'piezas'}
        </HeroEyebrow>
        <HeroTitle>Obra disponible</HeroTitle>
        <HeroSubtitle className="mt-4 max-w-2xl">
          Piezas únicas y ediciones firmadas. Cada obra sale del estudio con
          envoltorio en papel reciclado y una nota escrita a mano.
        </HeroSubtitle>
      </div>
    </section>
  )
}

export default TiendaHero

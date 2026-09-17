'use client'

import React, { useLayoutEffect, useRef } from 'react'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import { animateHero, splitWords } from '@/lib/animations'

interface TiendaHeroProps {
  productCount: number
}

const TITLE_PRE = 'Obras '
const TITLE_EM = 'disponibles'

const TiendaHero: React.FC<TiendaHeroProps> = ({ productCount }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    return animateHero(containerRef.current)
  }, [])

  return (
    <section
      aria-label="Catálogo"
      className="bg-cream-100 px-6 md:px-12 py-16 md:py-20"
    >
      <div ref={containerRef} className="mx-auto max-w-7xl">
        <HeroEyebrow className="hero-eyebrow mb-4">
          Tienda · {productCount} {productCount === 1 ? 'pieza' : 'piezas'}
        </HeroEyebrow>
        <HeroTitle>
          <span>
            {splitWords(TITLE_PRE).map((token, i) =>
              /^\s+$/.test(token) ? (
                <span key={`pre-${i}`}>{token}</span>
              ) : (
                <span
                  key={`pre-${i}`}
                  data-split-word
                  style={{ display: 'inline-block' }}
                >
                  {token}
                </span>
              )
            )}
            <em>
              {splitWords(TITLE_EM).map((token, i) =>
                /^\s+$/.test(token) ? (
                  <span key={`em-${i}`}>{token}</span>
                ) : (
                  <span
                    key={`em-${i}`}
                    data-split-word
                    style={{ display: 'inline-block' }}
                  >
                    {token}
                  </span>
                )
              )}
            </em>
          </span>
        </HeroTitle>
        <HeroSubtitle className="hero-subtitle mt-4 max-w-2xl">
          Piezas únicas creadas desde el amor por la naturaleza. Regalos para vos o para esa persona importante con la que compartir un momento especial.
        </HeroSubtitle>
      </div>
    </section>
  )
}

export default TiendaHero

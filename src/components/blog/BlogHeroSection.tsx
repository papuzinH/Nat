'use client'

import React, { useLayoutEffect, useRef } from 'react'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import { animateHero, splitWords } from '@/lib/animations'

interface BlogHeroSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const TITLE = 'Guías y reflexiones que quiero compartir.'

const BlogHeroSection: React.FC<BlogHeroSectionProps> = ({ sectionRef }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    return animateHero(containerRef.current)
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Blog"
      className="bg-cream-100 px-6 md:px-12 py-16 md:py-20"
    >
      <div ref={containerRef} className="relative mx-auto max-w-7xl">
        <HeroEyebrow className="hero-eyebrow blog-eyebrow mb-4">
         Conocé mi lado más íntimo
        </HeroEyebrow>
        <HeroTitle className="blog-h1 mb-4">
          <span>
            {splitWords(TITLE).map((token, i) =>
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
        </HeroTitle>
        <HeroSubtitle className="hero-subtitle blog-subtitle">
          También disfruto mucho de la escritura. En esta sección te cuento más sobre mi universo creativo y personal para que puedas conocerme más en profundidad. Espero que lo disfrutes!
        </HeroSubtitle>
      </div>
    </section>
  )
}

export default BlogHeroSection

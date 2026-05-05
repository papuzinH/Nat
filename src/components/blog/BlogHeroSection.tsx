import React, { useLayoutEffect, useRef } from 'react'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import { animateHero, splitWords } from '@/lib/animations'

interface BlogHeroSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const TITLE = 'Notas sobre proceso, plantas y oficio.'

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
          Diario del estudio
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
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {token}
                </span>
              )
            )}
          </span>
        </HeroTitle>
        <HeroSubtitle className="hero-subtitle blog-subtitle">
          Una vez al mes escribo sobre lo que estoy aprendiendo. Sin agenda, sin newsletter de
          lunes. Solo notas del taller.
        </HeroSubtitle>
      </div>
    </section>
  )
}

export default BlogHeroSection

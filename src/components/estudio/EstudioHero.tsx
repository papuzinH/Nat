import React from 'react'
import NHLeafMark from '@/components/shared/NHLeafMark'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import { useLayoutEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { SectionContainer } from '../shared'

const EstudioHero: React.FC = () => {

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
    <SectionContainer>
      <NHLeafMark
        size={64}
        color="#7a9e7e"
        className="absolute top-8 right-8 md:top-12 md:right-12 hidden md:block"
      />
      <NHLeafMark
        size={44}
        color="#7a9e7e"
        className="absolute top-6 right-6 md:hidden"
      />

      <div className="max-w-7xl mx-auto" ref={containerRef} >
        <HeroEyebrow className="mb-6">Estudio de tatuaje</HeroEyebrow>

        <HeroTitle className="mb-6">
          Línea fina, botánica{' '}
          <em>y una conversación lenta.</em>
        </HeroTitle>

        <HeroSubtitle className="max-w-2xl">
          Diseño tatuajes únicos basados en botánica, línea fina y formas orgánicas.
          Cada sesión empieza con una charla larga y termina con algo que realmente
          tiene sentido en tu piel.
        </HeroSubtitle>
      </div>
    </SectionContainer>
  )
}

export default EstudioHero

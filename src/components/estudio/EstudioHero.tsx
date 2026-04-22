import React from 'react'
import NHLeafMark from '@/components/shared/NHLeafMark'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'

const EstudioHero: React.FC = () => (
  <section className="relative bg-cream-100 px-6 md:px-12 py-16 md:py-20 overflow-hidden">
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

    <div className="max-w-7xl mx-auto">
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
  </section>
)

export default EstudioHero

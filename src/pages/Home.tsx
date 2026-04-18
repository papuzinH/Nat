import React from 'react'
import { SchemaMarkup } from '@/components/shared'
import NHDivider from '@/components/shared/NHDivider'
import { HomeHeroSection, FeaturedProductsSection, TattooTeaserSection } from '@/components/home'

const organizationSchema = {
  name: 'Natalia Heller',
  url: 'https://tatuajesnaty.com',
  description: 'Arte original, tienda online y estudio de tatuajes en Buenos Aires. Prints, cerámica, textiles, stickers y tatuajes de línea fina.',
  sameAs: ['https://instagram.com/nataliaceller_art'],
}

const Home: React.FC = () => (
  <>
    <SchemaMarkup type="Organization" data={organizationSchema} />

    <main>
      <HomeHeroSection />

      <FeaturedProductsSection />

      <NHDivider label="estudio + tatuaje" />

      <TattooTeaserSection />

      {/* Quote strip */}
      <section
        className="py-20 md:py-28 px-6"
        aria-label="Sobre el estudio"
      >
        <div className="max-w-[780px] mx-auto text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-8">
            · Sobre el estudio ·
          </p>
          <blockquote>
            <p
              className="font-display font-normal text-ink"
              style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontStyle: 'italic', lineHeight: 1.35 }}
            >
              "Cada obra empieza en el huerto del patio: hojas que seco, flores que dibujo, colores que preparo con ceniza y cebolla. Trabajar con la mano puesta en la tierra."
            </p>
            <footer className="mt-6">
              <cite
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 not-italic"
              >
                — Natalia, desde el estudio
              </cite>
            </footer>
          </blockquote>
        </div>
      </section>
    </main>
  </>
)

export default Home

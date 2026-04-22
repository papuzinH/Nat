import React from 'react'
import { SchemaMarkup } from '@/components/shared'
import NHDivider from '@/components/shared/NHDivider'
import { HomeHeroSection, FeaturedProductsSection, TattooTeaserSection, QuoteStripSection } from '@/components/home'

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

      <QuoteStripSection />
    </main>
  </>
)

export default Home

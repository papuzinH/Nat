import React from 'react'
import { SEOMeta } from '@/components/shared'
import NHDivider from '@/components/shared/NHDivider'
import { HomeHeroSection, FeaturedProductsSection, TattooTeaserSection, QuoteStripSection } from '@/components/home'

const homeSchema = {
  '@type': ['LocalBusiness', 'ArtGallery'],
  name: 'Natalia Heller — Arte & Tatuajes',
  url: 'https://tatuajesnaty.com',
  telephone: '+5491166191209',
  image: 'https://tatuajesnaty.com/og-image.webp',
  logo: 'https://tatuajesnaty.com/Logo.svg',
  description:
    'Arte original, tienda online y estudio de tatuajes en Buenos Aires. Prints, cerámica, textiles, stickers y tatuajes de línea fina.',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Desde el estudio',
    addressLocality: 'Ciudad Autónoma de Buenos Aires',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '11:00',
      closes: '17:00',
    },
  ],
  sameAs: ['https://instagram.com/nataliaceller_art'],
}

const Home: React.FC = () => (
  <>
    <SEOMeta
      title="Natalia Heller — Arte Original & Tienda | Buenos Aires"
      description="Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes de línea fina."
      canonical="https://tatuajesnaty.com/"
      schema={homeSchema}
    />

    <main>
      <HomeHeroSection />

      <NHDivider label="Tienda" />

      <FeaturedProductsSection />

      <NHDivider label="Arte en la piel" />

      <TattooTeaserSection />

      <QuoteStripSection />
    </main>
  </>
)

export default Home

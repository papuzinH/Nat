import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import NHDivider from '@/components/shared/NHDivider'
import {
  HomeHeroSection,
  FeaturedProductsSection,
  TattooTeaserSection,
  QuoteStripSection,
} from '@/components/home'
import { getSiteImages } from '@/lib/data/site-images'

export const metadata: Metadata = buildMetadata({
  title: 'Natalia Heller — Arte Original & Tienda | Buenos Aires',
  titleAbsolute: true,
  description:
    'Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes de línea fina.',
  path: '/',
})

// ISR: revalidación on-demand por tag (site_images / products) + fallback horario,
// igual que /tienda y /blog.
export const revalidate = 3600

const homeSchema = {
  '@type': ['LocalBusiness', 'ArtGallery'],
  name: 'Natalia Heller — Arte & Tatuajes',
  url: 'https://tatuajesnaty.com',
  telephone: '+5491132722555',
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

export default async function HomePage() {
  const [heroImages, teaserImages] = await Promise.all([
    getSiteImages('home_hero'),
    getSiteImages('home_teaser'),
  ])
  return (
    <>
      <JsonLd data={homeSchema} />
      <HomeHeroSection images={heroImages} />
      <NHDivider label="Tienda" />
      <FeaturedProductsSection />
      {teaserImages.length > 0 && (
        <>
          <NHDivider label="Arte en la piel" />
          <TattooTeaserSection images={teaserImages} />
        </>
      )}
      <QuoteStripSection />
    </>
  )
}

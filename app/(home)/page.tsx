import type { Metadata } from 'next'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import NHDivider from '@/components/shared/NHDivider'
import {
  HomeHeroSection,
  FeaturedProductsSection,
  TattooTeaserSection,
  QuoteStripSection,
} from '@/components/home'
import { getSiteImages } from '@/lib/data/site-images'
import { getProducts } from '@/lib/data/products'
import type { Product } from '@/data/products'

function latestActive(products: Product[], count: number): Product[] {
  const time = (p: Product) => (p.createdAt ? new Date(p.createdAt).getTime() : 0)
  return products
    .filter((p) => p.status === 'active')
    .sort((a, b) => time(b) - time(a))
    .slice(0, count)
}

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
  url: SITE_URL,
  telephone: '+5491132722555',
  image: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/Logo.svg`,
  description:
    'Arte original, tienda online y estudio de tatuajes en Buenos Aires. Prints, cerámica, textiles, stickers y tatuajes de línea fina.',
  priceRange: '$$',
  currenciesAccepted: 'ARS',
  paymentAccepted: 'Mercado Pago, Transferencia bancaria',
  areaServed: { '@type': 'Country', name: 'Argentina' },
  address: {
    '@type': 'PostalAddress',
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
  sameAs: [
    'https://instagram.com/nataliaceller_art',
    'https://instagram.com/nat.tatt',
  ],
  founder: {
    '@type': 'Person',
    name: 'Natalia Heller',
    jobTitle: 'Artista plástica y tatuadora',
    url: SITE_URL,
    sameAs: [
      'https://instagram.com/nataliaceller_art',
      'https://instagram.com/nat.tatt',
    ],
    knowsAbout: [
      'Ilustración botánica',
      'Acuarela',
      'Impresión giclée',
      'Cerámica',
      'Tatuaje de línea fina',
      'Tatuaje botánico',
    ],
  },
}

export default async function HomePage() {
  const [heroImages, teaserImages, products] = await Promise.all([
    getSiteImages('home_hero'),
    getSiteImages('home_teaser'),
    getProducts().catch(() => []),
  ])
  return (
    <>
      <JsonLd data={homeSchema} />
      <HomeHeroSection images={heroImages} />
      <NHDivider label="Tienda" />
      <FeaturedProductsSection products={latestActive(products, 4)} />
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

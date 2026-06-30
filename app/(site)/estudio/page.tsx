import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import NHDivider from '@/components/shared/NHDivider'
import EstudioHero from '@/components/estudio/EstudioHero'
import MasonryGallery from '@/components/estudio/MasonryGallery'
import StudioPhotosGallery from '@/components/estudio/StudioPhotosGallery'
import ProcessSteps from '@/components/estudio/ProcessSteps'
import ContactEstudioSection from '@/components/estudio/ContactEstudioSection'
import { getSiteImages } from '@/lib/data/site-images'

export const metadata: Metadata = buildMetadata({
  title: 'El Estudio — Tatuajes de línea fina y botánica en Buenos Aires',
  description:
    'Tatuajes de línea fina, botánica y diseño personalizado en Buenos Aires. Conocé el estudio de Natalia Heller, el proceso y reservá tu sesión.',
  path: '/estudio',
})

// ISR: revalidación on-demand por tag (site_images) + fallback horario, igual que /tienda y /blog.
export const revalidate = 3600

const estudioSchema = {
  '@type': 'LocalBusiness',
  name: 'El Estudio — Natalia Heller',
  description:
    'Tatuajes de línea fina, botánica y diseño personalizado en Buenos Aires.',
  url: 'https://tatuajesnaty.com/estudio',
}

export default async function EstudioPage() {
  const [tattooImages, espacioImages] = await Promise.all([
    getSiteImages('estudio_tattoos'),
    getSiteImages('estudio_espacio'),
  ])
  return (
    <div className="min-h-screen bg-cream-100">
      <JsonLd data={estudioSchema} />
      <EstudioHero />
      {espacioImages.length > 0 && (
        <>
          <NHDivider label="el espacio" />
          <StudioPhotosGallery images={espacioImages} />
        </>
      )}
      <MasonryGallery images={tattooImages} />
      <NHDivider label="el proceso" />
      <ProcessSteps />
      <NHDivider label="contacto" />
      <ContactEstudioSection />
    </div>
  )
}

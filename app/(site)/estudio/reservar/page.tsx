import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import ReservarIntro from '@/components/estudio/ReservarIntro'
import BookingForm from '@/components/estudio/BookingForm'

export const metadata: Metadata = buildMetadata({
  title: 'Reservar tatuaje — Cotizá tu diseño personalizado',
  description:
    'Cotizá tu tatuaje personalizado con Natalia Heller. Estilo botánico, line art y diseño a medida en Buenos Aires.',
  path: '/estudio/reservar',
})

const reservarSchema = {
  '@type': 'LocalBusiness',
  name: 'Reservar tatuaje — Natalia Heller',
  description:
    'Formulario para cotizar tu tatuaje personalizado con Natalia Heller. Estilo botánico, line art y diseño a medida en Buenos Aires.',
  url: 'https://tatuajesnaty.com/estudio/reservar',
}

export default function EstudioReservarPage() {
  return (
    <div className="bg-cream-100 py-16 md:py-24 min-h-screen">
      <JsonLd data={reservarSchema} />
      <div className="max-w-2xl mx-auto px-6">
        <ReservarIntro />
        <BookingForm />
      </div>
    </div>
  )
}

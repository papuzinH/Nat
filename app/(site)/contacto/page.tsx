import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import ContactHero from '@/components/contacto/ContactHero'

export const metadata: Metadata = buildMetadata({
  title: 'Contacto — Agendá tu cita o consulta',
  description:
    'Escribime para agendar tu cita o consultar por diseños personalizados. Tatuajes y arte original en Buenos Aires.',
  path: '/contacto',
})

const contactPageSchema = {
  '@type': 'ContactPage',
  name: 'Contacto - Natalia Heller',
  description: 'Agenda tu cita o consulta por diseños personalizados.',
  url: 'https://tatuajesnaty.com/contacto',
  mainEntity: {
    '@type': 'LocalBusiness',
    name: 'Natalia Heller Tattoo Studio',
    telephone: '+54 9 11 3272-2555',
    email: 'agendanattatt@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buenos Aires',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
  },
}

export default function ContactoPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <ContactHero />
    </>
  )
}

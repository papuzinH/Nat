import React from 'react'
import { SchemaMarkup } from '@/components/shared'
import NHDivider from '@/components/shared/NHDivider'
import EstudioHero from '@/components/estudio/EstudioHero'
import StudioPhotosGallery from '@/components/estudio/StudioPhotosGallery'
import MasonryGallery from '@/components/estudio/MasonryGallery'
import ProcessSteps from '@/components/estudio/ProcessSteps'
import ContactEstudioSection from '@/components/estudio/ContactEstudioSection'

const schemaData = {
  name: 'El Estudio — Natalia Heller',
  description: 'Tatuajes de línea fina, botánica y diseño personalizado en Villa Crespo, Buenos Aires.',
  url: 'https://tatuajesnaty.com/estudio',
}

const Estudio: React.FC = () => (
  <div className="min-h-screen bg-cream-100">
    <SchemaMarkup type="LocalBusiness" data={schemaData} />

    <EstudioHero />
    <NHDivider label="el espacio" />
    <StudioPhotosGallery />

    <MasonryGallery />

    <NHDivider label="el proceso" />

    <ProcessSteps />

    <NHDivider label="contacto" />

    <ContactEstudioSection />

  </div>
)

export default Estudio

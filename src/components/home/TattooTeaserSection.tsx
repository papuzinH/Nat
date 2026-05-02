import React from 'react'
import { ButtonPrimary, SectionContainer, SectionTitle } from '@/components/shared'

const TONE_COLORS: Record<string, string> = {
  a: '#ece2d1',
  d: '#d5ddcf',
  c: '#e5d9c7',
}

const TattooTeaserSection: React.FC = () => (
  <SectionContainer
    aria-labelledby="tattoo-teaser-heading"
  >
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

      {/* Left — mosaic */}
      <div className="grid grid-cols-2 gap-3 order-2 md:order-1" aria-hidden="true">
        {/* Tall left */}
        <div
          className="col-span-1 row-span-2 rounded-card overflow-hidden relative"
          style={{ aspectRatio: '3 / 5', background: TONE_COLORS.a }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)' }} />
          <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm" style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}>En piel</span>
        </div>
        {/* Top right */}
        <div
          className="col-span-1 rounded-card overflow-hidden relative"
          style={{ aspectRatio: '1 / 1', background: TONE_COLORS.d }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)' }} />
          <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm" style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}>Boceto</span>
        </div>
        {/* Bottom right */}
        <div
          className="col-span-1 rounded-card overflow-hidden relative"
          style={{ aspectRatio: '1 / 1.3', background: TONE_COLORS.c }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)' }} />
          <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm" style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}>En piel</span>
        </div>
      </div>

      {/* Right — text */}
      <div className="order-1 md:order-2">

        <SectionTitle id="tattoo-teaser-heading" className="mb-6">
          Tatuajes pensados especialmente para vos.
        </SectionTitle>
        <p
          className="font-body text-ink-soft mb-8"
        >
          Línea fina, botánica y ornamental con un amor especial por los detalles. Cada tatuaje empieza con una conversación y termina siendo parte de tu historia.
        </p>


        <ButtonPrimary
          to="/estudio"
        >
          Conocer el estudio
        </ButtonPrimary>

      </div>
    </div>
  </SectionContainer>
)

export default TattooTeaserSection

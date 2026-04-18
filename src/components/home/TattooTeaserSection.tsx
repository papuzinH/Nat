import React from 'react'
import { Link } from 'react-router-dom'

const TONE_COLORS: Record<string, string> = {
  a: '#ece2d1',
  d: '#d5ddcf',
  c: '#e5d9c7',
}

const TattooTeaserSection: React.FC = () => (
  <section
    className="py-20 md:py-28 px-6 md:px-12 bg-cream-100"
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
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-4">
          El estudio
        </p>
        <h2
          id="tattoo-teaser-heading"
          className="font-display font-normal text-ink mb-6"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}
        >
          Tatuajes de línea fina, pensados con vos.
        </h2>
        <p
          className="font-body text-ink-soft mb-8"
          style={{ fontSize: 16, lineHeight: 1.65, maxWidth: 440 }}
        >
          Line art botánico, ornamental y minimalista. Cada tatuaje empieza con una conversación y termina siendo parte de tu historia.
        </p>
        <Link
          to="/estudio"
          className="inline-flex items-center font-body font-semibold text-sm rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
          style={{
            background: 'var(--sage-700, #4a7c59)',
            color: 'var(--cream-50, #fdfcfb)',
            padding: '14px 22px',
            textDecoration: 'none',
          }}
        >
          Conocer el estudio
        </Link>
      </div>
    </div>
  </section>
)

export default TattooTeaserSection

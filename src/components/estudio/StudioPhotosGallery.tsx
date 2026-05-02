import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { SectionContainer } from '@/components/shared'
import NHDivider from '@/components/shared/NHDivider'

export interface StudioPhoto {
  src: string
  alt: string
}

// Agregá acá las fotos reales del estudio
const STUDIO_PHOTOS: StudioPhoto[] = []

const TONE_PLACEHOLDERS = [
  { bg: '#d9e0c8', ratio: '4/3' },
  { bg: '#e8dfd0', ratio: '3/4' },
  { bg: '#dde2d1', ratio: '4/3' },
  { bg: '#e5d9c7', ratio: '1/1' },
  { bg: '#d5ddcf', ratio: '3/4' },
  { bg: '#ece2d1', ratio: '4/3' },
]

const StudioPhotosGallery: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const hasPhotos = STUDIO_PHOTOS.length > 0

  if (!hasPhotos) {
    return (
      <SectionContainer aria-label="El espacio">
        <NHDivider label="el espacio" className="mb-8" />
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          aria-label="Fotos del estudio (próximamente)"
        >
          {TONE_PLACEHOLDERS.map((p, i) => (
            <div
              key={i}
              className="rounded-card overflow-hidden relative"
              style={{
                aspectRatio: p.ratio,
                background: p.bg,
                backgroundImage: `repeating-linear-gradient(
                  135deg,
                  rgba(96,108,56,0.07) 0px,
                  rgba(96,108,56,0.07) 1px,
                  transparent 1px,
                  transparent 8px
                )`,
              }}
            >
              <span
                className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
                style={{ background: 'rgba(254,250,224,0.82)', color: '#5a5350' }}
              >
                Pronto
              </span>
            </div>
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft text-center mt-6">
          Las fotos del espacio estarán disponibles pronto
        </p>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer aria-label="El espacio">
      <NHDivider label="el espacio" className="mb-8" />
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        role="list"
        aria-label="Fotos del estudio"
      >
        {STUDIO_PHOTOS.map((photo, i) => (
          <button
            key={i}
            role="listitem"
            type="button"
            onClick={() => { setIndex(i); setOpen(true) }}
            className="rounded-card overflow-hidden relative group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
            aria-label={`Ver foto: ${photo.alt}`}
            style={{ display: 'block', padding: 0, border: 'none', background: 'none' }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              style={{ background: 'rgba(40,54,24,0.18)' }}
              aria-hidden="true"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5" />
                <path d="M10 14h8M14 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={STUDIO_PHOTOS.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </SectionContainer>
  )
}

export default StudioPhotosGallery

import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import NHLeafMark from '@/components/shared/NHLeafMark'
import NHFlower from '@/components/shared/NHFlower'
import NHSprig from '@/components/shared/NHSprig'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import ButtonPrimary from '@/components/shared/ButtonPrimary'
import ButtonGhost from '@/components/shared/ButtonGhost'

const SLIDES = [
  { label: 'Helecho · acuarela', tone: 'a' },
  { label: 'Cuenco musgo · cerámica', tone: 'b' },
  { label: 'Anémonas · gouache', tone: 'c' },
  { label: 'Tapiz raíz · textil', tone: 'd' },
  { label: 'Olivo · lámina', tone: 'e' },
]

const TONE_COLORS: Record<string, string> = {
  a: '#ece2d1',
  b: '#dde2d1',
  c: '#e5d9c7',
  d: '#d5ddcf',
  e: '#e8dfd0',
}

interface SlideProps {
  label: string
  tone: string
  index: number
}

const Slide: React.FC<SlideProps> = ({ label, tone, index }) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{
      background: TONE_COLORS[tone] ?? '#ece2d1',
      opacity: index === 0 ? 1 : 0,
    }}
  >
    {/* Diagonal stripe overlay */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
      }}
    />
    <span
      className="relative font-mono text-[10px] uppercase tracking-[0.1em] text-center px-3 py-1 rounded-sm"
      style={{
        color: 'var(--ink-soft, #5a5350)',
        background: 'rgba(253,252,251,0.85)',
      }}
    >
      {label}
    </span>
  </div>
)

const HomeHeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const gsapCtxRef = useRef<{ revert: () => void } | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // GSAP crossfade
  useLayoutEffect(() => {
    if (isMobile) return
    if (gsapCtxRef.current) gsapCtxRef.current.revert()

    setCurrentSlide(0)
    gsapCtxRef.current = gsap.context(() => {
      if (!shouldAnimate()) return
      SLIDES.forEach((_, i) => {
        if (!slideRefs.current[i]) return
        gsap.set(slideRefs.current[i] as HTMLDivElement, { opacity: i === 0 ? 1 : 0, scale: 1 })
      })
    })

    return () => {
      if (gsapCtxRef.current) gsapCtxRef.current.revert()
    }
  }, [isMobile])

  const goToSlide = (next: number) => {
    if (isMobile) return
    const prev = currentSlide
    const prevEl = slideRefs.current[prev]
    const nextEl = slideRefs.current[next]
    if (!prevEl || !nextEl) return

    if (shouldAnimate()) {
      gsap.to(prevEl, { opacity: 0, duration: 0.7, ease: 'power2.inOut' })
      gsap.fromTo(
        nextEl,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.inOut' }
      )
    } else {
      gsap.set(prevEl, { opacity: 0 })
      gsap.set(nextEl, { opacity: 1 })
    }
    setCurrentSlide(next)
  }

  // Auto-advance
  useEffect(() => {
    if (isMobile) return
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % SLIDES.length
        const prevEl = slideRefs.current[prev]
        const nextEl = slideRefs.current[next]
        if (prevEl && nextEl && shouldAnimate()) {
          gsap.to(prevEl, { opacity: 0, duration: 0.7, ease: 'power2.inOut' })
          gsap.fromTo(
            nextEl,
            { opacity: 0, scale: 1.04 },
            { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.inOut' }
          )
        }
        return next
      })
    }, 4500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isMobile])

  const handleArrow = (dir: 1 | -1) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const next = (currentSlide + dir + SLIDES.length) % SLIDES.length
    goToSlide(next)
  }

  const handleDot = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    goToSlide(i)
  }

  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] min-h-[90vh] md:min-h-[85vh]">

        {/* Left column — Text */}
        <div className="relative flex flex-col justify-center px-6 py-16 md:px-16 md:py-24 order-2 md:order-1">

          {/* Decorative motifs */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 pointer-events-none" aria-hidden="true">
            <NHLeafMark size={isMobile ? 42 : 56} color="var(--sage-500, #7a9e7e)" />
          </div>
          <div className="absolute bottom-8 left-6 md:bottom-12 md:left-10 pointer-events-none" aria-hidden="true" style={{ opacity: 0.7 }}>
            <NHFlower size={isMobile ? 30 : 46} color="var(--sage-500, #7a9e7e)" />
          </div>

          {/* Eyebrow */}
          <HeroEyebrow className="mb-6 flex items-center gap-3">
            <NHSprig size={40} color="var(--sage-500, #7a9e7e)" />
            Estudio · Buenos Aires · desde 2019
          </HeroEyebrow>

          {/* H1 */}
          <HeroTitle className="mb-6">
            Botánica sensible,{' '}
            <em>hecha con paciencia.</em>
          </HeroTitle>

          {/* Paragraph */}
          <HeroSubtitle className="mb-10 max-w-[480px]">
            Obra en papel, cerámica, textiles y tatuaje de línea fina. Cada pieza nace despacio en el estudio del barrio Villa Crespo, rodeada de plantas.
          </HeroSubtitle>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <ButtonPrimary to="/tienda">Explorar la tienda →</ButtonPrimary>
            <ButtonGhost to="/estudio">Reservar tatuaje</ButtonGhost>
          </div>
        </div>

        {/* Right column — Carousel (desktop) / Static image (mobile) */}
        <div className="relative order-1 md:order-2 px-6 py-16 md:px-16 md:py-24" style={{ minHeight: isMobile ? 320 : undefined }}>
          {isMobile ? (
            /* Mobile: first slide static */
            <div
              className="w-full h-[320px] flex items-center justify-center relative"
              style={{ background: TONE_COLORS.a }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
                }}
              />
              <span
                className="relative font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-sm"
                style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}
              >
                {SLIDES[0].label}
              </span>
            </div>
          ) : (
            /* Desktop: full carousel */
            <div
              className="relative w-full h-full"
              style={{
                boxShadow: '0 20px 60px rgba(74,124,89,0.1), 0 2px 6px rgba(44,44,44,0.06)',
              }}
            >
              {/* Slides */}
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  ref={(el: HTMLDivElement | null) => { slideRefs.current[i] = el }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  aria-hidden={i !== currentSlide}
                >
                  <Slide label={slide.label} tone={slide.tone} index={i} />
                </div>
              ))}

              {/* Counter */}
              <div
                className="absolute top-4 left-4 font-mono text-[11px] px-2 py-1 rounded-sm z-10"
                style={{
                  background: 'rgba(253,252,251,0.9)',
                  color: 'var(--ink-soft)',
                  letterSpacing: '0.08em',
                }}
                aria-live="polite"
                aria-label={`Imagen ${currentSlide + 1} de ${SLIDES.length}`}
              >
                {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </div>

              {/* Arrow left */}
              <button
                onClick={() => handleArrow(-1)}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-200 hover:opacity-100 opacity-80"
                style={{ background: 'rgba(253,252,251,0.9)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Arrow right */}
              <button
                onClick={() => handleArrow(1)}
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-200 hover:opacity-100 opacity-80"
                style={{ background: 'rgba(253,252,251,0.9)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10" role="tablist" aria-label="Slides del carrusel">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDot(i)}
                    role="tab"
                    aria-selected={i === currentSlide}
                    aria-label={`Ir a imagen ${i + 1}`}
                    className="transition-all duration-300 rounded-pill"
                    style={{
                      width: i === currentSlide ? 22 : 6,
                      height: 6,
                      background:
                        i === currentSlide
                          ? 'var(--sage-700, #4a7c59)'
                          : 'var(--taupe-500, #b8a898)',
                      opacity: i === currentSlide ? 1 : 0.4,
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeHeroSection

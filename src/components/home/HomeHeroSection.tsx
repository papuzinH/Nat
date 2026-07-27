'use client'

import React, { useState, useLayoutEffect, useRef, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { animateHero, splitWords } from '@/lib/animations'
import NHLeafMark from '@/components/shared/NHLeafMark'
import NHBranch from '@/components/shared/NHBranch'
import NHFlower from '@/components/shared/NHFlower'
import NHSprig from '@/components/shared/NHSprig'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import ButtonPrimary from '@/components/shared/ButtonPrimary'
import ButtonGhost from '@/components/shared/ButtonGhost'
import type { SiteImage } from '@/lib/data/site-images'

const PLACEHOLDER_SLIDES = [
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

const TITLE_PRE = 'Te invito a mi '
const TITLE_EM = 'universo creativo'

type HeroSlide =
  | { kind: 'image'; url: string; alt: string; caption: string; focalX: number; focalY: number }
  | { kind: 'placeholder'; label: string; tone: string }

const SlideMedia: React.FC<{ slide: HeroSlide; priority?: boolean }> = ({ slide, priority }) => {
  if (slide.kind === 'image') {
    return (
      <Image
        src={slide.url}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="(max-width: 767px) 100vw, 55vw"
        className="object-cover"
        style={{ objectPosition: `${slide.focalX}% ${slide.focalY}%` }}
      />
    )
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: TONE_COLORS[slide.tone] ?? '#ece2d1' }}>
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
        {slide.label}
      </span>
    </div>
  )
}

const MobileTouchCarousel: React.FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Sync dot indicator with scroll position
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const slideWidth = track.clientWidth
      if (!slideWidth) return
      const idx = Math.round(track.scrollLeft / slideWidth)
      setActiveIndex(idx)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * track.clientWidth, behavior: shouldAnimate() ? 'smooth' : 'auto' })
  }

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory w-full h-[280px] rounded-card"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        role="region"
        aria-label="Carrusel de obras destacadas"
        aria-roledescription="carousel"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full h-full snap-center relative overflow-hidden"
            style={slide.kind === 'placeholder' ? { background: TONE_COLORS[slide.tone] ?? '#ece2d1' } : {}}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}${slide.kind === 'placeholder' ? ': ' + slide.label : slide.alt ? ': ' + slide.alt : ''}`}
          >
            <SlideMedia slide={slide} />
          </div>
        ))}
      </div>

      {/* Dots — wrapper extends tap area to 44px */}
      {slides.length > 1 && (
      <div className="mt-2 flex justify-center items-center" role="tablist" aria-label="Selector de imagen">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Ir a imagen ${i + 1}`}
            className="inline-flex items-center justify-center min-w-[44px] h-[44px] bg-transparent border-0 cursor-pointer p-0"
          >
            <span
              aria-hidden="true"
              className="block transition-all duration-300 rounded-pill"
              style={{
                width: i === activeIndex ? 22 : 6,
                height: 6,
                background:
                  i === activeIndex
                    ? 'var(--sage-700, #4a7c59)'
                    : 'var(--taupe-500, #b8a898)',
                opacity: i === activeIndex ? 1 : 0.4,
              }}
            />
          </button>
        ))}
      </div>
      )}
    </div>
  )
}

const HomeHeroSection: React.FC<{ images?: SiteImage[] }> = ({ images = [] }) => {
  const slides: HeroSlide[] = useMemo(
    () =>
      images.length > 0
        ? images.map((img) => ({
            kind: 'image' as const,
            url: img.url,
            alt: img.alt,
            caption: img.caption,
            focalX: img.focalX,
            focalY: img.focalY,
          }))
        : PLACEHOLDER_SLIDES.map((s) => ({ kind: 'placeholder' as const, label: s.label, tone: s.tone })),
    [images]
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const gsapCtxRef = useRef<{ revert: () => void } | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const stopAutoAdvance = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoAdvance = useCallback(() => {
    stopAutoAdvance()
    if (isMobile || !shouldAnimate() || isPaused || slides.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length
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
  }, [isMobile, isPaused, stopAutoAdvance, slides.length])

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Hero text entrance animation
  useLayoutEffect(() => {
    if (!textRef.current) return
    return animateHero(textRef.current)
  }, [])

  // GSAP crossfade
  useLayoutEffect(() => {
    if (isMobile) return
    if (gsapCtxRef.current) gsapCtxRef.current.revert()

    setCurrentSlide(0)
    gsapCtxRef.current = gsap.context(() => {
      if (!shouldAnimate()) return
      slides.forEach((_, i) => {
        if (!slideRefs.current[i]) return
        gsap.set(slideRefs.current[i] as HTMLDivElement, { opacity: i === 0 ? 1 : 0, scale: 1 })
      })
    })

    return () => {
      if (gsapCtxRef.current) gsapCtxRef.current.revert()
    }
  }, [isMobile, slides])

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
    startAutoAdvance()
    return stopAutoAdvance
  }, [startAutoAdvance, stopAutoAdvance])

  const handleArrow = (dir: 1 | -1) => {
    stopAutoAdvance()
    const next = (currentSlide + dir + slides.length) % slides.length
    goToSlide(next)
  }

  const handleDot = (i: number) => {
    stopAutoAdvance()
    goToSlide(i)
  }

  const togglePause = () => setIsPaused((p) => !p)

  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] min-h-[80dvh] md:min-h-[85vh]">

        {/* Left column — Carousel (desktop) / Text second (mobile) */}
        <div ref={textRef} className="relative flex flex-col justify-center px-6 py-10 md:px-10 md:py-20 lg:px-16 lg:py-24 order-1 md:order-2">

          {/* Decorative motifs — derivan a distinta velocidad al scrollear */}
          {isMobile ? (
            <div className="absolute top-8 right-8 pointer-events-none" aria-hidden="true">
              <NHLeafMark size={42} color="var(--sage-500, #7a9e7e)" />
            </div>
          ) : (
            <div
              className="absolute top-0 right-6 lg:right-10 pointer-events-none"
              aria-hidden="true"
              data-nh-drift="0.07"
            >
              <NHBranch size={78} color="var(--sage-500, #7a9e7e)" />
            </div>
          )}
          <div
            className="absolute bottom-8 left-6 md:bottom-12 md:left-10 pointer-events-none"
            aria-hidden="true"
            style={{ opacity: 0.7 }}
            data-nh-drift="-0.05"
          >
            <NHFlower size={isMobile ? 30 : 46} color="var(--sage-500, #7a9e7e)" />
          </div>

          {/* Eyebrow */}
          <HeroEyebrow className="hero-eyebrow mb-6 flex items-center gap-3 text-amber-700">
            <NHSprig size={40} color="var(--amber-700)" />
            ARTE · BUENOS AIRES · DESDE 1997
          </HeroEyebrow>

          {/* H1 */}
          <HeroTitle className="mb-3">
            <span>
              {splitWords(TITLE_PRE).map((token, i) =>
                /^\s+$/.test(token) ? (
                  <span key={`pre-${i}`}>{token}</span>
                ) : (
                  <span
                    key={`pre-${i}`}
                    data-split-word
                    style={{ display: 'inline-block' }}
                  >
                    {token}
                  </span>
                )
              )}
              <em>
                {splitWords(TITLE_EM).map((token, i) =>
                  /^\s+$/.test(token) ? (
                    <span key={`em-${i}`}>{token}</span>
                  ) : (
                    <span
                      key={`em-${i}`}
                      data-split-word
                      style={{ display: 'inline-block' }}
                    >
                      {token}
                    </span>
                  )
                )}
              </em>
            </span>
          </HeroTitle>

          {/* Paragraph */}
          <HeroSubtitle className="hero-subtitle mb-10 max-w-[480px]">
            Un universo de líneas, emociones y amor por los detalles. Creaciones únicas para la piel y el hogar.
          </HeroSubtitle>

          {/* CTAs */}
          <div className="hero-extra flex flex-wrap gap-3">
            <ButtonPrimary to="/tienda">Explorar la tienda →</ButtonPrimary>
            <ButtonGhost to="/estudio">Reservar tatuaje</ButtonGhost>
          </div>
        </div>

        {/* Left column — Carousel (desktop) / Touch carousel (mobile, second) */}
        <div className="relative order-2 md:order-1 px-6 py-10 md:px-10 md:py-20 lg:px-16 lg:py-24">
          {isMobile ? (
            /* Mobile: native scroll-snap touch carousel */
            <MobileTouchCarousel slides={slides} />
          ) : (
            /* Desktop: full carousel */
            <div
              className="relative w-full h-full"
              style={{
                boxShadow: '0 20px 60px rgba(74,124,89,0.1), 0 2px 6px rgba(44,44,44,0.06)',
              }}
              onMouseEnter={stopAutoAdvance}
              onMouseLeave={startAutoAdvance}
              onFocus={stopAutoAdvance}
            >
              {/* Slides */}
              {slides.map((slide, i) => (
                <div
                  key={i}
                  ref={(el: HTMLDivElement | null) => { slideRefs.current[i] = el }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  aria-hidden={i !== currentSlide}
                >
                  <SlideMedia slide={slide} priority={i === 0} />
                  {slide.kind === 'image' && slide.caption && (
                    <div
                      className="absolute bottom-4 left-4 right-4 z-10"
                    >
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
                        style={{
                          background: 'rgba(253,252,251,0.9)',
                          color: 'var(--ink-soft)',
                        }}
                      >
                        {slide.caption}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Controles — solo con más de un slide */}
              {slides.length > 1 && (
              <>
              {/* Counter + Pause/Play */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div
                  className="font-mono text-[11px] px-2 py-1 rounded-sm"
                  style={{
                    background: 'rgba(253,252,251,0.9)',
                    color: 'var(--ink-soft)',
                    letterSpacing: '0.08em',
                  }}
                  aria-live="polite"
                  aria-label={`Imagen ${currentSlide + 1} de ${slides.length}`}
                >
                  {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div>
                <button
                  onClick={togglePause}
                  aria-label={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
                  aria-pressed={isPaused}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-opacity duration-200 hover:opacity-100 opacity-80"
                  style={{ background: 'rgba(253,252,251,0.9)', color: 'var(--ink-soft)' }}
                >
                  {isPaused ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                      <path d="M2 1l7 4-7 4z" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="1" width="2" height="8" />
                      <rect x="6" y="1" width="2" height="8" />
                    </svg>
                  )}
                </button>
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

              {/* Dots — wrapper extends hit area to 44px (WCAG 2.5.8) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center z-10" role="tablist" aria-label="Slides del carrusel">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDot(i)}
                    role="tab"
                    aria-selected={i === currentSlide}
                    aria-label={`Ir a imagen ${i + 1}`}
                    className="inline-flex items-center justify-center min-w-[44px] h-[44px] bg-transparent border-0 cursor-pointer p-0"
                  >
                    <span
                      aria-hidden="true"
                      className="block transition-all duration-300 rounded-pill"
                      style={{
                        width: i === currentSlide ? 22 : 6,
                        height: 6,
                        background:
                          i === currentSlide
                            ? 'var(--sage-700, #4a7c59)'
                            : 'var(--taupe-500, #b8a898)',
                        opacity: i === currentSlide ? 1 : 0.4,
                      }}
                    />
                  </button>
                ))}
              </div>
              </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeHeroSection

import React, { useLayoutEffect, useEffect, useRef, useState, useCallback } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { SectionContainer } from '@/components/shared'

export interface StudioPhoto {
  src: string
  alt: string
}

const STUDIO_PHOTOS: StudioPhoto[] = []

const TONE_PLACEHOLDERS = [
  { bg: '#d9e0c8', ratio: '4/3' },
  { bg: '#e8dfd0', ratio: '3/4' },
  { bg: '#dde2d1', ratio: '4/3' },
  { bg: '#e5d9c7', ratio: '1/1' },
  { bg: '#d5ddcf', ratio: '3/4' },
  { bg: '#ece2d1', ratio: '4/3' },
]

const AUTOPLAY_DELAY = 4

type Slide = StudioPhoto | { bg: string; ratio: string }
const SLIDES: Slide[] = STUDIO_PHOTOS.length > 0 ? STUDIO_PHOTOS : TONE_PLACEHOLDERS

const StudioPhotosGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const activeIndexRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dotSpansRef = useRef<(HTMLSpanElement | null)[]>([])
  const arrowPrevRef = useRef<HTMLButtonElement>(null)
  const arrowNextRef = useRef<HTMLButtonElement>(null)
  const autoplayRef = useRef<gsap.core.Tween | null>(null)
  const slideSizeRef = useRef(0)
  const pointerStartX = useRef(0)

  const count = SLIDES.length
  const hasPhotos = STUDIO_PHOTOS.length > 0

  // Keep ref in sync for use inside callbacks that can't read fresh state
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // ── Autoplay ──────────────────────────────────────────────────────────────

  const stopAutoplay = useCallback(() => {
    autoplayRef.current?.kill()
    autoplayRef.current = null
  }, [])

  const scheduleNext = useCallback(() => {
    autoplayRef.current = gsap.delayedCall(AUTOPLAY_DELAY, () => {
      setActiveIndex((prev) => (prev + 1) % count)
      scheduleNext()
    })
  }, [count])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    scheduleNext()
  }, [stopAutoplay, scheduleNext])

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [startAutoplay, stopAutoplay])

  // ── Slide width + entrance animation ─────────────────────────────────────

  const calcSlideWidth = useCallback(() => {
    const slide = trackRef.current?.querySelector<HTMLElement>('.studio-slide')
    if (slide) slideSizeRef.current = slide.offsetWidth
  }, [])

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    calcSlideWidth()

    const ro = new ResizeObserver(() => {
      calcSlideWidth()
      if (trackRef.current) {
        gsap.set(trackRef.current, { x: -(activeIndexRef.current * slideSizeRef.current) })
      }
    })
    ro.observe(wrapper)

    // Clip-path reveal on scroll enter
    let ctx: gsap.Context | undefined
    if (shouldAnimate()) {
      ctx = gsap.context(() => {
        gsap.from(wrapper, {
          clipPath: 'inset(0% 100% 0% 0%)',
          opacity: 0.001,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 85%', once: true },
        })
      }, wrapper)
    }

    // Set initial dot state after refs are populated
    dotSpansRef.current.forEach((span, i) => {
      if (span) gsap.set(span, { scaleX: i === 0 ? 3 : 1, opacity: i === 0 ? 1 : 0.45 })
    })

    return () => {
      ctx?.revert()
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Animate track + dots when activeIndex changes ─────────────────────────

  useEffect(() => {
    if (!trackRef.current) return

    gsap.to(trackRef.current, {
      x: -(activeIndex * slideSizeRef.current),
      duration: 0.65,
      ease: 'expo.inOut',
      overwrite: 'auto',
    })

    dotSpansRef.current.forEach((span, i) => {
      if (!span) return
      gsap.to(span, {
        scaleX: i === activeIndex ? 3 : 1,
        opacity: i === activeIndex ? 1 : 0.45,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }, [activeIndex])

  // ── Arrow hover micro-animations ──────────────────────────────────────────

  useEffect(() => {
    if (!shouldAnimate()) return

    const arrows = [arrowPrevRef.current, arrowNextRef.current]
    const cleanups: (() => void)[] = []

    arrows.forEach((el) => {
      if (!el) return
      const onEnter = () =>
        gsap.to(el, { scale: 1.12, duration: 0.18, ease: 'power2.out', overwrite: 'auto' })
      const onLeave = () =>
        gsap.to(el, { scale: 1, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  // ── Navigation helpers ────────────────────────────────────────────────────

  const navigate = useCallback(
    (delta: number) => {
      stopAutoplay()
      setActiveIndex((prev) => (prev + delta + count) % count)
      scheduleNext()
    },
    [count, stopAutoplay, scheduleNext]
  )



  // ── Touch / pointer swipe ─────────────────────────────────────────────────

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const delta = pointerStartX.current - e.clientX
    if (Math.abs(delta) > 40) navigate(delta > 0 ? 1 : -1)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SectionContainer aria-label="El espacio">

      {/* Slider wrapper — clip-path reveal target, fixed height */}
      <div
        ref={wrapperRef}
        className="relative overflow-hidden select-none rounded-card h-56 sm:h-64 md:h-96 w-full"
        role="region"
        aria-roledescription="carousel"
        aria-label="Fotos del espacio"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Track */}
        <div ref={trackRef} className="flex h-full w-full" style={{ willChange: 'transform' }}>
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="studio-slide flex-shrink-0 h-full px-1"
              /* Peek: slightly narrower than 100% reveals edge of next slide */
              style={{ width: '100%' }}
              aria-hidden={i !== activeIndex ? true : undefined}
            >
              {hasPhotos ? (
                <button
                  type="button"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                  className="block w-full h-full rounded-card overflow-hidden group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
                  aria-label={`Ver foto: ${(slide as StudioPhoto).alt}`}
                  style={{ padding: 0, border: 'none', background: 'none' }}
                >
                  <img
                    src={(slide as StudioPhoto).src}
                    alt={(slide as StudioPhoto).alt}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </button>
              ) : (
                <div
                  className="w-full h-full rounded-card overflow-hidden relative"
                  style={{
                    background: (slide as { bg: string; ratio: string }).bg,
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
              )}
            </div>
          ))}
        </div>

        {/* Prev arrow */}
        <button
          ref={arrowPrevRef}
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-cream-50/80 backdrop-blur-sm border border-cream-200 text-ink-soft hover:text-ink transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
          aria-label="Slide anterior"
          style={{ willChange: 'transform' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          ref={arrowNextRef}
          type="button"
          onClick={() => navigate(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-cream-50/80 backdrop-blur-sm border border-cream-200 text-ink-soft hover:text-ink transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
          aria-label="Slide siguiente"
          style={{ willChange: 'transform' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      

  
      {hasPhotos && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={STUDIO_PHOTOS.map((p) => ({ src: p.src, alt: p.alt }))}
        />
      )}
    </SectionContainer>
  )
}

export default StudioPhotosGallery

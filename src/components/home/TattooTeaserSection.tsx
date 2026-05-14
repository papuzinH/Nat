import React, { useLayoutEffect, useRef } from 'react'
import { ButtonPrimary, SectionContainer, SectionTitle } from '@/components/shared'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'
import { splitWords } from '@/lib/animations'

const TONE_COLORS: Record<string, string> = {
  a: '#ece2d1',
  d: '#d5ddcf',
  c: '#e5d9c7',
}

const TattooTeaserSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const mosaicRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const mosaic = mosaicRef.current
    const title = titleRef.current
    const paragraph = paragraphRef.current
    const cta = ctaRef.current
    if (!section || !shouldAnimate()) return

    // Pre-set hidden state synchronously to avoid visible→hidden flash
    if (title) {
      const words = title.querySelectorAll<HTMLElement>('[data-split-word]')
      if (words.length) gsap.set(words, { y: 18, opacity: 0, filter: 'blur(4px)' })
    }
    if (paragraph) gsap.set(paragraph, { opacity: 0, y: 12 })
    if (cta) gsap.set(cta, { opacity: 0, y: 12 })

    const ctx = gsap.context(() => {
      if (mosaic) {
        const cards = mosaic.querySelectorAll<HTMLElement>('.teaser-card')
        gsap.fromTo(
          cards,
          { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.001 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 0.95,
            stagger: 0.13,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          }
        )

        const bgs = mosaic.querySelectorAll<HTMLElement>('.teaser-card-bg')
        bgs.forEach((bg) => {
          gsap.fromTo(
            bg,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          )
        })
      }

      if (title) {
        const words = title.querySelectorAll<HTMLElement>('[data-split-word]')
        gsap.fromTo(
          words,
          { y: 18, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          }
        )
      }

      if (paragraph) {
        gsap.fromTo(
          paragraph,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: 0.45,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          }
        )
      }

      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          }
        )
      }
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  const titleText = 'Tatuajes pensados especialmente para vos.'

  return (
    <SectionContainer aria-labelledby="tattoo-teaser-heading">
      <div
        ref={sectionRef}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
      >
        <div ref={mosaicRef} className="grid grid-cols-2 gap-3 order-2 md:order-1" aria-hidden="true">
          <div
            className="teaser-card col-span-1 row-span-2 rounded-card overflow-hidden relative"
            style={{ aspectRatio: '3 / 5', background: TONE_COLORS.a }}
          >
            <div
              className="teaser-card-bg absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
              }}
            />
            <span
              className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
              style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}
            >
              En piel
            </span>
          </div>
          <div
            className="teaser-card col-span-1 rounded-card overflow-hidden relative"
            style={{ aspectRatio: '1 / 1', background: TONE_COLORS.d }}
          >
            <div
              className="teaser-card-bg absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
              }}
            />
            <span
              className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
              style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}
            >
              Boceto
            </span>
          </div>
          <div
            className="teaser-card col-span-1 rounded-card overflow-hidden relative"
            style={{ aspectRatio: '1 / 1.3', background: TONE_COLORS.c }}
          >
            <div
              className="teaser-card-bg absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
              }}
            />
            <span
              className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
              style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}
            >
              En piel
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <SectionTitle id="tattoo-teaser-heading" className="mb-6">
            <span ref={titleRef}>
              {splitWords(titleText).map((token, i) =>
                /^\s+$/.test(token) ? (
                  <span key={i}>{token}</span>
                ) : (
                  <span
                    key={i}
                    data-split-word
                    style={{ display: 'inline-block' }}
                  >
                    {token}
                  </span>
                )
              )}
            </span>
          </SectionTitle>
          <p ref={paragraphRef} className="font-body text-ink-soft mb-8">
            Línea fina, botánica y ornamental con un amor especial por los detalles. Cada tatuaje empieza con una conversación y termina siendo parte de tu historia.
          </p>

          <div ref={ctaRef}>
            <ButtonPrimary to="/estudio">Conocer el estudio</ButtonPrimary>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}

export default TattooTeaserSection

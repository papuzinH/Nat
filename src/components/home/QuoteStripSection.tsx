import React, { useLayoutEffect, useRef } from 'react'
import { SectionContainer } from '../shared'
import NHDivider from '../shared/NHDivider'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { splitWords } from '@/lib/animations'

const QUOTE = '"Mi intención es ofrecer una experiencia para el recuerdo, transmitiendo calma, seguridad y compromiso, no solo con el resultado, sino con todo el proceso."'

const QuoteStripSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const citeRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const quote = quoteRef.current
    const cite = citeRef.current
    const line = lineRef.current
    if (!section || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      if (quote) {
        const words = quote.querySelectorAll<HTMLElement>('[data-split-word]')
        gsap.fromTo(
          words,
          { y: 14, opacity: 0, filter: 'blur(3px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.025,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          }
        )
      }

      if (cite) {
        gsap.fromTo(
          cite,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.25,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 70%', once: true },
          }
        )
      }

      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.7,
            delay: 0.45,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 70%', once: true },
          }
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <SectionContainer aria-label="Sobre el estudio">
      <NHDivider label="Un espacio distinto" className="md:mb-8" />
      <section ref={sectionRef} className="max-w-3xl mx-auto text-center">
        <blockquote>
          <p
            ref={quoteRef}
            className="font-display font-normal text-ink"
            style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontStyle: 'italic', lineHeight: 1.35 }}
          >
            {splitWords(QUOTE).map((token, i) =>
              /^\s+$/.test(token) ? (
                <span key={i}>{token}</span>
              ) : (
                <span
                  key={i}
                  data-split-word
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {token}
                </span>
              )
            )}
          </p>
          <footer className="mt-6 inline-flex flex-col items-center gap-2">
            <span
              ref={lineRef}
              aria-hidden="true"
              style={{
                display: 'block',
                width: 36,
                height: 1,
                background: 'var(--amber-700, #BC6C25)',
                transformOrigin: 'left center',
              }}
            />
            <cite
              ref={citeRef}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-700"
              style={{ opacity: 0 }}
            >
              — Natalia, desde el estudio
            </cite>
          </footer>
        </blockquote>
      </section>
    </SectionContainer>
  )
}

export default QuoteStripSection

import React, { useLayoutEffect, useRef } from 'react'
import { TATTOO_CARDS } from '@/assets/tattoo/mock-data'
import type { TatTone } from '@/assets/tattoo/mock-data'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'

const TONE_BG: Record<TatTone, string> = {
  a: '#ece2d1',
  b: '#dde2d1',
  c: '#e5d9c7',
  d: '#d5ddcf',
  e: '#e8dfd0',
  f: '#dfdfd1',
}

const MasonryGallery: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.masonry-card', {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: { amount: 0.45, from: 'random' },
              ease: 'power2.out',
              overwrite: 'auto',
            }
          ),
      })
    }, wrapper)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapperRef} className="bg-cream-100 px-6 md:px-12 py-16 md:py-20">
      <div className="[column-count:2] md:[column-count:4]" style={{ columnGap: '10px' }}>
        {TATTOO_CARDS.map((card) => (
          <div
            key={card.id}
            className="masonry-card relative break-inside-avoid mb-3 md:mb-4 rounded-[4px] overflow-hidden hover:-translate-y-0.5 hover:scale-[1.015] transition-transform duration-[260ms] ease-out"
            style={{ willChange: 'transform' }}
          >
            {card.image ? (
              <img
                src={card.image}
                alt={card.kind}
                loading="lazy"
                className="w-full block"
                style={{ aspectRatio: `1 / ${card.tall}`, objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  aspectRatio: `1 / ${card.tall}`,
                  background: TONE_BG[card.tone],
                  backgroundImage: `repeating-linear-gradient(
                    135deg,
                    rgba(74,124,89,0.07) 0px,
                    rgba(74,124,89,0.07) 1px,
                    transparent 1px,
                    transparent 8px
                  )`,
                }}
              />
            )}

            <div className="absolute bottom-2 left-2">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-[3px]"
                style={{ background: 'rgba(253, 252, 251, 0.82)', color: '#5a5350' }}
              >
                {card.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MasonryGallery

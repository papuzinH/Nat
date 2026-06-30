'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import type { SiteImage } from '@/lib/data/site-images'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'
import { ButtonPrimary, NHSprig } from '@/components/shared'

const MasonryGallery: React.FC<{ images?: SiteImage[] }> = ({ images = [] }) => {
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

  const portfolioCard = (
    <div
      className="masonry-card relative w-[min(400px,90%)] rounded-[6px] bg-cream-50 border border-sage-200/50 shadow-2xl p-8 md:p-9 flex flex-col items-center text-center gap-4 pointer-events-auto overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top, rgba(168,184,122,0.10) 0%, transparent 60%)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-sage-500 to-transparent opacity-60"
      />

      <NHSprig size={72} color="#606C38" className="opacity-75" />

      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-700">
        @nat.tatt
      </p>

      <h3 className="font-display text-2xl md:text-[26px] leading-tight text-ink">
        Mi portfolio completo
      </h3>

      <p className="text-sm font-body text-ink-soft leading-relaxed max-w-[280px]">
        Te invito a ver más de mi trabajo haciendo click en el link
      </p>

      <ButtonPrimary
        href="https://www.instagram.com/nat.tatt/"
        target="_blank"
        className="mt-2"
      >
        PORTFOLIO
      </ButtonPrimary>
    </div>
  )

  return (
    <section ref={wrapperRef} className="bg-cream-100 px-6 md:px-12 py-16 md:py-20">
      {images.length > 0 ? (
        <div className="relative">
          <div className="[column-count:2] md:[column-count:4]" style={{ columnGap: '10px' }}>
            {images.map((img, i) => (
              <div
                key={img.id}
                className="masonry-card relative break-inside-avoid mb-3 md:mb-4 rounded-[4px] overflow-hidden hover:-translate-y-0.5 hover:scale-[1.015] transition-transform duration-[260ms] ease-out"
                style={{ willChange: 'transform' }}
              >
                <div className="relative w-full" style={{ aspectRatio: i % 3 === 0 ? '1 / 1.35' : '1 / 1' }}>
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    style={{ objectPosition: `${img.focalX}% ${img.focalY}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {portfolioCard}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          {portfolioCard}
        </div>
      )}
    </section>
  )
}

export default MasonryGallery

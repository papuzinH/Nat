'use client'

import React, { useLayoutEffect, useRef } from 'react'
import NHLeafMark from '@/components/shared/NHLeafMark'
import NHBranch from '@/components/shared/NHBranch'
import HeroEyebrow from '@/components/shared/HeroEyebrow'
import HeroTitle from '@/components/shared/HeroTitle'
import HeroSubtitle from '@/components/shared/HeroSubtitle'
import { SectionContainer } from '../shared'
import { animateHero, splitWords } from '@/lib/animations'

const TITLE_PRE = 'Un momento para vos '
const TITLE_EM = 'y un recuerdo para siempre.'

const EstudioHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    return animateHero(containerRef.current)
  }, [])

  return (
    // `relative` es necesario: sin él los motivos absolutos se anclaban al primer
    // ancestro posicionado, no a la sección.
    <SectionContainer className="relative overflow-hidden">
      <div
        className="absolute top-0 right-4 lg:right-10 pointer-events-none hidden md:block"
        aria-hidden="true"
        data-nh-drift="0.07"
      >
        <NHBranch size={86} color="#7a9e7e" />
      </div>
      <NHLeafMark
        size={44}
        color="#7a9e7e"
        className="absolute top-6 right-6 md:hidden"
      />

      <div className="max-w-7xl mx-auto" ref={containerRef}>
        <HeroEyebrow className="hero-eyebrow mb-6">Estudio de tatuaje</HeroEyebrow>

        <HeroTitle className="mb-6">
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
            <em style={{ display: 'block' }}>
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

        <HeroSubtitle className="hero-subtitle max-w-2xl">
          Me especializo en línea fina, botánica y ornamental. La idea es crear algo especial y único que se adapte a la anatomía de tu cuerpo.
        </HeroSubtitle>
      </div>
    </SectionContainer>
  )
}

export default EstudioHero

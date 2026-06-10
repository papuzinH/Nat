'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, shouldAnimate } from '@/lib/gsap'

// Hero animado de la página de reserva (extraído del screen legacy para que la
// página pueda ser Server Component y exportar metadata).
const ReservarIntro: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.hero-line')
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      )
    }, hero)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef}>
      <Link
        href="/estudio"
        className="hero-line font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 inline-flex items-center gap-2 mb-10 hover:text-sage-900 transition-colors duration-150"
      >
        <span aria-hidden="true">←</span> Volver al estudio
      </Link>

      <p className="hero-line font-mono text-[11px] uppercase tracking-[0.16em] text-sage-700 mb-4">
        Formulario de tatuaje
      </p>

      <h1
        className="hero-line font-display font-normal mb-5 leading-[1.1] text-ink"
        style={{ fontSize: 'clamp(32px, 5vw, 44px)' }}
      >
        Contame tu idea
      </h1>

      <p
        className="hero-line font-body text-ink-soft mb-12 leading-[1.65]"
        style={{ fontSize: '16px', maxWidth: '520px' }}
      >
        Tomate unos minutos. Cuanto más detalle me des, mejor puedo entender lo que tenés en
        mente y armar una propuesta que se acerque a tu idea.
      </p>
    </div>
  )
}

export default ReservarIntro

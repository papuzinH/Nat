'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import NHLeafMark from '@/components/shared/NHLeafMark'
import { gsap, shouldAnimate } from '@/lib/gsap'

const EstudioCTA: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.cta-field')
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        }
      )
      if (items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 80%', once: true },
            delay: 0.2,
          }
        )
      }
    }, card)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className="bg-cream-50 rounded-form p-8 md:p-9"
      style={{
        border: '1px solid rgba(44,44,44,0.08)',
        boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
      }}
    >
      <div className="cta-field flex items-center gap-2 mb-3">
        <NHLeafMark size={18} color="#7a9e7e" />
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700">
          Cotizá tu idea
        </p>
      </div>

      <h3 className="cta-field font-display font-normal mb-3" style={{ fontSize: '28px' }}>
        Tu próximo tatuaje
      </h3>

      <p
        className="cta-field font-body text-ink-soft mb-6 leading-[1.65]"
        style={{ fontSize: '14px' }}
      >
        Completá el formulario con los detalles de tu idea —referencias, zona, tamaño y cuándo te
        queda mejor— y te respondo en pocos días.
      </p>

      <ul className="cta-field font-body text-ink-soft text-[13px] space-y-2 mb-8">
        <li className="flex items-start gap-2">
          <span className="text-sage-700 mt-0.5">·</span>
          <span>Respuesta en 2-4 días por mail</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-sage-700 mt-0.5">·</span>
          <span>Presupuesto y fecha estimada</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-sage-700 mt-0.5">·</span>
          <span>Te pido que seas lo más detallado posible para entender bien tu idea</span>
        </li>
      </ul>

      <Link
        href="/estudio/reservar"
        className="cta-field inline-flex items-center gap-2 bg-sage-700 text-cream-50 rounded-pill px-6 py-3 font-body text-[14px] hover:bg-sage-900 hover:-translate-y-px transition-all duration-200"
      >
        Cotizar mi tatuaje
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

export default EstudioCTA

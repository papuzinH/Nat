import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SchemaMarkup } from '@/components/shared'
import BookingForm from '@/components/estudio/BookingForm'
import { gsap, shouldAnimate } from '@/lib/gsap'

const schemaData = {
  name: 'Reservar tatuaje — Natalia Heller',
  description:
    'Formulario para cotizar tu tatuaje personalizado con Natalia Heller. Estilo botánico, line art y diseño a medida en Buenos Aires.',
  url: 'https://tatuajesnaty.com/estudio/reservar',
}

const EstudioReservar: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.hero-line')
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      )
    }, hero)

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-cream-100 py-16 md:py-24 min-h-screen">
      <SchemaMarkup type="LocalBusiness" data={schemaData} />

      <div className="max-w-2xl mx-auto px-6">
        <div ref={heroRef}>
          <Link
            to="/estudio"
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

        <BookingForm />
      </div>
    </div>
  )
}

export default EstudioReservar

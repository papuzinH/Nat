'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { SectionContainer } from '../shared'
import { gsap, shouldAnimate } from '@/lib/gsap'

const STEPS = [
  {
    num: '01',
    title: 'Conversamos',
    desc: 'Contame tu idea desde el formulario para poder enviarte un presupuesto y la fecha estimada para la sesión.',
  },
  {
    num: '02',
    title: 'Diseño',
    desc: 'Te armo una propuesta basada en las referencias que elegiste y lo ajustamos hasta que quede exactamente como lo imaginaste.',
  },
  {
    num: '03',
    title: 'Sesión',
    desc: 'Nos encontramos en el estudio. Algo fresco para tomar, música suave y el tiempo que haga falta. Tatuamos sin apuro.',
  },
  {
    num: '04',
    title: 'Cuidado',
    desc: 'Te explico en detalle cómo lograr una buena cicatrización y quedamos en contacto por cualquier duda que pueda surgir.',
  },
]

const ProcessSteps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const stepEls = gsap.utils.toArray<HTMLElement>('.process-step')
      stepEls.forEach((step, idx) => {
        const num = step.querySelector<HTMLElement>('.process-step-num')
        const title = step.querySelector<HTMLElement>('.process-step-title')
        const desc = step.querySelector<HTMLElement>('.process-step-desc')

        // Pre-set hidden state synchronously to avoid visible→hidden flash
        if (num) gsap.set(num, { opacity: 0, y: 20 })
        if (title) gsap.set(title, { opacity: 0, y: 12 })
        if (desc) gsap.set(desc, { opacity: 0, y: 8 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: 'top 85%', once: true },
          delay: idx * 0.05,
        })
        if (num) {
          tl.fromTo(
            num,
            { opacity: 0, y: 20, letterSpacing: '0.05em' },
            { opacity: 1, y: 0, letterSpacing: '0em', duration: 0.7, ease: 'power3.out' }
          )
        }
        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.4'
          )
        }
        if (desc) {
          tl.fromTo(
            desc,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            '-=0.3'
          )
        }
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <SectionContainer>
      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 max-w-7xl mx-auto"
      >
        {STEPS.map((step) => (
          <div key={step.num} className="process-step">
            <p
              className="process-step-num font-display italic leading-none mb-4"
              style={{ fontSize: '56px', color: '#7a9e7e' }}
            >
              {step.num}
            </p>
            <h3
              className="process-step-title font-display mb-2"
              style={{ fontSize: '22px', color: '#2c2c2c' }}
            >
              {step.title}
            </h3>
            <p
              className="process-step-desc font-body leading-[1.6]"
              style={{ fontSize: '14px', color: '#5a5350' }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

export default ProcessSteps

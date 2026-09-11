'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { SectionContainer, NHBud } from '../shared'
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

        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: 'top 85%', once: true },
          delay: idx * 0.05,
        })
        if (num) {
          tl.fromTo(
            num,
            { y: 20, letterSpacing: '0.05em' },
            { y: 0, letterSpacing: '0em', duration: 0.7, ease: 'power3.out', immediateRender: false }
          )
        }
        if (title) {
          tl.fromTo(
            title,
            { y: 12 },
            { y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false },
            '-=0.4'
          )
        }
        if (desc) {
          tl.fromTo(
            desc,
            { y: 8 },
            { y: 0, duration: 0.45, ease: 'power2.out', immediateRender: false },
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
        {STEPS.map((step, i) => (
          <div key={step.num} className="process-step" data-nh-hover>
            {/* El brote crece paso a paso: el tamaño acompaña el avance del proceso. */}
            <NHBud size={13 + i * 2} index={i * 3} className="mb-3 text-sage-500" />
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

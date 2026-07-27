'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import { HeroEyebrow, SectionTitle, NHBud } from '../shared'
import { gsap, shouldAnimate } from '@/lib/gsap'

const FAQS = [
  {
    q: '¿Hacés tatuajes personalizados?',
    a: 'Sí, cada diseño es único y creado exclusivamente para esa persona.',
  },
  {
    q: '¿Cuál es el valor de la sesión?',
    a: 'El valor puede cambiar dependiendo de muchos factores, como por ejemplo, el tamaño, la ubicacion, la zona, el nivel de detalle, entre otros.',
  },
  {
    q: '¿Hacés coberturas de tatuajes viejos?',
    a: 'En principio sí, pero depende mucho de cuál sea el trabajo a realizar. En caso de ser necesario, te derivo con el artista que crea necesario para lograr la idea que tengas en mente.',
  },
  {
    q: '¿Cuánto tiempo dura la sesión?',
    a: 'Por lo general, un mínimo de 1 o 2 horas y hasta 5 horas máximo para trabajos más complejos.',
  }

]

const FAQItem: React.FC<{
  q: string
  a: string
  index: number
  open: boolean
  onToggle: () => void
}> = ({ q, a, index, open, onToggle }) => {
  const answerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const answer = answerRef.current
    const icon = iconRef.current
    if (!answer || !icon) return

    if (!shouldAnimate()) {
      answer.style.height = open ? 'auto' : '0px'
      answer.style.opacity = open ? '1' : '0'
      icon.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)'
      return
    }

    const ctx = gsap.context(() => {
      gsap.to(icon, {
        rotation: open ? 45 : 0,
        duration: 0.3,
        ease: 'power2.inOut',
      })
      if (open) {
        gsap.fromTo(
          answer,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
        )
      } else {
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        })
      }
    })

    return () => ctx.revert()
  }, [open])

  return (
    <div className="faq-item" data-nh-hover>
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="flex items-start gap-3">
          <NHBud size={13} index={index * 3} className="mt-[2px] text-sage-500" />
          <span className="font-body text-[15px] text-ink">{q}</span>
        </span>
        <span
          ref={iconRef}
          className="flex-shrink-0 font-mono text-lg text-sage-500 inline-block"
          style={{ transformOrigin: 'center' }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        ref={answerRef}
        style={{ height: 0, opacity: 0, overflow: 'hidden', willChange: 'height, opacity' }}
      >
        <p
          className="font-body pb-4 leading-[1.6]"
          style={{ fontSize: '14px', color: '#5a5350' }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

const EstudioFAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.faq-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: wrapper, start: 'top 85%', once: true },
        }
      )
    }, wrapper)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef}>
      <HeroEyebrow>Antes de escribir</HeroEyebrow>
      <SectionTitle>Preguntas frecuentes</SectionTitle>

      <div className="space-y-0 divide-y divide-[rgba(44,44,44,0.12)]">
        {FAQS.map((item, i) => (
          <FAQItem
            key={i}
            q={item.q}
            a={item.a}
            index={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}

export default EstudioFAQ

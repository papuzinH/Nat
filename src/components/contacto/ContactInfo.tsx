import React, { useLayoutEffect, useRef } from 'react'
import { HeroEyebrow, HeroTitle, HeroSubtitle } from '../shared'
import { animateHero, splitWords } from '@/lib/animations'

const INFO_ITEMS = [
  { label: 'Correo', value: 'hola@nataliaheller.ar' },
  { label: 'Instagram', value: '@nat.tatt' },
  { label: 'Estudio', value: 'Parque Chacabuco · CABA\nCon turno previo' },
  { label: 'Horario', value: 'Mar a Sáb · 11:00 — 19:00' },
]

const TITLE_PRE = 'Las buenas conversaciones '
const TITLE_EM = 'empiezan así.'

const ContactInfo: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!wrapperRef.current) return
    return animateHero(wrapperRef.current)
  }, [])

  return (
    <div ref={wrapperRef} className="flex flex-col gap-8 lg:gap-10">
      <div className="space-y-4">
        <HeroEyebrow className="hero-eyebrow">Escribime</HeroEyebrow>
        <HeroTitle as="h1">
          <span>
            {splitWords(TITLE_PRE).map((token, i) =>
              /^\s+$/.test(token) ? (
                <span key={`pre-${i}`}>{token}</span>
              ) : (
                <span
                  key={`pre-${i}`}
                  data-split-word
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {token}
                </span>
              )
            )}
            <em>
              {splitWords(TITLE_EM).map((token, i) =>
                /^\s+$/.test(token) ? (
                  <span key={`em-${i}`}>{token}</span>
                ) : (
                  <span
                    key={`em-${i}`}
                    data-split-word
                    style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                  >
                    {token}
                  </span>
                )
              )}
            </em>
          </span>
        </HeroTitle>
        <HeroSubtitle className="hero-subtitle max-w-sm text-ink-soft">
          Contame tu idea, pedí una cotización o simplemente decí hola. Respondo en menos de 48 horas.
        </HeroSubtitle>
      </div>

      <dl className="grid gap-5">
        {INFO_ITEMS.map((item) => (
          <div key={item.label} className="hero-extra">
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-1">
              {item.label}
            </dt>
            <dd
              className="font-display text-xl text-ink whitespace-pre-line"
              style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ContactInfo

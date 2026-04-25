import React, { useState } from 'react'
import { HeroEyebrow, SectionTitle } from '../shared'

const FAQS = [
  {
    q: '¿Cuánto tarda en agendarse?',
    a: 'Abro agenda cada dos meses. Los cupos se llenan rápido; te aviso por mail si hay lugar.',
  },
  {
    q: '¿Cuál es el mínimo?',
    a: 'La sesión empieza en $45.000 ARS e incluye diseño, materiales y el tiempo de consulta.',
  },
  {
    q: '¿Viajás para trabajar?',
    a: 'Hago guest spots un par de veces al año. Anotate al newsletter para enterarte.',
  },
  {
    q: '¿Hacés tapados o coberturas?',
    a: 'Depende de cada caso. Mandame fotos y lo conversamos.',
  },
]

const EstudioFAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      <HeroEyebrow>
        Antes de escribir
      </HeroEyebrow>
      <SectionTitle
      >
        Cosas que suelen preguntar
      </SectionTitle>

      <div className="space-y-0 divide-y divide-[rgba(44,44,44,0.12)]">
        {FAQS.map((item, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between py-4 text-left gap-4"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-body text-[15px] text-ink">{item.q}</span>
              <span
                className="flex-shrink-0 font-mono text-lg text-sage-500 transition-transform duration-200"
                style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            {open === i && (
              <p
                className="font-body pb-4 leading-[1.6]"
                style={{ fontSize: '14px', color: '#5a5350' }}
              >
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EstudioFAQ

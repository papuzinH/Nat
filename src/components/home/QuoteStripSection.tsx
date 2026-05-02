import React from 'react'
import { SectionContainer } from '../shared'
import NHDivider from '../shared/NHDivider'

const QuoteStripSection: React.FC = () => (
  <SectionContainer
    aria-label="Sobre el estudio"
  >
    <NHDivider label="Un espacio distinto" className='md:mb-8' />
    <div className="max-w-3xl mx-auto text-center">
      <blockquote>
        <p
          className="font-display font-normal text-ink"
          style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontStyle: 'italic', lineHeight: 1.35 }}
        >
          "Cada obra empieza en el huerto del patio: hojas que seco, flores que dibujo, colores que preparo con ceniza y cebolla. Trabajar con la mano puesta en la tierra."
        </p>
        <footer className="mt-6">
          <cite
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 not-italic"
          >
            — Natalia, desde el estudio
          </cite>
        </footer>
      </blockquote>
      <p
        className="font-body text-ink-soft mt-8 max-w-2xl mx-auto text-center"
        style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: 1.7 }}
      >
        Mi intención es ofrecer una experiencia para el recuerdo, transmitiendo calma, seguridad y compromiso, no solo con el resultado, sino con todo el proceso.
      </p>
    </div>
  </SectionContainer>
)

export default QuoteStripSection

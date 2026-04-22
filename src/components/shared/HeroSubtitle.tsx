import React from 'react'

interface HeroSubtitleProps {
  children: React.ReactNode
  className?: string
}

/**
 * Bajada / descripción del hero — font-body, ink-soft, leading-[1.65].
 * Tamaño fluido: clamp(15px, 1.5vw, 18px).
 * Basado en el `<p>` de bajada del design handoff.
 *
 * El ancho máximo (max-w) se controla desde afuera con `className` según el layout.
 */
const HeroSubtitle: React.FC<HeroSubtitleProps> = ({ children, className = '' }) => (
  <p
    className={`font-body text-ink-soft leading-[1.65] ${className}`}
    style={{ fontSize: 'clamp(15px, 1.5vw, 18px)' }}
  >
    {children}
  </p>
)

export default HeroSubtitle

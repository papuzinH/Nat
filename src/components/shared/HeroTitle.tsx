import React from 'react'

type HeadingTag = 'h1' | 'h2' | 'h3'

interface HeroTitleProps {
  children: React.ReactNode
  as?: HeadingTag
  className?: string
}

/**
 * Título de hero — font-display, font-normal, leading-[1.02], tracking-[-0.02em].
 * Tamaño fluido: clamp(38px, 7vw, 78px).
 * Basado en `.nh-serif` del design handoff.
 *
 * Usa `<em>` para la parte en cursiva sage-700 siguiendo la convención del handoff:
 *   <HeroTitle>Botánica sensible, <em>hecha con paciencia.</em></HeroTitle>
 */
const HeroTitle: React.FC<HeroTitleProps> = ({ children, as: Tag = 'h1', className = '' }) => (
  <Tag
    className={`font-display font-normal leading-[1.02] tracking-[-0.02em] text-ink [&_em]:italic [&_em]:text-sage-700 ${className}`}
    style={{ fontSize: 'clamp(38px, 7vw, 78px)' }}
  >
    {children}
  </Tag>
)

export default HeroTitle

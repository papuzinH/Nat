import React from 'react'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface SectionTitleProps {
  children: React.ReactNode
  as?: HeadingTag
  id?: string
  className?: string
}

/**
 * Titulo de seccion reutilizable.
 * Mantiene la escala tipografica de los bloques editoriales de Home.
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  as: Tag = 'h2',
  id,
  className = '',
}) => (
  <Tag
    id={id}
    className={`font-display font-normal text-ink leading-[1.1] tracking-[-0.02em] mb-4 ${className}`}
    style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
  >
    {children}
  </Tag>
)

export default SectionTitle
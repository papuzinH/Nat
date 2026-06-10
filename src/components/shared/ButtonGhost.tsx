import React from 'react'
import Link from 'next/link'

interface ButtonGhostProps {
  children: React.ReactNode
  /** Navegación interna con React Router */
  to?: string
  /** Enlace externo */
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

const BASE =
  'inline-flex items-center gap-2.5 px-[22px] py-[14px] rounded-pill font-body font-semibold text-sm tracking-[0.02em] border border-ink bg-transparent text-ink transition-all duration-[220ms] hover:bg-ink hover:text-cream-50 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'

/**
 * Botón ghost / secondary — borde ink, fondo transparente. Hover: fondo ink + texto cream.
 * Basado en `.nh-btn.nh-btn-ghost` del design handoff.
 *
 * Se renderiza como `<button>`, `<Link>` (si recibe `to`) o `<a>` (si recibe `href`).
 */
const ButtonGhost: React.FC<ButtonGhostProps> = ({
  children,
  to,
  href,
  target,
  rel,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const cls = `${BASE} ${className}`

  if (to) {
    return (
      <Link href={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)} className={cls} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default ButtonGhost

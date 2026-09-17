import React from 'react'

interface NHStarProps {
  size?: number
  color?: string
  className?: string
}

const POINTS = 6
const OUTER_R = 11
// Radio interno chico: puntas finas, como el glifo ✶ (U+2736).
const INNER_R = 3.4

const STAR_PATH =
  Array.from({ length: POINTS * 2 }, (_, k) => {
    const angle = ((-90 + k * (180 / POINTS)) * Math.PI) / 180
    const r = k % 2 === 0 ? OUTER_R : INNER_R
    const x = (12 + r * Math.cos(angle)).toFixed(2)
    const y = (12 + r * Math.sin(angle)).toFixed(2)
    return `${k === 0 ? 'M' : 'L'}${x} ${y}`
  }).join(' ') + ' Z'

/**
 * Estrella de seis puntas (✶) — ícono inline chico, ej. "revisá la casilla de spam ✶".
 * Es SVG y no el carácter para no depender de que la fuente tenga el glifo.
 * Mismo patrón de props que el resto de los motivos NH*, pero no es botánico:
 * no vive en botanical.ts ni participa de BotanicalMotion.
 */
const NHStar: React.FC<NHStarProps> = ({
  size = 14,
  color = 'currentColor',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ color, display: 'inline-block', flexShrink: 0 }}
    className={className}
    aria-hidden="true"
  >
    <path d={STAR_PATH} fill="currentColor" />
  </svg>
)

export default NHStar

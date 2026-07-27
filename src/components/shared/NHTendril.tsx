import React from 'react'
import { leafWithMidrib, breeze, sprout } from './botanical'

interface NHTendrilProps {
  size?: number
  color?: string
  flip?: boolean
  className?: string
}

/**
 * Espiral logarítmica que cierra el zarcillo. Arranca exactamente donde termina el
 * tallo (th=0 cae en cx,cy) y se enrosca hacia dentro en ~2,3 vueltas.
 */
const spiral = (cx: number, cy: number, r0: number, k: number, steps: number, step: number) => {
  let d = ''
  for (let i = 1; i <= steps; i++) {
    const th = i * step
    const r = r0 * Math.exp(-k * th)
    d += `L${(cx + r * Math.sin(th)).toFixed(2)} ${(cy - r * Math.cos(th) + r0).toFixed(2)}`
  }
  return d
}

const STEM = 'M12 2C12 22 18 34 13 52C9 68 15 80 12 94'
const LEAVES = [
  { x: 13.2, y: 50, rot: 56, length: 9.6 },
  { x: 10.4, y: 70, rot: -54, length: 8.4 },
  { x: 13, y: 86, rot: 52, length: 7 },
] as const

const NHTendril: React.FC<NHTendrilProps> = ({
  size = 24,
  color = 'currentColor',
  flip = false,
  className = '',
}) => {
  const height = Math.round(size * (118 / 24))
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 24 118"
      style={{ color, display: 'inline-block', transform: flip ? 'scaleX(-1)' : 'none', flexShrink: 0 }}
      className={className}
      aria-hidden="true"
      data-nh-motif
    >
      <path
        className="nh-draw"
        style={{ '--nh-len': 240 } as React.CSSProperties}
        d={STEM + spiral(12, 94, 8.4, 0.135, 37, 0.4)}
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="240"
      />
      {LEAVES.map(({ x, y, rot, length }, i) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <g className="nh-sway" style={breeze(i)}>
            <path
              className="nh-leaf"
              style={sprout(i)}
              d={leafWithMidrib(length, Number((length * 0.3).toFixed(2)))}
              fill="currentColor"
              fillRule="evenodd"
            />
          </g>
        </g>
      ))}
    </svg>
  )
}

export default NHTendril

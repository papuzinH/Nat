import React from 'react'
import { leafPath, breeze, sprout } from './botanical'

interface NHSprigProps {
  size?: number
  color?: string
  flip?: boolean
  className?: string
}

/**
 * El tallo es `M3 16 Q 37 14.6 71 16`. En esa cuadrática la x avanza lineal
 * (x = 3 + 68t), así que la altura del tallo en cualquier x sale directa — y cada
 * hoja puede nacer exactamente sobre la curva en vez de flotar al lado.
 */
const stemY = (x: number) => {
  const t = (x - 3) / 68
  return Number((16 - 2.8 * t * (1 - t)).toFixed(2))
}

// Hojas alternadas, decreciendo hacia la punta como en una rama real.
const LEAVES = [
  { x: 10, length: 9.4, up: true },
  { x: 20.5, length: 10.8, up: false },
  { x: 31, length: 11.2, up: true },
  { x: 41.5, length: 10.2, up: false },
  { x: 52, length: 8.8, up: true },
  { x: 62, length: 7.2, up: false },
] as const

const TIP = { x: 70.5, length: 6.2 }

const NHSprig: React.FC<NHSprigProps> = ({
  size = 80,
  color = 'currentColor',
  flip = false,
  className = '',
}) => {
  const height = Math.round(size * 0.4)
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 80 32"
      style={{ color, display: 'inline-block', transform: flip ? 'scaleX(-1)' : 'none', flexShrink: 0 }}
      className={className}
      aria-hidden="true"
      data-nh-motif
    >
      <path
        className="nh-sprig-path nh-draw"
        style={{ '--nh-len': 90 } as React.CSSProperties}
        d="M3 16 Q 37 14.6 71 16"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="90"
      />
      {LEAVES.map(({ x, length, up }, i) => (
        // El rotate vive en el <g> exterior y el movimiento en el interior: una
        // animación CSS reemplazaría el atributo transform si compartieran elemento.
        <g key={x} transform={`translate(${x} ${stemY(x)}) rotate(${up ? 32 : 148})`}>
          <g className="nh-sway" style={breeze(i)}>
            <path
              className="nh-sprig-leaf nh-leaf"
              style={sprout(i)}
              d={leafPath(length, Number((length * 0.31).toFixed(2)))}
              fill="currentColor"
            />
          </g>
        </g>
      ))}
      <g transform={`translate(${TIP.x} ${stemY(TIP.x)}) rotate(90)`}>
        <g className="nh-sway" style={breeze(6)}>
          <path className="nh-sprig-tip nh-leaf" style={sprout(6)} d={leafPath(TIP.length, 2)} fill="currentColor" />
        </g>
      </g>
    </svg>
  )
}

export default NHSprig

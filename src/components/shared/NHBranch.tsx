import React from 'react'
import { leafWithMidrib, cubicAt, breeze, sprout, type Cubic } from './botanical'

interface NHBranchProps {
  size?: number
  color?: string
  flip?: boolean
  className?: string
}

/**
 * Rama de esquina. Las hojas no llevan coordenadas a mano: se muestrea la cúbica del
 * tallo en `TS` y cada una se planta en ese punto, orientada con la tangente más un
 * ángulo de apertura. Cambiar la curva reacomoda las hojas solo.
 */
const STEM: Cubic = [
  [62, 144],
  [48, 106],
  [30, 74],
  [10, 16],
]

const TS = [0.14, 0.27, 0.4, 0.53, 0.66, 0.79, 0.9] as const
const OPENING = 42

const NHBranch: React.FC<NHBranchProps> = ({
  size = 68,
  color = 'currentColor',
  flip = false,
  className = '',
}) => {
  const height = Math.round(size * (150 / 68))
  const tip = cubicAt(STEM, 1)

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 68 150"
      style={{ color, display: 'inline-block', transform: flip ? 'scaleX(-1)' : 'none', flexShrink: 0 }}
      className={className}
      aria-hidden="true"
      data-nh-motif
    >
      <path
        className="nh-draw"
        style={{ '--nh-len': 200 } as React.CSSProperties}
        d="M62 144C48 106 30 74 10 16"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="200"
      />
      {TS.map((t, i) => {
        const p = cubicAt(STEM, t)
        const length = 26 - i * 2.1
        const side = i % 2 === 0 ? -1 : 1
        return (
          <g key={t} transform={`translate(${p.x} ${p.y}) rotate(${p.angle + side * OPENING})`}>
            <g className="nh-sway" style={breeze(i)}>
              <path
                className={`nh-leaf${i < 2 ? ' nh-tilt' : ''}`}
                style={sprout(i)}
                d={leafWithMidrib(length, Number((length * 0.3).toFixed(2)))}
                fill="currentColor"
                fillRule="evenodd"
              />
            </g>
          </g>
        )
      })}
      {/* brote terminal, alineado con el final del tallo */}
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
        <g className="nh-sway" style={breeze(7)}>
          <path
            className="nh-leaf"
            style={sprout(7)}
            d={leafWithMidrib(12, 3.4)}
            fill="currentColor"
            fillRule="evenodd"
          />
        </g>
      </g>
    </svg>
  )
}

export default NHBranch

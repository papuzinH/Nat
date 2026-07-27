import React from 'react'
import { leafWithMidrib, arcAt, breeze, sprout } from './botanical'

interface NHWreathProps {
  size?: number
  color?: string
  className?: string
}

/**
 * Laurel abierto: dos arcos espejados que suben desde abajo y casi se tocan arriba.
 * Cada hoja se planta sobre el arco con la tangente del círculo más un ángulo de
 * apertura, igual que las de NHBranch sobre su cúbica.
 */
const CX = 60
const CY = 62
const R = 44
const OPENING = 26

// De casi abajo (162°) a casi arriba (30°): el hueco superior es lo que lo hace
// leer como corona y no como anillo.
const PHIS = [162, 143, 124, 105, 86, 67, 48, 30] as const

const NHWreath: React.FC<NHWreathProps> = ({
  size = 120,
  color = 'currentColor',
  className = '',
}) => {
  const start = arcAt(CX, CY, R, PHIS[0])
  const end = arcAt(CX, CY, R, PHIS[PHIS.length - 1])

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ color, display: 'inline-block', flexShrink: 0 }}
      className={className}
      aria-hidden="true"
      data-nh-motif
    >
      {[1, -1].map((side) => {
        const mirror = (x: number) => Number((CX + side * (x - CX)).toFixed(2))
        return (
          <g key={side}>
            <path
              className="nh-draw"
              style={{ '--nh-len': 130 } as React.CSSProperties}
              d={`M${mirror(start.x)} ${start.y}A${R} ${R} 0 0 ${side > 0 ? 1 : 0} ${mirror(end.x)} ${end.y}`}
              stroke="currentColor"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="130"
            />
            {PHIS.map((phi, i) => {
              const p = arcAt(CX, CY, R, phi)
              // Las del medio del arco más largas, como en una corona de laurel.
              const length = 15 - Math.abs(i - 3.5) * 1.15
              const j = side > 0 ? i : i + PHIS.length
              return (
                <g
                  key={phi}
                  transform={`translate(${mirror(p.x)} ${p.y}) rotate(${(side * (p.angle + OPENING)).toFixed(2)})`}
                >
                  <g className="nh-sway" style={breeze(j)}>
                    <path
                      className="nh-leaf"
                      style={sprout(j)}
                      d={leafWithMidrib(length, Number((length * 0.3).toFixed(2)))}
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </g>
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

export default NHWreath

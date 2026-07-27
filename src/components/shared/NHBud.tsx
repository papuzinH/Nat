import React from 'react'
import { leafPath, leafWithMidrib, breeze, sprout } from './botanical'

interface NHBudProps {
  size?: number
  color?: string
  /** Desfasa brisa y brote respecto de los buds vecinos en una lista. */
  index?: number
  className?: string
}

/**
 * Brote chico: tallo, dos sépalos y un capullo cerrado. Pensado para marcadores de
 * lista, donde tiene que leerse a 16-24px.
 */
const NHBud: React.FC<NHBudProps> = ({
  size = 16,
  color = 'currentColor',
  index = 0,
  className = '',
}) => {
  const height = Math.round(size * (26 / 16))
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 16 26"
      style={{ color, display: 'inline-block', flexShrink: 0 }}
      className={className}
      aria-hidden="true"
      data-nh-motif
    >
      <path
        className="nh-draw"
        style={{ '--nh-len': 20 } as React.CSSProperties}
        d="M8 25C8 20 7.4 16 8 12"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="20"
      />
      <g transform="translate(8 18.4) rotate(214)">
        <g className="nh-sway" style={breeze(index)}>
          <path className="nh-leaf" style={sprout(index)} d={leafPath(5.2, 1.7)} fill="currentColor" />
        </g>
      </g>
      <g transform="translate(8 16.6) rotate(34)">
        <g className="nh-sway" style={breeze(index + 1)}>
          <path className="nh-leaf" style={sprout(index + 1)} d={leafPath(4.6, 1.5)} fill="currentColor" />
        </g>
      </g>
      <g transform="translate(8 12.6)">
        <g className="nh-sway" style={breeze(index + 3)}>
          <path
            className="nh-leaf nh-tilt"
            style={sprout(index + 2)}
            d={leafWithMidrib(9.4, 3.5)}
            fill="currentColor"
            fillRule="evenodd"
          />
        </g>
      </g>
    </svg>
  )
}

export default NHBud

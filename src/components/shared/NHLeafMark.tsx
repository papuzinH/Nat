import React from 'react'
import { leafWithMidrib, sprout } from './botanical'

interface NHLeafMarkProps {
  size?: number
  color?: string
  className?: string
}

const LENGTH = 14.6
const WIDTH = 4.6

const NHLeafMark: React.FC<NHLeafMarkProps> = ({
  size = 20,
  color = 'currentColor',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    style={{ color, display: 'inline-block', flexShrink: 0 }}
    className={className}
    aria-hidden="true"
    data-nh-motif
  >
    <g transform="translate(10 17.4) rotate(-8)">
      <path
        d="M0 0L0 2.2"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hoja sola: se balancea más lento que las de una rama. */}
      <g className="nh-sway" style={{ '--nh-dur': '6.5s' } as React.CSSProperties}>
        <path
          className="nh-leaf nh-tilt"
          style={sprout(0)}
          d={leafWithMidrib(LENGTH, WIDTH)}
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </g>
  </svg>
)

export default NHLeafMark

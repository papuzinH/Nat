import React from 'react'
import { leafWithMidrib, breeze, sprout } from './botanical'

interface NHFlowerProps {
  size?: number
  color?: string
  className?: string
}

const PETAL_ANGLES = [0, 72, 144, 216, 288] as const
const PETAL_LENGTH = 13.5
const PETAL_WIDTH = 4.3
// Los pétalos arrancan a esta distancia del centro: deja respirar el botón y, sobre
// todo, evita que se crucen entre sí (antes se superponían y la opacidad se acumulaba).
const PETAL_OFFSET = 3.6

const NHFlower: React.FC<NHFlowerProps> = ({
  size = 40,
  color = 'currentColor',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{ color, display: 'inline-block', flexShrink: 0 }}
    className={className}
    aria-hidden="true"
    data-nh-motif
  >
    {PETAL_ANGLES.map((angle, i) => (
      <g key={angle} transform={`translate(20 20) rotate(${angle}) translate(0 ${-PETAL_OFFSET})`}>
        <g className="nh-sway" style={breeze(i)}>
          <path
            className="nh-leaf"
            style={sprout(i)}
            d={leafWithMidrib(PETAL_LENGTH, PETAL_WIDTH)}
            fill="currentColor"
            fillRule="evenodd"
          />
        </g>
      </g>
    ))}
    <circle cx="20" cy="20" r="2.4" fill="currentColor" />
  </svg>
)

export default NHFlower

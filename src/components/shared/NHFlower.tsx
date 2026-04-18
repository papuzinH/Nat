import React from 'react'

interface NHFlowerProps {
  size?: number
  color?: string
  className?: string
}

const PETAL_ANGLES = [0, 72, 144, 216, 288] as const

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
  >
    {PETAL_ANGLES.map((angle, i) => (
      <ellipse
        key={i}
        cx="20"
        cy="11"
        rx="4"
        ry="7"
        fill="currentColor"
        opacity="0.75"
        transform={`rotate(${angle} 20 20)`}
      />
    ))}
    <circle cx="20" cy="20" r="2.3" fill="currentColor" />
  </svg>
)

export default NHFlower

import React from 'react'

interface NHSprigProps {
  size?: number
  color?: string
  flip?: boolean
  className?: string
}

const LEAF_X = [10, 22, 34, 46, 58, 70] as const

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
    >
      <path d="M2 16 Q 20 14, 40 14 T 78 14" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
      {LEAF_X.map((x, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={i % 2 === 0 ? 8 : 20}
          rx="5"
          ry="2"
          fill="currentColor"
          opacity="0.85"
          transform={`rotate(${i % 2 === 0 ? -22 : 22} ${x} ${i % 2 === 0 ? 8 : 20})`}
        />
      ))}
      <circle cx="78" cy="14" r="1.6" fill="currentColor" />
    </svg>
  )
}

export default NHSprig

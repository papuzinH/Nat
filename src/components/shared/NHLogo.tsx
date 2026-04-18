import React from 'react'
import { Link } from 'react-router-dom'

interface NHLogoProps {
  size?: number
  color?: string
  onClick?: () => void
}

const NHLogo: React.FC<NHLogoProps> = ({ size = 32, color = 'var(--sage-900, #2f4a37)', onClick }) => {
  const scaledSize = size
  return (
    <Link
      to="/"
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
      aria-label="Natalia Heller — inicio"
    >
      <svg
        width={scaledSize}
        height={scaledSize}
        viewBox="0 0 40 40"
        style={{ color, flexShrink: 0 }}
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <text
          x="20"
          y="26.5"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="22"
          fontStyle="italic"
          fontWeight="500"
          fill="currentColor"
        >
          n
        </text>
        <circle cx="9.5" cy="10" r="1.3" fill="currentColor" opacity="0.7" />
        <circle cx="31" cy="30.5" r="1.3" fill="currentColor" opacity="0.7" />
      </svg>
      <span
        style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 17,
          fontStyle: 'italic',
          color,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        natalia heller
      </span>
    </Link>
  )
}

export default NHLogo

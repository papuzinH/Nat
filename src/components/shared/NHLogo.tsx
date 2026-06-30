import React from 'react'
import Link from 'next/link'

interface NHLogoProps {
  size?: number
  color?: string
  onClick?: () => void
}

const NHLogo: React.FC<NHLogoProps> = ({ size = 16, onClick }) => {
  const logoHeight = size * 2
  return (
    <Link
      href="/"
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
      aria-label="Natalia Heller — inicio"
      className='hover:opacity-80 transition-all hover:scale-[1.02] '
    >
      <img
        src="/Logo.svg"
        alt="Natalia Heller"
        height={logoHeight}
        style={{ height: logoHeight, width: 'auto', display: 'block' }}
      />
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: 1,
          height: logoHeight * 0.55,
          background: 'var(--line, rgba(44,44,44,0.18))',
          margin: '0 10px',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 17,
          color: 'var(--ink, #2c2c2c)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        NAT.TATT
      </span>
    </Link>
  )
}

export default NHLogo

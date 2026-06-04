import React from 'react'
import { Link } from 'react-router-dom'

interface NHLogoProps {
  size?: number
  color?: string
  onClick?: () => void
}

const NHLogo: React.FC<NHLogoProps> = ({ size = 32, onClick }) => {
  // const logoHeight = size * 2
  return (
    <Link
      to="/"
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
      aria-label="Natalia Heller — inicio"
      className='hover:opacity-80 transition-all hover:scale-[1.02] '
    >
      {/* <img
        src="/Logo.svg"
        alt="Natalia Heller"
        height={logoHeight}
        style={{ height: logoHeight, width: 'auto', display: 'block' }}
      /> */}
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

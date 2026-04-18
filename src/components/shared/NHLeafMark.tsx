import React from 'react'

interface NHLeafMarkProps {
  size?: number
  color?: string
  className?: string
}

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
  >
    <path d="M10 2 C 6 5, 4 10, 5 18" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <circle cx="7.2" cy="7.5" r="1.3" fill="currentColor" />
    <circle cx="6.1" cy="11.5" r="1.3" fill="currentColor" />
    <circle cx="5.3" cy="15" r="1.3" fill="currentColor" />
    <circle cx="10" cy="4" r="1.1" fill="currentColor" />
    <circle cx="13" cy="6.5" r="0.9" fill="currentColor" opacity="0.7" />
  </svg>
)

export default NHLeafMark

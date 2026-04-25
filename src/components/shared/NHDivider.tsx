import React from 'react'
import NHSprig from './NHSprig'

interface NHDividerProps {
  label?: string
  className?: string
}

const NHDivider: React.FC<NHDividerProps> = ({ label, className = '' }) => (
  <div
    className={`flex items-center justify-center gap-4 my-6 md:mt-8 md:mb-0 ${className}`}
    style={{ color: 'var(--sage-500, #7a9e7e)' }}
    aria-hidden="true"
  >
    <NHSprig size={56} />
    {label && (
      <span
        className="font-mono text-sm uppercase tracking-[0.18em]"
        style={{ color: 'var(--sage-700, #4a7c59)' }}
      >
        {label}
      </span>
    )}
    <NHSprig size={56} flip />
  </div>
)

export default NHDivider

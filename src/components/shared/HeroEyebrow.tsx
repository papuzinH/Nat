import React from 'react'

interface HeroEyebrowProps {
  children: React.ReactNode
  className?: string
}

/**
 * Pretitle / eyebrow — font-mono, 11px, uppercase, sage-700.
 * Basado en `.nh-eyebrow` del design handoff.
 */
const HeroEyebrow: React.FC<HeroEyebrowProps> = ({ children, className = '' }) => (
  <p className={`font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 ${className}`}>
    {children}
  </p>
)

export default HeroEyebrow

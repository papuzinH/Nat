'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import NHSprig from './NHSprig'

interface NHDividerProps {
  label?: string
  className?: string
}

const NHDivider: React.FC<NHDividerProps> = ({ label, className = '' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const paths = wrapper.querySelectorAll<SVGPathElement>('.nh-sprig-path')
      const leaves = wrapper.querySelectorAll<SVGEllipseElement>('.nh-sprig-leaf')
      const tips = wrapper.querySelectorAll<SVGCircleElement>('.nh-sprig-tip')
      const labelEl = wrapper.querySelector<HTMLElement>('.nh-divider-label')

      paths.forEach((p) => {
        const length = p.getTotalLength()
        gsap.set(p, { strokeDasharray: length, strokeDashoffset: length })
      })
      gsap.set(leaves, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(tips, { scale: 0, transformOrigin: '50% 50%' })
      if (labelEl) gsap.set(labelEl, { opacity: 0, y: 6 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: 'top 88%', once: true },
      })
      tl.to(paths, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.05 })
        .to(leaves, { scale: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.04 }, '-=0.5')
        .to(tips, { scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, '-=0.2')
        .to(labelEl, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.5')
    }, wrapper)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`flex items-center justify-center gap-4 my-6 md:mt-8 md:mb-0 ${className}`}
      style={{ color: 'var(--amber-700, #BC6C25)' }}
      aria-hidden="true"
    >
      <NHSprig size={56} />
      {label && (
        <span
          className="nh-divider-label font-mono text-sm uppercase tracking-[0.18em]"
          style={{ color: 'var(--amber-700, #BC6C25)' }}
        >
          {label}
        </span>
      )}
      <NHSprig size={56} flip />
    </div>
  )
}

export default NHDivider

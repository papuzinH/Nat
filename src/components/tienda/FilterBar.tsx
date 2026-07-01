'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { type ProductCategoryMeta } from '@/data/products'

interface FilterBarProps {
  categories: ProductCategoryMeta[]
  active: string
  onSelect: (slug: string) => void
  countForCategory: (slug: string) => number
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  active,
  onSelect,
  countForCategory,
}) => {
  const activePillRef = useRef<HTMLButtonElement | null>(null)

  useLayoutEffect(() => {
    if (!shouldAnimate() || !activePillRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        activePillRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: 'power1.out' }
      )
    })
    return () => ctx.revert()
  }, [active])

  return (
    <div
      className="sticky z-20"
      style={{ top: 'var(--header-h, 62px)' }}
    >
      <div
        className="border-b px-6 md:px-12 py-4"
        style={{
          background: 'rgba(250,246,240,0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderColor: 'var(--line-soft)',
        }}
      >
        <div className="relative max-w-7xl mx-auto">
          <div
            role="tablist"
            aria-label="Filtrar por categoría"
            className="flex gap-2 overflow-x-auto scrollbar-hide"
            style={{ padding: '0 0 2px' }}
          >
            {categories.map((cat) => {
              const isActive = active === cat.slug
              const count = countForCategory(cat.slug)

              return (
                <button
                  key={cat.slug}
                  ref={isActive ? activePillRef : null}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="product-grid"
                  onClick={() => onSelect(cat.slug)}
                  className={[
                    'font-body text-[13px] font-[500] px-[14px] py-[11px] min-h-[44px] inline-flex items-center rounded-pill border whitespace-nowrap transition-all duration-200 shrink-0',
                    isActive
                      ? 'bg-sage-900 text-cream-50 border-sage-900'
                      : 'text-ink-soft border-[var(--line)] hover:border-sage-500 hover:text-ink',
                  ].join(' ')}
                  style={{ cursor: 'pointer' }}
                >
                  {cat.label}
                  <span className={`ml-[6px] font-mono text-[11px] ${isActive ? 'opacity-70' : 'opacity-40'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Fade scroll-hint — indica contenido horizontal fuera de pantalla */}
          <div
            className="md:hidden absolute right-0 top-0 bottom-0 w-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, rgba(250,246,240,0.95))' }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}

export default FilterBar

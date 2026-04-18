import React from 'react'
import { PRODUCTS } from '@/data/products'
import ProductImagePlaceholder from './ProductImagePlaceholder'
import NHDivider from '@/components/shared/NHDivider'

const ComingSoonSection: React.FC = () => {
  const comingSoon = PRODUCTS.filter((p) => p.status === 'coming-soon')
  if (comingSoon.length === 0) return null

  return (
    <section aria-label="Próximamente" className="mt-20 md:mt-28">
      <NHDivider label="próximamente" />

      <div className="mt-10 md:mt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3">
          En preparación
        </p>
        <h2
          className="font-display font-normal text-ink mb-10"
          style={{ fontSize: 'clamp(28px, 5vw, 34px)', lineHeight: 1.1 }}
        >
          Lo que viene
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {comingSoon.map((product) => (
            <div key={product.slug} className="relative">
              {/* Card no clickeable */}
              <div
                className="bg-cream-50 rounded-card overflow-hidden"
                style={{
                  boxShadow:
                    '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
                }}
              >
                <div className="relative">
                  <ProductImagePlaceholder
                    tone={product.tone}
                    tall={product.tall}
                    catLabel={product.catLabel}
                    size={product.size}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-cream-200/80" />
                </div>

                <div className="p-[18px_18px_22px]">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-display text-[20px] font-normal text-ink-soft leading-tight">
                      {product.title}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-sage-700 bg-sage-200 px-2 py-1 rounded-pill shrink-0">
                      Próximamente
                    </span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mt-[6px]">
                    {product.catLabel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ComingSoonSection

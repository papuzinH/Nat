import React from 'react'
import { type Product, type ProductVariant, getVariantPrice, formatARS } from '@/data/products'

interface VariantSelectorProps {
  product: Product
  selectedSize: string | null
  onSelect: (size: string) => void
  priceRef?: React.RefObject<HTMLElement | null>
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  selectedSize,
  onSelect,
}) => {
  if (!product.variants) return null

  return (
    <div className="mt-6">
      <p
        className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-3"
        id="variant-label"
      >
        Tamaño
      </p>
      <div
        role="radiogroup"
        aria-labelledby="variant-label"
        className="flex flex-wrap gap-2"
      >
        {product.variants.map((variant: ProductVariant) => {
          const isActive = selectedSize === variant.size
          const price = getVariantPrice(product, variant.size)

          return (
            <button
              key={variant.size}
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(variant.size)}
              className={[
                'font-mono text-[12px] px-[12px] py-[8px] rounded-pill border transition-all duration-200',
                isActive
                  ? 'bg-sage-900 text-cream-50 border-sage-900'
                  : 'text-ink-soft border-[var(--line)] hover:border-sage-500 hover:text-ink',
              ].join(' ')}
              style={{ cursor: 'pointer', background: isActive ? undefined : 'transparent' }}
            >
              {variant.size}
              <span className="ml-[6px] opacity-70">{formatARS(price)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default VariantSelector

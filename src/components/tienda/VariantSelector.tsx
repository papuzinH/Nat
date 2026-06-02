import React from 'react'
import { type Product, type ProductVariant, getVariantPrice, formatARS } from '@/data/products'

interface VariantSelectorProps {
  product: Product
  selectedVariant: string | null
  onSelect: (label: string) => void
  priceRef?: React.RefObject<HTMLElement | null>
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  selectedVariant,
  onSelect,
}) => {
  if (!product.variants) return null

  return (
    <div className="mt-6">
      <div
        role="radiogroup"
        className="flex flex-wrap gap-2"
      >
        {product.variants.map((variant: ProductVariant) => {
          const isActive = selectedVariant === variant.label
          const price = getVariantPrice(product, variant.label)

          return (
            <button
              key={variant.label}
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(variant.label)}
              className={[
                'font-mono text-[12px] px-[12px] py-[8px] rounded-pill border transition-all duration-200',
                isActive
                  ? 'bg-sage-900 text-cream-50 border-sage-900'
                  : 'text-ink-soft border-[var(--line)] hover:border-sage-500 hover:text-ink',
              ].join(' ')}
              style={{ cursor: 'pointer', background: isActive ? undefined : 'transparent' }}
            >
              {variant.label}
              <span className="ml-[6px] opacity-70">{formatARS(price)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default VariantSelector

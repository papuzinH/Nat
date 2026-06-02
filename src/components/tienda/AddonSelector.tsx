import React from 'react'
import { type Product, getFramePrice, formatARS } from '@/data/products'

interface AddonSelectorProps {
  product: Product
  frameSelected: boolean
  onToggle: () => void
  selectedSize: string | null
  selectedFrameColor: string | null
  onFrameColorChange: (color: string) => void
}

const AddonSelector: React.FC<AddonSelectorProps> = ({
  product,
  frameSelected,
  onToggle,
  selectedSize,
  selectedFrameColor,
  onFrameColorChange,
}) => {
  if (!product.hasFrame) return null

  const currentFramePrice = getFramePrice(product, selectedSize)
  const hasColorOptions = product.frameOptions && product.frameOptions.length > 0

  return (
    <div className="mt-5">
      <label
        className={[
          'flex items-start gap-3 p-[14px_16px] border rounded-[4px] cursor-pointer transition-all duration-200',
          frameSelected
            ? 'bg-sage-200 border-sage-500'
            : 'bg-transparent border-[var(--line)]',
        ].join(' ')}
      >
        <input
          type="checkbox"
          checked={frameSelected}
          onChange={onToggle}
          className="mt-[2px] shrink-0"
          style={{ accentColor: '#4a7c59', width: 16, height: 16, cursor: 'pointer' }}
        />
        <div>
          <p className="font-body text-[14px] font-semibold text-ink leading-tight">
            Sumar enmarcado
          </p>
          <p className="font-body text-[12px] text-ink-soft mt-[3px]">
            Marco industrial con vidrio protector · +{formatARS(currentFramePrice)}
          </p>
        </div>
      </label>

      {frameSelected && hasColorOptions && (
        <div className="mt-3 px-[2px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-2">
            Color del marco
          </p>
          <div className="flex flex-wrap gap-2">
            {product.frameOptions!.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => onFrameColorChange(opt.label)}
                className={[
                  'font-body text-[12px] px-3 py-1.5 rounded-pill border transition-all duration-150',
                  selectedFrameColor === opt.label
                    ? 'bg-sage-900 text-cream-50 border-sage-900'
                    : 'text-ink-soft border-[var(--line)] hover:border-sage-500 hover:text-ink',
                ].join(' ')}
                style={{ cursor: 'pointer' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AddonSelector

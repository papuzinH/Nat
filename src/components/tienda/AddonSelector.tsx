import React from 'react'
import { type Product, formatARS } from '@/data/products'

interface AddonSelectorProps {
  product: Product
  frameSelected: boolean
  onToggle: () => void
}

const AddonSelector: React.FC<AddonSelectorProps> = ({
  product,
  frameSelected,
  onToggle,
}) => {
  if (!product.hasFrame) return null

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
            Sumar marco de roble
          </p>
          <p className="font-body text-[12px] text-ink-soft mt-[3px]">
            Marco artesanal con vidrio antirreflejo · +{formatARS(product.framePrice)}
          </p>
        </div>
      </label>
    </div>
  )
}

export default AddonSelector

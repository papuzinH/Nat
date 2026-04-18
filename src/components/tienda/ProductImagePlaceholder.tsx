import React from 'react'
import { TONE_COLORS, type ProductTone } from '@/data/products'

interface ProductImagePlaceholderProps {
  tone: ProductTone
  tall: number
  catLabel: string
  size?: string
}

const ProductImagePlaceholder: React.FC<ProductImagePlaceholderProps> = ({
  tone,
  tall,
  catLabel,
  size,
}) => {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ paddingTop: `${tall * 77}%`, background: TONE_COLORS[tone] }}
      role="img"
      aria-label={`Imagen de ${catLabel}${size ? `, ${size}` : ''}`}
    >
      {/* Overlay diagonal sutil */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
        }}
      />

      {/* Label centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-center leading-relaxed"
          style={{ color: 'rgba(44,44,44,0.45)' }}
        >
          {catLabel}
          {size && (
            <>
              <br />
              {size}
            </>
          )}
        </span>
      </div>
    </div>
  )
}

export default ProductImagePlaceholder

import React, { useState, useRef, useLayoutEffect } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { type Product, getVariantPrice, formatARS } from '@/data/products'
import VariantSelector from './VariantSelector'
import AddonSelector from './AddonSelector'

interface ProductInfoProps {
  product: Product
  onAddToCart: () => void
}

const WHATSAPP_NUMBER = '5491166191209'

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants?.[2]?.size ?? null // default A4 (index 2) si tiene variantes
  )
  const [frameSelected, setFrameSelected] = useState(false)
  const priceRef = useRef<HTMLParagraphElement>(null)

  const variantPrice = getVariantPrice(product, selectedSize)
  const displayPrice = variantPrice + (frameSelected ? product.framePrice : 0)

  // Animación de precio al cambiar variante o addon
  useLayoutEffect(() => {
    if (!shouldAnimate() || !priceRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        priceRef.current,
        { scale: 1.06 },
        { scale: 1, duration: 0.25, ease: 'power2.out' }
      )
    })
    return () => ctx.revert()
  }, [displayPrice])

  const waMessage = encodeURIComponent(
    `Hola Natalia! Me interesa "${product.title}" (${product.catLabel}). ¿Está disponible?`
  )

  return (
    <div className="md:sticky md:top-[100px]">
      {/* Eyebrow */}
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3">
        {product.catLabel}
      </p>

      {/* Título */}
      <h1
        className="font-display font-normal text-ink"
        style={{
          fontSize: 'clamp(28px, 4.5vw, 52px)',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
        }}
      >
        {product.title}
      </h1>

      {/* Precio */}
      <div className="flex items-baseline gap-3 mt-5">
        <p
          ref={priceRef}
          className="font-display text-[28px] text-sage-900"
          style={{ lineHeight: 1 }}
        >
          {formatARS(displayPrice)}
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft bg-cream-200 px-2 py-1 rounded-pill">
          ARS
        </span>
      </div>

      {/* Descripción */}
      <p
        className="font-body text-ink-soft mt-5"
        style={{ fontSize: '15px', lineHeight: 1.7 }}
      >
        {product.description}
      </p>

      {/* Selector de variante */}
      <VariantSelector
        product={product}
        selectedSize={selectedSize}
        onSelect={setSelectedSize}
      />

      {/* Addon de marco */}
      <AddonSelector
        product={product}
        frameSelected={frameSelected}
        onToggle={() => setFrameSelected((prev) => !prev)}
      />

      {/* CTAs */}
      <div className="flex gap-[10px] mt-7">
        <button
          onClick={onAddToCart}
          className="flex-1 bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
          style={{ cursor: 'pointer', border: 'none' }}
        >
          Agregar al carrito
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-[18px] rounded-pill border border-[var(--line)] text-ink-soft hover:border-sage-500 hover:text-ink transition-all duration-200"
          aria-label="Consultar por WhatsApp"
          style={{ textDecoration: 'none' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
      </div>

      {/* Specs table */}
      <div
        className="mt-9 pt-6"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Técnica', product.medium],
              ['Medidas', product.size],
              ['Edición', product.edition],
              ['Envío', 'Todo el país · 3–6 días hábiles'],
            ].map(([key, value]) => (
              <tr
                key={key}
                style={{ borderBottom: '1px solid var(--line-soft)' }}
              >
                <td
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft py-3 pr-4"
                  style={{ width: 120 }}
                >
                  {key}
                </td>
                <td className="font-body text-[13px] text-ink py-3">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductInfo

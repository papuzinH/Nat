import React, { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { flyToCart } from '@/lib/animations'
import { type Product, getVariantPrice, formatARS } from '@/data/products'
import VariantSelector from './VariantSelector'
import AddonSelector from './AddonSelector'

const DESC_RENDERER_EXTENSIONS = [
  StarterKit,
  LinkExt,
  ImageExt,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
  Highlight,
  Typography,
]

interface ProductInfoProps {
  product: Product
  onAddToCart: (selectedSize: string | null, hasFrame: boolean) => void
}

const WHATSAPP_NUMBER = '5491166191209'

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants?.[2]?.size ?? null
  )
  const [frameSelected, setFrameSelected] = useState(false)
  const priceRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const variantPrice = getVariantPrice(product, selectedSize)
  const displayPrice = variantPrice + (frameSelected ? product.framePrice : 0)

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

  function handleAddToCart() {
    if (shouldAnimate()) {
      const sourceImage = document.querySelector<HTMLImageElement>('img[data-product-main-image]')
      const cartIcon = findVisibleCartIcon()
      if (sourceImage && cartIcon && product.images[0]) {
        const fromRect = sourceImage.getBoundingClientRect()
        const toRect = cartIcon.getBoundingClientRect()
        flyToCart({
          fromRect,
          toRect,
          imageSrc: sourceImage.src,
          imageAlt: product.title,
        })
      }
    }
    onAddToCart(selectedSize, frameSelected)
  }

  const waMessage = encodeURIComponent(
    `Hola Natalia! Me interesa "${product.title}" (${product.catLabel}). ¿Está disponible?`
  )

  const descriptionHTML = useMemo(() => {
    try {
      return generateHTML(product.description, DESC_RENDERER_EXTENSIONS)
    } catch { return '' }
  }, [product.description])

  const detailRows: [string, string][] = [
    ...product.specs.map((s) => [s.label, s.value] as [string, string]),
    ['Medidas', product.size],
    ['Envío', 'A domicilio - Retiro en persona'],
  ]

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3">
        {product.catLabel}
      </p>

      <h1
        className="font-display font-normal text-ink"
        style={{
          fontSize: 'clamp(22px, 3vw, 36px)',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
        }}
      >
        {product.title}
      </h1>

      <div className="flex items-baseline gap-3 mt-5">
        <p
          ref={priceRef}
          className="font-display text-[22px] text-sage-900"
          style={{ lineHeight: 1 }}
        >
          {formatARS(displayPrice)}
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft bg-cream-200 px-2 py-1 rounded-pill">
          ARS
        </span>
      </div>

      <div
        className="tiptap-content product-description font-body text-ink-soft mt-5"
        style={{ fontSize: '15px', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />

      <VariantSelector
        product={product}
        selectedSize={selectedSize}
        onSelect={setSelectedSize}
      />

      <AddonSelector
        product={product}
        frameSelected={frameSelected}
        onToggle={() => setFrameSelected((prev) => !prev)}
      />

      <div className="flex gap-[10px] mt-7">
        <button
          ref={buttonRef}
          onClick={handleAddToCart}
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

      <div
        className="mt-9 pt-6"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {detailRows
              .filter(([, value]) => value && value.trim().length > 0)
              .map(([key, value]) => (
                <tr
                  key={key}
                  style={{ borderBottom: '1px solid var(--line-soft)' }}
                >
                  <td
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft py-3 pr-4 align-top"
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

function findVisibleCartIcon(): HTMLElement | null {
  const icons = document.querySelectorAll<HTMLElement>('[data-cart-icon]')
  for (const icon of icons) {
    const rect = icon.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) return icon
  }
  return null
}

export default ProductInfo

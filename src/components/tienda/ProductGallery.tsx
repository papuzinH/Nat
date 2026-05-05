import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { type Product } from '@/data/products'
import ProductImagePlaceholder from './ProductImagePlaceholder'

interface ProductGalleryProps {
  product: Product
}

const THUMB_COUNT = 4

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState(0)

  // Zoom in al montar
  useLayoutEffect(() => {
    if (!shouldAnimate() || !mainRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        { scale: 1.03, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
    })
    return () => ctx.revert()
  }, [])

  function handleThumbClick(i: number) {
    if (i === activeThumb || !shouldAnimate()) {
      setActiveThumb(i)
      return
    }
    if (mainRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          mainRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: 'power1.inOut' }
        )
      })
      setActiveThumb(i)
      return () => ctx.revert()
    }
    setActiveThumb(i)
  }

  const hasImages = product.images.length > 0

  return (
    <div>
      {/* Imagen principal */}
      <div ref={mainRef} className="rounded-card overflow-hidden">
        {hasImages ? (
          <img
            src={product.images[activeThumb] ?? product.images[0]}
            alt={`${product.title} — ${product.catLabel}, ${product.medium}`}
            width={600}
            height={Math.round(600 * product.tall)}
            loading="eager"
            fetchPriority="high"
            className="w-full object-cover"
            style={{ display: 'block' }}
            data-product-main-image
          />
        ) : (
          <ProductImagePlaceholder
            tone={product.tone}
            tall={product.tall}
            catLabel={product.catLabel}
            size={product.size}
          />
        )}
      </div>

      {/* Thumbnails — solo desktop */}
      <div className="hidden md:grid grid-cols-4 gap-[12px] mt-[12px]">
        {Array.from({ length: THUMB_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleThumbClick(i)}
            className={[
              'rounded-[3px] overflow-hidden transition-all duration-150',
              activeThumb === i
                ? 'ring-2 ring-sage-700 ring-offset-1'
                : 'opacity-60 hover:opacity-100',
            ].join(' ')}
            aria-label={`Ver imagen ${i + 1}`}
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            {hasImages && product.images[i] ? (
              <img
                src={product.images[i]}
                alt={`${product.title} — vista ${i + 1}`}
                width={120}
                height={Math.round(120 * product.tall)}
                loading="lazy"
                className="w-full object-cover"
                style={{ display: 'block' }}
              />
            ) : (
              <ProductImagePlaceholder
                tone={product.tone}
                tall={product.tall}
                catLabel=""
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery

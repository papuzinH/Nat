import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { type Product } from '@/data/products'
import ProductImagePlaceholder from './ProductImagePlaceholder'

interface ProductGalleryProps {
  product: Product
  sticky?: boolean
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product, sticky }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const thumbsContainerRef = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const hasImages = product.images.length > 0
  const showArrows = product.images.length > 1
  const aspectRatio = `1 / ${product.tall}`

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

  useEffect(() => {
    const container = thumbsContainerRef.current
    if (!container) return
    const thumbEl = container.children[activeThumb] as HTMLElement
    if (thumbEl) {
      thumbEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeThumb])

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

  function handlePrev(e: React.MouseEvent) {
    e.stopPropagation()
    handleThumbClick((activeThumb - 1 + product.images.length) % product.images.length)
  }

  function handleNext(e: React.MouseEvent) {
    e.stopPropagation()
    handleThumbClick((activeThumb + 1) % product.images.length)
  }

  function handleMainClick() {
    if (hasImages) setLightboxOpen(true)
  }

  function handleMainKeyDown(e: React.KeyboardEvent) {
    if (!hasImages) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setLightboxOpen(true)
    }
  }

  return (
    <div className={sticky ? 'md:flex md:flex-col md:h-full' : ''}>
      {/* Imagen principal */}
      <div
        ref={mainRef}
        className={[
          'relative rounded-card overflow-hidden group',
          sticky ? 'md:flex-1 md:min-h-0 md:![aspect-ratio:unset]' : '',
          hasImages ? 'cursor-zoom-in' : '',
        ].join(' ')}
        style={{ aspectRatio }}
        onClick={handleMainClick}
        onKeyDown={handleMainKeyDown}
        role={hasImages ? 'button' : undefined}
        tabIndex={hasImages ? 0 : undefined}
        aria-label={hasImages ? 'Ampliar imagen' : undefined}
      >
        {hasImages ? (
          <img
            src={product.images[activeThumb] ?? product.images[0]}
            alt={`${product.title} — ${product.catLabel}`}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
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

        {showArrows && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente imagen"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — flex scrollable, solo imágenes reales */}
      {hasImages && (
        <div
          ref={thumbsContainerRef}
          className={`flex gap-[12px] mt-[12px] overflow-x-auto [&::-webkit-scrollbar]:hidden${sticky ? ' md:flex-shrink-0' : ''}`}
          style={{ scrollbarWidth: 'none' }}
        >
          {product.images.map((src, i) => (
            <button
              key={i}
              onClick={() => handleThumbClick(i)}
              className={[
                'relative flex-shrink-0 w-[calc(25%-9px)] rounded-[3px] overflow-hidden transition-all duration-150',
                activeThumb === i
                  ? 'ring-2 ring-sage-700 ring-offset-1 opacity-100'
                  : 'opacity-60 hover:opacity-100',
              ].join(' ')}
              aria-label={`Ver imagen ${i + 1}`}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                aspectRatio,
              }}
            >
              <img
                src={src}
                alt={`${product.title} — vista ${i + 1}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      {hasImages && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={activeThumb}
          on={{ view: ({ index }) => setActiveThumb(index) }}
          slides={product.images.map((src) => ({
            src,
            alt: `${product.title} — ${product.catLabel}`,
          }))}
        />
      )}
    </div>
  )
}

export default ProductGallery

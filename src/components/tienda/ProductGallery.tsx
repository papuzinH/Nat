import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image, { getImageProps } from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { TONE_COLORS, type Product } from '@/data/products'
import ProductImagePlaceholder from './ProductImagePlaceholder'

/**
 * Placeholder de carga: un SVG de un color plano en data URI. Las imágenes vienen
 * de PocketBase, así que Next no puede generar el blur en build; con esto la
 * imagen entra desde el tono del producto en vez de aparecer de golpe.
 */
const toneBlur = (hex: string) =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="5"><rect width="4" height="5" fill="${hex}"/></svg>`
  )

const MAIN_SIZES = '(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 620px'

// Si el cambio de foto tarda más que el delay, la principal se atenúa y aparece el
// spinner. Con la foto en caché el cambio es inmediato y no llega a verse.
const SWITCH_FEEDBACK = 'opacity 200ms ease 150ms'

/**
 * Baja la foto principal con el mismo srcset y sizes que va a usar <Image>, así el
 * cambio sale de caché. Sin esto, al cambiar el src el navegador sigue mostrando la
 * foto anterior hasta que termina de bajar la nueva (1 a 3 s la primera vez) y
 * parece que el clic no hizo nada.
 */
const preloads = new Map<string, Promise<void>>()
function preloadMainImage(src: string): Promise<void> {
  const cached = preloads.get(src)
  if (cached) return cached
  const { props } = getImageProps({ src, alt: '', fill: true, sizes: MAIN_SIZES })
  const promise = new Promise<void>((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => {
      preloads.delete(src)
      resolve()
    }
    if (props.sizes) img.sizes = props.sizes
    if (props.srcSet) img.srcset = props.srcSet
    img.src = props.src
  })
  preloads.set(src, promise)
  return promise
}

function whenIdle(cb: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout: 2000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(cb, 300)
  return () => window.clearTimeout(id)
}

const arrowClassName =
  'absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full text-ink bg-cream-50/85 backdrop-blur-sm shadow-sm transition-colors duration-200 hover:bg-cream-50 hover:text-sage-700'

interface ProductGalleryProps {
  product: Product
  sticky?: boolean
  frameImage?: string | null
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product, sticky, frameImage }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const thumbsContainerRef = useRef<HTMLDivElement>(null)
  // activeThumb: la que eligió el usuario (miniatura marcada, flechas, lightbox).
  // shownThumb: la que se ve en grande. Alcanza a activeThumb cuando la foto bajó.
  const [activeThumb, setActiveThumb] = useState(0)
  const [shownThumb, setShownThumb] = useState(0)
  const activeRef = useRef(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { images } = product
  const count = images.length
  const hasImages = count > 0
  // Cuando hay imagen de marco activa, se muestra solo esa imagen (sin flechas ni lightbox de marco)
  const displaySrc = frameImage ?? images[shownThumb] ?? images[0]
  const showArrows = !frameImage && count > 1
  const isSwitching = !frameImage && activeThumb !== shownThumb
  // El contenedor toma la proporción real de la obra que se está mostrando, así no
  // hay que elegir entre recortarla (object-cover) o rodearla de aire. `tall` queda
  // como fallback para el placeholder y para el hook client, que no trae ratios.
  const shownRatio = product.imageRatios?.[shownThumb] ?? null
  const aspectRatio = frameImage || !shownRatio ? `1 / ${product.tall}` : `${shownRatio}`
  const thumbRatio = `1 / ${product.tall}`
  const toneBg = TONE_COLORS[product.tone] ?? '#f5efe6'
  const blurPlaceholder = toneBlur(toneBg)
  const mainImageStyle: React.CSSProperties = {
    opacity: isSwitching ? 0.55 : 1,
    transition: isSwitching ? SWITCH_FEEDBACK : 'opacity 150ms ease',
  }

  useLayoutEffect(() => {
    if (!shouldAnimate() || !mainRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        { scale: 1.03 },
        { scale: 1, duration: 0.6, ease: 'power2.out' }
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

  // Deja listas la anterior y la siguiente, para que las flechas cambien al toque.
  useEffect(() => {
    if (count < 2) return
    return whenIdle(() => {
      preloadMainImage(images[(activeThumb + 1) % count])
      preloadMainImage(images[(activeThumb - 1 + count) % count])
    })
  }, [activeThumb, count, images])

  const goTo = useCallback(
    (i: number) => {
      activeRef.current = i
      setActiveThumb(i)
      preloadMainImage(images[i]).then(() => {
        // Con clics rápidos solo cuenta el último pedido.
        if (activeRef.current === i) setShownThumb(i)
      })
    },
    [images]
  )

  function step(dir: 1 | -1) {
    goTo((activeThumb + dir + count) % count)
  }

  function handlePrev(e: React.MouseEvent) {
    e.stopPropagation()
    step(-1)
  }

  function handleNext(e: React.MouseEvent) {
    e.stopPropagation()
    step(1)
  }

  function handleMainClick() {
    if (hasImages) setLightboxOpen(true)
  }

  function handleMainKeyDown(e: React.KeyboardEvent) {
    if (!hasImages) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setLightboxOpen(true)
    } else if (showArrows && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault()
      step(e.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return (
    <div className={sticky ? 'md:flex md:flex-col md:h-full' : ''}>
      {/* Imagen principal */}
      <div
        ref={mainRef}
        className={[
          'relative rounded-card overflow-hidden group flex items-center justify-center',
          sticky ? 'md:flex-1 md:min-h-0 md:![aspect-ratio:unset]' : '',
          hasImages ? 'cursor-zoom-in' : '',
        ].join(' ')}
        /* Sin fondo propio: sobre el cream de la sección la obra flota y el aire
           que pueda sobrar deja de leerse como una caja alrededor. */
        style={{ aspectRatio }}
        onClick={handleMainClick}
        onKeyDown={handleMainKeyDown}
        role={hasImages ? 'button' : undefined}
        tabIndex={hasImages ? 0 : undefined}
        aria-label={hasImages ? `Ampliar imagen ${activeThumb + 1} de ${count}` : undefined}
      >
        {frameImage ? (
          <Image
            src={frameImage}
            alt={`${product.title} — enmarcado`}
            fill
            priority
            sizes={MAIN_SIZES}
            className="object-contain"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            data-product-main-image
          />
        ) : hasImages && shownRatio ? (
          /* Con la proporción conocida damos width/height intrínsecos: el navegador
             escala la obra solo, acotada por el alto disponible y por el ancho de la
             columna, sin recortar ni pedirnos un ratio de contenedor. Los números
             absolutos no importan, Next solo los usa para la proporción. */
          <Image
            src={displaySrc}
            alt={`${product.title} — ${product.catLabel}`}
            width={Math.round(1000 * shownRatio)}
            height={1000}
            priority
            sizes={MAIN_SIZES}
            className="w-auto h-auto max-w-full max-h-full object-contain"
            style={mainImageStyle}
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            data-product-main-image
          />
        ) : hasImages ? (
          <Image
            src={displaySrc}
            alt={`${product.title} — ${product.catLabel}`}
            fill
            priority
            sizes={MAIN_SIZES}
            className="object-contain"
            style={mainImageStyle}
            placeholder="blur"
            blurDataURL={blurPlaceholder}
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

        {/* Spinner: siempre montado, aparece solo si el cambio de foto se demora */}
        {hasImages && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ opacity: isSwitching ? 1 : 0, transition: isSwitching ? SWITCH_FEEDBACK : 'opacity 100ms ease' }}
          >
            <span
              className={`block w-8 h-8 rounded-full border-2${isSwitching ? ' animate-spin' : ''}`}
              style={{ borderColor: 'rgba(74,124,89,0.25)', borderTopColor: 'var(--sage-700)' }}
            />
          </span>
        )}

        {showArrows && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Imagen anterior"
              className={`${arrowClassName} left-2 md:left-3`}
              style={{ cursor: 'pointer', border: '1px solid var(--line)' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente imagen"
              className={`${arrowClassName} right-2 md:right-3`}
              style={{ cursor: 'pointer', border: '1px solid var(--line)' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — flex scrollable, solo imágenes reales. El padding de 3px deja
          lugar al ring de la seleccionada (2px + 1px de offset): overflow-x-auto
          también recorta en vertical, y sin él se perdían los bordes. */}
      {hasImages && (
        <div
          ref={thumbsContainerRef}
          className={`flex gap-[8px] mt-[5px] -mx-[3px] p-[3px] overflow-x-auto [&::-webkit-scrollbar]:hidden${sticky ? ' md:flex-shrink-0' : ''}`}
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              onPointerEnter={() => preloadMainImage(src)}
              onPointerDown={() => preloadMainImage(src)}
              onFocus={() => preloadMainImage(src)}
              aria-current={activeThumb === i ? 'true' : undefined}
              className={[
                'relative flex-shrink-0 w-[58px] rounded-[3px] overflow-hidden transition-all duration-150',
                activeThumb === i
                  ? 'ring-2 ring-sage-700 ring-offset-1 opacity-100'
                  : 'opacity-60 hover:opacity-100',
              ].join(' ')}
              aria-label={`Ver imagen ${i + 1}`}
              style={{
                cursor: 'pointer',
                background: toneBg,
                border: 'none',
                padding: 0,
                aspectRatio: thumbRatio,
              }}
            >
              <Image
                src={src}
                alt={`${product.title} — vista ${i + 1}`}
                fill
                sizes="58px"
                className="object-contain"
                placeholder="blur"
                blurDataURL={blurPlaceholder}
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
          on={{
            view: ({ index }) => {
              if (index !== activeRef.current) goTo(index)
            },
          }}
          slides={images.map((src) => ({
            src,
            alt: `${product.title} — ${product.catLabel}`,
          }))}
        />
      )}
    </div>
  )
}

export default ProductGallery

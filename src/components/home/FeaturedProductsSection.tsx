import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'

interface Product {
  slug: string
  title: string
  category: string
  cat_label: string
  price: number
  tone: string
}

const TONE_COLORS: Record<string, string> = {
  a: '#ece2d1',
  b: '#dde2d1',
  c: '#e5d9c7',
  d: '#d5ddcf',
  e: '#e8dfd0',
  f: '#dfdfd1',
}

const FEATURED_PRODUCTS: Product[] = [
  { slug: 'helecho-i', title: 'Helecho I', category: 'laminas', cat_label: 'Lámina — Giclée', price: 8500, tone: 'a' },
  { slug: 'cuenco-musgo', title: 'Cuenco Musgo', category: 'ceramica', cat_label: 'Cerámica — Gres esmaltado', price: 24000, tone: 'b' },
  { slug: 'anemone-studio', title: 'Anémonas — estudio', category: 'acuarela', cat_label: 'Acuarela original', price: 46000, tone: 'c' },
  { slug: 'tapiz-raiz', title: 'Tapiz Raíz', category: 'textil', cat_label: 'Fibra — telar manual', price: 92000, tone: 'd' },
  { slug: 'gouache-membrillo', title: 'Membrillo en gouache', category: 'gouache', cat_label: 'Gouache original', price: 38000, tone: 'e' },
  { slug: 'abanico-jazmin', title: 'Abanico Jazmín', category: 'abanicos', cat_label: 'Abanico pintado a mano', price: 28000, tone: 'f' },
]

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <Link
    to={`/tienda/${product.slug}`}
    className="group block rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1"
    style={{
      textDecoration: 'none',
      background: 'var(--cream-50, #fdfcfb)',
      boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
    }}
  >
    {/* Placeholder image */}
    <div
      className="w-full relative overflow-hidden"
      style={{ aspectRatio: '4 / 5', background: TONE_COLORS[product.tone] ?? '#ece2d1' }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(74,124,89,0.07) 11px, rgba(74,124,89,0.07) 12px)',
        }}
      />
      <span
        className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
        style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}
      >
        {product.cat_label}
      </span>
    </div>

    {/* Info */}
    <div className="p-4 pb-5">
      <h3 className="font-display text-[18px] text-ink mb-1 group-hover:text-sage-700 transition-colors duration-200">
        {product.title}
      </h3>
      <p className="font-display text-[22px] text-sage-900 mt-2">
        {formatPrice(product.price)}
      </p>
    </div>
  </Link>
)

// Void reference to suppress unused import warning — ScrollTrigger is registered globally via gsap lib
void ScrollTrigger

const FeaturedProductsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!cardsRef.current || !shouldAnimate()) return

    const cards = cardsRef.current.querySelectorAll<HTMLElement>('.product-card')
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 px-6 md:px-12 bg-cream-100"
      aria-labelledby="featured-products-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 md:mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3">
              Tienda
            </p>
            <h2
              id="featured-products-heading"
              className="font-display font-normal text-ink"
              style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.1 }}
            >
              Piezas que acaban de salir del estudio
            </h2>
          </div>
          <Link
            to="/tienda"
            className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink hover:text-sage-700 transition-colors duration-200 mt-2 shrink-0 hidden md:block"
            style={{ textDecoration: 'none' }}
          >
            Ver todo →
          </Link>
        </div>

        {/* Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-7"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.slug} className="product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile "ver todo" */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/tienda"
            className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink hover:text-sage-700 transition-colors duration-200"
            style={{ textDecoration: 'none' }}
          >
            Ver todo →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSection

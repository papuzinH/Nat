'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type Product, formatARS } from '@/data/products'
import { useCart } from '@/context/CartContext'
import ProductImagePlaceholder from './ProductImagePlaceholder'
import AddedToast from './AddedToast'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addItem } = useCart()
  const router = useRouter()
  const [toastVisible, setToastVisible] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.variants) {
      router.push(`/tienda/${product.slug}`)
      return
    }
    addItem({
      slug: product.slug,
      title: product.title,
      catLabel: product.catLabel,
      image: product.images[0] ?? '',
      selectedSize: null,
      hasFrame: false,
      frameColor: null,
      unitPrice: product.basePrice,
    })
    setToastVisible(true)
  }

  return (
    <article
      className="product-card group relative bg-cream-50 rounded-card overflow-hidden hover:-translate-y-1 active:scale-[0.98] active:opacity-90 transition-[transform,opacity] duration-[260ms] ease-out"
      style={{
        boxShadow:
          '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
      }}
    >
      {/* Badges de stock y estado */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
        {product.stock != null && product.stock > 0 && product.stock <= 3 && (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm bg-amber-100 text-amber-800">
            Últimas {product.stock}
          </span>
        )}
        {product.onDemand && (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm bg-cream-200 text-ink-soft">
            A pedido
          </span>
        )}
      </div>

      <Link
        href={`/tienda/${product.slug}`}
        aria-label={product.title}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {/* Media */}
        {product.images.length > 0 ? (
          <div className="relative w-full" style={{ aspectRatio: `1 / ${product.tall}` }}>
            <Image
              src={product.images[0]}
              alt={`${product.title} — ${product.catLabel}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover"
            />
          </div>
        ) : (
          <ProductImagePlaceholder
            tone={product.tone}
            tall={product.tall}
            catLabel={product.catLabel}
            size={product.size}
          />
        )}

        {/* Info */}
        <div className="p-3 sm:p-[18px_18px_22px]">
          <h3 className="font-display text-[15px] sm:text-xl font-normal text-ink leading-snug group-hover:text-sage-700 transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>
          <span className="font-display text-[14px] sm:text-lg text-sage-700 block mt-1.5">
            {formatARS(product.basePrice)}
          </span>
          {/* Etiqueta de categoría: oculta en mobile, visible desde sm+ */}
          <div className="hidden sm:block font-mono text-xs uppercase tracking-[0.14em] text-ink-soft mt-[6px]">
            {product.catLabel}
          </div>
        </div>
      </Link>

      {/* Quick-add overlay — centrado, fondo claro borroso, visible en hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-cream-50/30 backdrop-blur-[3px]"
      >
        <button
          onClick={handleQuickAdd}
          tabIndex={-1}
          className="pointer-events-auto px-6 py-2.5 font-body text-[13px] font-semibold bg-sage-900 text-cream-50 rounded-pill shadow-lg scale-95 group-hover:scale-100 transition-[transform,background-color] duration-200 hover:bg-sage-700"
          aria-label={`Agregar ${product.title} al carrito`}
        >
          {product.variants ? 'Ver opciones →' : 'Agregar al carrito'}
        </button>
      </div>

      <AddedToast
        visible={toastVisible}
        productTitle={product.title}
        onDismiss={() => setToastVisible(false)}
      />
    </article>
  )
}

export default ProductCard

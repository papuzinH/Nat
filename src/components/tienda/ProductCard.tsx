import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [toastVisible, setToastVisible] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.variants) {
      navigate(`/tienda/${product.slug}`)
      return
    }
    addItem({
      slug: product.slug,
      title: product.title,
      catLabel: product.catLabel,
      image: product.images[0] ?? '',
      selectedSize: null,
      hasFrame: false,
      unitPrice: product.basePrice,
    })
    setToastVisible(true)
  }

  return (
    <article
      className="product-card group relative break-inside-avoid mb-3 md:mb-4 bg-cream-50 rounded-card overflow-hidden hover:-translate-y-1 active:scale-[0.98] active:opacity-90 transition-[transform,opacity] duration-[260ms] ease-out"
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
        to={`/tienda/${product.slug}`}
        aria-label={product.title}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {/* Media */}
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={`${product.title} — ${product.catLabel}, ${product.medium}`}
            width={400}
            height={Math.round(400 * product.tall)}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            className="w-full object-cover"
            style={{ display: 'block', aspectRatio: `1 / ${product.tall}` }}
          />
        ) : (
          <ProductImagePlaceholder
            tone={product.tone}
            tall={product.tall}
            catLabel={product.catLabel}
            size={product.size}
          />
        )}

        {/* Info */}
        <div className="p-[18px_18px_22px]">
          <div className="flex justify-between items-baseline gap-2">
            <h3 className="font-display text-xl font-normal text-ink leading-tight group-hover:text-sage-700 transition-colors duration-200">
              {product.title}
            </h3>
            <span className="font-display text-xl text-sage-700 shrink-0">
              {formatARS(product.basePrice)}
            </span>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft mt-[6px]">
            {product.catLabel}
          </div>
        </div>
      </Link>

      {/* Quick-add overlay — visible en hover */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 p-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
      >
        <button
          onClick={handleQuickAdd}
          tabIndex={-1}
          className="w-full py-2 font-body text-[13px] font-semibold bg-sage-900 text-cream-50 rounded-pill hover:bg-sage-700 transition-colors duration-150"
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

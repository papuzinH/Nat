import React from 'react'
import { Link } from 'react-router-dom'
import { type Product, formatARS } from '@/data/products'
import ProductImagePlaceholder from './ProductImagePlaceholder'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  return (
    <article
      className="product-card bg-cream-50 rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow:
          '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
      }}
    >
      <Link
        to={`/tienda/${product.slug}`}
        aria-label={product.title}
        style={{ textDecoration: 'none', display: 'block' }}
        className="group"
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
            style={{ display: 'block' }}
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
    </article>
  )
}

export default ProductCard

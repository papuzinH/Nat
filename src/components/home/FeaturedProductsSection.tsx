import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/tienda'
import { SectionContainer, SectionTitle } from '@/components/shared'

const FeaturedProductsSection: React.FC = () => {
  const { products } = useProducts()
  const featuredProducts = products.filter((p) => p.status === 'active').slice(0, 6)

  return (
    <SectionContainer
      aria-labelledby="featured-products-heading"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-10 md:mb-14">
        <div>

          <SectionTitle
            id="featured-products-heading"
          >
            Piezas que acaban de salir del estudio
          </SectionTitle>
        </div>
        <Link
          to="/tienda"
          className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink hover:text-sage-700 transition-colors duration-200 mt-2 shrink-0 hidden md:block"
          style={{ textDecoration: 'none' }}
        >
          Ver todo →
        </Link>
      </div>

      <ProductGrid
        products={featuredProducts}
        activeCategory="featured"
        withSection={false}
        gridId="featured-product-grid"
        ariaLabel="Productos destacados"
        gridClassName="gap-4 md:gap-7"
      />

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
    </SectionContainer>
  )
}

export default FeaturedProductsSection

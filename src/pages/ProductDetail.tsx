import React from 'react'
import { useParams, Link } from 'react-router-dom'
import SchemaMarkup from '@/components/shared/SchemaMarkup'

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const productSchema = {
    name: slug ?? 'Producto',
    url: `https://tatuajesnaty.com/tienda/${slug ?? ''}`,
  }

  return (
    <>
      <SchemaMarkup type="Product" data={productSchema} />
      <main className="min-h-screen py-16 px-6 md:px-12">
        <nav className="max-w-5xl mx-auto mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <Link to="/tienda" className="hover:text-sage-700 transition-colors">tienda</Link>
            {' / '}
            <span>{slug}</span>
          </p>
        </nav>

        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="inline-block border border-[var(--line)] rounded-card p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-6">
              En preparación
            </p>
            <h1 className="font-display text-4xl text-ink mb-4">
              {slug}
            </h1>
            <p className="font-body text-ink-soft text-[16px] leading-relaxed max-w-md mx-auto mb-8">
              El detalle de producto estará disponible pronto.
            </p>
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 bg-sage-700 text-cream-50 font-body font-semibold text-sm px-[22px] py-[14px] rounded-pill hover:bg-sage-900 transition-all duration-[220ms] hover:-translate-y-px"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default ProductDetail

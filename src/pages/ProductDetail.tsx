import React, { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getVariantPrice } from '@/data/products'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/context/CartContext'
import {
  Breadcrumb,
  ProductGallery,
  ProductInfo,
  AddedToast,
  RelatedProducts,
} from '@/components/tienda'
import { SEOMeta } from '@/components/shared'

const BASE_URL = 'https://tatuajesnaty.com'

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { products, loading, getProduct } = useProducts()
  const product = getProduct(slug ?? '')

  const [toastVisible, setToastVisible] = useState(false)
  const { addItem } = useCart()

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream-50">
      <span className="font-mono text-[12px] text-ink-soft uppercase tracking-[0.14em]">Cargando…</span>
    </div>
  )

  if (!product) return <Navigate to="/tienda" replace />

  const handleAddToCart = (selectedSize: string | null, hasFrame: boolean) => {
    const unitPrice =
      getVariantPrice(product, selectedSize) + (hasFrame ? (product.framePrice ?? 0) : 0)
    addItem({
      slug: product.slug,
      title: product.title,
      catLabel: product.catLabel,
      image: product.images[0] ?? '',
      selectedSize,
      hasFrame,
      unitPrice,
    })
    setToastVisible(true)
  }

  const productSchema = {
    name: product.title,
    description: product.description,
    image: product.images[0] ?? `${BASE_URL}/og-placeholder.webp`,
    url: `${BASE_URL}/tienda/${product.slug}`,
    brand: { '@type': 'Brand', name: 'Natalia Heller' },
    category: product.catLabel,
    offers: {
      '@type': 'Offer',
      price: product.basePrice,
      priceCurrency: 'ARS',
      availability:
        product.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Person', name: 'Natalia Heller' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', currency: 'ARS' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 6,
            unitCode: 'DAY',
          },
        },
      },
    },
  }

  const combinedSchema = {
    '@graph': [
      { '@type': 'Product', ...productSchema },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${BASE_URL}/tienda` },
          { '@type': 'ListItem', position: 3, name: product.catLabel },
          { '@type': 'ListItem', position: 4, name: product.title },
        ],
      },
    ],
  }

  const metaDescription = `${product.description} ${product.medium}. ${product.edition}. A domicilio - Retiro en persona.`

  return (
    <>
      <SEOMeta
        title={`${product.title} — ${product.catLabel} | Natalia Heller`}
        description={metaDescription}
        canonical={`${BASE_URL}/tienda/${product.slug}`}
        ogType="product"
        ogImage={product.images[0] ?? `${BASE_URL}/og-placeholder.webp`}
        schema={combinedSchema}
      />

      <main className="min-h-screen bg-cream-50">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-8 pb-6">
          <Breadcrumb
            items={[
              { label: 'tienda', href: '/tienda' },
              { label: product.catLabel, href: `/tienda?cat=${product.category}` },
              { label: product.title },
            ]}
          />
        </div>

        {/* Layout principal */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-start">
            <ProductGallery product={product} />
            <ProductInfo product={product} onAddToCart={handleAddToCart} />
          </div>
        </section>

        {/* Relacionados */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <RelatedProducts currentSlug={product.slug} category={product.category} products={products} />
        </div>
      </main>

      {/* Toast */}
      <AddedToast
        visible={toastVisible}
        productTitle={product.title}
        onDismiss={() => setToastVisible(false)}
      />
    </>
  )
}

export default ProductDetail

import React, { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PRODUCTS } from '@/data/products'
import {
  Breadcrumb,
  ProductGallery,
  ProductInfo,
  AddedToast,
  RelatedProducts,
} from '@/components/tienda'
import SchemaMarkup from '@/components/shared/SchemaMarkup'

const BASE_URL = 'https://tatuajesnaty.com'

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const product = PRODUCTS.find((p) => p.slug === slug)

  const [toastVisible, setToastVisible] = useState(false)

  if (!product) return <Navigate to="/tienda" replace />

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

  const breadcrumbSchema = {
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${BASE_URL}/tienda` },
      { '@type': 'ListItem', position: 3, name: product.catLabel },
      { '@type': 'ListItem', position: 4, name: product.title },
    ],
  }

  const metaDescription = `${product.description} ${product.medium}. ${product.edition}. Envíos a todo el país.`

  return (
    <>
      <Helmet>
        <title>{`${product.title} — ${product.catLabel} | Natalia Heller`}</title>
        <meta name="description" content={metaDescription} />
        <meta
          property="og:title"
          content={`${product.title} — ${product.catLabel} | Natalia Heller`}
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/tienda/${product.slug}`} />
        <meta
          property="og:image"
          content={product.images[0] ?? `${BASE_URL}/og-placeholder.webp`}
        />
        <link rel="canonical" href={`${BASE_URL}/tienda/${product.slug}`} />
      </Helmet>

      <SchemaMarkup type="Product" data={productSchema} />
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbSchema} />

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
            <ProductInfo product={product} onAddToCart={() => setToastVisible(true)} />
          </div>
        </section>

        {/* Relacionados */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <RelatedProducts currentSlug={product.slug} category={product.category} />
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

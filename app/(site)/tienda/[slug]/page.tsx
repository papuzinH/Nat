import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProducts, getProduct } from '@/lib/data/products'
import { descriptionToPlainText } from '@/data/products'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import ProductDetailContent from '@/components/tienda/ProductDetailContent'

export const revalidate = 3600

// Prerender estático de todos los slugs de producto en build (SSG + ISR).
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return buildMetadata({ title: 'Producto no encontrado', noindex: true })

  const descriptionText = descriptionToPlainText(product.description)
  const specsLine = product.specs.map((s) => `${s.label}: ${s.value}`).join('. ')
  const metaDescription = [descriptionText, specsLine, 'A domicilio · retiro en persona.']
    .filter(Boolean)
    .join(' ')

  return buildMetadata({
    title: `${product.title} — ${product.catLabel}`,
    description: metaDescription,
    path: `/tienda/${product.slug}`,
    type: 'product',
    image: product.images[0] ?? '/og-placeholder.webp',
  })
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const descriptionText = descriptionToPlainText(product.description)

  const combinedSchema = {
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        description: descriptionText,
        image: product.images[0] ?? `${SITE_URL}/og-placeholder.webp`,
        url: `${SITE_URL}/tienda/${product.slug}`,
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
              handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 6, unitCode: 'DAY' },
            },
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${SITE_URL}/tienda` },
          { '@type': 'ListItem', position: 3, name: product.catLabel },
          { '@type': 'ListItem', position: 4, name: product.title },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={combinedSchema} />
      <ProductDetailContent product={product} products={products} />
    </>
  )
}

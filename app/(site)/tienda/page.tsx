import type { Metadata } from 'next'
import { getProducts } from '@/lib/data/products'
import { descriptionToPlainText } from '@/data/products'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import TiendaContent from '@/components/tienda/TiendaContent'

// ISR: HTML cacheado en edge, revalidado por tiempo + on-demand (tag 'products').
export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Tienda de Arte — Prints, Stickers, Cerámicas y más',
  description:
    'Comprá obra original de Natalia Heller: prints, cerámicas, acuarelas, stickers y abanicos. A domicilio · retiro en persona.',
  path: '/tienda',
  image: '/og-tienda.webp',
})

export default async function TiendaPage() {
  const products = await getProducts()
  const activeProducts = products.filter((p) => p.status === 'active')

  const tiendaSchema = {
    '@type': 'CollectionPage',
    name: 'Tienda de Arte — Natalia Heller',
    description:
      'Obra original de Natalia Heller: láminas giclée, cerámicas, acuarelas, stickers y abanicos.',
    url: `${SITE_URL}/tienda`,
    numberOfItems: activeProducts.length,
    itemListElement: activeProducts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.title,
        url: `${SITE_URL}/tienda/${p.slug}`,
        description: descriptionToPlainText(p.description),
        category: p.catLabel,
      },
    })),
  }

  return (
    <>
      <JsonLd data={tiendaSchema} />
      <TiendaContent products={products} />
    </>
  )
}

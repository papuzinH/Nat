import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { getProducts } from '@/lib/data/products'
import { getBlogPosts } from '@/lib/data/blog'

// Se regenera con el ISR (mismo TTL que las páginas de datos).
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                 lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/tienda`,           lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/estudio`,          lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/estudio/reservar`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/blog`,             lastModified: now, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/contacto`,         lastModified: now, priority: 0.5, changeFrequency: 'yearly' },
  ]

  const [products, posts] = await Promise.all([
    getProducts().catch(() => []),
    getBlogPosts().catch(() => []),
  ])

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/tienda/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...postRoutes]
}

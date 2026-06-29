import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPost, getRelatedPosts } from '@/lib/data/blog'
import { renderTiptapHtml } from '@/lib/tiptap'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import BlogPostArticle from '@/components/blog/BlogPostArticle'

// SSG + ISR. La page NO lee searchParams (eso la volvería dinámica y anularía el
// prerender). El modo vista previa del admin (?preview) se implementa aparte en
// la Wave 8 con una ruta client dedicada (BlogPostPreview ya existe).
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    // Si PocketBase no está disponible en build time (env var no configurada),
    // devuelve [] para que Next.js genere las páginas on-demand (SSR dinámico).
    return []
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return buildMetadata({ title: 'Nota no encontrada', noindex: true })

  return buildMetadata({
    title: post.title,
    description: post.subtitle,
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.image ?? undefined,
  })
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const bodyHtml = renderTiptapHtml(post.bodyJson)
  const related = await getRelatedPosts(post.related)

  const articleSchema = {
    '@type': 'Article',
    headline: post.title,
    description: post.subtitle,
    datePublished: post.isoDate,
    dateModified: post.isoDate,
    author: [{ '@type': 'Person', name: 'Natalia Heller', url: `${SITE_URL}/sobre-mi` }],
    publisher: {
      '@type': 'Organization',
      name: 'Natalia Heller Tattoo Studio',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <BlogPostArticle post={post} bodyHtml={bodyHtml} related={related} />
    </>
  )
}

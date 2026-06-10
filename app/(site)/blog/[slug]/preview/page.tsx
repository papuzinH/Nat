import type { Metadata } from 'next'
import BlogPostPreview from '@/components/blog/BlogPostPreview'

// Vista previa de borradores del admin: client-only, lee el draft de
// localStorage. Nunca se indexa ni se prerenderiza.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <BlogPostPreview slug={slug} />
}

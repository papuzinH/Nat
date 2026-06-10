import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/data/blog'
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import BlogContent from '@/components/blog/BlogContent'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Diario — Notas sobre proceso, plantas y oficio',
  description:
    'Conocé mi lado más íntimo: notas sobre proceso, plantas y oficio. Escritas desde el taller de Natalia Heller.',
  path: '/blog',
})

const collectionSchema = {
  '@type': 'CollectionPage',
  name: 'Conocé mi lado más íntimo — Natalia Heller',
  description:
    'Notas sobre proceso, plantas y oficio. Escritas una vez al mes desde el taller.',
  url: 'https://tatuajesnaty.com/blog',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <JsonLd data={collectionSchema} />
      <BlogContent posts={posts} />
    </>
  )
}

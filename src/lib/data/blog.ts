import 'server-only'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { rowToPost, BLOG_LIST_FIELDS } from '@/lib/data/blog-mappers'
import type { BlogPost } from '@/data/blog-posts'
import type { JSONContent } from '@tiptap/core'

// Tag de cache para revalidación on-demand desde el admin (/api/revalidate).
export const BLOG_TAG = 'blog_posts'

export interface BlogPostDetail extends BlogPost {
  bodyJson: JSONContent | null
  isoDate: string
}

/** Lista de posts publicados (campos de card), cacheada con ISR. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await pbGetFullList<Record<string, unknown>>(
    'blog_posts',
    { filter: 'published = true', sort: '-date', fields: BLOG_LIST_FIELDS },
    { tags: [BLOG_TAG] },
  )
  return rows.map(rowToPost)
}

/** Detalle de un post publicado por slug (con bodyJson para render server). */
export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  const rows = await pbGetFullList<Record<string, any>>(
    'blog_posts',
    { filter: `slug="${slug}" && published=true`, perPage: '1' },
    { tags: [BLOG_TAG] },
  )
  const data = rows[0]
  if (!data) return null
  return {
    ...rowToPost(data),
    bodyJson: (data.body as JSONContent) ?? null,
    isoDate: data.date as string,
  }
}

/** Posts relacionados (por slugs), publicados. */
export async function getRelatedPosts(slugs: string[]): Promise<BlogPost[]> {
  if (!slugs.length) return []
  const filter = `(${slugs.map((s) => `slug="${s}"`).join(' || ')}) && published=true`
  const rows = await pbGetFullList<Record<string, unknown>>(
    'blog_posts',
    { filter, fields: BLOG_LIST_FIELDS },
    { tags: [BLOG_TAG] },
  )
  return rows.map(rowToPost)
}

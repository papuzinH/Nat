import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { rowToPost } from '@/hooks/useBlogLogic'
import type { BlogPost } from '@/data/blog-posts'
import type { JSONContent } from '@tiptap/core'

export interface BlogPostDetail extends BlogPost {
  bodyJson: JSONContent | null
  isoDate: string
}

export const useBlogPostLogic = (slug: string | undefined, preview = false) => {
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setLoading(false); return }

    setPost(null)
    setRelated([])
    setLoading(true)

    // En preview, intentar cargar desde el localStorage que escribe AdminBlogEditor.
    if (preview) {
      try {
        const raw = localStorage.getItem('__blog_preview__')
        if (raw) {
          const draft = JSON.parse(raw) as Record<string, unknown>
          if (draft.slug === slug) {
            const base = rowToPost(draft)
            setPost({
              ...base,
              bodyJson: (draft.body as JSONContent) ?? null,
              isoDate:  draft.date as string,
            })
            setLoading(false)
            return
          }
        }
      } catch { /* continúa al fetch normal */ }
    }

    const filter = preview ? `slug = "${slug}"` : `slug = "${slug}" && published = true`
    pb.collection('blog_posts')
      .getFirstListItem(filter, { requestKey: null })
      .then(async (data) => {
        const base = rowToPost(data as Record<string, unknown>)
        setPost({
          ...base,
          bodyJson: (data.body as JSONContent) ?? null,
          isoDate:  data.date as string,
        })

        const relSlugs = (data.related as string[]) ?? []
        if (relSlugs.length > 0) {
          const relFilter = relSlugs.map((s) => `slug = "${s}"`).join(' || ')
          const relData = await pb.collection('blog_posts').getFullList({
            filter: `(${relFilter}) && published = true`,
            fields: 'slug,title,subtitle,category,date,reading_time,cover_image,related',
            requestKey: null,
          })
          setRelated(relData.map((r) => rowToPost(r as Record<string, unknown>)))
        }

        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [slug, preview])

  return { post, related, loading }
}

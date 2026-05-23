import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { rowToPost } from '@/hooks/useBlogLogic'
import type { BlogPost } from '@/data/blog-posts'
import type { JSONContent } from '@tiptap/core'

export interface BlogPostDetail extends BlogPost {
  bodyJson: JSONContent | null
  isoDate: string
}

export const useBlogPostLogic = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setLoading(false); return }

    setPost(null)
    setRelated([])
    setLoading(true)

    pb.collection('blog_posts')
      .getFirstListItem(`slug = "${slug}" && published = true`)
      .then(async (data) => {
        const base = rowToPost(data as Record<string, unknown>)
        setPost({
          ...base,
          bodyJson: (data.body as JSONContent) ?? null,
          isoDate:  data.date as string,
        })

        const relSlugs = (data.related as string[]) ?? []
        if (relSlugs.length > 0) {
          const filter = relSlugs.map((s) => `slug = "${s}"`).join(' || ')
          const relData = await pb.collection('blog_posts').getFullList({
            filter: `(${filter}) && published = true`,
            fields: 'slug,title,subtitle,category,date,reading_time,cover_image,related',
          })
          setRelated(relData.map((r) => rowToPost(r as Record<string, unknown>)))
        }

        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [slug])

  return { post, related, loading }
}

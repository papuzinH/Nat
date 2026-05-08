import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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

    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(async ({ data }) => {
        if (!data) { setLoading(false); return }

        const base = rowToPost(data as Record<string, unknown>)
        setPost({
          ...base,
          bodyJson: (data.body as JSONContent) ?? null,
          isoDate: data.date as string,
        })

        const relSlugs = (data.related as string[]) ?? []
        if (relSlugs.length > 0) {
          const { data: relData } = await supabase
            .from('blog_posts')
            .select('slug, title, subtitle, category, date, reading_time, cover_image, related')
            .in('slug', relSlugs)
            .eq('published', true)
          if (relData) setRelated(relData.map((r) => rowToPost(r as Record<string, unknown>)))
        }

        setLoading(false)
      })
  }, [slug])

  return { post, related, loading }
}

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BLOG_CATEGORIES, type BlogPost } from '@/data/blog-posts'

export { BLOG_CATEGORIES }
export type { BlogPost }

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(isoDate + 'T12:00:00')).replace('.', '')
}

export function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    slug: row.slug as string,
    title: row.title as string,
    subtitle: (row.subtitle as string) ?? '',
    category: row.category as string,
    date: formatDate(row.date as string),
    reading: row.reading_time as string,
    image: (row.cover_image as string) ?? undefined,
    body: [],
    related: (row.related as string[]) ?? [],
  }
}

export const useBlogLogic = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('slug, title, subtitle, category, date, reading_time, cover_image, related')
      .eq('published', true)
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (data) setAllPosts(data.map(rowToPost))
        setLoading(false)
      })
  }, [])

  const filtered =
    activeCategory === 'Todos'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory)

  const [featured = null, ...rest] = filtered

  return { featured, rest, allPosts, activeCategory, setActiveCategory, loading }
}

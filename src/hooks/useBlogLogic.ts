import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { BLOG_CATEGORIES, type BlogPost } from '@/data/blog-posts'
import { rowToPost } from '@/lib/data/blog-mappers'

export { BLOG_CATEGORIES }
export type { BlogPost }
// Re-exportado para compatibilidad: useBlogPostLogic importa rowToPost de aquí.
export { rowToPost }

export const useBlogLogic = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection('blog_posts')
      .getFullList({
        filter: 'published = true',
        sort:   '-date',
        fields: 'id,slug,title,subtitle,category,date,reading_time,cover_image,related',
        requestKey: null,
      })
      .then((data) => {
        setAllPosts(data.map((r) => rowToPost(r as Record<string, unknown>)))
        setLoading(false)
      })
      .catch((err) => {
        console.error('[useBlogLogic] error al traer blog_posts', err)
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

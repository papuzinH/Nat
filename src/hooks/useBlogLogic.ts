import { useState } from 'react'
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from '@/data/blog-posts'

export { BLOG_CATEGORIES }
export type { BlogPost }

export const useBlogLogic = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')

  const filtered =
    activeCategory === 'Todos'
      ? BLOG_POSTS
      : BLOG_POSTS.filter(p => p.category === activeCategory)

  const [featured = null, ...rest] = filtered

  return { featured, rest, activeCategory, setActiveCategory }
}

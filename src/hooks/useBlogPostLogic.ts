import { useMemo } from 'react'
import { BLOG_POSTS, type BlogPost } from '@/data/blog-posts'

export const useBlogPostLogic = (slug: string | undefined) => {
  const post = useMemo(
    () => (slug ? BLOG_POSTS.find(p => p.slug === slug) ?? null : null),
    [slug]
  )

  const related = useMemo<BlogPost[]>(
    () =>
      (post?.related ?? [])
        .map(s => BLOG_POSTS.find(p => p.slug === s))
        .filter((p): p is BlogPost => Boolean(p)),
    [post]
  )

  return { post, related }
}

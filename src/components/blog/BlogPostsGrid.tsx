import React from 'react'
import type { BlogPost } from '@/data/blog-posts'
import { NHDivider } from '@/components/shared'
import BlogCard from './BlogCard'

interface BlogPostsGridProps {
  posts: BlogPost[]
  containerRef?: React.RefObject<HTMLDivElement | null>
}

const BlogPostsGrid: React.FC<BlogPostsGridProps> = ({ posts, containerRef }) => {
  if (posts.length === 0) return null

  return (
    <>
      <NHDivider label="mas notas" className="my-8 md:my-[52px]" />
      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 mb-20 max-w-7xl mx-auto"
      >
        {posts.map((post) => (
          <div key={post.slug} className="blog-card-item">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </>
  )
}

export default BlogPostsGrid

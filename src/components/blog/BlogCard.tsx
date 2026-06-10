import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/data/blog-posts'
import BlogPlaceholder from './BlogPlaceholder'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block text-inherit no-underline"
    aria-label={`Leer: ${post.title}`}
  >
    <div
      className="overflow-hidden rounded-card"
      style={{ boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)' }}
    >
      <div className="overflow-hidden transition-transform duration-500 group-hover:scale-105">
        {post.image ? (
          <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <BlogPlaceholder aspect="3/2" />
        )}
      </div>
    </div>

    <div className="pt-4 pb-1 px-0.5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-700">
          {post.category}
        </span>
        <span className="font-mono text-[10px] text-ink-soft tracking-[0.1em]">
          {post.reading}
        </span>
      </div>

      <h3 className="font-display font-normal text-[22px] leading-[1.15] tracking-[-0.01em] text-ink mb-2 group-hover:text-sage-700 transition-colors duration-200">
        {post.title}
      </h3>

      <p className="text-[13px] text-ink-soft leading-[1.6]">{post.subtitle}</p>

      <div className="font-mono text-[10px] text-taupe-700 mt-2.5 tracking-[0.1em] uppercase">
        {post.date}
      </div>
    </div>
  </Link>
)

export default BlogCard

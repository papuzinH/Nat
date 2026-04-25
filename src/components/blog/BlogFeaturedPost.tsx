import React from 'react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '@/data/blog-posts'

interface BlogFeaturedPostProps {
  post: BlogPost
  containerRef?: React.RefObject<HTMLDivElement | null>
}

const BlogFeaturedPost: React.FC<BlogFeaturedPostProps> = ({ post, containerRef }) => {
  const featuredImage = post.image ?? '/imgPrueba.webp'

  return (
    <section ref={containerRef} className="mt-8 md:mt-10 mb-10 md:mb-14 max-w-7xl mx-auto ">
      <Link to={`/blog/${post.slug}`} className="group block no-underline text-inherit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-stretch">
          <div className="overflow-hidden rounded-card h-[240px] md:h-auto md:min-h-0 md:self-stretch">
            <div className="relative overflow-hidden h-full md:min-h-0">
              <img
                src={featuredImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="py-4 md:py-12">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="px-2.5 py-1 rounded-pill border border-sage-700 text-sage-700 font-mono text-[11px] tracking-[0.08em] pointer-events-none">
                {post.category}
              </span>
              <span className="font-mono text-[10px] text-ink-soft tracking-[0.12em]">
                {post.date} · {post.reading} lectura
              </span>
            </div>

            <h2 className="font-display font-normal text-[28px] md:text-[48px] leading-[1.08] tracking-[-0.02em] text-ink m-0 mb-4">
              {post.title}
            </h2>

            <p className="text-[15px] md:text-[17px] text-ink-soft leading-[1.65] max-w-[480px]">
              {post.subtitle}
            </p>

            <div className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 border-b border-sage-700 pb-0.5">
              Leer nota →
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}

export default BlogFeaturedPost

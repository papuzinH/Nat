import React from 'react'
import BlogPlaceholder from './BlogPlaceholder'
import { NHDivider } from '@/components/shared'

const BlogSkeleton: React.FC = () => (
  <>
    <section className="mt-8 md:mt-10 mb-10 md:mb-14 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-stretch">

        <div className="animate-pulse rounded-card overflow-hidden bg-cream-200 h-[240px] md:h-full min-h-[320px]" />

        <div className="py-4 md:py-12 flex flex-col gap-4 animate-pulse">
          <div className="h-5 w-32 bg-cream-200 rounded" />
          <div className="space-y-3">
            <div className="h-8 w-full bg-cream-200 rounded" />
            <div className="h-8 w-4/5 bg-cream-200 rounded" />
            <div className="h-8 w-3/5 bg-cream-200 rounded" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-4 w-full bg-cream-200 rounded" />
            <div className="h-4 w-3/4 bg-cream-200 rounded" />
          </div>
          <div className="h-4 w-28 bg-cream-200 rounded mt-3" />
        </div>
      </div>
    </section>

    <NHDivider label="mas notas" className="my-8 md:my-[52px]" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 mb-20 max-w-7xl mx-auto">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse">
          <BlogPlaceholder aspect="4/5" className="rounded-card" />
          <div className="pt-4 pb-1 px-0.5 space-y-2.5">
            <div className="h-3 w-24 bg-cream-200 rounded" />
            <div className="h-5 w-full bg-cream-200 rounded" />
            <div className="h-5 w-3/4 bg-cream-200 rounded" />
            <div className="h-3 w-16 bg-cream-200 rounded mt-1" />
          </div>
        </div>
      ))}
    </div>
  </>
)

export default BlogSkeleton

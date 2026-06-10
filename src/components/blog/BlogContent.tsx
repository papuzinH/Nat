'use client'

import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import type { BlogPost } from '@/data/blog-posts'
import { BLOG_CATEGORIES } from '@/data/blog-posts'
import BlogFeaturedPost from './BlogFeaturedPost'
import BlogHeroSection from './BlogHeroSection'
import BlogPostsGrid from './BlogPostsGrid'
import BlogEmptyState from './BlogEmptyState'
import FilterBar from '@/components/tienda/FilterBar'
import { gsap, shouldAnimate } from '@/lib/gsap'

// Client island del listado de blog: recibe los posts (ISR) del server y maneja
// el filtrado por categoría + animaciones. El HTML inicial trae los posts →
// indexable para SEO.
interface BlogContentProps {
  posts: BlogPost[]
}

const slugifyCategory = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')

const BlogContent: React.FC<BlogContentProps> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const headerRef = useRef<HTMLElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filterCategories = useMemo(
    () => BLOG_CATEGORIES.map((label) => ({ slug: slugifyCategory(label), label })),
    []
  )
  const activeCategorySlug = useMemo(() => slugifyCategory(activeCategory), [activeCategory])

  const handleSelectCategory = useCallback(
    (slug: string) => {
      const selected = filterCategories.find((c) => c.slug === slug)
      if (selected) setActiveCategory(selected.label)
    },
    [filterCategories]
  )

  const countForCategory = useCallback(
    (slug: string) => {
      if (slug === 'todos') return posts.length
      return posts.filter((p) => slugifyCategory(p.category) === slug).length
    },
    [posts]
  )

  const filtered = useMemo(
    () => (activeCategory === 'Todos' ? posts : posts.filter((p) => p.category === activeCategory)),
    [activeCategory, posts]
  )
  const featured = filtered[0] ?? null
  const rest = filtered.slice(1)

  useEffect(() => {
    if (!shouldAnimate() || !featuredRef.current || !featured) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: featuredRef.current, start: 'top 82%' },
        }
      )
    })
    return () => ctx.revert()
  }, [featured])

  useEffect(() => {
    if (!shouldAnimate() || !gridRef.current || rest.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-card-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 86%' },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [activeCategory, rest.length])

  return (
    <>
      <BlogHeroSection sectionRef={headerRef} />

      <FilterBar
        categories={filterCategories}
        active={activeCategorySlug}
        onSelect={handleSelectCategory}
        countForCategory={countForCategory}
      />

      {posts.length === 0 && <BlogEmptyState variant="global" />}

      {posts.length > 0 && !featured && rest.length === 0 && (
        <BlogEmptyState variant="filtered" onReset={() => setActiveCategory('Todos')} />
      )}

      {featured && <BlogFeaturedPost post={featured} containerRef={featuredRef} />}
      {rest.length > 0 && <BlogPostsGrid posts={rest} containerRef={gridRef} />}
    </>
  )
}

export default BlogContent

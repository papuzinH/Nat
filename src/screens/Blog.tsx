import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { SchemaMarkup } from '@/components/shared'
import BlogFeaturedPost from '@/components/blog/BlogFeaturedPost'
import BlogHeroSection from '@/components/blog/BlogHeroSection'
import BlogPostsGrid from '@/components/blog/BlogPostsGrid'
import BlogSkeleton from '@/components/blog/BlogSkeleton'
import BlogEmptyState from '@/components/blog/BlogEmptyState'
import { useBlogLogic, BLOG_CATEGORIES } from '@/hooks/useBlogLogic'
import FilterBar from '@/components/tienda/FilterBar'
import { gsap, shouldAnimate } from '@/lib/gsap'

const Blog: React.FC = () => {
  const { featured, rest, allPosts, activeCategory, setActiveCategory, loading } = useBlogLogic()
  const headerRef = useRef<HTMLElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const slugifyCategory = useCallback(
    (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-'),
    []
  )

  const filterCategories = useMemo(
    () => BLOG_CATEGORIES.map((label) => ({ slug: slugifyCategory(label), label })),
    [slugifyCategory]
  )

  const activeCategorySlug = useMemo(
    () => slugifyCategory(activeCategory),
    [activeCategory, slugifyCategory]
  )

  const handleSelectCategory = useCallback(
    (slug: string) => {
      const selected = filterCategories.find((category) => category.slug === slug)
      if (selected) {
        setActiveCategory(selected.label)
      }
    },
    [filterCategories, setActiveCategory]
  )

  const countForCategory = useCallback(
    (slug: string) => {
      if (slug === 'todos') return allPosts.length
      return allPosts.filter((post) => slugifyCategory(post.category) === slug).length
    },
    [allPosts, slugifyCategory]
  )

  // Featured post scroll entrance
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

  // Cards stagger — re-trigger on category change
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

  const collectionSchema = {
    name: 'Conocé mi lado más íntimo — Natalia Heller',
    description: 'Notas sobre proceso, plantas y oficio. Escritas una vez al mes desde el taller.',
    url: 'https://tatuajesnaty.com/blog',
  }

  return (
    <>
      <SchemaMarkup type="CollectionPage" data={collectionSchema} />

      <BlogHeroSection sectionRef={headerRef} />

      <FilterBar
        categories={filterCategories}
        active={activeCategorySlug}
        onSelect={handleSelectCategory}
        countForCategory={countForCategory}
      />

      {loading && <BlogSkeleton />}

      {!loading && allPosts.length === 0 && (
        <BlogEmptyState variant="global" />
      )}

      {!loading && allPosts.length > 0 && !featured && rest.length === 0 && (
        <BlogEmptyState variant="filtered" onReset={() => setActiveCategory('Todos')} />
      )}

      {!loading && featured && (
        <BlogFeaturedPost post={featured} containerRef={featuredRef} />
      )}
      {!loading && rest.length > 0 && (
        <BlogPostsGrid posts={rest} containerRef={gridRef} />
      )}

    </>
  )
}

export default Blog

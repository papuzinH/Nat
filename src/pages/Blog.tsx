import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout, NHLeafMark, NHDivider, SchemaMarkup } from '@/components/shared'
import BlogCard from '@/components/blog/BlogCard'
import BlogPlaceholder from '@/components/blog/BlogPlaceholder'
import { useBlogLogic, BLOG_CATEGORIES } from '@/hooks/useBlogLogic'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'

const Blog: React.FC = () => {
  const { featured, rest, activeCategory, setActiveCategory } = useBlogLogic()
  const headerRef = useRef<HTMLElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Header entrance animation
  useEffect(() => {
    if (!shouldAnimate() || !headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.blog-eyebrow', '.blog-h1', '.blog-subtitle'],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out', delay: 0.1 }
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

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
    name: 'Diario del estudio — Natalia Heller',
    description: 'Notas sobre proceso, plantas y oficio. Escritas una vez al mes desde el taller.',
    url: 'https://tatuajesnaty.com/blog',
  }

  return (
    <Layout>
      <SchemaMarkup type="CollectionPage" data={collectionSchema} />

      {/* ── Header ── */}
      <header ref={headerRef} className="relative px-[22px] md:px-12 pt-7 md:pt-[60px] pb-8 md:pb-12">
        <div
          className="absolute top-5 md:top-11 right-[22px] md:right-12 text-sage-500 pointer-events-none"
          aria-hidden="true"
        >
          <NHLeafMark size={40} className="md:hidden" />
          <NHLeafMark size={56} className="hidden md:block" />
        </div>

        <p className="blog-eyebrow font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3.5">
          Diario del estudio
        </p>
        <h1 className="blog-h1 font-display font-normal text-[38px] md:text-[72px] leading-[1.02] tracking-[-0.02em] text-ink max-w-[800px] m-0">
          Notas sobre proceso, plantas y oficio.
        </h1>
        <p className="blog-subtitle text-[15px] md:text-[17px] text-ink-soft mt-4 max-w-[540px] leading-[1.65]">
          Una vez al mes escribo sobre lo que estoy aprendiendo. Sin agenda,
          sin newsletter de lunes. Sólo notas del taller.
        </p>
      </header>

      {/* ── Filter bar ── */}
      <div
        className="sticky z-10 bg-cream-100/95 backdrop-blur-md border-b border-cream-300 px-[22px] md:px-12 py-2.5"
        style={{ top: '57px' }}
      >
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                'flex-shrink-0 px-3 py-1.5 rounded-pill border font-mono text-[12px] tracking-[0.08em] transition-colors duration-200 cursor-pointer',
                activeCategory === cat
                  ? 'bg-sage-700 border-sage-700 text-cream-50'
                  : 'bg-transparent border-sage-400 text-sage-700 hover:border-sage-700',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <section className="px-[22px] md:px-12">
        {/* Empty state */}
        {!featured && (
          <div className="py-20 text-center">
            <p className="font-display italic text-[22px] text-ink-soft">Nada por acá todavía</p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <div ref={featuredRef} className="mt-8 md:mt-14 mb-10 md:mb-[72px]">
            <Link to={`/blog/${featured.slug}`} className="group block no-underline text-inherit">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 items-center">
                {/* Image */}
                <div className="overflow-hidden rounded-card">
                  <div className="overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    <BlogPlaceholder
                      aspect="4/5"
                      label={`${featured.category} · ${featured.date}`}
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="px-2.5 py-1 rounded-pill border border-sage-700 text-sage-700 font-mono text-[11px] tracking-[0.08em] pointer-events-none">
                      {featured.category}
                    </span>
                    <span className="font-mono text-[10px] text-ink-soft tracking-[0.12em]">
                      {featured.date} · {featured.reading} lectura
                    </span>
                  </div>

                  <h2 className="font-display font-normal text-[28px] md:text-[48px] leading-[1.08] tracking-[-0.02em] text-ink m-0 mb-4">
                    {featured.title}
                  </h2>

                  <p className="text-[15px] md:text-[17px] text-ink-soft leading-[1.65] max-w-[480px]">
                    {featured.subtitle}
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 border-b border-sage-700 pb-0.5">
                    Leer nota →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* More posts */}
        {rest.length > 0 && (
          <>
            <NHDivider label="más notas" className="my-8 md:my-[52px]" />
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 mb-20"
            >
              {rest.map(post => (
                <div key={post.slug} className="blog-card-item">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}

export default Blog

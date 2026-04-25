import React, { useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout, NHLeafMark, NHDivider, SchemaMarkup, NHFlower } from '@/components/shared'
import BlogCard from '@/components/blog/BlogCard'
import BlogPlaceholder from '@/components/blog/BlogPlaceholder'
import { useBlogPostLogic } from '@/hooks/useBlogPostLogic'
import { type BodyBlock } from '@/data/blog-posts'
import { gsap, shouldAnimate } from '@/lib/gsap'

// ── Renderiza los bloques estructurados del body ──
const BodyRenderer: React.FC<{ blocks: BodyBlock[] }> = ({ blocks }) => (
  <>
    {blocks.map((block, i) => {
      if (block.t === 'p')
        return (
          <p key={i} className="body-block text-[16px] md:text-[18px] leading-[1.75] text-ink mb-[22px]">
            {block.c}
          </p>
        )
      if (block.t === 'h2')
        return (
          <h2
            key={i}
            className="body-block font-display font-normal text-[24px] md:text-[32px] leading-[1.15] tracking-[-0.01em] text-ink mt-12 mb-[18px]"
          >
            {block.c}
          </h2>
        )
      if (block.t === 'ul')
        return (
          <ul key={i} className="body-block list-none m-0 p-0 mb-6">
            {block.c.map((item, j) => (
              <li
                key={j}
                className="flex gap-3.5 py-2.5 border-b border-cream-200 text-[15px] md:text-[17px] leading-[1.6] text-ink"
              >
                <span className="text-sage-500 flex-shrink-0 mt-1" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="5" cy="5" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        )
      return null
    })}
  </>
)

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { post, related } = useBlogPostLogic(slug)
  const heroRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement>(null)

  // Hero entrance
  useEffect(() => {
    if (!shouldAnimate() || !heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.post-meta', '.post-h1', '.post-lead'],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', delay: 0.05 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [slug])

  // Body blocks stagger on scroll
  useEffect(() => {
    if (!shouldAnimate() || !bodyRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.body-block',
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power1.out',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 80%' },
        }
      )
    }, bodyRef)
    return () => ctx.revert()
  }, [slug])

  // 404
  if (!post) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-[22px] md:px-12">
          <div className="text-center max-w-md">
            <p className="font-display font-normal text-[68px] leading-[1] tracking-[-0.02em] text-sage-200 mb-4">
              404
            </p>
            <h1 className="font-display font-normal text-[28px] text-ink mb-4">
              Nota no encontrada
            </h1>
            <p className="text-[15px] text-ink-soft mb-8">
              La nota que buscás no existe o fue movida.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 border-b border-sage-700 pb-0.5 no-underline"
            >
              ← volver al diario
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const articleSchema = {
    headline: post.title,
    description: post.subtitle,
    datePublished: post.date,
    dateModified: post.date,
    author: [{ '@type': 'Person', name: 'Natalia Heller', url: 'https://tatuajesnaty.com/sobre-mi' }],
    publisher: {
      '@type': 'Organization',
      name: 'Natalia Heller Tattoo Studio',
      logo: { '@type': 'ImageObject', url: 'https://tatuajesnaty.com/logo.png' },
    },
  }

  return (
    <Layout>
      <SchemaMarkup type="Article" data={articleSchema} />

      {/* ── Breadcrumb ── */}
      <nav
        className="px-[22px] md:px-12 pt-[18px] font-mono text-[11px] text-ink-soft tracking-[0.08em]"
        aria-label="Migas de pan"
      >
        <Link to="/blog" className="text-inherit no-underline hover:text-sage-700 transition-colors">
          diario
        </Link>
        {' / '}
        <span className="text-sage-700">{post.slug}</span>
      </nav>

      {/* ── Hero ── */}
      <div ref={heroRef} className="px-[22px] md:px-12 pt-[22px] md:pt-9">
        <div className="max-w-[760px]">
          <div className="post-meta flex items-center gap-2.5 mb-5">
            <span className="px-2.5 py-1 rounded-pill border border-sage-700 text-sage-700 font-mono text-[11px] tracking-[0.08em] pointer-events-none">
              {post.category}
            </span>
            <time
              dateTime={post.date}
              className="font-mono text-[10px] text-ink-soft tracking-[0.12em]"
            >
              {post.date} · {post.reading} lectura
            </time>
          </div>

          <h1 className="post-h1 font-display font-normal text-[36px] md:text-[68px] leading-[1.04] tracking-[-0.02em] text-ink m-0">
            {post.title}
          </h1>

          <p className="post-lead font-display italic text-[18px] md:text-[22px] text-ink-soft mt-[18px] leading-[1.5] max-w-[600px]">
            {post.subtitle}
          </p>
        </div>
      </div>

      {/* ── Cover image ── */}
      <div className="px-[22px] md:px-12 mt-6 max-w-[860px]">
        <BlogPlaceholder
          aspect="16/9"
          label={`Imagen · ${post.title}`}
          className="rounded-card"
          style={{ boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }}
        />
      </div>

      {/* ── Article body ── */}
      <article
        ref={bodyRef}
        className="px-[22px] md:px-12 pt-11 md:pt-16 pb-5 max-w-[720px]"
      >
        {/* Author strip */}
        <div className="flex items-center gap-3.5 py-[18px] border-b border-cream-300 mb-10">
          <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center flex-shrink-0">
            <NHLeafMark size={22} color="#fdfcfb" />
          </div>
          <div>
            <div className="font-display text-[15px] font-medium text-ink leading-tight">
              Natalia Heller
            </div>
            <div className="font-mono text-[10px] text-ink-soft tracking-[0.1em] uppercase mt-0.5">
              Villa Crespo · {post.date}
            </div>
          </div>
        </div>

        {/* Body blocks */}
        <BodyRenderer blocks={post.body} />

        {/* Signature */}
        <div className="mt-14 pt-8 border-t border-cream-300 flex items-center gap-3.5">
          <span className="text-sage-500" aria-hidden="true">
            <NHFlower size={32} />
          </span>
          <p className="font-display italic text-[14px] text-ink-soft m-0">
            Natalia Heller — escrito desde el estudio, Villa Crespo.
          </p>
        </div>
      </article>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="px-[22px] md:px-12 pt-[60px] md:pt-[100px] pb-10 md:pb-[60px]">
          <NHDivider label="seguir leyendo" className="mb-9" />
          <div
            className={`grid gap-6 md:gap-9 mt-9 ${
              related.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {related.map(p => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}

export default BlogPost

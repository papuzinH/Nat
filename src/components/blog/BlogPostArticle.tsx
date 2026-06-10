'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pen } from 'lucide-react'
import NHDivider from '@/components/shared/NHDivider'
import BlogCard from '@/components/blog/BlogCard'
import BlogPlaceholder from '@/components/blog/BlogPlaceholder'
import type { BlogPost } from '@/data/blog-posts'
import { gsap, shouldAnimate } from '@/lib/gsap'

interface BlogPostArticleProps {
  post: BlogPost & { isoDate: string }
  /** HTML del cuerpo, renderizado desde TipTap (server o cliente). */
  bodyHtml: string
  related: BlogPost[]
  /** Muestra el badge de vista previa (modo admin). */
  preview?: boolean
}

const BlogPostArticle: React.FC<BlogPostArticleProps> = ({ post, bodyHtml, related, preview = false }) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

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
  }, [post.slug])

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
  }, [post.slug])

  useEffect(() => {
    if (!shouldAnimate() || !bodyRef.current || !progressRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 80%', end: 'bottom bottom', scrub: 0.3 },
        }
      )
    })
    return () => ctx.revert()
  }, [post.slug])

  return (
    <>
      {preview && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-4 py-2 rounded-pill shadow-lg pointer-events-none"
          style={{ background: 'var(--sage-700, #4a7c59)', color: '#fff', whiteSpace: 'nowrap' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Vista previa</span>
        </div>
      )}

      {/* Scroll progress bar */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 70, pointerEvents: 'none', background: 'transparent' }}
      >
        <div
          ref={progressRef}
          style={{ height: '100%', background: 'var(--sage-700, #4a7c59)', transformOrigin: 'left center', transform: 'scaleX(0)' }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="px-[22px] md:px-12 pt-[18px] font-mono text-[11px] text-ink-soft tracking-[0.08em]" aria-label="Migas de pan">
        <Link href="/blog" className="text-inherit no-underline hover:text-sage-700 transition-colors">
          diario
        </Link>
        {' / '}
        <span className="text-sage-700">{post.slug}</span>
      </nav>

      {/* Hero */}
      <div ref={heroRef} className="px-[22px] md:px-12 pt-[22px] md:pt-9">
        <div className="max-w-[760px]">
          <div className="post-meta flex items-center gap-2.5 mb-5">
            <span className="px-2.5 py-1 rounded-pill border border-sage-700 text-sage-700 font-mono text-[11px] tracking-[0.08em] pointer-events-none">
              {post.category}
            </span>
            <time dateTime={post.isoDate} className="font-mono text-[10px] text-ink-soft tracking-[0.12em]">
              {post.date} · {post.reading} lectura
            </time>
          </div>

          <h1 className="post-h1 font-display font-normal text-[36px] md:text-[68px] leading-[1.04] tracking-[-0.02em] text-ink m-0">
            {post.title}
          </h1>

          <p className="post-lead font-body text-[18px] md:text-[22px] text-ink-soft mt-[18px] leading-[1.5] max-w-[600px]">
            {post.subtitle}
          </p>
        </div>
      </div>

      {/* Cover image */}
      <div className="px-[22px] md:px-12 mt-6 max-w-[860px]">
        {post.image ? (
          <div
            className="relative w-full rounded-card overflow-hidden"
            style={{ aspectRatio: '16/9', boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 860px"
              className="object-cover"
            />
          </div>
        ) : (
          <BlogPlaceholder
            aspect="16/9"
            label={`Imagen · ${post.title}`}
            className="rounded-card"
            style={{ boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }}
          />
        )}
      </div>

      {/* Article body */}
      <article ref={bodyRef} className="px-[22px] md:px-12 pt-11 md:pt-16 pb-5 max-w-[720px]">
        <div className="flex items-center gap-3.5 py-[18px] border-b border-cream-300 mb-10">
          <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center flex-shrink-0">
            <Pen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-[15px] font-medium text-ink leading-tight">Natalia Heller</div>
            <div className="font-mono text-[10px] text-ink-soft tracking-[0.1em] uppercase mt-0.5">
              Desde el estudio · <time dateTime={post.isoDate}>{post.date}</time>
            </div>
          </div>
        </div>

        {bodyHtml && (
          <div className="tiptap-content body-block" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        )}
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="px-[22px] md:px-12 pt-[60px] md:pt-[100px] pb-10 md:pb-[60px]">
          <NHDivider label="seguir leyendo" className="mb-9" />
          <div className={`grid gap-6 md:gap-9 mt-9 ${related.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-1 md:grid-cols-2'}`}>
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default BlogPostArticle

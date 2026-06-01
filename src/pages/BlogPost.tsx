import React, { useRef, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { NHLeafMark, NHDivider, SchemaMarkup, NHFlower } from '@/components/shared'
import BlogCard from '@/components/blog/BlogCard'
import BlogPlaceholder from '@/components/blog/BlogPlaceholder'
import { useBlogPostLogic } from '@/hooks/useBlogPostLogic'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import type { JSONContent } from '@tiptap/core'

// ── Renderiza contenido TipTap como HTML ──
const RENDERER_EXTENSIONS = [
  StarterKit,
  LinkExt,
  ImageExt,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
  Highlight,
  Typography,
]

const TipTapRenderer: React.FC<{ content: JSONContent }> = ({ content }) => {
  const html = useMemo(() => {
    try {
      return generateHTML(content, RENDERER_EXTENSIONS)
    } catch {
      return ''
    }
  }, [content])

  return (
    <div
      className="tiptap-content body-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'
  const { post, related, loading } = useBlogPostLogic(slug, isPreview)
  const heroRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

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

  // Scroll progress bar (escaneando el cuerpo del artículo)
  useEffect(() => {
    if (!shouldAnimate() || !bodyRef.current || !progressRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [slug])

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-mono text-[12px] text-ink-soft uppercase tracking-[0.14em]">Cargando…</p>
      </div>
    )
  }

  // 404
  if (!post) {
    return (
      <>
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
      </>
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
    <>
      <SchemaMarkup type="Article" data={articleSchema} />

      {/* Scroll progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 70,
          pointerEvents: 'none',
          background: 'transparent',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: 'var(--sage-700, #4a7c59)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>


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
              dateTime={post.isoDate}
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
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-card object-cover"
            style={{ aspectRatio: '16/9', boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }}
          />
        ) : (
          <BlogPlaceholder
            aspect="16/9"
            label={`Imagen · ${post.title}`}
            className="rounded-card"
            style={{ boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }}
          />
        )}
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
              Villa Crespo · <time dateTime={post.isoDate}>{post.date}</time>
            </div>
          </div>
        </div>

        {/* Body */}
        {post.bodyJson && <TipTapRenderer content={post.bodyJson} />}

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
    </>
  )
}

export default BlogPost

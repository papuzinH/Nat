'use client'

import React, { useEffect, useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { BlogPost } from '@/data/blog-posts'
import { rowToPost } from '@/lib/data/blog-mappers'
import { renderTiptapHtml } from '@/lib/tiptap'
import BlogPostArticle from './BlogPostArticle'

// Modo vista previa del admin: lee el borrador desde localStorage
// ('__blog_preview__', escrito por AdminBlogEditor) y lo renderiza sin pasar por
// PocketBase. Es client-only (la page server delega aquí cuando ?preview=true).
const BlogPostPreview: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, setData] = useState<
    { post: BlogPost & { isoDate: string }; bodyHtml: string; related: BlogPost[] } | null
  >(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('__blog_preview__')
      if (raw) {
        const draft = JSON.parse(raw) as Record<string, unknown>
        if (draft.slug === slug) {
          const base = rowToPost(draft)
          setData({
            post: { ...base, isoDate: (draft.date as string) ?? '' },
            bodyHtml: renderTiptapHtml((draft.body as JSONContent) ?? null),
            related: [],
          })
        }
      }
    } catch {
      /* sin preview disponible */
    }
    setReady(true)
  }, [slug])

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-mono text-[12px] text-ink-soft uppercase tracking-[0.14em]">Cargando…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 text-center">
        <p className="font-body text-[15px] text-ink-soft">
          No hay vista previa disponible para este borrador.
        </p>
      </div>
    )
  }

  return <BlogPostArticle post={data.post} bodyHtml={data.bodyHtml} related={data.related} preview />
}

export default BlogPostPreview

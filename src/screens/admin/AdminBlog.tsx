'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'
import { triggerRevalidate } from '@/lib/revalidate-client'
import { useToast } from '@/context/ToastContext'
import { useTableFilter } from '@/hooks/useTableFilter'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import ConfirmDeleteInline from '@/components/admin/shared/ConfirmDeleteInline'

interface PostListItem {
  id: string
  slug: string
  title: string
  category: string
  date: string
  published: boolean
  toggling: boolean
  [key: string]: unknown
}

const BLOG_CATEGORIES = ['Estudio', 'Botánica', 'Cerámica', 'Dibujo', 'Textiles']

function formatDate(raw: string): string {
  if (!raw) return ''
  const d = new Date(raw.slice(0, 10) + 'T12:00:00')
  if (isNaN(d.getTime())) return raw
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(d).replace('.', '')
}

const AdminBlog: React.FC = () => {
  const router = useRouter()
  const toast = useToast()
  const [rows, setRows] = useState<PostListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection('blog_posts')
      .getFullList({ sort: '-date', fields: 'id,slug,title,category,date,published', requestKey: null })
      .then((data) => {
        setRows(
          data.map((d) => ({
            id:        d.id,
            slug:      d.slug as string,
            title:     d.title as string,
            category:  d.category as string,
            date:      d.date as string,
            published: d.published as boolean,
            toggling:  false,
          }))
        )
        setLoading(false)
      })
      .catch((e) => {
        toast.error('No se pudieron cargar los posts', { detail: e instanceof Error ? e.message : undefined })
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { filtered, query, setQuery, filters, setFilter } = useTableFilter<PostListItem>(rows, {
    searchFields: ['title', 'slug'],
    customFilter: (row, f) => {
      if (f.category && row.category !== f.category) return false
      if (f.publish === 'draft' && row.published) return false
      if (f.publish === 'published' && !row.published) return false
      return true
    },
  })

  const counts = useMemo(() => ({
    total:     rows.length,
    drafts:    rows.filter((r) => !r.published).length,
    published: rows.filter((r) =>  r.published).length,
  }), [rows])

  const togglePublished = async (id: string, current: boolean) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, toggling: true } : r))
    try {
      await pb.collection('blog_posts').update(id, { published: !current })
      setRows((prev) =>
        prev.map((r) => r.id === id ? { ...r, published: !current, toggling: false } : r)
      )
      toast.success(!current ? 'Post publicado' : 'Post movido a borrador')
      triggerRevalidate('blog_posts')
    } catch (e) {
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, toggling: false } : r))
      toast.error('No se pudo cambiar el estado', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  const deletePost = async (id: string) => {
    try {
      await pb.collection('blog_posts').delete(id)
      setRows((prev) => prev.filter((r) => r.id !== id))
      toast.success('Post eliminado')
      triggerRevalidate('blog_posts')
    } catch (e) {
      toast.error('No se pudo eliminar', { detail: e instanceof Error ? e.message : undefined })
    }
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando posts…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-[22px] text-ink font-normal">Blog</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
            {filtered.length} de {counts.total} · {counts.drafts} borrador{counts.drafts === 1 ? '' : 'es'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/blog/nuevo')}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
          style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
        >
          + Nuevo post
        </button>
      </div>

      {/* Toolbar */}
      {rows.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5 p-3 rounded-sm" style={{ background: 'var(--cream-100, #faf6f0)', border: '1px solid var(--line-soft)' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar título o slug…"
            className="flex-1 min-w-0 font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-3 py-1.5 outline-none focus:border-sage-700 transition-colors"
            style={{ borderColor: 'var(--line)' }}
            aria-label="Buscar post"
          />
          <select
            value={filters.category ?? 'all'}
            onChange={(e) => setFilter('category', e.target.value)}
            className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
            style={{ borderColor: 'var(--line)' }}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filters.publish ?? 'all'}
            onChange={(e) => setFilter('publish', e.target.value)}
            className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
            style={{ borderColor: 'var(--line)' }}
            aria-label="Filtrar por estado de publicación"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Solo borradores</option>
            <option value="published">Solo publicados</option>
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-sm" style={{ border: '1px solid var(--line-soft)' }}>
          <p className="font-body text-[14px] text-ink-soft mb-2">
            {rows.length === 0 ? 'No hay posts todavía.' : 'Ningún post coincide con los filtros.'}
          </p>
          {rows.length === 0 && (
            <p className="font-mono text-[11px] text-ink-soft">Hacé clic en "+ Nuevo post" para escribir el primero.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header desktop */}
          <div
            className="hidden md:grid grid-cols-[1fr_2fr_120px_110px_100px_auto] gap-4 px-4 py-2"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            {['Slug', 'Título', 'Categoría', 'Fecha', 'Estado', ''].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
            ))}
          </div>

          {filtered.map((row) => (
            <div key={row.id} className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
              {/* Desktop */}
              <div className="hidden md:grid grid-cols-[1fr_2fr_120px_110px_100px_auto] gap-4 px-4 py-3.5 items-center bg-cream-50">
                <span className="font-mono text-[11px] text-ink-soft truncate">{row.slug || '—'}</span>
                <span className="font-body text-[14px] text-ink truncate">
                  {row.title || <span className="italic text-ink-soft">sin título</span>}
                </span>
                <span className="font-mono text-[11px] text-ink-soft">{row.category}</span>
                <span className="font-mono text-[11px] text-ink-soft">{formatDate(row.date)}</span>
                <StatusBadge tone={row.published ? 'published' : 'draft'}>
                  {row.published ? 'Publicado' : 'Borrador'}
                </StatusBadge>
                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/blog/${row.id}`)}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={row.toggling}
                    onClick={() => togglePublished(row.id, row.published)}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] transition-colors disabled:opacity-40"
                    style={{ color: row.published ? 'var(--ink-soft)' : 'var(--sage-700)' }}
                  >
                    {row.toggling ? '…' : row.published ? 'Despublicar' : 'Publicar'}
                  </button>
                  <ConfirmDeleteInline onConfirm={() => deletePost(row.id)} />
                </div>
              </div>

              {/* Mobile card */}
              <div className="md:hidden px-4 py-3.5 flex flex-col gap-2 bg-cream-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[14px] text-ink leading-snug">
                      {row.title || <span className="italic text-ink-soft">sin título</span>}
                    </p>
                    <p className="font-mono text-[10px] text-ink-soft truncate">{row.slug || '—'}</p>
                  </div>
                  <StatusBadge tone={row.published ? 'published' : 'draft'}>
                    {row.published ? 'Publicado' : 'Borrador'}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-mono text-[10px] text-ink-soft">
                    {row.category} · {formatDate(row.date)}
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/blog/${row.id}`)}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={row.toggling}
                      onClick={() => togglePublished(row.id, row.published)}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] disabled:opacity-40"
                      style={{ color: row.published ? 'var(--ink-soft)' : 'var(--sage-700)' }}
                    >
                      {row.toggling ? '…' : row.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <ConfirmDeleteInline onConfirm={() => deletePost(row.id)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBlog

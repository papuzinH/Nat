import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PostListItem {
  id: string
  slug: string
  title: string
  category: string
  date: string
  published: boolean
  toggling: boolean
  confirmDelete: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(iso + 'T12:00:00')).replace('.', '')
}

// ─── Componente ───────────────────────────────────────────────────────────────

const AdminBlog: React.FC = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState<PostListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, slug, title, category, date, published, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setRows(
            data.map((d) => ({
              id: d.id as string,
              slug: d.slug as string,
              title: d.title as string,
              category: d.category as string,
              date: d.date as string,
              published: d.published as boolean,
              toggling: false,
              confirmDelete: false,
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  const togglePublished = async (id: string, current: boolean) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, toggling: true } : r))
    await supabase.from('blog_posts').update({ published: !current }).eq('id', id)
    setRows((prev) =>
      prev.map((r) => r.id === id ? { ...r, published: !current, toggling: false } : r)
    )
  }

  const deletePost = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id)
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        Cargando posts…
      </p>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[22px] text-ink font-normal">Blog</h1>
        <button
          type="button"
          onClick={() => navigate('/admin/blog/nuevo')}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
          style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
        >
          + Nuevo post
        </button>
      </div>

      {rows.length === 0 ? (
        <div
          className="py-16 text-center rounded-sm"
          style={{ border: '1px solid var(--line-soft)' }}
        >
          <p className="font-body text-[14px] text-ink-soft mb-2">No hay posts todavía.</p>
          <p className="font-mono text-[11px] text-ink-soft">
            Hacé clic en "+ Nuevo post" para escribir el primero.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Cabecera de tabla */}
          <div
            className="grid grid-cols-[1fr_2fr_100px_110px_100px_auto] gap-4 px-4 py-2 hidden md:grid"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            {['Slug', 'Título', 'Categoría', 'Fecha', 'Estado', ''].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                {h}
              </span>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-sm overflow-hidden"
              style={{ border: '1px solid var(--line-soft)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_100px_110px_100px_auto] gap-4 px-4 py-3.5 items-center bg-cream-50">
                {/* Slug */}
                <span className="font-mono text-[11px] text-ink-soft truncate max-w-[120px]">
                  {row.slug || '—'}
                </span>

                {/* Título */}
                <span className="font-body text-[14px] text-ink">
                  {row.title || <span className="italic text-ink-soft">sin título</span>}
                </span>

                {/* Categoría */}
                <span className="font-mono text-[11px] text-ink-soft hidden md:block">
                  {row.category}
                </span>

                {/* Fecha */}
                <span className="font-mono text-[11px] text-ink-soft hidden md:block">
                  {formatDate(row.date)}
                </span>

                {/* Estado */}
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-pill self-start md:self-auto"
                  style={{
                    background: row.published ? 'var(--sage-100, #dff0e6)' : 'var(--cream-200, #ede8e0)',
                    color: row.published ? 'var(--sage-700)' : 'var(--ink-soft)',
                  }}
                >
                  {row.published ? 'Publicado' : 'Borrador'}
                </span>

                {/* Acciones */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/blog/${row.id}`)}
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

                  {!row.confirmDelete ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRows((prev) =>
                          prev.map((r) => r.id === row.id ? { ...r, confirmDelete: true } : r)
                        )
                      }
                      className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline"
                      style={{ color: '#a8503f' }}
                    >
                      Eliminar
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-ink-soft">¿Segura?</span>
                      <button
                        type="button"
                        onClick={() => deletePost(row.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline"
                        style={{ color: '#a8503f' }}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRows((prev) =>
                            prev.map((r) => r.id === row.id ? { ...r, confirmDelete: false } : r)
                          )
                        }
                        className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink"
                      >
                        No
                      </button>
                    </div>
                  )}
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

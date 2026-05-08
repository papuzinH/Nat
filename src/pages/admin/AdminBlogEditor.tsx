import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { JSONContent } from '@tiptap/core'
import { supabase } from '@/lib/supabase'
import TipTapEditor from '@/components/admin/blog/TipTapEditor'

// ─── Constantes ───────────────────────────────────────────────────────────────

const BLOG_CATEGORIES = ['Estudio', 'Botánica', 'Cerámica', 'Dibujo', 'Textiles']
const BLOG_BUCKET = 'blog-images'
const EMPTY_BODY: JSONContent = { type: 'doc', content: [] }
const TODAY = new Date().toISOString().slice(0, 10)

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface BlogEditorState {
  id: string | null
  slug: string
  title: string
  subtitle: string
  category: string
  date: string
  reading_time: string
  cover_image: string | null
  body: JSONContent
  excerpt: string
  tags: string[]
  tagsInput: string
  related: string[]
  relatedInput: string
  published: boolean
  seo_title: string
  seo_description: string
  isNew: boolean
  dirty: boolean
  saving: boolean
  saveError: string | null
}

function emptyState(): BlogEditorState {
  return {
    id: null, slug: '', title: '', subtitle: '',
    category: 'Estudio', date: TODAY, reading_time: '5 min',
    cover_image: null, body: EMPTY_BODY, excerpt: '',
    tags: [], tagsInput: '', related: [], relatedInput: '',
    published: false, seo_title: '', seo_description: '',
    isNew: true, dirty: false, saving: false, saveError: null,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isBodyEmpty(body: JSONContent): boolean {
  if (!body.content || body.content.length === 0) return true
  return body.content.every((node) => {
    if (!node.content || node.content.length === 0) return true
    return node.content.every((n) => !n.text?.trim())
  })
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const inputCls = 'font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1.5 transition-colors w-full'
const inputStyle = { borderColor: 'var(--line)' }

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label, hint, children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
      {label}
    </label>
    {children}
    {hint && (
      <p className="font-mono text-[10px] text-ink-soft leading-snug">{hint}</p>
    )}
  </div>
)

// Upload de imagen de portada
const CoverImageUploader: React.FC<{
  slug: string
  url: string | null
  onChange: (url: string | null) => void
}> = ({ slug, url, onChange }) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    if (!slug) { setError('Ingresá el slug antes de subir la imagen'); return }
    setUploading(true); setError(null)
    const ext = file.name.split('.').pop()
    const path = `covers/${slug}-${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from(BLOG_BUCKET).upload(path, file, { upsert: true })
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return }
    const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {url ? (
        <div className="relative group">
          <img
            src={url}
            alt="Portada"
            className="w-full aspect-video object-cover rounded-sm"
            style={{ border: '1px solid var(--line-soft)' }}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[13px]"
            style={{ background: '#a8503f', color: '#fff' }}
            aria-label="Quitar imagen"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-sm cursor-pointer transition-colors"
          style={{ border: '1.5px dashed var(--line)', background: 'var(--cream-50)' }}
        >
          {uploading ? (
            <span className="font-mono text-[11px] text-ink-soft uppercase tracking-[0.1em]">Subiendo…</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-soft">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              <span className="font-body text-[12px] text-ink-soft text-center">
                Subir imagen de portada
              </span>
            </>
          )}
        </div>
      )}
      {error && <p className="font-mono text-[11px]" style={{ color: '#a8503f' }}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f) }}
      />
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminBlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<BlogEditorState>(emptyState())

  // Carga del post existente
  useEffect(() => {
    if (!id) return
    setState((prev) => ({ ...prev, isNew: false }))
    supabase.from('blog_posts').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) return
      setState({
        id: data.id as string,
        slug: data.slug as string,
        title: data.title as string,
        subtitle: (data.subtitle as string) ?? '',
        category: (data.category as string) ?? 'Estudio',
        date: (data.date as string) ?? TODAY,
        reading_time: (data.reading_time as string) ?? '5 min',
        cover_image: (data.cover_image as string | null) ?? null,
        body: (data.body as JSONContent) ?? EMPTY_BODY,
        excerpt: (data.excerpt as string) ?? '',
        tags: (data.tags as string[]) ?? [],
        tagsInput: ((data.tags as string[]) ?? []).join(', '),
        related: (data.related as string[]) ?? [],
        relatedInput: ((data.related as string[]) ?? []).join(', '),
        published: (data.published as boolean) ?? false,
        seo_title: (data.seo_title as string) ?? '',
        seo_description: (data.seo_description as string) ?? '',
        isNew: false,
        dirty: false,
        saving: false,
        saveError: null,
      })
    })
  }, [id])

  const patch = <K extends keyof BlogEditorState>(field: K, value: BlogEditorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value, dirty: true }))
  }

  const handleTitleChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      title: value,
      slug: prev.isNew ? slugify(value) : prev.slug,
      dirty: true,
    }))
  }

  const save = async (publishOverride?: boolean) => {
    const published = publishOverride !== undefined ? publishOverride : state.published
    if (!state.slug || !state.title) {
      setState((prev) => ({ ...prev, saveError: 'El slug y el título son obligatorios.' }))
      return
    }
    if (isBodyEmpty(state.body)) {
      setState((prev) => ({ ...prev, saveError: 'El contenido del post no puede estar vacío.' }))
      return
    }

    setState((prev) => ({ ...prev, saving: true, saveError: null }))

    const payload: Record<string, unknown> = {
      slug: state.slug,
      title: state.title,
      subtitle: state.subtitle,
      category: state.category,
      date: state.date,
      reading_time: state.reading_time,
      cover_image: state.cover_image || null,
      body: state.body,
      excerpt: state.excerpt,
      tags: state.tags,
      related: state.related,
      published,
      seo_title: state.seo_title || null,
      seo_description: state.seo_description || null,
    }
    if (!state.isNew && state.id) payload.id = state.id

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(payload)
      .select()
      .single()

    if (error) {
      setState((prev) => ({ ...prev, saving: false, saveError: error.message }))
      return
    }

    setState((prev) => ({
      ...prev,
      id: data.id as string,
      isNew: false,
      published,
      dirty: false,
      saving: false,
      saveError: null,
    }))

    if (!id) navigate(`/admin/blog/${data.id as string}`, { replace: true })
  }

  const headerTitle = state.isNew
    ? 'Nuevo post'
    : state.slug
    ? `Editando: ${state.slug}`
    : 'Editor'

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between mb-6 pb-5"
        style={{ borderBottom: '1px solid var(--line-soft)' }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors"
          >
            ← Blog
          </button>
          <h1 className="font-display text-[20px] text-ink font-normal">{headerTitle}</h1>
          {state.dirty && (
            <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: '#a87c3f' }}>
              sin guardar
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {state.saveError && (
            <span className="font-mono text-[11px]" style={{ color: '#a8503f' }}>
              {state.saveError}
            </span>
          )}
          <button
            type="button"
            disabled={state.saving}
            onClick={() => save(false)}
            className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all disabled:opacity-40"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            {state.saving && !state.published ? 'Guardando…' : 'Guardar borrador'}
          </button>
          <button
            type="button"
            disabled={state.saving}
            onClick={() => save(true)}
            className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill transition-all disabled:opacity-40"
            style={{ background: 'var(--sage-700)', color: 'var(--cream-50)', border: '1px solid var(--sage-700)' }}
          >
            {state.saving && state.published ? 'Publicando…' : state.published ? 'Actualizar' : 'Publicar'}
          </button>
        </div>
      </div>

      {/* Layout: editor + sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Editor principal ── */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mb-3">
            Contenido
          </p>
          <TipTapEditor
            value={state.body}
            onChange={(v) => patch('body', v)}
            placeholder="Escribí el contenido del post aquí…"
          />
        </div>

        {/* ── Sidebar de metadatos ── */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">

          {/* Identificación */}
          <section className="flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Identificación
            </p>
            <Field
              label="Slug"
              hint={state.isNew ? 'Se genera automáticamente desde el título. No se puede cambiar después.' : undefined}
            >
              <input
                type="text"
                value={state.slug}
                disabled={!state.isNew}
                placeholder="mi-primer-post"
                onChange={(e) => patch('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className={`${inputCls} disabled:opacity-50`}
                style={inputStyle}
              />
            </Field>
            <Field label="Título">
              <input
                type="text"
                value={state.title}
                placeholder="El título del post"
                onChange={(e) => handleTitleChange(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
            <Field label="Subtítulo / bajada">
              <input
                type="text"
                value={state.subtitle}
                placeholder="Una frase que resume el post"
                onChange={(e) => patch('subtitle', e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* Categoría y fecha */}
          <section className="flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Categoría y fecha
            </p>
            <Field label="Categoría">
              <select
                value={state.category}
                onChange={(e) => patch('category', e.target.value)}
                className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1.5 outline-none focus:border-sage-700 transition-colors"
                style={{ borderColor: 'var(--line)' }}
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha">
                <input
                  type="date"
                  value={state.date}
                  onChange={(e) => patch('date', e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                />
              </Field>
              <Field label="Tiempo de lectura">
                <input
                  type="text"
                  value={state.reading_time}
                  placeholder="5 min"
                  onChange={(e) => patch('reading_time', e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                />
              </Field>
            </div>
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* Imagen de portada */}
          <section className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Imagen de portada
            </p>
            <CoverImageUploader
              slug={state.slug}
              url={state.cover_image}
              onChange={(url) => patch('cover_image', url)}
            />
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* Extracto */}
          <section className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Extracto
            </p>
            <textarea
              value={state.excerpt}
              rows={3}
              placeholder="Resumen breve que aparece en la lista del blog…"
              onChange={(e) => patch('excerpt', e.target.value)}
              className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1.5 transition-colors resize-none w-full"
              style={{ borderColor: 'var(--line)' }}
            />
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* Posts relacionados */}
          <section className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Posts relacionados
            </p>
            <Field
              label="Slugs separados por coma"
              hint="Ejemplo: cicatrizar-despacio, plantas-que-tatuo"
            >
              <input
                type="text"
                value={state.relatedInput}
                placeholder="slug-uno, slug-dos"
                onChange={(e) => patch('relatedInput', e.target.value)}
                onBlur={(e) => {
                  const parsed = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  setState((prev) => ({ ...prev, related: parsed, relatedInput: parsed.join(', '), dirty: true }))
                }}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* Tags */}
          <section className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">Tags</p>
            <Field label="Palabras clave separadas por coma">
              <input
                type="text"
                value={state.tagsInput}
                placeholder="botanica, flores, taller"
                onChange={(e) => patch('tagsInput', e.target.value)}
                onBlur={(e) => {
                  const parsed = e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  setState((prev) => ({ ...prev, tags: parsed, tagsInput: parsed.join(', '), dirty: true }))
                }}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* SEO */}
          <section className="flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">SEO</p>
            <Field label="Título SEO" hint="Si está vacío, se usa el título del post.">
              <input
                type="text"
                value={state.seo_title}
                placeholder={state.title || 'Título del post — NatArt'}
                onChange={(e) => patch('seo_title', e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
            <Field label="Descripción SEO" hint="Máximo 160 caracteres.">
              <textarea
                value={state.seo_description}
                rows={3}
                maxLength={160}
                placeholder={state.subtitle || state.excerpt || 'Descripción del post…'}
                onChange={(e) => patch('seo_description', e.target.value)}
                className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1.5 transition-colors resize-none w-full"
                style={{ borderColor: 'var(--line)' }}
              />
              <p className="font-mono text-[10px] text-ink-soft text-right">
                {state.seo_description.length}/160
              </p>
            </Field>
          </section>

          <div style={{ borderTop: '1px solid var(--line-soft)' }} />

          {/* Estado de publicación */}
          <section className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="post-published"
              checked={state.published}
              onChange={(e) => patch('published', e.target.checked)}
              className="accent-sage-700 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="post-published" className="font-body text-[13px] text-ink cursor-pointer">
              Publicado
            </label>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-pill ml-auto"
              style={{
                background: state.published ? 'var(--sage-100, #dff0e6)' : 'var(--cream-200, #ede8e0)',
                color: state.published ? 'var(--sage-700)' : 'var(--ink-soft)',
              }}
            >
              {state.published ? 'Publicado' : 'Borrador'}
            </span>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminBlogEditor

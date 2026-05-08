import React, { useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { supabase } from '@/lib/supabase'

// ─── Helpers visuales ─────────────────────────────────────────────────────────

const Divider = () => (
  <span className="w-px h-5 mx-1 flex-shrink-0" style={{ background: 'var(--line)' }} />
)

const Btn: React.FC<{
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}> = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    className="p-1.5 rounded-sm font-mono text-[11px] transition-colors disabled:opacity-30"
    style={{
      background: active ? 'var(--sage-700)' : 'transparent',
      color: active ? 'var(--cream-50)' : 'var(--ink-soft)',
    }}
    onMouseEnter={(e) => {
      if (!active && !disabled) {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream-200, #ede8e0)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-soft)'
      }
    }}
  >
    {children}
  </button>
)

// ─── Upload de imágenes al bucket blog-images ─────────────────────────────────

const BLOG_BUCKET = 'blog-images'

async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, file, { upsert: false })
  if (error) return null
  const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export const EditorToolbar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  const imgInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) editor.chain().focus().setImage({ src: url }).run()
    e.target.value = ''
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL del enlace', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 px-3 py-2"
      style={{ background: 'var(--cream-100, #f5f0eb)', borderBottom: '1px solid var(--line-soft)' }}
    >
      {/* Formato de texto */}
      <Btn title="Negrita" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </Btn>
      <Btn title="Cursiva" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </Btn>
      <Btn title="Subrayado" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span style={{ textDecoration: 'underline' }}>U</span>
      </Btn>
      <Btn title="Tachado" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </Btn>

      <Divider />

      {/* Headings */}
      <Btn title="Subtítulo H2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </Btn>
      <Btn title="Subtítulo H3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </Btn>
      <Btn title="Subtítulo H4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
        H4
      </Btn>

      <Divider />

      {/* Listas y citas */}
      <Btn title="Lista con viñetas" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="2" cy="4" r="1" fill="currentColor" stroke="none" />
          <line x1="5" y1="4" x2="13" y2="4" />
          <circle cx="2" cy="8" r="1" fill="currentColor" stroke="none" />
          <line x1="5" y1="8" x2="13" y2="8" />
          <circle cx="2" cy="12" r="1" fill="currentColor" stroke="none" />
          <line x1="5" y1="12" x2="13" y2="12" />
        </svg>
      </Btn>
      <Btn title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <text x="0" y="5" fontSize="5" fill="currentColor" stroke="none">1.</text>
          <line x1="5" y1="4" x2="13" y2="4" />
          <text x="0" y="9" fontSize="5" fill="currentColor" stroke="none">2.</text>
          <line x1="5" y1="8" x2="13" y2="8" />
          <text x="0" y="13" fontSize="5" fill="currentColor" stroke="none">3.</text>
          <line x1="5" y1="12" x2="13" y2="12" />
        </svg>
      </Btn>
      <Btn title="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M1 3h2.5v3H1.5C1.5 7.5 2.5 9 4 9.5V11C1.5 10.5 0 8.5 0 6V3h1zm7 0h2.5v3H8.5C8.5 7.5 9.5 9 11 9.5V11C8.5 10.5 7 8.5 7 6V3h1z" />
        </svg>
      </Btn>

      <Divider />

      {/* Línea horizontal */}
      <Btn title="Línea separadora" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.4">
          <line x1="1" y1="7" x2="13" y2="7" />
        </svg>
      </Btn>

      <Divider />

      {/* Link e imagen */}
      <Btn title="Agregar enlace" active={editor.isActive('link')} onClick={setLink}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M5.5 8.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L6 3" strokeLinecap="round" />
          <path d="M8.5 5.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5L8 11" strokeLinecap="round" />
        </svg>
      </Btn>
      <Btn title="Insertar imagen" onClick={() => imgInputRef.current?.click()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="1" y="2" width="12" height="10" rx="1" />
          <circle cx="4.5" cy="5.5" r="1" />
          <path d="M1 10l3-3 2 2 3-4 4 5" strokeLinejoin="round" />
        </svg>
      </Btn>
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />

      <Divider />

      {/* Alineación */}
      <Btn title="Alinear izquierda" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.3">
          <line x1="1" y1="3" x2="13" y2="3" /><line x1="1" y1="6" x2="9" y2="6" />
          <line x1="1" y1="9" x2="13" y2="9" /><line x1="1" y1="12" x2="9" y2="12" />
        </svg>
      </Btn>
      <Btn title="Centrar" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.3">
          <line x1="1" y1="3" x2="13" y2="3" /><line x1="3" y1="6" x2="11" y2="6" />
          <line x1="1" y1="9" x2="13" y2="9" /><line x1="3" y1="12" x2="11" y2="12" />
        </svg>
      </Btn>
      <Btn title="Alinear derecha" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.3">
          <line x1="1" y1="3" x2="13" y2="3" /><line x1="5" y1="6" x2="13" y2="6" />
          <line x1="1" y1="9" x2="13" y2="9" /><line x1="5" y1="12" x2="13" y2="12" />
        </svg>
      </Btn>

      <Divider />

      {/* Resaltado */}
      <Btn title="Resaltar texto" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="6" width="10" height="6" rx="1" fill={editor.isActive('highlight') ? 'var(--cream-50)' : 'var(--sage-500, #7aab8a)'} opacity="0.7" />
          <text x="3" y="5" fontSize="6" fill="currentColor">A</text>
        </svg>
      </Btn>

      <Divider />

      {/* Código */}
      <Btn title="Código inline" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <polyline points="4,3 1,7 4,11" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="10,3 13,7 10,11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>
      <Btn title="Bloque de código" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="1" y="2" width="12" height="10" rx="1" />
          <polyline points="4,5 2.5,7 4,9" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7,5 8.5,7 7,9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>

      <Divider />

      {/* Historial */}
      <Btn title="Deshacer" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M2 7a5 5 0 105-5H4" strokeLinecap="round" />
          <polyline points="1,4 4,7 1,10" strokeLinejoin="round" transform="rotate(180,2.5,7)" />
          <path d="M1 4L4 7L1 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>
      <Btn title="Rehacer" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 7a5 5 0 10-5-5h-3" strokeLinecap="round" />
          <path d="M13 4L10 7L13 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>
    </div>
  )
}

export default EditorToolbar

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TipTapImage from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import type { JSONContent } from '@tiptap/core'
import { EditorToolbar } from './EditorToolbar'

interface TipTapEditorProps {
  value: JSONContent
  onChange: (v: JSONContent) => void
  placeholder?: string
}

const EDITOR_EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: 'text-sage-700 underline' },
  }),
  TipTapImage.configure({ inline: false, allowBase64: false }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
  Highlight.configure({ multicolor: false }),
  Typography,
  CharacterCount,
]

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      ...EDITOR_EXTENSIONS,
      Placeholder.configure({ placeholder: placeholder ?? 'Escribí el contenido del post…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  })

  const charCount = editor?.storage?.characterCount?.characters?.() ?? 0
  const wordCount = editor?.storage?.characterCount?.words?.() ?? 0

  return (
    <div
      className="tiptap-editor rounded-sm overflow-hidden"
      style={{ border: '1px solid var(--line)' }}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <div
        className="flex items-center justify-end gap-4 px-4 py-1.5"
        style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--cream-100, #f5f0eb)' }}
      >
        <span className="font-mono text-[10px] text-ink-soft">
          {wordCount} palabras · {charCount} caracteres
        </span>
      </div>
    </div>
  )
}

export { EDITOR_EXTENSIONS }
export default TipTapEditor

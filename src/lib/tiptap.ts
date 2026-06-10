import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import type { JSONContent } from '@tiptap/core'

// Extensiones para renderizar contenido TipTap → HTML. Isomórfico: se usa tanto
// en el server (page del post, para SEO) como en cliente (preview del admin).
// StarterKit v3 ya incluye link/underline → se deshabilitan ahí para no duplicar
// (evita el warning "Duplicate extension names").
const RENDERER_EXTENSIONS = [
  StarterKit.configure({ link: false, underline: false }),
  LinkExt,
  ImageExt,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
  Highlight,
  Typography,
]

/** Renderiza un documento TipTap (JSONContent) a HTML string. */
export function renderTiptapHtml(content: JSONContent | null): string {
  if (!content) return ''
  try {
    return generateHTML(content, RENDERER_EXTENSIONS)
  } catch {
    return ''
  }
}

import React, { useEffect, useState } from 'react'
import Modal from '@/components/admin/shared/Modal'

interface LinkModalProps {
  open: boolean
  initialUrl?: string
  initialNewTab?: boolean
  /** Si hay un link pre-existente, mostrar botón "Quitar enlace". */
  hasExisting: boolean
  onApply: (url: string, newTab: boolean) => void
  onRemove: () => void
  onClose: () => void
}

function isValidUrl(s: string): boolean {
  if (!s) return false
  try {
    // URL relativa (empieza con /) la consideramos válida
    if (s.startsWith('/') || s.startsWith('#') || s.startsWith('mailto:') || s.startsWith('tel:')) return true
    new URL(s)
    return true
  } catch {
    return false
  }
}

const LinkModal: React.FC<LinkModalProps> = ({ open, initialUrl = '', initialNewTab = false, hasExisting, onApply, onRemove, onClose }) => {
  const [url, setUrl] = useState(initialUrl)
  const [newTab, setNewTab] = useState(initialNewTab)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setUrl(initialUrl)
      setNewTab(initialNewTab)
      setTouched(false)
    }
  }, [open, initialUrl, initialNewTab])

  const valid = isValidUrl(url.trim())

  return (
    <Modal open={open} onClose={onClose} title={hasExisting ? 'Editar enlace' : 'Insertar enlace'} maxWidth={420}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setTouched(true)
          if (!valid) return
          onApply(url.trim(), newTab)
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="link-url" className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            URL
          </label>
          <input
            id="link-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="https://… · /tienda · mailto:hola@…"
            className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 py-1.5 transition-colors"
            style={{ borderColor: touched && !valid ? '#a8503f' : 'var(--line)' }}
          />
          {touched && !valid && (
            <p className="font-mono text-[10px]" style={{ color: '#a8503f' }}>URL inválida.</p>
          )}
        </div>

        <label className="inline-flex items-center gap-2 font-body text-[13px] text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={newTab}
            onChange={(e) => setNewTab(e.target.checked)}
            className="accent-sage-700 w-4 h-4"
          />
          Abrir en pestaña nueva
        </label>

        <div className="flex items-center justify-between gap-3 pt-2" style={{ borderTop: '1px solid var(--line-soft)' }}>
          {hasExisting ? (
            <button
              type="button"
              onClick={onRemove}
              className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline"
              style={{ color: '#a8503f' }}
            >
              Quitar enlace
            </button>
          ) : <span />}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill transition-all disabled:opacity-40"
              style={{ background: 'var(--sage-700)', color: 'var(--cream-50)' }}
            >
              {hasExisting ? 'Actualizar' : 'Insertar'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default LinkModal

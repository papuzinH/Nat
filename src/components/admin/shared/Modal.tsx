import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap, shouldAnimate } from '@/lib/gsap'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: number
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, maxWidth = 480 }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  // Cierre con ESC y bloqueo de scroll del body
  useEffect(() => {
    if (!open) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lastFocusedRef.current?.focus()
    }
  }, [open, onClose])

  // Animación de entrada + foco al primer focusable
  useLayoutEffect(() => {
    if (!open || !overlayRef.current || !panelRef.current) return
    if (shouldAnimate()) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.96, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: 'power2.out' }
      )
    }
    const first = panelRef.current.querySelector<HTMLElement>(
      'input, textarea, button, select, [tabindex]:not([tabindex="-1"])'
    )
    first?.focus()
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(20, 20, 20, 0.45)' }}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className="bg-cream-50 rounded-sm shadow-xl flex flex-col max-h-[90vh] w-full"
        style={{ maxWidth, border: '1px solid var(--line-soft)' }}
      >
        {title && (
          <header
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            <h2 id="modal-title" className="font-display text-[16px] text-ink font-normal">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[14px] text-ink-soft hover:text-ink transition-colors"
              aria-label="Cerrar"
            >
              ×
            </button>
          </header>
        )}
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal

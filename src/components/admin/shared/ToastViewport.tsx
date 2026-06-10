'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { useToast, type ToastItem } from '@/context/ToastContext'

const TONE_STYLES: Record<ToastItem['tone'], { bg: string; fg: string; iconColor: string }> = {
  success: { bg: 'var(--sage-700)',     fg: '#fdfcfb', iconColor: '#fdfcfb' },
  error:   { bg: '#7a2c2c',             fg: '#fdfcfb', iconColor: '#fdfcfb' },
  info:    { bg: 'var(--ink, #2c2c2c)', fg: '#fdfcfb', iconColor: '#fdfcfb' },
}

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !shouldAnimate()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }
      )
    })
    return () => ctx.revert()
  }, [])

  const tone = TONE_STYLES[toast.tone]

  return (
    <div
      ref={ref}
      role={toast.tone === 'error' ? 'alert' : 'status'}
      aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
      className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-sm shadow-md max-w-sm"
      style={{ background: tone.bg, color: tone.fg }}
    >
      <span aria-hidden="true" className="font-mono text-[14px] leading-none mt-0.5" style={{ color: tone.iconColor }}>
        {toast.tone === 'success' ? '✓' : toast.tone === 'error' ? '!' : '·'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[13px] leading-snug">{toast.message}</p>
        {toast.detail && (
          <p className="font-mono text-[10px] mt-1 opacity-80 break-words">{toast.detail}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="font-mono text-[14px] leading-none opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
        aria-label="Cerrar notificación"
        style={{ color: tone.fg }}
      >
        ×
      </button>
    </div>
  )
}

const ToastViewport: React.FC = () => {
  const { toasts, dismiss } = useToast()
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  )
}

export default ToastViewport

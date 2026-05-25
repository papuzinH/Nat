import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  tone: ToastTone
  message: string
  detail?: string
}

interface ToastOptions {
  detail?: string
  duration?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  dismiss: (id: number) => void
  success: (message: string, opts?: ToastOptions) => void
  error:   (message: string, opts?: ToastOptions) => void
  info:    (message: string, opts?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 3500,
  info:    3500,
  error:   6000,
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((tone: ToastTone, message: string, opts?: ToastOptions) => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, tone, message, detail: opts?.detail }])
    const duration = opts?.duration ?? DEFAULT_DURATION[tone]
    if (duration > 0) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const value = useMemo<ToastContextValue>(() => ({
    toasts,
    dismiss,
    success: (m, o) => push('success', m, o),
    error:   (m, o) => push('error',   m, o),
    info:    (m, o) => push('info',    m, o),
  }), [toasts, dismiss, push])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

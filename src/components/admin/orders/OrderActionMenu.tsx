'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { StatusAction } from '@/data/orderStatus'

interface OrderActionMenuProps {
  actions: StatusAction[]
  onSelect: (next: StatusAction['next']) => void | Promise<void>
}

/**
 * Menú "⋯" de acciones secundarias (no lineales) de una orden: revertir a un
 * estado anterior, confirmar pago manual, cancelar… Las acciones `danger`
 * piden confirmación inline antes de ejecutarse. Cierra al click-outside / Esc.
 */
const OrderActionMenu: React.FC<OrderActionMenuProps> = ({ actions, onSelect }) => {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  // Posición fija calculada desde el botón: el dropdown usa position:fixed para
  // escapar de cualquier ancestro con overflow-hidden (cada fila lo tiene).
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const openMenu = () => {
    const r = triggerRef.current?.getBoundingClientRect()
    if (r) setCoords({ top: r.bottom + 4, right: window.innerWidth - r.right })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    // Reposicionar/cerrar si cambia el viewport mientras está abierto.
    const onReflow = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onReflow, true)
    window.addEventListener('resize', onReflow)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onReflow, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [open])

  // Reset del estado de confirmación al cerrar.
  useEffect(() => { if (!open) setConfirming(null) }, [open])

  if (actions.length === 0) return null

  const run = async (next: StatusAction['next']) => {
    setRunning(true)
    try {
      await onSelect(next)
      setOpen(false)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div ref={ref} className="inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); if (open) setOpen(false); else openMenu() }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Más acciones"
        className="w-9 h-9 inline-flex items-center justify-center rounded-sm text-ink-soft hover:text-ink hover:bg-cream-100 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="8" r="1.4" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="13" cy="8" r="1.4" />
        </svg>
      </button>

      {open && coords && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 min-w-[200px] rounded-sm py-1 shadow-md bg-cream-50"
          style={{ top: coords.top, right: coords.right, border: '1px solid var(--line)' }}
        >
          {actions.map((a) => {
            const isConfirming = confirming === a.next
            if (a.danger && isConfirming) {
              return (
                <div key={a.next} className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">¿Seguro?</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="menuitem"
                      disabled={running}
                      onClick={() => run(a.next)}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline disabled:opacity-50"
                      style={{ color: '#a8503f' }}
                    >
                      {running ? '…' : 'Sí'}
                    </button>
                    <button
                      type="button"
                      disabled={running}
                      onClick={() => setConfirming(null)}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink disabled:opacity-50"
                    >
                      No
                    </button>
                  </div>
                </div>
              )
            }
            return (
              <button
                key={a.next}
                type="button"
                role="menuitem"
                disabled={running}
                onClick={() => (a.danger ? setConfirming(a.next) : run(a.next))}
                className="w-full text-left px-3 py-2 font-body text-[13px] hover:bg-cream-100 transition-colors disabled:opacity-50"
                style={{ color: a.danger ? '#a8503f' : 'var(--ink)' }}
              >
                {a.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderActionMenu

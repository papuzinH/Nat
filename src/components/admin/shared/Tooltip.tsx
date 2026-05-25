import React, { useEffect, useId, useState } from 'react'

interface TooltipProps {
  text: string
  /** Si se pasan children, se reemplaza el ícono `?` por el children como trigger. */
  children?: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [open, setOpen] = useState(false)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const trigger = children ?? (
    <span
      className="inline-flex items-center justify-center rounded-full font-mono text-[9px] w-3.5 h-3.5 flex-shrink-0"
      style={{ background: 'var(--line)', color: 'var(--ink-soft)' }}
      aria-hidden="true"
    >
      ?
    </span>
  )

  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-label="Mostrar ayuda"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
        className="inline-flex items-center cursor-help bg-transparent border-0 p-0"
      >
        {trigger}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-52 font-body text-[12px] leading-snug rounded-sm px-3 py-2 shadow-md pointer-events-none"
          style={{ background: '#2c2c2c', color: '#fdfcfb', whiteSpace: 'normal' }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

export default Tooltip

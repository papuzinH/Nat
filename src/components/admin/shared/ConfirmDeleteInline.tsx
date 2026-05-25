import React, { useState } from 'react'

interface ConfirmDeleteInlineProps {
  onConfirm: () => void | Promise<void>
  label?: string
  question?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

const ConfirmDeleteInline: React.FC<ConfirmDeleteInlineProps> = ({
  onConfirm,
  label = 'Eliminar',
  question = '¿Segura?',
  confirmLabel = 'Sí, eliminar',
  cancelLabel = 'Cancelar',
  danger = true,
}) => {
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:underline"
        style={{ color: danger ? '#a8503f' : 'var(--ink-soft)' }}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] text-ink-soft">{question}</span>
      <button
        type="button"
        disabled={running}
        onClick={async () => {
          setRunning(true)
          try {
            await onConfirm()
          } finally {
            setRunning(false)
            setOpen(false)
          }
        }}
        className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline disabled:opacity-50"
        style={{ color: '#a8503f' }}
      >
        {running ? '…' : confirmLabel}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        disabled={running}
        className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink disabled:opacity-50"
      >
        {cancelLabel}
      </button>
    </div>
  )
}

export default ConfirmDeleteInline

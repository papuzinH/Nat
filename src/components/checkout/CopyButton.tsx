'use client'

import React, { useState } from 'react'

interface CopyButtonProps {
  /** Texto que se copia al portapapeles. */
  value: string
  /** Etiqueta accesible (ej. "Copiar CBU"). */
  label: string
}

/**
 * Botón "Copiar" con Clipboard API y feedback efímero ("¡Copiado!" ~1.5 s).
 * Pensado para datos bancarios en la Thank You Page (mobile-first).
 */
const CopyButton: React.FC<CopyButtonProps> = ({ value, label }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Fallback para navegadores sin Clipboard API / contextos no seguros.
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-pill border transition-all duration-200 cursor-pointer ${
        copied
          ? 'bg-sage-700 text-cream-50 border-sage-700'
          : 'bg-transparent text-sage-700 border-[var(--line)] hover:border-sage-700'
      }`}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copiar
        </>
      )}
    </button>
  )
}

export default CopyButton

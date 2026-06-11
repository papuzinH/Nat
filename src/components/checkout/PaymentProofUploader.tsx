'use client'

import React, { useRef, useState } from 'react'

const ACCEPT = '.jpg,.jpeg,.png,.pdf'
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

interface PaymentProofUploaderProps {
  orderId: string
  /** Token que autoriza la subida (verificado en el servidor). */
  uploadToken: string
  /** Se invoca tras subir el comprobante con éxito. */
  onUploaded: () => void
}

function validate(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Subí una imagen (JPG/PNG) o un PDF.'
  }
  if (file.size > MAX_SIZE) {
    return 'El archivo supera los 5 MB.'
  }
  return null
}

/**
 * Zona de carga del comprobante de transferencia: drag & drop + selector.
 * Valida tipo y tamaño en cliente y sube vía /api/upload-payment-proof.
 */
const PaymentProofUploader: React.FC<PaymentProofUploaderProps> = ({ orderId, uploadToken, onUploaded }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    const validationError = validate(file)
    if (validationError) {
      setError(validationError)
      setFileName(null)
      return
    }
    setError(null)
    setFileName(file.name)
    setUploading(true)

    try {
      const form = new FormData()
      form.append('orderId', orderId)
      form.append('token', uploadToken)
      form.append('file', file)
      const res = await fetch('/api/upload-payment-proof', { method: 'POST', body: form })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'No se pudo subir el comprobante.')
      }
      onUploaded()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir el comprobante.')
      setFileName(null)
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploading) inputRef.current?.click() }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-label="Subir comprobante de transferencia"
        className={`flex flex-col items-center justify-center text-center gap-2 px-6 py-8 rounded-sm cursor-pointer transition-colors ${
          uploading ? 'cursor-wait' : ''
        }`}
        style={{
          border: `1.5px dashed ${dragging ? 'var(--sage-700, #4a7c59)' : 'var(--line)'}`,
          background: dragging ? 'var(--cream-100, #faf6f0)' : 'transparent',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
        />

        {uploading ? (
          <>
            <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="var(--line)" strokeWidth="2.5" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="var(--sage-700, #4a7c59)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="font-body text-[13px] text-ink-soft">Subiendo {fileName}…</p>
          </>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sage-700, #4a7c59)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="font-body text-[14px] text-ink">
              <span className="text-sage-700 font-semibold">Tocá para subir</span> o arrastrá el archivo
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
              JPG · PNG · PDF · hasta 5 MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-[#a8503f] text-[12px] font-body mt-2 text-center">{error}</p>
      )}
    </div>
  )
}

export default PaymentProofUploader

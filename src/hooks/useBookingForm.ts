import { useEffect, useRef, useState } from 'react'
import { compressImage } from '@/lib/imageCompression'

export type ArrayField = 'workTypes' | 'days' | 'timeSlots'

export interface BookingFields {
  name: string
  email: string
  instagram: string
  idea: string
  sizeCm: string
  area: string
  references: File[]
  workTypes: string[]
  days: string[]
  timeSlots: string[]
  notes: string
}

export interface BookingErrors {
  name?: string
  email?: string
  instagram?: string
  idea?: string
  sizeCm?: string
  area?: string
  references?: string
  workTypes?: string
  days?: string
  timeSlots?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const IG_RE = /^[a-zA-Z0-9._]{1,30}$/
const MAX_FILES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

const INITIAL: BookingFields = {
  name: '',
  email: '',
  instagram: '',
  idea: '',
  sizeCm: '',
  area: '',
  references: [],
  workTypes: [],
  days: [],
  timeSlots: [],
  notes: '',
}


function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1] ?? '')
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function useBookingForm() {
  const [fields, setFields] = useState<BookingFields>(INITIAL)
  const [previews, setPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<BookingErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const previewsRef = useRef<string[]>([])

  useEffect(() => {
    previewsRef.current = previews
  }, [previews])

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function update<K extends keyof BookingFields>(field: K, value: BookingFields[K]) {
    setFields((f) => ({ ...f, [field]: value }))
  }

  function toggleArrayField(field: ArrayField, value: string) {
    setFields((f) => {
      const current = f[field]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...f, [field]: next }
    })
  }

  function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming)
    const currentCount = fields.references.length
    const remaining = MAX_FILES - currentCount

    if (remaining <= 0) {
      setErrors((e) => ({ ...e, references: `Máximo ${MAX_FILES} imágenes.` }))
      return
    }

    const valid: File[] = []
    const newPreviews: string[] = []
    let rejectedSize = false
    let rejectedType = false

    for (const file of arr.slice(0, remaining)) {
      if (!ALLOWED_MIME.includes(file.type)) {
        rejectedType = true
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        rejectedSize = true
        continue
      }
      valid.push(file)
      newPreviews.push(URL.createObjectURL(file))
    }

    if (valid.length > 0) {
      setFields((f) => ({ ...f, references: [...f.references, ...valid] }))
      setPreviews((p) => [...p, ...newPreviews])
    }

    let errMsg: string | undefined
    if (rejectedType) errMsg = 'Solo imágenes (jpg, png, webp).'
    else if (rejectedSize) errMsg = 'Cada imagen debe pesar menos de 5MB.'
    else if (arr.length > remaining) errMsg = `Máximo ${MAX_FILES} imágenes.`
    setErrors((e) => ({ ...e, references: errMsg }))
  }

  function removeFile(index: number) {
    const url = previews[index]
    if (url) URL.revokeObjectURL(url)
    setPreviews((p) => p.filter((_, i) => i !== index))
    setFields((f) => ({
      ...f,
      references: f.references.filter((_, i) => i !== index),
    }))
    setErrors((e) => ({ ...e, references: undefined }))
  }

  function validate(): BookingErrors {
    const e: BookingErrors = {}
    if (fields.name.trim().length < 3) {
      e.name = 'Ingresá tu nombre y apellido.'
    }
    if (!EMAIL_RE.test(fields.email)) {
      e.email = 'Email no válido.'
    }
    if (fields.instagram.trim()) {
      const handle = fields.instagram.trim().replace(/^@/, '')
      if (!IG_RE.test(handle)) e.instagram = 'Usuario inválido.'
    }
    if (fields.idea.trim().length < 20) {
      e.idea = 'Contame un poco más (mínimo 20 caracteres).'
    }
    const sizeNum = Number(fields.sizeCm)
    if (!fields.sizeCm || Number.isNaN(sizeNum) || sizeNum < 1 || sizeNum > 100) {
      e.sizeCm = 'Tamaño entre 1 y 100 cm.'
    }
    if (!fields.area) {
      e.area = 'Seleccioná una zona.'
    }
    if (fields.workTypes.length === 0) {
      e.workTypes = 'Elegí al menos un tipo.'
    }
    if (fields.days.length === 0) {
      e.days = 'Elegí al menos un día.'
    }
    if (fields.timeSlots.length === 0) {
      e.timeSlots = 'Elegí al menos un horario.'
    }
    return e
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    const errs = validate()
    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      const firstErrorKey = Object.keys(errs)[0]
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSending(true)
    setSendError(null)

    try {
      // Comprimir imágenes antes de convertir a base64 (evita el 413 de Vercel)
      const attachments = await Promise.all(
        fields.references.map(async (file) => {
          const compressed = await compressImage(file, {
            maxDimension: 1200,
            quality: 0.8,
            skipUnderBytes: 300_000,
          })
          return {
            name: compressed.name,
            mimeType: compressed.type || 'image/jpeg',
            size: compressed.size,
            base64: await fileToBase64(compressed),
          }
        })
      )

      const payload = {
        name: fields.name.trim(),
        email: fields.email.trim().toLowerCase(),
        instagram: fields.instagram.trim().replace(/^@/, ''),
        idea: fields.idea.trim(),
        sizeCm: fields.sizeCm,
        area: fields.area,
        workTypes: fields.workTypes,
        days: fields.days,
        timeSlots: fields.timeSlots,
        notes: fields.notes.trim(),
        attachments,
      }

      const emailRes = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!emailRes.ok) {
        const errData = await emailRes.json().catch(() => ({})) as { error?: string }
        throw new Error(errData.error ?? 'email_send_failed')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('[booking] submit failed', err)
      setSendError('No pudimos enviar tu mensaje. Probá de nuevo en un rato.')
    } finally {
      setSending(false)
    }
  }

  function reset() {
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url))
    setPreviews([])
    setFields(INITIAL)
    setErrors({})
    setSubmitted(false)
    setSendError(null)
  }

  const firstName = fields.name.trim().split(' ')[0]

  return {
    fields,
    previews,
    errors,
    submitted,
    sending,
    sendError,
    firstName,
    update,
    toggleArrayField,
    addFiles,
    removeFile,
    submit,
    reset,
  }
}

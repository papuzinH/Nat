import { useState } from 'react'

interface BookingFields {
  name: string
  email: string
  area: string
  size: string
  idea: string
}

interface BookingErrors {
  name?: string
  email?: string
  area?: string
  idea?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useBookingForm() {
  const [fields, setFields] = useState<BookingFields>({
    name: '',
    email: '',
    area: '',
    size: '',
    idea: '',
  })
  const [errors, setErrors] = useState<BookingErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function update(field: keyof BookingFields, value: string) {
    setFields((f) => ({ ...f, [field]: value }))
  }

  function validate(): BookingErrors {
    const e: BookingErrors = {}
    if (!fields.name.trim()) e.name = 'Ingresá tu nombre.'
    if (!EMAIL_RE.test(fields.email)) e.email = 'Email no válido.'
    if (!fields.area) e.area = 'Seleccioná una zona del cuerpo.'
    if (fields.idea.trim().length < 20) e.idea = 'Contanos un poco más (mínimo 20 caracteres).'
    return e
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
    }
  }

  function reset() {
    setFields({ name: '', email: '', area: '', size: '', idea: '' })
    setErrors({})
    setSubmitted(false)
  }

  const firstName = fields.name.trim().split(' ')[0]

  return { fields, errors, submitted, firstName, update, submit, reset }
}

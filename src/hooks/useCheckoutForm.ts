import { useState } from 'react'

export interface CheckoutFields {
  name: string
  email: string
  phone: string
  deliveryMode: 'envio' | 'retiro' | ''
  street: string
  city: string
  postalCode: string
  zoneId: number | null
  zoneName: string
  zonePrice: number
  deliveryDay: string
  paymentMethod: 'mercadopago' | 'transferencia' | ''
}

export interface CheckoutErrors {
  name?: string
  email?: string
  phone?: string
  deliveryMode?: string
  street?: string
  city?: string
  postalCode?: string
  zoneId?: string
  deliveryDay?: string
  paymentMethod?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL: CheckoutFields = {
  name: '',
  email: '',
  phone: '',
  deliveryMode: '',
  street: '',
  city: '',
  postalCode: '',
  zoneId: null,
  zoneName: '',
  zonePrice: 0,
  deliveryDay: '',
  paymentMethod: '',
}

function validate(fields: CheckoutFields): CheckoutErrors {
  const e: CheckoutErrors = {}
  if (!fields.name.trim()) e.name = 'El nombre es requerido'
  if (!fields.email.trim()) e.email = 'El email es requerido'
  else if (!EMAIL_REGEX.test(fields.email)) e.email = 'Email inválido'
  if (!fields.phone.trim()) e.phone = 'El teléfono es requerido'
  if (!fields.deliveryMode) e.deliveryMode = 'Seleccioná una modalidad de entrega'
  if (fields.deliveryMode === 'envio') {
    if (!fields.street.trim()) e.street = 'La dirección es requerida'
    if (!fields.city.trim()) e.city = 'La localidad es requerida'
    if (!fields.postalCode.trim()) e.postalCode = 'El código postal es requerido'
    if (!fields.zoneId) e.zoneId = 'Seleccioná el barrio de entrega'
    if (!fields.deliveryDay) e.deliveryDay = 'Seleccioná el día de entrega preferido'
  }
  if (!fields.paymentMethod) e.paymentMethod = 'Seleccioná un método de pago'
  return e
}

export function useCheckoutForm() {
  const [fields, setFields] = useState<CheckoutFields>(INITIAL)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [attempted, setAttempted] = useState(false)

  const update = (key: keyof CheckoutFields, value: string | number | null) => {
    const next = { ...fields, [key]: value }
    setFields(next)
    if (attempted) setErrors(validate(next))
  }

  const submit = (): boolean => {
    setAttempted(true)
    const errs = validate(fields)
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  return { fields, errors, update, submit }
}

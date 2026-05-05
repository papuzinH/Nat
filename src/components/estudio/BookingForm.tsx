import React, { useLayoutEffect, useRef } from 'react'
import { useBookingForm } from '@/hooks/useBookingForm'
import NHLeafMark from '@/components/shared/NHLeafMark'
import { SectionTitle } from '../shared'
import { gsap, shouldAnimate } from '@/lib/gsap'

const ERROR_COLOR = '#a8503f'

const AREAS = [
  { value: '', label: 'Zona del cuerpo' },
  { value: 'brazo', label: 'Brazo / antebrazo' },
  { value: 'pierna', label: 'Pierna' },
  { value: 'espalda', label: 'Espalda' },
  { value: 'pecho', label: 'Pecho / esternón' },
  { value: 'otra', label: 'Otra' },
]

const SIZES = [
  { value: '', label: 'Tamaño aprox.' },
  { value: 'pequeño', label: 'Pequeño (~5 cm)' },
  { value: 'mediano', label: 'Mediano (10 cm)' },
  { value: 'grande', label: 'Grande (15 cm+)' },
  { value: 'nosé', label: 'No lo sé todavía' },
]

const inputBase =
  'w-full font-body text-[14px] text-ink bg-transparent border-0 border-b border-[rgba(44,44,44,0.2)] py-2 outline-none focus:border-sage-700 transition-colors duration-150 placeholder:text-ink-soft'

const selectBase =
  'w-full font-body text-[14px] text-ink bg-cream-50 border-0 border-b border-[rgba(44,44,44,0.2)] py-2 outline-none focus:border-sage-700 transition-colors duration-150 appearance-none cursor-pointer'

const BookingForm: React.FC = () => {
  const { fields, errors, submitted, firstName, update, submit, reset } = useBookingForm()
  const cardRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const fields = gsap.utils.toArray<HTMLElement>('.booking-field')
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        }
      )
      if (fields.length) {
        gsap.fromTo(
          fields,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 80%', once: true },
            delay: 0.2,
          }
        )
      }
    }, card)

    return () => ctx.revert()
  }, [submitted])

  useLayoutEffect(() => {
    const success = successRef.current
    if (!submitted || !success || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const children = success.children
      gsap.fromTo(
        children,
        { opacity: 0, y: 12, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
        }
      )
    }, success)

    return () => ctx.revert()
  }, [submitted])

  if (submitted) {
    return (
      <div
        ref={successRef}
        className="bg-cream-50 rounded-form p-8 md:p-9 text-center flex flex-col items-center gap-4"
        style={{
          border: '1px solid rgba(44,44,44,0.08)',
          boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
        }}
      >
        <NHLeafMark size={48} color="#7a9e7e" />
        <SectionTitle>Llegó tu mensaje</SectionTitle>
        <p
          className="font-body text-ink-soft leading-[1.6]"
          style={{ fontSize: '15px', maxWidth: '320px' }}
        >
          Gracias, {firstName}. Te voy a contestar en los próximos días desde
          hola@nataliaheller.ar. Mientras tanto, respirá hondo ✶
        </p>
        <button
          onClick={reset}
          className="mt-2 font-body text-[13px] text-sage-700 border border-sage-500 rounded-pill px-5 py-2 hover:bg-sage-200 transition-colors duration-150"
        >
          Enviar otra
        </button>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      id="book"
      className="bg-cream-50 rounded-form p-8 md:p-9"
      style={{
        border: '1px solid rgba(44,44,44,0.08)',
        boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
      }}
    >
      <p className="booking-field font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-2">
        Reservar sesión
      </p>
      <h3 className="booking-field font-display font-normal mb-1" style={{ fontSize: '26px' }}>
        Contame tu idea
      </h3>
      <p className="booking-field font-body text-ink-soft mb-6" style={{ fontSize: '13px' }}>
        Te respondo en 3 a 5 días con preguntas para afinar el diseño.
      </p>

      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="booking-field">
          <input
            type="text"
            placeholder="Cómo querés que te llame"
            value={fields.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputBase}
            aria-label="Tu nombre"
          />
          {errors.name && (
            <p className="mt-1 font-body" style={{ fontSize: '12px', color: ERROR_COLOR }}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="booking-field">
          <input
            type="email"
            placeholder="vos@correo.com"
            value={fields.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputBase}
            aria-label="Correo"
          />
          {errors.email && (
            <p className="mt-1 font-body" style={{ fontSize: '12px', color: ERROR_COLOR }}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="booking-field">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                value={fields.area}
                onChange={(e) => update('area', e.target.value)}
                className={selectBase}
                aria-label="Zona del cuerpo"
              >
                {AREAS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={fields.size}
                onChange={(e) => update('size', e.target.value)}
                className={selectBase}
                aria-label="Tamaño aproximado"
              >
                {SIZES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.area && (
            <p className="mt-1 font-body" style={{ fontSize: '12px', color: ERROR_COLOR }}>
              {errors.area}
            </p>
          )}
        </div>

        <div className="booking-field">
          <textarea
            rows={5}
            placeholder="Contame la idea: zona, estilo que te gusta, si tenés referencias de imágenes, si es tu primer tatuaje…"
            value={fields.idea}
            onChange={(e) => update('idea', e.target.value)}
            className={`${inputBase} resize-none`}
            style={{ minHeight: '110px' }}
            aria-label="Contame la idea"
          />
          {errors.idea && (
            <p className="mt-1 font-body" style={{ fontSize: '12px', color: ERROR_COLOR }}>
              {errors.idea}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="booking-field w-full font-body font-medium text-[14px] bg-sage-700 text-cream-50 rounded-pill py-3 hover:bg-sage-900 hover:-translate-y-px transition-all duration-200"
        >
          Enviar propuesta
        </button>
      </form>
    </div>
  )
}

export default BookingForm

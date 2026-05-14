import React, { useLayoutEffect, useRef, useState } from 'react'
import { useBookingForm } from '@/hooks/useBookingForm'
import NHLeafMark from '@/components/shared/NHLeafMark'
import { SectionTitle } from '../shared'
import { gsap, shouldAnimate } from '@/lib/gsap'

const ERROR_COLOR = '#a8503f'

const AREAS = [
  { value: '', label: 'Zona del cuerpo' },
  { value: 'brazo', label: 'Brazo / antebrazo' },
  { value: 'mano', label: 'Mano / muñeca' },
  { value: 'hombro', label: 'Hombro' },
  { value: 'pierna', label: 'Pierna / muslo' },
  { value: 'tobillo', label: 'Tobillo / pie' },
  { value: 'espalda', label: 'Espalda' },
  { value: 'pecho', label: 'Pecho / esternón' },
  { value: 'costilla', label: 'Costilla' },
  { value: 'cuello', label: 'Cuello / nuca' },
  { value: 'otra', label: 'Otra' },
]

const WORK_TYPES = [
  { value: 'lineal', label: 'Lineal' },
  { value: 'sombras', label: 'Con sombras' },
  { value: 'rellenos', label: 'Con rellenos' },
]

const DAYS = [
  { value: 'lun', label: 'Lun' },
  { value: 'mar', label: 'Mar' },
  { value: 'mie', label: 'Mié' },
  { value: 'jue', label: 'Jue' },
  { value: 'vie', label: 'Vie' },
  { value: 'sab', label: 'Sáb' },
]

const TIME_SLOTS = [
  { value: 'manana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noche', label: 'Noche' },
]

const inputBase =
  'w-full font-body text-[14px] text-ink bg-transparent border-0 border-b border-[rgba(44,44,44,0.2)] py-2 outline-none focus:border-sage-700 transition-colors duration-150 placeholder:text-ink-soft'

const selectBase =
  'w-full font-body text-[14px] text-ink bg-cream-50 border-0 border-b border-[rgba(44,44,44,0.2)] py-2 outline-none focus:border-sage-700 transition-colors duration-150 appearance-none cursor-pointer'

const chipBase =
  'rounded-pill px-4 py-2 font-body text-[13px] transition-all duration-150 cursor-pointer select-none'
const chipOff =
  'bg-transparent text-ink-soft border border-sage-500/40 hover:bg-sage-200/40 hover:text-ink'
const chipOn = 'bg-sage-700 text-cream-50 border border-sage-700 hover:bg-sage-900'

const sectionHeader = (num: string, label: string) => (
  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-700 mb-5 flex items-center gap-3">
    <span>{num}</span>
    <span className="h-px flex-1 bg-sage-500/40" />
    <span>{label}</span>
  </p>
)

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1 font-body" style={{ fontSize: '12px', color: ERROR_COLOR }}>
      {msg}
    </p>
  ) : null

const BookingForm: React.FC = () => {
  const {
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
  } = useBookingForm()

  const cardRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card || !shouldAnimate()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.booking-field')
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        }
      )
      if (items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            delay: 0.15,
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
          style={{ fontSize: '15px', maxWidth: '360px' }}
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }

  const openFilePicker = () => fileInputRef.current?.click()
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFilePicker()
    }
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
        Cotizá tu idea
      </p>
      <h3 className="booking-field font-display font-normal mb-1" style={{ fontSize: '26px' }}>
        Formulario de Tatuaje
      </h3>
      <p className="booking-field font-body text-ink-soft mb-8" style={{ fontSize: '13px' }}>
        Sé lo más detallado posible para entender bien tu idea.
      </p>

      <form onSubmit={submit} noValidate className="space-y-10">
        {/* ── 01 — Sobre vos ── */}
        <section>
          <div className="booking-field">{sectionHeader('01', 'Sobre vos')}</div>

          <div className="space-y-5">
            <div className="booking-field" data-field="name">
              <input
                type="text"
                placeholder="Nombre y apellido"
                value={fields.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputBase}
                aria-label="Nombre y apellido"
                autoComplete="name"
              />
              <FieldError msg={errors.name} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="booking-field" data-field="email">
                <input
                  type="email"
                  placeholder="vos@correo.com"
                  value={fields.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputBase}
                  aria-label="Mail"
                  autoComplete="email"
                />
                <FieldError msg={errors.email} />
              </div>

              <div className="booking-field" data-field="instagram">
                <div className="flex items-center border-b border-[rgba(44,44,44,0.2)] focus-within:border-sage-700 transition-colors duration-150">
                  <span className="font-body text-[14px] text-ink-soft pr-1 select-none">@</span>
                  <input
                    type="text"
                    placeholder="tu_usuario (opcional)"
                    value={fields.instagram.replace(/^@/, '')}
                    onChange={(e) => update('instagram', e.target.value.replace(/^@/, ''))}
                    className="w-full font-body text-[14px] text-ink bg-transparent border-0 py-2 outline-none placeholder:text-ink-soft"
                    aria-label="Usuario de Instagram"
                  />
                </div>
                <FieldError msg={errors.instagram} />
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 — Tu idea ── */}
        <section>
          <div className="booking-field">{sectionHeader('02', 'Tu idea')}</div>

          <div className="space-y-6">
            <div className="booking-field" data-field="idea">
              <textarea
                rows={5}
                placeholder="Contame la idea: qué te gustaría tatuar, estilo, qué te inspira, si es tu primer tatuaje…"
                value={fields.idea}
                onChange={(e) => update('idea', e.target.value)}
                className={`${inputBase} resize-none`}
                style={{ minHeight: '110px' }}
                aria-label="Idea del tatuaje"
              />
              <FieldError msg={errors.idea} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="booking-field" data-field="sizeCm">
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    placeholder="Tamaño aprox."
                    value={fields.sizeCm}
                    onChange={(e) => update('sizeCm', e.target.value)}
                    className={`${inputBase} pr-10`}
                    aria-label="Tamaño en centímetros"
                  />
                  <span
                    className="absolute right-0 bottom-2 font-body text-[13px] text-ink-soft pointer-events-none"
                    aria-hidden="true"
                  >
                    cm
                  </span>
                </div>
                <p className="mt-1 font-body text-[11px] text-ink-soft">
                  Aprox, redondeá si no estás segura/o
                </p>
                <FieldError msg={errors.sizeCm} />
              </div>

              <div className="booking-field" data-field="area">
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
                <FieldError msg={errors.area} />
              </div>
            </div>

            <div className="booking-field" data-field="workTypes">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-3">
                Tipo de trabajo
              </p>
              <div className="flex flex-wrap gap-2">
                {WORK_TYPES.map((t) => {
                  const on = fields.workTypes.includes(t.value)
                  return (
                    <button
                      key={t.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleArrayField('workTypes', t.value)}
                      className={`${chipBase} ${on ? chipOn : chipOff}`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
              <FieldError msg={errors.workTypes} />
            </div>

            <div className="booking-field" data-field="references">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-3">
                Imágenes de referencia
              </p>
              <div
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={handleKey}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`rounded-form border border-dashed p-6 text-center cursor-pointer transition-all duration-150 ${
                  dragActive
                    ? 'border-sage-700 bg-sage-200/20'
                    : 'border-sage-500/40 hover:border-sage-700 hover:bg-sage-200/10'
                }`}
                aria-label="Arrastrá imágenes o hacé clic para elegir"
              >
                <div className="flex flex-col items-center gap-2">
                  <NHLeafMark size={28} color="#7a9e7e" />
                  <p className="font-body text-[13px] text-ink">
                    Arrastrá imágenes o <span className="underline">hacé clic</span>
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                    hasta 5 · jpg, png, webp · 5MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 md:grid-cols-5 gap-2">
                  {previews.map((url, i) => (
                    <div
                      key={url}
                      className="relative group aspect-square rounded-md overflow-hidden border border-[rgba(44,44,44,0.08)]"
                    >
                      <img
                        src={url}
                        alt={`Referencia ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Quitar referencia ${i + 1}`}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink/70 text-cream-50 text-[12px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <FieldError msg={errors.references} />
            </div>
          </div>
        </section>

        {/* ── 03 — Cuándo te queda ── */}
        <section>
          <div className="booking-field">{sectionHeader('03', 'Cuándo te queda')}</div>

          <div className="space-y-6">
            <div className="booking-field" data-field="days">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-3">
                Días disponibles
              </p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => {
                  const on = fields.days.includes(d.value)
                  return (
                    <button
                      key={d.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleArrayField('days', d.value)}
                      className={`${chipBase} min-w-[58px] ${on ? chipOn : chipOff}`}
                    >
                      {d.label}
                    </button>
                  )
                })}
              </div>
              <FieldError msg={errors.days} />
            </div>

            <div className="booking-field" data-field="timeSlots">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-3">
                Horarios
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => {
                  const on = fields.timeSlots.includes(t.value)
                  return (
                    <button
                      key={t.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleArrayField('timeSlots', t.value)}
                      className={`${chipBase} ${on ? chipOn : chipOff}`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
              <FieldError msg={errors.timeSlots} />
            </div>

            <div className="booking-field">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-3">
                Notas (opcional)
              </p>
              <textarea
                rows={3}
                placeholder="Alergias, si es tu primera vez, lo que quieras agregar…"
                value={fields.notes}
                onChange={(e) => update('notes', e.target.value)}
                className={`${inputBase} resize-none`}
                style={{ minHeight: '72px' }}
                aria-label="Notas"
              />
            </div>
          </div>
        </section>

        {sendError && (
          <div
            className="booking-field rounded-form px-4 py-3 font-body text-[13px]"
            role="alert"
            style={{
              border: `1px solid ${ERROR_COLOR}33`,
              background: `${ERROR_COLOR}10`,
              color: ERROR_COLOR,
            }}
          >
            {sendError}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="booking-field w-full font-body font-medium text-[14px] bg-sage-700 text-cream-50 rounded-pill py-3 hover:bg-sage-900 hover:-translate-y-px transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-sage-700"
        >
          {sending ? 'Enviando…' : 'Enviar propuesta'}
        </button>
      </form>
    </div>
  )
}

export default BookingForm

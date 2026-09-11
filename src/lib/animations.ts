import { gsap, ScrollTrigger, shouldAnimate } from './gsap'

export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean)
}

type SplitRevealOpts = {
  duration?: number
  stagger?: number
  ease?: string
  delay?: number
  scrollTrigger?: ScrollTrigger.Vars | boolean
}

export function splitReveal(el: HTMLElement, opts: SplitRevealOpts = {}) {
  if (!shouldAnimate()) return () => {}
  const { duration = 0.7, stagger = 0.06, ease = 'power3.out', delay = 0, scrollTrigger } = opts

  const targets = el.querySelectorAll<HTMLElement>('[data-split-word]')
  if (targets.length === 0) return () => {}

  const trigger =
    scrollTrigger === true
      ? { trigger: el, start: 'top 85%', once: true }
      : scrollTrigger || undefined

  // Sin opacity y con immediateRender: false: si el trigger nunca dispara, el
  // texto queda visible en su estado natural en vez de oculto.
  const ctx = gsap.context(() => {
    gsap.fromTo(
      targets,
      { y: 18, filter: 'blur(4px)' },
      {
        y: 0,
        filter: 'blur(0px)',
        duration,
        stagger,
        ease,
        delay,
        ...(trigger ? { scrollTrigger: trigger, immediateRender: false } : {}),
      }
    )
  }, el)

  return () => ctx.revert()
}

type AnimateHeroOpts = {
  delay?: number
  start?: string
}

/**
 * Animación canónica para los heroes de subpages (Tienda, Estudio, Blog, Contacto).
 * Querysea por convención: .hero-eyebrow, [data-split-word], .hero-subtitle, .hero-extra.
 * Mantiene un timing consistente entre páginas.
 */
export function animateHero(container: HTMLElement, opts: AnimateHeroOpts = {}) {
  if (!shouldAnimate()) return () => {}
  const { delay = 0 } = opts

  const eyebrow = container.querySelector('.hero-eyebrow')
  const titleWords = container.querySelectorAll('[data-split-word]')
  const subtitle = container.querySelector('.hero-subtitle')
  const extras = Array.from(container.querySelectorAll<HTMLElement>('.hero-extra'))

  // Pre-set entrance offset synchronously to avoid a jump on first paint.
  // Nunca se toca opacity: el texto debe leerse aunque el timeline no llegue a
  // correr (capturas headless, bots) — la animación es solo desplazamiento + blur.
  if (eyebrow) gsap.set(eyebrow, { y: 8 })
  if (titleWords.length) gsap.set(titleWords, { y: 18, filter: 'blur(4px)' })
  if (subtitle) gsap.set(subtitle, { y: 8 })
  if (extras.length) gsap.set(extras, { y: 12 })

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay })

    if (eyebrow) {
      tl.fromTo(eyebrow, { y: 8 }, { y: 0, duration: 0.4 })
    }
    if (titleWords.length) {
      tl.fromTo(
        titleWords,
        { y: 18, filter: 'blur(4px)' },
        {
          y: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.05,
          ease: 'power3.out',
          onStart: () => {
            titleWords.forEach((w) => ((w as HTMLElement).style.willChange = 'transform, filter'))
          },
          onComplete: () => {
            titleWords.forEach((w) => ((w as HTMLElement).style.willChange = 'auto'))
          },
        },
        '-=0.2'
      )
    }
    if (subtitle) {
      tl.fromTo(subtitle, { y: 8 }, { y: 0, duration: 0.5 }, '-=0.3')
    }
    if (extras.length) {
      tl.fromTo(
        extras,
        { y: 12 },
        { y: 0, duration: 0.45, stagger: 0.08 },
        '-=0.3'
      )
    }
  }, container)

  return () => ctx.revert()
}

type FlyToCartArgs = {
  fromRect: DOMRect
  toRect: DOMRect
  imageSrc: string
  imageAlt?: string
  onComplete?: () => void
}

let motionPathReady: Promise<void> | null = null

// MotionPathPlugin (22 KB) solo lo usa flyToCart: se carga bajo demanda en vez
// de viajar con GSAP en todas las páginas.
export function loadMotionPath(): Promise<void> {
  motionPathReady ??= import('gsap/MotionPathPlugin').then(({ MotionPathPlugin }) => {
    gsap.registerPlugin(MotionPathPlugin)
  })
  return motionPathReady
}

export function flyToCart(args: FlyToCartArgs) {
  if (!shouldAnimate()) {
    args.onComplete?.()
    return
  }
  loadMotionPath()
    .then(() => animateFlyToCart(args))
    .catch(() => args.onComplete?.())
}

function animateFlyToCart({ fromRect, toRect, imageSrc, imageAlt = '', onComplete }: FlyToCartArgs) {
  const clone = document.createElement('img')
  clone.src = imageSrc
  clone.alt = imageAlt
  clone.style.position = 'fixed'
  clone.style.left = `${fromRect.left}px`
  clone.style.top = `${fromRect.top}px`
  clone.style.width = `${fromRect.width}px`
  clone.style.height = `${fromRect.height}px`
  clone.style.objectFit = 'cover'
  clone.style.borderRadius = '8px'
  clone.style.zIndex = '999'
  clone.style.pointerEvents = 'none'
  clone.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'
  clone.setAttribute('aria-hidden', 'true')
  document.body.appendChild(clone)

  const targetX = toRect.left + toRect.width / 2 - fromRect.left - fromRect.width / 2
  const targetY = toRect.top + toRect.height / 2 - fromRect.top - fromRect.height / 2
  const arcHeight = Math.min(180, Math.abs(targetY) * 0.4 + 60)

  gsap.to(clone, {
    duration: 0.85,
    ease: 'power2.inOut',
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: targetX * 0.5, y: targetY * 0.3 - arcHeight },
        { x: targetX, y: targetY },
      ],
      curviness: 1.5,
    },
    scale: 0.18,
    opacity: 0.55,
    rotation: 12,
    onComplete: () => {
      clone.remove()
      onComplete?.()
    },
  })
}

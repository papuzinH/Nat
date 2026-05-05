import { gsap, ScrollTrigger, MotionPathPlugin, shouldAnimate } from './gsap'

type RevealOpts = {
  y?: number
  duration?: number
  stagger?: number
  start?: string
  ease?: string
}

export function revealOnScroll(selector: string, scope: Element, opts: RevealOpts = {}) {
  if (!shouldAnimate()) return () => {}
  const { y = 24, duration = 0.55, stagger = 0.08, start = 'top 88%', ease = 'power2.out' } = opts

  const ctx = gsap.context(() => {
    ScrollTrigger.batch(selector, {
      start,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y },
          { opacity: 1, y: 0, duration, stagger, ease, overwrite: 'auto' }
        ),
    })
  }, scope as any)

  return () => ctx.revert()
}

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

  const ctx = gsap.context(() => {
    gsap.fromTo(
      targets,
      { y: 18, opacity: 0, filter: 'blur(4px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger:
          scrollTrigger === true
            ? { trigger: el, start: 'top 85%', once: true }
            : scrollTrigger || undefined,
      }
    )
  }, el)

  return () => ctx.revert()
}

type ClipRevealOpts = {
  duration?: number
  ease?: string
  stagger?: number
  start?: string
}

export function clipReveal(selector: string, scope: Element, opts: ClipRevealOpts = {}) {
  if (!shouldAnimate()) return () => {}
  const { duration = 0.9, ease = 'power3.out', stagger = 0.12, start = 'top 85%' } = opts

  const ctx = gsap.context(() => {
    ScrollTrigger.batch(selector, {
      start,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.001 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration,
            stagger,
            ease,
            overwrite: 'auto',
          }
        ),
    })
  }, scope as any)

  return () => ctx.revert()
}

export function drawSvgPath(path: SVGPathElement, opts: { duration?: number; delay?: number; ease?: string } = {}) {
  if (!shouldAnimate()) return () => {}
  const { duration = 0.9, delay = 0, ease = 'power2.inOut' } = opts

  const length = path.getTotalLength()
  if (!length) return () => {}

  const ctx = gsap.context(() => {
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease,
      scrollTrigger: { trigger: path, start: 'top 90%', once: true },
    })
  })

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

  const ctx = gsap.context(() => {
    const eyebrow = container.querySelector('.hero-eyebrow')
    const titleWords = container.querySelectorAll('[data-split-word]')
    const subtitle = container.querySelector('.hero-subtitle')
    const extras = gsap.utils.toArray<HTMLElement>('.hero-extra')

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay })

    if (eyebrow) {
      tl.fromTo(eyebrow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 })
    }
    if (titleWords.length) {
      tl.fromTo(
        titleWords,
        { y: 18, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.05,
          ease: 'power3.out',
        },
        '-=0.2'
      )
    }
    if (subtitle) {
      tl.fromTo(subtitle, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    }
    if (extras.length) {
      tl.fromTo(
        extras,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
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

export function flyToCart({ fromRect, toRect, imageSrc, imageAlt = '', onComplete }: FlyToCartArgs) {
  if (!shouldAnimate()) {
    onComplete?.()
    return
  }

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

gsap.registerPlugin(MotionPathPlugin)

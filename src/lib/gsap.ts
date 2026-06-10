import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// Registrar los plugins SOLO en el browser. En Next el módulo se evalúa también
// durante el SSR (sin window), donde ScrollTrigger no puede inicializarse
// (`ScrollTrigger.register` no llama a `enable()` sin `window.document`) y queda
// en un estado a medias que rompe el primer tween con `scrollTrigger` al hidratar.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
}

export { gsap, ScrollTrigger, MotionPathPlugin }

export const shouldAnimate = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

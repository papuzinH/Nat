import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

export { gsap, ScrollTrigger, MotionPathPlugin }

export const shouldAnimate = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

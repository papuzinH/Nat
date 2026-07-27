'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { shouldAnimate } from '@/lib/gsap'

/**
 * Controlador único del movimiento de los motivos botánicos.
 *
 * Los motivos son Server Components sin JS propio: solo marcan `data-nh-motif`.
 * Este componente, montado una vez en el root layout, les enciende las capas:
 *
 *   nh-in    brote — se agrega al entrar en viewport y no se saca nunca (corre una vez)
 *   nh-live  brisa — solo mientras están a la vista, para no animar fuera de pantalla
 *   --nh-py  parallax — deriva vertical de los que tengan `data-nh-drift`
 *
 * Sin este componente los motivos igual se ven: las animaciones están declaradas
 * detrás de esas clases, no en un estado inicial oculto.
 */
export default function BotanicalMotion() {
  const pathname = usePathname()

  useEffect(() => {
    if (!shouldAnimate()) return

    const observed = new WeakSet<Element>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('nh-in', 'nh-live')
          } else {
            // Pausamos la brisa fuera de pantalla. El margen del observer garantiza
            // que el reinicio del ciclo ocurra con el motivo ya invisible.
            entry.target.classList.remove('nh-live')
          }
        }
      },
      { rootMargin: '120px' }
    )

    let drifters: HTMLElement[] = []

    const scan = () => {
      document.querySelectorAll('[data-nh-motif]').forEach((el) => {
        if (observed.has(el)) return
        observed.add(el)
        io.observe(el)
      })
      drifters = Array.from(document.querySelectorAll<HTMLElement>('[data-nh-drift]'))
      onScroll()
    }

    // ── parallax ──
    let queued = false

    const apply = () => {
      queued = false
      const mid = window.innerHeight / 2
      for (const el of drifters) {
        const rect = el.getBoundingClientRect()
        const depth = Number(el.dataset.nhDrift) || 0.05
        el.style.setProperty('--nh-py', `${((rect.top + rect.height / 2 - mid) * depth).toFixed(1)}px`)
      }
    }

    function onScroll() {
      if (queued || drifters.length === 0) return
      queued = true
      requestAnimationFrame(apply)
    }

    scan()

    // Los motivos que aparecen después del primer render (success de un formulario,
    // resultados de un filtro, slides del carrusel) también entran al sistema.
    // El rescan va detrás de un rAF para no correr una vez por mutación.
    let rescan = 0
    const mo = new MutationObserver(() => {
      if (rescan) return
      rescan = requestAnimationFrame(() => {
        rescan = 0
        scan()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      if (rescan) cancelAnimationFrame(rescan)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  return null
}

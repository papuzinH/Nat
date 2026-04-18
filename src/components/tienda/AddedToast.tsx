import React, { useLayoutEffect, useRef } from 'react'
import { gsap, shouldAnimate } from '@/lib/gsap'

interface AddedToastProps {
  visible: boolean
  productTitle: string
  onDismiss: () => void
}

const AddedToast: React.FC<AddedToastProps> = ({ visible, productTitle, onDismiss }) => {
  const toastRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!toastRef.current) return

    if (visible) {
      const ctx = gsap.context(() => {
        if (shouldAnimate()) {
          gsap.fromTo(
            toastRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          )
        } else {
          gsap.set(toastRef.current, { y: 0, opacity: 1 })
        }
      })

      const timer = setTimeout(() => {
        if (toastRef.current) {
          if (shouldAnimate()) {
            gsap.to(toastRef.current, {
              y: 40,
              opacity: 0,
              duration: 0.25,
              onComplete: onDismiss,
            })
          } else {
            onDismiss()
          }
        }
      }, 2200)

      return () => {
        ctx.revert()
        clearTimeout(timer)
      }
    } else {
      gsap.set(toastRef.current, { y: 40, opacity: 0 })
    }
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      ref={toastRef}
      className="fixed z-50 font-mono text-[12px] text-cream-50 bg-ink px-5 py-3 rounded-pill"
      style={{
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
      role="status"
      aria-live="polite"
    >
      {productTitle} · agregado
    </div>
  )
}

export default AddedToast

import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatARS } from '@/data/products'
import { gsap, shouldAnimate } from '@/lib/gsap'
import CartItemRow from './CartItemRow'

const CartDrawer: React.FC = () => {
  const { items, isOpen, itemCount, subtotal, removeItem, updateQty, closeCart } = useCart()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsContainerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return

    if (!shouldAnimate()) {
      gsap.set(overlay, { autoAlpha: isOpen ? 1 : 0 })
      gsap.set(panel, { x: isOpen ? 0 : '100%' })
      return
    }

    const ctx = gsap.context(() => {
      if (isOpen) {
        const itemRows = itemsContainerRef.current?.querySelectorAll('.cart-item-row') ?? []
        const tl = gsap.timeline()
        tl.to(overlay, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
          .fromTo(
            panel,
            { x: '100%' },
            { x: 0, duration: 0.45, ease: 'power3.out' },
            '<'
          )
        if (itemRows.length) {
          tl.fromTo(
            itemRows,
            { opacity: 0, x: 16 },
            { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' },
            '-=0.2'
          )
        }
        if (footerRef.current) {
          tl.fromTo(
            footerRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
            '-=0.15'
          )
        }
      } else {
        gsap.to(panel, { x: '100%', duration: 0.3, ease: 'power3.in' })
        gsap.to(overlay, { autoAlpha: 0, duration: 0.25, ease: 'power2.in', delay: 0.05 })
      }
    })

    return () => ctx.revert()
  }, [isOpen, items.length])

  return (
    <>
      <div
        ref={overlayRef}
        onClick={closeCart}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 60,
          opacity: 0,
          visibility: 'hidden',
        }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: 420,
          background: 'var(--cream-50, #fdfcfb)',
          zIndex: 61,
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateX(100%)',
          boxShadow: '-4px 0 24px rgba(44,44,44,0.08)',
          willChange: 'transform',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-display text-[18px] text-ink font-normal">Carrito</h2>
            {itemCount > 0 && (
              <span
                className="font-mono text-[11px] text-cream-50 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--sage-700, #4a7c59)',
                  width: 20,
                  height: 20,
                  lineHeight: 1,
                }}
              >
                {itemCount}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 rounded-full hover:bg-cream-200 transition-colors text-ink-soft hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ opacity: 0.25 }}>
              <path
                d="M3 6h14l-1.5 9H4.5L3 6z M7 6V4.5a3 3 0 016 0V6"
                stroke="var(--ink)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-body text-[14px] text-ink-soft text-center">Tu carrito está vacío.</p>
            <Link
              to="/tienda"
              onClick={closeCart}
              className="font-body text-[13px] font-semibold text-sage-700 hover:text-sage-900 underline underline-offset-2 transition-colors"
            >
              Ver la tienda →
            </Link>
          </div>
        ) : (
          <>
            <div ref={itemsContainerRef} className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div
              ref={footerRef}
              className="flex-shrink-0 px-6 py-5"
              style={{ borderTop: '1px solid var(--line-soft)' }}
            >
              <div className="flex justify-between items-baseline mb-5">
                <span className="font-body text-[14px] text-ink-soft">Total estimado</span>
                <span className="font-display text-[22px] text-sage-900">{formatARS(subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
                style={{ textDecoration: 'none' }}
              >
                Proceder al pago
              </Link>
              <p className="font-mono text-[10px] text-ink-soft text-center mt-3 uppercase tracking-[0.1em]">
                Envíos a todo el país · 3–6 días hábiles
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer

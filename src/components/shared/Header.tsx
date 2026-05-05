import React, { useState, useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap, shouldAnimate } from '@/lib/gsap'
import NHLogo from './NHLogo'
import { useCart } from '@/context/CartContext'

const navigationItems = [
  { path: '/tienda', label: 'Tienda' },
  { path: '/estudio', label: 'El Estudio' },
  { path: '/blog', label: 'Blog' },
  { path: '/contacto', label: 'Contacto' },
]

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { itemCount, openCart } = useCart()
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const bar1Ref = useRef<SVGLineElement>(null)
  const bar2Ref = useRef<SVGLineElement>(null)
  const bar3Ref = useRef<SVGLineElement>(null)
  const gsapCtxRef = useRef<{ revert: () => void } | null>(null)
  const badgeDesktopRef = useRef<HTMLSpanElement>(null)
  const badgeMobileRef = useRef<HTMLSpanElement>(null)
  const prevCountRef = useRef(itemCount)

  const isActive = (path: string) => location.pathname === path

  // Close menu on route change
  const handleNavClick = () => setIsMenuOpen(false)

  // Badge bump al sumar items
  useLayoutEffect(() => {
    const prev = prevCountRef.current
    prevCountRef.current = itemCount
    if (itemCount <= prev || !shouldAnimate()) return

    const targets = [badgeDesktopRef.current, badgeMobileRef.current].filter(
      (el): el is HTMLSpanElement => Boolean(el)
    )
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      targets.forEach((badge) => {
        const isFirst = prev === 0
        if (isFirst) {
          gsap.fromTo(
            badge,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)' }
          )
        } else {
          gsap.fromTo(
            badge,
            { scale: 0.6 },
            { scale: 1, duration: 0.45, ease: 'back.out(2.4)' }
          )
        }
      })
    })
    return () => ctx.revert()
  }, [itemCount])

  useLayoutEffect(() => {
    const panel = menuPanelRef.current
    const b1 = bar1Ref.current
    const b2 = bar2Ref.current
    const b3 = bar3Ref.current
    if (!panel || !b1 || !b2 || !b3) return

    // Cleanup previous context
    if (gsapCtxRef.current) gsapCtxRef.current.revert()

    gsapCtxRef.current = gsap.context(() => {
      if (!shouldAnimate()) {
        // No animation — just set final state
        gsap.set(panel, { height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 })
        if (isMenuOpen) {
          gsap.set(b1, { rotation: 45, y: 8, transformOrigin: '50% 50%' })
          gsap.set(b2, { opacity: 0 })
          gsap.set(b3, { rotation: -45, y: -8, transformOrigin: '50% 50%' })
        } else {
          gsap.set(b1, { rotation: 0, y: 0 })
          gsap.set(b2, { opacity: 1 })
          gsap.set(b3, { rotation: 0, y: 0 })
        }
        return
      }

      if (isMenuOpen) {
        // Open
        gsap.fromTo(panel,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
        gsap.to(b1, { rotation: 45, y: 8, duration: 0.25, ease: 'power2.inOut', transformOrigin: '50% 50%' })
        gsap.to(b2, { opacity: 0, duration: 0.15 })
        gsap.to(b3, { rotation: -45, y: -8, duration: 0.25, ease: 'power2.inOut', transformOrigin: '50% 50%' })
      } else {
        // Close
        gsap.to(panel,
          { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' }
        )
        gsap.to(b1, { rotation: 0, y: 0, duration: 0.25, ease: 'power2.inOut', transformOrigin: '50% 50%' })
        gsap.to(b2, { opacity: 1, duration: 0.15, delay: 0.1 })
        gsap.to(b3, { rotation: 0, y: 0, duration: 0.25, ease: 'power2.inOut', transformOrigin: '50% 50%' })
      }
    })

    return () => {
      if (gsapCtxRef.current) gsapCtxRef.current.revert()
    }
  }, [isMenuOpen])

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(250, 246, 240, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line-soft)',
      }}
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-10 py-[22px]">
        <NHLogo size={36} />

        <nav role="navigation" aria-label="Navegación principal" className="flex items-center gap-9">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="font-body text-sm font-medium pb-1 transition-all duration-200"
              style={{
                color: isActive(item.path) ? 'var(--sage-900, #2f4a37)' : 'var(--ink, #2c2c2c)',
                borderBottom: isActive(item.path)
                  ? '1px solid var(--sage-700, #4a7c59)'
                  : '1px solid transparent',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            data-cart-icon
            className="relative inline-flex items-center gap-2 font-body text-[13px] font-semibold rounded-pill border px-4 py-[10px] transition-all duration-[220ms] hover:bg-ink hover:text-cream-50"
            style={{
              background: 'transparent',
              color: 'var(--ink, #2c2c2c)',
              border: '1px solid var(--line, rgba(44,44,44,0.12))',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 6h14l-1.5 9H4.5L3 6z M7 6V4.5a3 3 0 016 0V6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            Carrito
            {itemCount > 0 && (
              <span
                ref={badgeDesktopRef}
                className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-cream-50 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--sage-700, #4a7c59)',
                  width: 18,
                  height: 18,
                  lineHeight: 1,
                }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-[18px] py-[14px]">
        <NHLogo size={28} onClick={handleNavClick} />

        <div className="flex items-center gap-1">
          {/* Cart icon mobile */}
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            data-cart-icon
            className="relative p-2 rounded-full transition-colors hover:bg-cream-200"
            style={{ color: 'var(--ink, #2c2c2c)' }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 6h14l-1.5 9H4.5L3 6z M7 6V4.5a3 3 0 016 0V6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {itemCount > 0 && (
              <span
                ref={badgeMobileRef}
                className="absolute top-0.5 right-0.5 font-mono text-[9px] text-cream-50 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--sage-700, #4a7c59)',
                  width: 15,
                  height: 15,
                  lineHeight: 1,
                }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            className="p-2 rounded-full transition-colors hover:bg-cream-200"
            style={{ color: 'var(--ink, #2c2c2c)' }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <line ref={bar1Ref} x1="0" y1="2" x2="22" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line ref={bar2Ref} x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line ref={bar3Ref} x1="0" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel — drops below header */}
      <div
        ref={menuPanelRef}
        className="md:hidden overflow-hidden"
        style={{ height: 0, opacity: 0 }}
        aria-hidden={!isMenuOpen}
      >
        <nav
          role="navigation"
          aria-label="Navegación principal"
          style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--cream-100, #faf6f0)' }}
          className="px-6 py-6 flex flex-col gap-6"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className="font-display text-[24px] font-normal"
              style={{
                color: isActive(item.path) ? 'var(--sage-900, #2f4a37)' : 'var(--ink, #2c2c2c)',
                textDecoration: 'none',
                fontStyle: isActive(item.path) ? 'italic' : 'normal',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { gsap, shouldAnimate } from '@/lib/gsap'
import { pb } from '@/lib/pocketbase'

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard', end: true },
  { to: '/admin/ordenes',   label: 'Órdenes' },
  { to: '/admin/stock',     label: 'Stock' },
  { to: '/admin/envios',    label: 'Envíos' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/blog',      label: 'Blog' },
]

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/admin/login', { replace: true })
    } else {
      setChecking(false)
    }
  }, [navigate])

  // Cierra el menú al navegar
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Animación panel mobile
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (!shouldAnimate()) {
      gsap.set(panel, { height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 })
      return
    }
    const ctx = gsap.context(() => {
      if (menuOpen) {
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.25, ease: 'power2.out' })
      } else {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' })
      }
    })
    return () => ctx.revert()
  }, [menuOpen])

  const handleLogout = () => {
    pb.authStore.clear()
    navigate('/admin/login', { replace: true })
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Verificando sesión…</span>
      </div>
    )
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-[11px] uppercase tracking-[0.12em] transition-colors whitespace-nowrap pb-1 border-b-2 ${
      isActive
        ? 'text-sage-700 border-sage-700'
        : 'text-ink-soft border-transparent hover:text-ink hover:border-ink/20'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-[12px] uppercase tracking-[0.12em] py-3 px-2 rounded-sm transition-colors block ${
      isActive ? 'text-sage-700 bg-cream-100' : 'text-ink hover:bg-cream-100'
    }`

  const adminEmail = (pb.authStore.record?.email as string | undefined) ?? null

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <header
        className="flex-shrink-0"
        style={{ borderBottom: '1px solid var(--line-soft)' }}
      >
        <div className="flex items-center justify-between gap-3 px-4 md:px-10 py-4">
          {/* Logo + hamburger */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center -ml-2 text-ink"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen ? (
                  <>
                    <line x1="5" y1="5" x2="17" y2="17" strokeLinecap="round" />
                    <line x1="17" y1="5" x2="5" y2="17" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="19" y2="7" strokeLinecap="round" />
                    <line x1="3" y1="11" x2="19" y2="11" strokeLinecap="round" />
                    <line x1="3" y1="15" x2="19" y2="15" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
            <span className="font-display text-[15px] text-ink truncate">NatArt · Admin</span>
          </div>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Acciones derecha */}
          <div className="flex items-center gap-3 md:gap-5">
            {adminEmail && (
              <span
                className="hidden lg:inline font-mono text-[10px] text-ink-soft truncate max-w-[180px]"
                title={adminEmail}
              >
                {adminEmail}
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft hover:text-ink transition-colors"
            >
              ↗ Ver sitio
            </a>
            <button
              onClick={handleLogout}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft hover:text-ink transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Panel nav mobile */}
        <div
          ref={panelRef}
          className="md:hidden overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <nav className="flex flex-col gap-1 px-4 pb-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={mobileLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] uppercase tracking-[0.12em] py-3 px-2 rounded-sm text-ink-soft hover:bg-cream-100 mt-2"
              style={{ borderTop: '1px solid var(--line-soft)' }}
            >
              ↗ Ver sitio
            </a>
            {adminEmail && (
              <span className="font-mono text-[10px] text-ink-soft px-2 pt-2">{adminEmail}</span>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-10 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

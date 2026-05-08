import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login', { replace: true })
      else setChecking(false)
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  if (checking) return null

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
      isActive ? 'text-sage-700' : 'text-ink-soft hover:text-ink'
    }`

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Header admin */}
      <header
        className="flex items-center justify-between px-6 md:px-10 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--line-soft)' }}
      >
        <div className="flex items-center gap-8">
          <span className="font-display text-[15px] text-ink">NatArt · Admin</span>
          <nav className="flex items-center gap-6">
            <NavLink to="/admin" end className={navLinkClass}>
              Órdenes
            </NavLink>
            <NavLink to="/admin/stock" className={navLinkClass}>
              Stock
            </NavLink>
            <NavLink to="/admin/envios" className={navLinkClass}>
              Envíos
            </NavLink>
            <NavLink to="/admin/productos" className={navLinkClass}>
              Productos
            </NavLink>
            <NavLink to="/admin/blog" className={navLinkClass}>
              Blog
            </NavLink>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft hover:text-ink transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="flex-1 px-6 md:px-10 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

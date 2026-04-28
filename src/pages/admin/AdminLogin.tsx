import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true })
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError('Email o contraseña incorrectos.')
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-8 text-center">
          Panel de administración
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-body text-[14px] text-ink bg-transparent border-b py-2 outline-none focus:border-sage-700 transition-colors"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-body text-[14px] text-ink bg-transparent border-b py-2 outline-none focus:border-sage-700 transition-colors"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>

          {error && (
            <p className="font-body text-[13px] text-center" style={{ color: '#a8503f' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[13px] rounded-pill transition-all duration-[220ms] disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin

import React from 'react'
import { Link } from 'react-router-dom'
import NHLogo from './NHLogo'

const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      style={{
        background: 'var(--cream-200, #f5efe6)',
        borderTop: '1px solid var(--line-soft)',
      }}
    >
      <div className="px-[22px] pt-10 pb-7 md:px-12 md:pt-16 md:pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-7 md:gap-10 mb-12 md:mb-16">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <NHLogo size={32} />
            <p
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: 20,
                fontStyle: 'italic',
                color: 'var(--ink-soft, #5a5350)',
                lineHeight: 1.4,
                maxWidth: 320,
              }}
            >
              Arte y tatuaje sensible, desde el huerto del estudio en Buenos Aires.
            </p>
          </div>

          {/* Col 2 — Navegar */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-1">
              Navegar
            </p>
            <nav aria-label="Navegación footer">
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {[
                  { to: '/tienda', label: 'Tienda' },
                  { to: '/estudio', label: 'El Estudio' },
                  { to: '/blog', label: 'Blog' },
                  { to: '/contacto', label: 'Contacto' },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="font-body text-[15px] transition-colors duration-200 hover:text-sage-700"
                      style={{ color: 'var(--ink, #2c2c2c)', textDecoration: 'none' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Contacto */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-1">
              Contacto
            </p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li>
                <a
                  href="https://instagram.com/nat.tatt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[15px] transition-colors duration-200 hover:text-sage-700"
                  style={{ color: 'var(--ink, #2c2c2c)', textDecoration: 'none' }}
                  aria-label="Instagram @nat.tatt"
                >
                  @nat.tatt
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/artexnat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[15px] transition-colors duration-200 hover:text-sage-700"
                  style={{ color: 'var(--ink, #2c2c2c)', textDecoration: 'none' }}
                  aria-label="Instagram @artexnat"
                >
                  @artexnat
                </a>
              </li>
              <li>
                <a
                  href="mailto:agendanattatt@gmail.com"
                  className="font-body text-[15px] transition-colors duration-200 hover:text-sage-700"
                  style={{ color: 'var(--ink, #2c2c2c)', textDecoration: 'none' }}
                >
                  agendanattatt@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5491132722555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[15px] transition-colors duration-200 hover:text-sage-700"
                  style={{ color: 'var(--ink, #2c2c2c)', textDecoration: 'none' }}
                  aria-label="WhatsApp +54 9 11 3272-2555"
                >
                  +54 9 11 3272-2555
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Estudio */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-1">
              Estudio
            </p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <a
                  href="https://maps.app.goo.gl/j68uUh5BDTiYM8vL8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[15px] transition-colors duration-200 hover:text-sage-700"
                  style={{ color: 'var(--ink, #2c2c2c)', textDecoration: 'none' }}
                  aria-label="Ver ubicación en Google Maps"
                >
                  Parque Chacabuco · Buenos Aires, AR
                </a>
              </li>
              <li className="font-body text-[15px] text-sage-700">
                Con turno previo
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between gap-2 pt-6"
          style={{ borderTop: '1px solid var(--line-soft)' }}
        >
          <p className="font-mono text-[12px] text-ink-soft">
            © 2026 · Natalia Heller · Hecho con paciencia
          </p>
          <p className="font-mono text-[12px] text-ink-soft">
            Envíos a todo el país · Retiro en CABA
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

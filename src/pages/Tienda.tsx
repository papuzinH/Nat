import React from 'react'
import { useEffect } from 'react'
import SchemaMarkup from '@/components/shared/SchemaMarkup'

const tiendaSchema = {
  name: 'Tienda de Arte — Natalia Heller',
  description: 'Tienda de arte original: prints, stickers, abanicos, cerámica y más. Arte de Natalia Heller, Buenos Aires. Envíos a todo el país.',
  url: 'https://tatuajesnaty.com/tienda',
}

const Tienda: React.FC = () => {
  useEffect(() => {
    document.title = 'Tienda de Arte — Natalia Heller | Prints, Stickers y más'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Comprá prints originales, stickers, abanicos y hojas para colorear. Arte de Natalia Heller, Buenos Aires. Envíos a todo el país.')
    }
    return () => {
      document.title = 'Natalia Heller — Arte Original & Tienda | Buenos Aires'
    }
  }, [])

  return (
    <>
      <SchemaMarkup type="CollectionPage" data={tiendaSchema} />
      <main className="min-h-screen py-24 px-6 md:px-12">
        <header className="max-w-5xl mx-auto mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-4">
            Tienda
          </p>
          <h1 className="font-display text-[72px] leading-[1.02] tracking-[-0.02em] text-ink">
            Obra disponible
          </h1>
        </header>

        <section className="max-w-5xl mx-auto text-center py-20">
          <div className="inline-block border border-[var(--line)] rounded-card p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-6">
              En preparación
            </p>
            <h2 className="font-display text-3xl text-ink mb-4">
              Catálogo en construcción
            </h2>
            <p className="font-body text-ink-soft text-[16px] leading-relaxed max-w-md mx-auto">
              Pronto vas a poder explorar y comprar obra original, prints, cerámica, stickers y más.<br />
              Envíos a todo el país.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default Tienda

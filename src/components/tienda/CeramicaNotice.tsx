import React from 'react'
import NHBud from '@/components/shared/NHBud'

// Slug de la categoría en PocketBase (product_categories).
export const CERAMICA_SLUG = 'ceramica'

interface CeramicaNoticeProps {
  className?: string
}

/**
 * Aviso de tiempos de producción de la cerámica. Se muestra en /tienda con el
 * filtro Cerámica activo y en el detalle de cada pieza de esa categoría.
 */
const CeramicaNotice: React.FC<CeramicaNoticeProps> = ({ className = '' }) => (
  <aside
    aria-label="Sobre las piezas de cerámica"
    className={`flex gap-4 rounded-card bg-cream-100 px-5 py-5 md:px-6 ${className}`}
    style={{ border: '1px solid var(--line)' }}
  >
    <NHBud size={16} color="var(--sage-500)" className="mt-[2px]" />
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-2">
        Cerámica hecha a pedido
      </p>
      <p className="font-body text-[14px] leading-[1.65] text-ink-soft">
        Las piezas hechas en cerámica se hacen a pedido una a una manualmente y eso requiere un
        tiempo de producción estimado de 20 a 30 días, considerando el modelado, emprolijado,
        secado, esmaltado y horneado de la pieza. Cada pieza es única, por lo que puede tener
        pequeñas variaciones respecto a la referencia original. No dudes en consultar si tenés
        alguna duda respecto al proceso, al esmaltado o al envío de la pieza.
      </p>
    </div>
  </aside>
)

export default CeramicaNotice

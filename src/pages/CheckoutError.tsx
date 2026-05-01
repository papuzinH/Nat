import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const CheckoutError: React.FC = () => {
  const [params] = useSearchParams()
  const orderId  = params.get('order')
  const shortId  = orderId ? orderId.slice(0, 8).toUpperCase() : null

  return (
    <>
      <Helmet><title>Pago no completado · Natalia Heller</title></Helmet>
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          {shortId && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-3">
              Pedido · {shortId}
            </p>
          )}
          <h1 className="font-display text-[32px] font-normal text-ink mb-4">
            El pago no se completó
          </h1>
          <p className="font-body text-[15px] text-ink-soft leading-relaxed mb-8">
            Tu pedido fue cancelado y el stock liberado. Podés intentarlo de nuevo o elegir transferencia bancaria.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/tienda"
              className="bg-sage-700 hover:bg-sage-900 text-cream-50 font-body font-semibold text-[14px] py-[14px] px-[22px] rounded-pill transition-all duration-[220ms] hover:-translate-y-px"
            >
              Volver a la tienda
            </Link>
            <Link
              to="/contacto"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink transition-colors"
            >
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutError

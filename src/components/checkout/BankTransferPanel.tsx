'use client'

import React, { useState } from 'react'
import { formatARS } from '@/data/products'
import { BANK_DETAILS, buildWhatsappProofUrl } from '@/lib/bankDetails'
import CopyButton from './CopyButton'
import PaymentProofUploader from './PaymentProofUploader'
import WhatsappButton from './WhatsappButton'

interface BankTransferPanelProps {
  orderId: string
  /** Token que autoriza subir el comprobante (del link del email / vuelta del checkout). */
  uploadToken: string
  shortId: string
  total: number
  /** true si la orden ya tiene comprobante cargado al entrar. */
  initialReceived: boolean
}

/** Indica si un valor de BANK_DETAILS está completo (no es un placeholder TODO). */
function isFilled(value: string): boolean {
  return !value.startsWith('TODO')
}

/**
 * Panel de la Thank You Page para pago por transferencia: datos bancarios con
 * copiar al portapapeles, carga de comprobante (web) y WhatsApp (salvavidas).
 * Mobile-first: la prioridad es alternar con la app del banco.
 */
const BankTransferPanel: React.FC<BankTransferPanelProps> = ({ orderId, uploadToken, shortId, total, initialReceived }) => {
  const [received, setReceived] = useState(initialReceived)

  const rows: { label: string; value: string; copy?: string }[] = [
    { label: 'Banco', value: BANK_DETAILS.banco },
    { label: 'Tipo de cuenta', value: BANK_DETAILS.tipoCuenta },
    { label: 'CBU', value: BANK_DETAILS.cbu, copy: BANK_DETAILS.cbu },
    { label: 'Alias', value: BANK_DETAILS.alias, copy: BANK_DETAILS.alias },
    { label: 'Titular', value: BANK_DETAILS.titular },
  ].filter((r) => isFilled(r.value))

  return (
    <div className="flex flex-col gap-5">
      {/* Datos bancarios */}
      <div className="rounded-sm p-5 sm:p-6" style={{ border: '1px solid var(--line-soft)', background: 'var(--cream-200, #f5efe6)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-4">Datos para transferir</p>

        <div className="flex flex-col">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid var(--line-soft)' }}>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{r.label}</p>
                <p className="font-body text-[14px] text-ink font-semibold break-all">{r.value}</p>
              </div>
              {r.copy && <CopyButton value={r.copy} label={`Copiar ${r.label}`} />}
            </div>
          ))}

          {/* Monto exacto — destacado */}
          <div className="flex items-center justify-between gap-3 pt-3.5">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">Monto exacto</p>
              <p className="font-display text-[22px] text-sage-900 leading-tight">{formatARS(total)}</p>
            </div>
            <CopyButton value={String(total)} label="Copiar monto" />
          </div>
        </div>
      </div>

      {/* Comprobante */}
      <div className="rounded-sm p-5 sm:p-6" style={{ border: '1px solid var(--line-soft)' }}>
        {received ? (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sage-200, #c8dcd0)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sage-700, #4a7c59)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="font-body text-[15px] text-ink font-semibold">Comprobante recibido, procesando tu pago</p>
              <p className="font-body text-[13px] text-ink-soft leading-relaxed mt-1">
                Lo estamos verificando. Apenas acreditemos el pago, te confirmamos el pedido por mail.
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-1">Enviá tu comprobante</p>
            <p className="font-body text-[13px] text-ink-soft leading-relaxed mb-4">
              Subí la captura o el PDF de la transferencia y nos encargamos del resto.
            </p>
            <PaymentProofUploader orderId={orderId} uploadToken={uploadToken} onUploaded={() => setReceived(true)} />
          </>
        )}

        {/* WhatsApp — salvavidas, siempre disponible */}
        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--line-soft)' }}>
          <p className="font-body text-[13px] text-ink-soft text-center mb-3">
            {received ? '¿Querés enviarnos algo más?' : '¿Preferís mandarlo por WhatsApp?'}
          </p>
          <WhatsappButton href={buildWhatsappProofUrl(shortId)}>Enviar por WhatsApp</WhatsappButton>
        </div>
      </div>
    </div>
  )
}

export default BankTransferPanel

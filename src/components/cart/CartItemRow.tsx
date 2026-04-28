import React from 'react'
import { formatARS } from '@/data/products'
import type { CartItem } from '@/context/CartContext'
import { TONE_COLORS } from '@/data/products'

interface CartItemRowProps {
  item: CartItem
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQty, onRemove }) => {
  const rowTotal = item.unitPrice * item.quantity

  return (
    <div
      className="flex gap-3 py-4"
      style={{ borderBottom: '1px solid var(--line-soft)' }}
    >
      {/* Imagen / placeholder */}
      <div
        className="flex-shrink-0 rounded-md overflow-hidden"
        style={{
          width: 64,
          height: 64,
          background: TONE_COLORS['a'],
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Info + controles */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-[13px] font-semibold text-ink truncate">{item.title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-0.5">
          {item.catLabel}
          {item.selectedSize ? ` · ${item.selectedSize}` : ''}
          {item.hasFrame ? ' · con marco' : ''}
        </p>
        <p className="font-body text-[12px] text-ink-soft mt-0.5">{formatARS(item.unitPrice)} c/u</p>

        <div className="flex items-center justify-between mt-2">
          {/* Cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              aria-label="Reducir cantidad"
              className="w-7 h-7 rounded-full border flex items-center justify-center text-ink-soft hover:border-sage-500 hover:text-ink transition-colors"
              style={{ border: '1px solid var(--line)' }}
            >
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none" aria-hidden="true">
                <line x1="0" y1="1" x2="10" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <span className="font-mono text-[13px] w-4 text-center text-ink">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              aria-label="Aumentar cantidad"
              className="w-7 h-7 rounded-full border flex items-center justify-center text-ink-soft hover:border-sage-500 hover:text-ink transition-colors"
              style={{ border: '1px solid var(--line)' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Subtotal + eliminar */}
          <div className="flex items-center gap-3">
            <span className="font-body text-[13px] font-semibold text-sage-900">{formatARS(rowTotal)}</span>
            <button
              onClick={() => onRemove(item.id)}
              aria-label={`Eliminar ${item.title}`}
              className="text-ink-soft hover:text-ink transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItemRow

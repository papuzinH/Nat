'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, shouldAnimate } from '@/lib/gsap'
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
  const rootRef = useRef<HTMLDivElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const prevTotalRef = useRef(rowTotal)

  useLayoutEffect(() => {
    const total = totalRef.current
    if (!total || !shouldAnimate()) {
      prevTotalRef.current = rowTotal
      return
    }
    if (prevTotalRef.current === rowTotal) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        total,
        { scale: 1.12 },
        { scale: 1, duration: 0.3, ease: 'power2.out' }
      )
    })
    prevTotalRef.current = rowTotal
    return () => ctx.revert()
  }, [rowTotal])

  function handleRemove() {
    const root = rootRef.current
    if (!root || !shouldAnimate()) {
      onRemove(item.id)
      return
    }
    gsap.to(root, {
      x: 30,
      opacity: 0,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => onRemove(item.id),
    })
  }

  return (
    <div
      ref={rootRef}
      className="cart-item-row flex gap-3 py-4"
      style={{ borderBottom: '1px solid var(--line-soft)', willChange: 'transform, opacity' }}
    >
      <div
        className="relative flex-shrink-0 rounded-md overflow-hidden"
        style={{ width: 64, height: 64, background: TONE_COLORS['a'] }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-body text-[13px] font-semibold text-ink truncate">{item.title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-0.5">
          {item.catLabel}
          {item.selectedSize ? ` · ${item.selectedSize}` : ''}
          {item.hasFrame ? ' · con marco' : ''}
        </p>
        <p className="font-body text-[12px] text-ink-soft mt-0.5">{formatARS(item.unitPrice)} c/u</p>

        <div className="flex items-center justify-between mt-2">
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

          <div className="flex items-center gap-3">
            <span
              ref={totalRef}
              className="font-body text-[13px] font-semibold text-sage-900 inline-block"
              style={{ transformOrigin: 'right center' }}
            >
              {formatARS(rowTotal)}
            </span>
            <button
              onClick={handleRemove}
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

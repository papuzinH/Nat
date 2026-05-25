import React from 'react'

export type StatusTone =
  | 'pending'
  | 'paid'
  | 'prep'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'draft'
  | 'published'
  | 'warning'
  | 'danger'

const TONE_CLASSES: Record<StatusTone, string> = {
  pending:   'bg-status-pendingBg text-status-pendingFg',
  paid:      'bg-status-paidBg text-status-paidFg',
  prep:      'bg-status-prepBg text-status-prepFg',
  shipped:   'bg-status-shippedBg text-status-shippedFg',
  delivered: 'bg-status-deliveredBg text-status-deliveredFg',
  cancelled: 'bg-status-cancelledBg text-status-cancelledFg',
  draft:     'bg-status-draftBg text-status-draftFg',
  published: 'bg-status-publishedBg text-status-publishedFg',
  warning:   'bg-status-warningBg text-status-warningFg',
  danger:    'bg-status-dangerBg text-status-dangerFg',
}

interface StatusBadgeProps {
  tone: StatusTone
  children: React.ReactNode
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ tone, children, className = '' }) => (
  <span
    className={`inline-flex items-center font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-pill flex-shrink-0 ${TONE_CLASSES[tone]} ${className}`}
  >
    {children}
  </span>
)

export const ORDER_STATUS_TONE: Record<string, StatusTone> = {
  pendiente:        'pending',
  pagado:           'paid',
  'en-preparacion': 'prep',
  enviado:          'shipped',
  entregado:        'delivered',
  cancelado:        'cancelled',
}

export default StatusBadge

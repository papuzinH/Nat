import type { StatusTone } from '@/components/admin/shared/StatusBadge'

/**
 * Modelo de dominio de los estados de una orden.
 *
 * Centraliza labels, tonos, el flujo guiado (acción principal + secundarias) y
 * la segmentación del panel `/admin/ordenes`. Antes esto vivía disperso entre
 * AdminOrders (STATUS_OPTIONS) y StatusBadge (ORDER_STATUS_TONE).
 *
 * Ciclo de vida:
 *   Mercado Pago:  pendiente ──(webhook)──▶ pagado | cancelado
 *   Transferencia: pendiente_de_pago ──▶ comprobante_recibido ──▶ pagado
 *   Fulfillment:   pagado ──▶ en-preparacion ──▶ enviado ──▶ entregado
 *   cancelado = terminal
 */

export type OrderStatus =
  | 'pendiente'
  | 'pendiente_de_pago'
  | 'comprobante_recibido'
  | 'pagado'
  | 'en-preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

export type PaymentMethod = 'mercadopago' | 'transferencia'

interface StatusMeta {
  label: string
  tone: StatusTone
}

/**
 * Label + tono por estado. Los dos estados de espera se distinguen a propósito:
 * `pendiente` (MP en vuelo, tono beige) vs `pendiente_de_pago` (esperando
 * transferencia, tono lila) para que no se confundan de un vistazo.
 */
export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  pendiente:            { label: 'Esperando pago (MP)',  tone: 'pending'   },
  pendiente_de_pago:    { label: 'Esperando transferencia', tone: 'awaiting' },
  comprobante_recibido: { label: 'Comprobante recibido', tone: 'warning'   },
  pagado:               { label: 'Pagado',               tone: 'paid'      },
  'en-preparacion':     { label: 'En preparación',       tone: 'prep'      },
  enviado:              { label: 'Enviado',              tone: 'shipped'   },
  entregado:            { label: 'Entregado',            tone: 'delivered' },
  cancelado:            { label: 'Cancelado',            tone: 'cancelled' },
}

export function statusLabel(status: string): string {
  return STATUS_META[status as OrderStatus]?.label ?? status
}

export function statusTone(status: string): StatusTone {
  return STATUS_META[status as OrderStatus]?.tone ?? 'draft'
}

/** Compat: mapa estado → tono (consumido por StatusBadge y otros). */
export const ORDER_STATUS_TONE: Record<string, StatusTone> = Object.fromEntries(
  (Object.keys(STATUS_META) as OrderStatus[]).map((s) => [s, STATUS_META[s].tone]),
)

/** Compat: lista value/label para cualquier `<select>` que la necesite. */
export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] =
  (Object.keys(STATUS_META) as OrderStatus[]).map((s) => ({ value: s, label: STATUS_META[s].label }))

// ── Flujo guiado ──────────────────────────────────────────────────────────

export interface StatusAction {
  label: string
  next: OrderStatus
  danger?: boolean
}

/**
 * Acción principal que avanza el pedido al próximo paso lógico (un click).
 * Devuelve `null` para estados de espera pasiva (MP en vuelo) o terminales.
 */
export function getPrimaryAction(status: string): StatusAction | null {
  switch (status) {
    case 'comprobante_recibido': return { label: 'Confirmar pago',       next: 'pagado'         }
    case 'pagado':               return { label: 'Marcar en preparación', next: 'en-preparacion' }
    case 'en-preparacion':       return { label: 'Marcar enviado',        next: 'enviado'        }
    case 'enviado':              return { label: 'Marcar entregado',      next: 'entregado'      }
    default:                     return null
  }
}

/** Acciones no lineales para el menú "⋯": revertir y/o cancelar. */
export function getSecondaryActions(status: string): StatusAction[] {
  switch (status) {
    case 'pendiente':
      return [{ label: 'Cancelar pedido', next: 'cancelado', danger: true }]
    case 'pendiente_de_pago':
      return [
        { label: 'Confirmar pago manual', next: 'pagado' },
        { label: 'Cancelar pedido',       next: 'cancelado', danger: true },
      ]
    case 'comprobante_recibido':
      return [
        { label: 'Volver a esperar transferencia', next: 'pendiente_de_pago' },
        { label: 'Cancelar pedido',                next: 'cancelado', danger: true },
      ]
    case 'pagado':
      return [{ label: 'Cancelar pedido', next: 'cancelado', danger: true }]
    case 'en-preparacion':
      return [
        { label: 'Revertir a pagado', next: 'pagado' },
        { label: 'Cancelar pedido',   next: 'cancelado', danger: true },
      ]
    case 'enviado':
      return [{ label: 'Revertir a en preparación', next: 'en-preparacion' }]
    case 'entregado':
      return [{ label: 'Revertir a enviado', next: 'enviado' }]
    case 'cancelado':
      return [{ label: 'Reactivar pedido', next: 'pendiente_de_pago' }]
    default:
      return []
  }
}

/** Nota para estados sin acción principal (espera pasiva). */
export const PASSIVE_NOTE: Partial<Record<OrderStatus, string>> = {
  pendiente:         'Esperando confirmación de Mercado Pago',
  pendiente_de_pago: 'Esperando que el cliente suba el comprobante',
}

// ── Segmentación del panel ─────────────────────────────────────────────────

/** Estados que requieren atención del admin (base del segmento "Acción requerida"). */
export const ACTION_STATES: OrderStatus[] = [
  'pendiente_de_pago',
  'comprobante_recibido',
  'pagado',
  'en-preparacion',
]

export interface OrderSegment {
  id: string
  label: string
  match: (status: string) => boolean
}

export const SEGMENTS: OrderSegment[] = [
  { id: 'accion',     label: 'Acción requerida', match: (s) => ACTION_STATES.includes(s as OrderStatus) },
  { id: 'preparacion', label: 'En preparación',  match: (s) => s === 'pagado' || s === 'en-preparacion' },
  { id: 'enviados',   label: 'Enviados',         match: (s) => s === 'enviado' },
  { id: 'entregados', label: 'Entregados',       match: (s) => s === 'entregado' },
  { id: 'todas',      label: 'Todas',            match: () => true },
]

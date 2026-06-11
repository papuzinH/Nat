import type { StatusTone } from '@/components/admin/shared/StatusBadge'
import type { ProductStatus } from '@/data/products'

/**
 * Modelo de dominio del inventario.
 *
 * Centraliza dos ejes que antes vivían dispersos como constantes mágicas dentro
 * de AdminStock:
 *   1. `status`  — estado de publicación MANUAL del producto (active / coming-soon
 *      / out-of-stock). Lo decide la administradora.
 *   2. `level`   — nivel de existencias DERIVADO de la cantidad (`stock`). Es una
 *      alerta automática: sin stock, bajo, ok o ilimitado.
 *
 * Sigue el mismo patrón que `src/data/orderStatus.ts` (labels + tonos + segmentos)
 * para que `/admin/stock` hable el mismo lenguaje visual que `/admin/ordenes`.
 */

// ── Estado de publicación (manual) ─────────────────────────────────────────

interface StatusMeta {
  label: string
  tone: StatusTone
}

/**
 * `out-of-stock` se rotula "Pausado" a propósito: es una decisión manual de no
 * vender, distinta de quedarse sin unidades (eso es el `level` "Sin stock").
 */
export const STATUS_META: Record<ProductStatus, StatusMeta> = {
  active:         { label: 'Activo',       tone: 'published' },
  'coming-soon':  { label: 'Próximamente', tone: 'awaiting'  },
  'out-of-stock': { label: 'Pausado',      tone: 'draft'     },
}

export function statusLabel(status: string): string {
  return STATUS_META[status as ProductStatus]?.label ?? status
}

export function statusTone(status: string): StatusTone {
  return STATUS_META[status as ProductStatus]?.tone ?? 'draft'
}

/** Lista value/label para el `<select>` de estado. */
export const STATUS_OPTIONS: { value: ProductStatus; label: string }[] =
  (Object.keys(STATUS_META) as ProductStatus[]).map((s) => ({ value: s, label: STATUS_META[s].label }))

// ── Nivel de existencias (derivado de la cantidad) ─────────────────────────

/** Umbral por debajo del cual (inclusive) se considera "bajo stock". */
export const LOW_STOCK_THRESHOLD = 3

export type StockLevel = 'infinite' | 'out' | 'low' | 'ok'

export function stockLevel(stock: number | null): StockLevel {
  if (stock == null) return 'infinite' // null = ilimitado / on-demand
  if (stock <= 0) return 'out'
  if (stock <= LOW_STOCK_THRESHOLD) return 'low'
  return 'ok'
}

/**
 * Nivel de una fila considerando el flag `onDemand` (fuente de verdad del stock
 * ilimitado, almacenado en `products.on_demand`). Si está on-demand, la cantidad
 * numérica es irrelevante: el nivel es siempre `infinite`.
 */
export function rowLevel(row: StockRowLike): StockLevel {
  if (row.onDemand) return 'infinite'
  return stockLevel(row.stock)
}

/**
 * Badge tonal por nivel. `ok` (existencias normales) no lleva badge; `infinite`
 * sí, para que los productos on-demand / ilimitados se distingan de un vistazo.
 */
export const STOCK_LEVEL_META: Record<'out' | 'low' | 'infinite', { label: string; tone: StatusTone }> = {
  out:      { label: 'Sin stock', tone: 'danger'  },
  low:      { label: 'Bajo',      tone: 'warning' },
  infinite: { label: 'Ilimitado', tone: 'draft'   },
}

// ── Reglas de inventario ────────────────────────────────────────────────────

export interface StockRowLike {
  stock: number | null
  status: string
  /** `products.on_demand`: true = stock ilimitado (se fabrica bajo pedido). */
  onDemand?: boolean
}

/**
 * Producto marcado como Activo pero con 0 unidades reales y sin ser on-demand:
 * se vendería sin existencias.
 */
export function isInconsistent(row: StockRowLike): boolean {
  return !row.onDemand && row.stock === 0 && row.status === 'active'
}

/** ¿La fila necesita atención de la administradora? (alerta o inconsistencia) */
export function needsAttention(row: StockRowLike): boolean {
  const level = rowLevel(row)
  return level === 'out' || level === 'low' || isInconsistent(row)
}

// ── Segmentación del panel ──────────────────────────────────────────────────

export interface StockSegment {
  id: string
  label: string
  match: (row: StockRowLike) => boolean
}

export const SEGMENTS: StockSegment[] = [
  { id: 'atencion',     label: 'Atención',     match: needsAttention                              },
  { id: 'sin-stock',    label: 'Sin stock',    match: (r) => rowLevel(r) === 'out'                },
  { id: 'bajo',         label: 'Bajo stock',   match: (r) => rowLevel(r) === 'low'                },
  { id: 'proximamente', label: 'Próximamente', match: (r) => r.status === 'coming-soon'           },
  { id: 'todos',        label: 'Todos',        match: () => true                                  },
]

// Orden manual de la tienda (campo `sort_order` de products). Lógica pura, sin UI,
// para la pantalla de admin que ordena arrastrando.

export const SORT_STEP = 10

/**
 * Mueve `activeId` al lugar de `overId` dentro de `visibleIds` (un filtro de
 * categoría) sin tocar al resto: los visibles vuelven a ocupar los mismos lugares
 * que tenían en `order`. `visibleIds` tiene que estar en el mismo orden relativo
 * que en `order`.
 */
export function reorderWithinSubset(
  order: string[],
  visibleIds: string[],
  activeId: string,
  overId: string
): string[] {
  const from = visibleIds.indexOf(activeId)
  const to = visibleIds.indexOf(overId)
  if (from < 0 || to < 0 || from === to) return order

  const moved = [...visibleIds]
  moved.splice(to, 0, ...moved.splice(from, 1))

  const visible = new Set(visibleIds)
  let k = 0
  return order.map((id) => (visible.has(id) ? moved[k++] : id))
}

export interface SortableProduct {
  id: string
  sortOrder: number
}

/**
 * Numera de SORT_STEP en SORT_STEP: primero `shownOrder` (lo que muestra la tienda,
 * en el orden elegido) y después el resto de `all`, en el orden en que viene.
 * Devuelve solo los productos cuyo número cambia.
 */
export function computeSortUpdates(
  all: SortableProduct[],
  shownOrder: string[]
): SortableProduct[] {
  const shown = new Set(shownOrder)
  const finalOrder = [...shownOrder, ...all.filter((p) => !shown.has(p.id)).map((p) => p.id)]
  const current = new Map(all.map((p) => [p.id, p.sortOrder]))
  return finalOrder
    .map((id, i) => ({ id, sortOrder: (i + 1) * SORT_STEP }))
    .filter((u) => current.get(u.id) !== u.sortOrder)
}

/**
 * Utilidades de envío / códigos postales (CP), compartidas entre el admin
 * (tarifa de envío), el carrito, el checkout y el server (create-order).
 *
 * Modelo (decidido con Naty, jul 2026): el envío a domicilio tiene un precio
 * único dentro de CABA; fuera de CABA no hay tarifa y el envío se coordina
 * aparte. Ya no se matchea por listas de CPs por zona.
 *
 * Robustez de formato: en Argentina conviven el CP viejo de 4 dígitos ("1424")
 * y el CPA ("C1424ABC", letra de provincia + 4 dígitos + 3 letras de manzana).
 * Normalizamos todo a los 4 dígitos.
 */

/** Extrae los 4 dígitos del CP en cualquier formato. "C1424ABC" → "1424". '' si no hay. */
export function normalizeCP(raw: string): string {
  const m = String(raw ?? '').toUpperCase().match(/\d{4}/)
  return m ? m[0] : ''
}

/** ¿El CP pertenece a CABA? Los 4 dígitos caen en 1000–1499. */
export function isCABA(raw: string): boolean {
  const cp = normalizeCP(raw)
  if (!cp) return false
  const n = parseInt(cp, 10)
  return n >= 1000 && n <= 1499
}

/** Forma mínima de una tarifa para resolver el envío (sin acoplar a ShippingZone). */
interface ZoneLike {
  active: boolean
  price: number
}

/**
 * Resuelve la tarifa de envío para un CP: si es de CABA, la tarifa activa
 * (ante datos legacy con varias activas, la más barata — nunca cobramos de
 * más); si no es de CABA o no hay tarifa activa, null → "a coordinar".
 */
export function resolveCABAZone<T extends ZoneLike>(raw: string, zones: T[]): T | null {
  if (!isCABA(raw)) return null
  return zones
    .filter((z) => z.active)
    .reduce<T | null>((best, z) => (best === null || z.price < best.price ? z : best), null)
}

/**
 * Utilidades de envío / códigos postales (CP), compartidas entre el admin
 * (carga de zonas), el checkout y el carrito.
 *
 * Robustez de formato: en Argentina conviven el CP viejo de 4 dígitos ("1424")
 * y el CPA ("C1424ABC", letra de provincia + 4 dígitos + 3 letras de manzana).
 * Normalizamos todo a los 4 dígitos para que el match no dependa del formato
 * que tipee el usuario ni de cómo se haya cargado en el admin.
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

/** Forma mínima de una zona para hacer match (sin acoplar a ShippingZone). */
interface ZoneLike {
  active: boolean
  postal_codes: string[]
}

/**
 * Busca la zona activa que contiene el CP, comparando formas normalizadas
 * (así "1424" cargado matchea "C1424ABC" ingresado y viceversa).
 */
export function matchZone<T extends ZoneLike>(raw: string, zones: T[]): T | null {
  const cp = normalizeCP(raw)
  if (!cp) return null
  return zones.find((z) => z.active && z.postal_codes.some((pc) => normalizeCP(pc) === cp)) ?? null
}

/** Tope de seguridad para no expandir rangos absurdos (CABA entera son ~500 CPs). */
const MAX_RANGE_SPAN = 600

/**
 * Expande un texto libre del admin a una lista de CPs normalizados (4 dígitos).
 * Acepta separadores (coma, espacio, salto de línea, punto y coma) y rangos
 * "1420-1425" (o con guión largo). Deduplica preservando el orden de aparición.
 *
 * Ej: "1414, 1416, 1420-1422" → ["1414","1416","1420","1421","1422"]
 */
export function expandCPInput(raw: string): string[] {
  const out = new Set<string>()
  for (const token of String(raw ?? '').split(/[\s,;]+/).filter(Boolean)) {
    const range = token.match(/^[A-Za-z]?(\d{4})\s*[-–]\s*[A-Za-z]?(\d{4})$/)
    if (range) {
      let a = parseInt(range[1], 10)
      let b = parseInt(range[2], 10)
      if (a > b) [a, b] = [b, a]
      if (b - a <= MAX_RANGE_SPAN) {
        for (let n = a; n <= b; n++) out.add(String(n))
      }
    } else {
      const cp = normalizeCP(token)
      if (cp) out.add(cp)
    }
  }
  return [...out]
}

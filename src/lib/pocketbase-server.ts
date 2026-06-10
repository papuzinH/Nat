import 'server-only'
import PocketBase from 'pocketbase'

/**
 * URL de PocketBase para uso en el servidor (Server Components, Route Handlers,
 * fetchers ISR). Prefiere POCKETBASE_URL (privada) y cae a la pública.
 */
export const POCKETBASE_URL =
  process.env.POCKETBASE_URL ?? process.env.NEXT_PUBLIC_POCKETBASE_URL ?? ''

/**
 * Crea una instancia nueva de PocketBase por request. Nunca compartir un
 * cliente autenticado entre requests en el servidor (fuga de sesión).
 * Usar para operaciones que requieren el SDK (auth admin, escrituras).
 */
export function getPb(): PocketBase {
  return new PocketBase(POCKETBASE_URL)
}

type PbListResponse<T> = {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

interface PbFetchOptions {
  /** Tags de cache de Next para revalidación on-demand (revalidateTag). */
  tags?: string[]
  /** Segundos de revalidación ISR. `false` = sin revalidar por tiempo. */
  revalidate?: number | false
}

/**
 * Fetch a la REST API de PocketBase con caching de Next (ISR + tags).
 * Se usa fetch directo (en vez del SDK) para poder declarar `next: { tags,
 * revalidate }` y que el HTML quede cacheado en el edge / revalidable on-demand.
 */
export async function pbFetch<T = unknown>(
  path: string,
  { tags, revalidate = 3600 }: PbFetchOptions = {},
): Promise<T> {
  const res = await fetch(`${POCKETBASE_URL}${path}`, {
    next: { tags, revalidate },
  })
  if (!res.ok) {
    throw new Error(`PocketBase ${res.status} en ${path}`)
  }
  return res.json() as Promise<T>
}

/**
 * Equivalente a getFullList del SDK: trae todos los records de una colección
 * (perPage alto), con caching ISR. Devuelve el array de items ya tipado.
 */
export async function pbGetFullList<T = Record<string, unknown>>(
  collection: string,
  params: Record<string, string> = {},
  opts: PbFetchOptions = {},
): Promise<T[]> {
  const query = new URLSearchParams({ perPage: '500', ...params }).toString()
  const data = await pbFetch<PbListResponse<T>>(
    `/api/collections/${collection}/records?${query}`,
    opts,
  )
  return data.items
}

/** Construye la URL pública de un archivo almacenado en PocketBase. */
export function pbFileUrl(
  collectionId: string,
  recordId: string,
  filename: string,
): string {
  return `${POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}`
}

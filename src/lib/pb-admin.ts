import 'server-only'
import crypto from 'crypto'

/**
 * Helpers de acceso a PocketBase con credenciales de superuser, para uso
 * exclusivo en el servidor (Route Handlers / webhooks). Centraliza el auth
 * admin que antes vivía duplicado en el webhook de Mercado Pago.
 */

export const PB_URL =
  process.env.POCKETBASE_URL ?? process.env.NEXT_PUBLIC_POCKETBASE_URL ?? process.env.VITE_POCKETBASE_URL ?? ''

/**
 * Token determinístico que autoriza la subida del comprobante de una orden,
 * sin guardar nada en la DB: HMAC-SHA256(secreto, orderId). Lo genera el
 * servidor al crear la orden y lo verifica el endpoint de subida.
 */
export function uploadTokenFor(orderId: string): string {
  const secret = process.env.UPLOAD_TOKEN_SECRET ?? ''
  return crypto.createHmac('sha256', secret).update(orderId).digest('hex')
}

/** Compara dos tokens en tiempo constante (evita timing attacks). */
export function verifyUploadToken(orderId: string, token: string): boolean {
  if (!process.env.UPLOAD_TOKEN_SECRET || !token) return false
  const expected = uploadTokenFor(orderId)
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Autentica como superuser y devuelve el token, o null si no se pudo. */
export async function pbAdminToken(): Promise<string | null> {
  const email = process.env.PB_ADMIN_EMAIL
  const password = process.env.PB_ADMIN_PASSWORD
  if (!PB_URL || !email || !password) return null

  const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { token?: string }
  return data.token ?? null
}

/** Trae una orden por id usando un token admin. Devuelve null si no existe. */
export async function fetchOrder(
  orderId: string,
  token: string,
): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${PB_URL}/api/collections/orders/records/${orderId}`, {
    headers: { Authorization: token },
  })
  if (!res.ok) return null
  return (await res.json()) as Record<string, unknown>
}

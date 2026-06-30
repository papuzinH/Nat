/**
 * Datos bancarios y de contacto para el flujo de pago por transferencia.
 * Fuente única de verdad reutilizada por checkout, Thank You Page, admin y emails.
 */

export const BANK_DETAILS = {
  // CVU de cuenta virtual (sin banco / tipo de cuenta asociados).
  cbu: '0000003100011890692022',
  alias: 'nat.tatt',
  titular: 'Natalia Heller',
} as const

/** Teléfono de WhatsApp en formato wa.me (solo dígitos, con código de país). +54 9 11 3272-2555 */
export const WHATSAPP_PHONE = '5491132722555'

/** WhatsApp en formato legible para mostrar en pantalla. */
export const WHATSAPP_DISPLAY = '+54 9 11 3272-2555'

/**
 * Arma el enlace a la API de WhatsApp con el mensaje preformateado para enviar
 * el comprobante de transferencia, referenciando el pedido.
 */
export function buildWhatsappProofUrl(orderRef: string): string {
  const text = `¡Hola! Acá te dejo el comprobante de mi transferencia para el Pedido #${orderRef}. Quedo a la espera de la confirmación. ¡Muchas gracias!`
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

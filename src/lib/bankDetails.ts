/**
 * Datos bancarios y de contacto para el flujo de pago por transferencia.
 * Fuente única de verdad reutilizada por checkout, Thank You Page, admin y emails.
 */

export const BANK_DETAILS = {
  // TODO: completar con el nombre real del banco.
  banco: 'TODO — completar nombre del banco',
  // TODO: completar tipo de cuenta (ej. "Caja de ahorro en pesos").
  tipoCuenta: 'TODO — completar tipo de cuenta',
  cbu: '0000003100062588008793',
  alias: 'natalia.arte',
  titular: 'Natalia Heller',
} as const

/** Teléfono de WhatsApp en formato wa.me (solo dígitos, con código de país). +54 9 11 6619-1209 */
export const WHATSAPP_PHONE = '5491166191209'

/**
 * Arma el enlace a la API de WhatsApp con el mensaje preformateado para enviar
 * el comprobante de transferencia, referenciando el pedido.
 */
export function buildWhatsappProofUrl(orderRef: string): string {
  const text = `¡Hola! Acá te dejo el comprobante de mi transferencia para el Pedido #${orderRef}. Quedo a la espera de la confirmación. ¡Muchas gracias!`
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

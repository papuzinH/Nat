import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import CheckoutContent from '@/components/checkout/CheckoutContent'

export const metadata: Metadata = buildMetadata({
  title: 'Finalizar pedido',
  description: 'Completá tu compra de arte original de Natalia Heller.',
  noindex: true,
})

export default function CheckoutPage() {
  return <CheckoutContent />
}

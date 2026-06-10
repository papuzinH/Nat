import type { Metadata } from 'next'
import { Suspense } from 'react'
import { buildMetadata } from '@/lib/seo'
import CheckoutConfirmacionContent from '@/components/checkout/CheckoutConfirmacionContent'

export const metadata: Metadata = buildMetadata({
  title: 'Confirmación de pedido',
  noindex: true,
})

export default function CheckoutConfirmacionPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutConfirmacionContent />
    </Suspense>
  )
}

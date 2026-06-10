import type { Metadata } from 'next'
import { Suspense } from 'react'
import { buildMetadata } from '@/lib/seo'
import CheckoutErrorContent from '@/components/checkout/CheckoutErrorContent'

export const metadata: Metadata = buildMetadata({
  title: 'Pago no completado',
  noindex: true,
})

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutErrorContent />
    </Suspense>
  )
}

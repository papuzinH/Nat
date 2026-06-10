import type { ReactNode } from 'react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

// Shell público (tienda, estudio, blog, contacto, checkout). Equivale al
// <Layout> legacy: Header sticky + main con padding superior + Footer.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />
      <main className="flex-grow pt-18">{children}</main>
      <Footer />
    </div>
  )
}

import type { ReactNode } from 'react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

// Shell del home: Header sticky + Footer, SIN padding superior (el hero va
// full-bleed pegado al header, igual que en la SPA legacy).
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

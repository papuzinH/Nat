import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Nunito, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Fuentes vía next/font/google — self-hosted, sin render-blocking ni FOUT.
// Exponen CSS variables consumidas por tailwind.config.js (display/body/mono).
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-nunito',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'NatArt',
  description: 'Andamiaje de migración a Next.js',
}

export const viewport: Viewport = {
  themeColor: '#dde2d1',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${nunito.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { Fraunces, Nunito, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import CartDrawer from '@/components/cart/CartDrawer'
import ToastViewport from '@/components/admin/shared/ToastViewport'
import BotanicalMotion from '@/components/shared/BotanicalMotion'
import { SITE_URL } from '@/lib/seo'

// Google Analytics 4 directo, sin Tag Manager: el contenedor GTM bajaba 325 KB
// (112 KB transferidos) y no tenía NINGUNA etiqueta configurada — el sitio pagaba
// el peso y no medía nada (verificado el 2026-09-17). El ID es público.
const GA_ID = 'G-3EW4EJND04'

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

// Metadata base — migrada del fallback estático de index.html. Cada página
// define su propio title/description/canonical vía generateMetadata (Wave 3+).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Natalia Heller — Arte Original & Tienda | Buenos Aires',
    template: '%s | Natalia Heller',
  },
  description:
    'Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes.',
  robots: { index: true, follow: true },
  // El favicon lo resuelve app/icon.svg (convencion de Next).
  openGraph: {
    siteName: 'Natalia Heller',
    type: 'website',
    locale: 'es_AR',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nataliaceller_art',
  },
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
      <body>
        {/* GA4 con lazyOnload, igual que hacía GTM: gtag.js son 145 KB
            transferidos que competirían por el hilo principal justo mientras se
            pinta el hero. Cargarlo después del load saca ese trabajo de la
            ventana que Google mide. Contrapartida: se pierden los eventos de un
            rebote muy rápido; si hace falta precisión, pasar a afterInteractive. */}
        <Script
          id="ga4-src"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        {/* El atajo gtag se define apenas hidrata (150 bytes): si se definiera
            también en diferido, un evento disparado antes de que baje gtag.js se
            perdería en silencio. Los eventos quedan encolados en dataLayer y se
            mandan cuando el script llega. */}
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>

        <CartProvider>
          <ToastProvider>
            {children}
            <CartDrawer />
            <ToastViewport />
            <BotanicalMotion />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}

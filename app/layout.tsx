import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { Fraunces, Nunito, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import CartDrawer from '@/components/cart/CartDrawer'
import ToastViewport from '@/components/admin/shared/ToastViewport'

const GTM_ID = 'GTM-WXL45DSC'

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
  metadataBase: new URL('https://tatuajesnaty.com'),
  title: {
    default: 'Natalia Heller — Arte Original & Tienda | Buenos Aires',
    template: '%s | Natalia Heller',
  },
  description:
    'Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes.',
  robots: { index: true, follow: true },
  icons: { icon: '/Logo.svg' },
  openGraph: {
    siteName: 'Natalia Heller',
    type: 'website',
    locale: 'es_AR',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
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
        {/* Google Tag Manager — carga diferida tras interactividad */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        <CartProvider>
          <ToastProvider>
            {children}
            <CartDrawer />
            <ToastViewport />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}

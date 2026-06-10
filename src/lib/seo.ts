import type { Metadata } from 'next'

// Constantes de marca (portadas del antiguo SEOMeta.tsx / react-helmet).
export const SITE_URL = 'https://tatuajesnaty.com'
export const SITE_NAME = 'Natalia Heller'
export const DEFAULT_IMAGE = '/og-image.webp'
export const DEFAULT_DESCRIPTION =
  'Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes.'
export const TWITTER_HANDLE = '@nataliaceller_art'

export interface BuildMetadataInput {
  title: string
  /** Si true, el título ignora el template del root ('%s | Natalia Heller'). */
  titleAbsolute?: boolean
  description?: string
  /** Path canónico relativo, ej: '/tienda' o '/blog/mi-post'. */
  path?: string
  /** URL de imagen OG (absoluta o relativa a metadataBase). */
  image?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
}

/**
 * Genera el objeto Metadata de Next a partir de datos por página.
 * Reemplaza al componente SEOMeta (react-helmet-async) del stack Vite.
 * El `metadataBase` y los defaults de OG/Twitter viven en app/layout.tsx.
 */
export function buildMetadata({
  title,
  titleAbsolute = false,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
}: BuildMetadataInput): Metadata {
  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      // OpenGraph de Next no acepta 'product'; la semántica de producto va por
      // JSON-LD. Mapeamos a 'article' o 'website'.
      type: type === 'article' ? 'article' : 'website',
      ...(path ? { url: path } : {}),
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

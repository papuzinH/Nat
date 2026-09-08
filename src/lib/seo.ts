import type { Metadata } from 'next'

// Constantes de marca (portadas del antiguo SEOMeta.tsx / react-helmet).

/**
 * Dominio canónico del sitio: única fuente de verdad. De acá salen canonicals,
 * JSON-LD, sitemap, robots, las URLs de retorno de Mercado Pago y los emails.
 *
 * `SITE_DOMAIN` es un literal, así que es seguro importarlo desde Client
 * Components. `SITE_URL` admite override por env (previews, entorno local) y
 * solo se resuelve de verdad en el server: en el browser `process.env.SITE_URL`
 * es undefined y siempre cae al fallback.
 */
export const SITE_DOMAIN = 'nattatt.com.ar'
export const SITE_URL = (process.env.SITE_URL ?? `https://${SITE_DOMAIN}`).replace(/\/$/, '')
export const SITE_NAME = 'Natalia Heller'
// Ruta que sirve app/opengraph-image.tsx. Se declara explicita porque Next
// solo resuelve la imagen generada cuando la pagina NO define openGraph, y
// buildMetadata siempre lo hace.
export const DEFAULT_IMAGE = '/opengraph-image'
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
  /**
   * URL de imagen OG (absoluta o relativa a metadataBase). Si se omite,
   * Next cae a la imagen generada en app/opengraph-image.tsx.
   */
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
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

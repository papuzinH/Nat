import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://tatuajesnaty.com'
const SITE_NAME = 'Natalia Heller'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.webp`
const DEFAULT_DESCRIPTION =
  'Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes.'
const TWITTER_HANDLE = '@nataliaceller_art'

export interface SEOMetaProps {
  /** Título completo de la página. Se usa en <title>, og:title y twitter:title. */
  title: string
  description?: string
  /** URL canónica completa, ej: https://tatuajesnaty.com/tienda */
  canonical?: string
  /** Sobreescribe og:title si es distinto al title */
  ogTitle?: string
  ogDescription?: string
  /** URL absoluta de la imagen 1200×630. Defaults a /og-image.webp */
  ogImage?: string
  /** 'website' | 'article' | 'product'. Default: 'website' */
  ogType?: string
  /** Pasa noindex:true en páginas que no deben indexarse */
  noindex?: boolean
  /**
   * Schema JSON-LD como objeto JS. @context se agrega automáticamente.
   * Para múltiples schemas, usar @graph: [{ @type: 'LocalBusiness', ... }, ...]
   */
  schema?: Record<string, unknown>
}

export default function SEOMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noindex = false,
  schema,
}: SEOMetaProps) {
  const resolvedOgTitle = ogTitle ?? title
  const resolvedOgDesc = ogDescription ?? description

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_AR" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={resolvedOgTitle} />
      <meta name="twitter:description" content={resolvedOgDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', ...schema })}
        </script>
      )}
    </Helmet>
  )
}

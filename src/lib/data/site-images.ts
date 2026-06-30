import 'server-only'
import { pbGetFullList } from '@/lib/pocketbase-server'
import { rowToSiteImage } from './site-images-mappers'

// Tag de cache para revalidación on-demand desde el admin (/api/revalidate).
export const SITE_IMAGES_TAG = 'site_images'

export type SiteImageSection =
  | 'home_hero'
  | 'home_teaser'
  | 'estudio_tattoos'
  | 'estudio_espacio'

export interface SiteImage {
  id: string
  url: string
  alt: string
  caption: string
  focalX: number
  focalY: number
}

/**
 * Imágenes activas de una sección, ordenadas por sort_order, cacheadas con ISR.
 * Devuelve [] si la colección no existe todavía o el fetch falla (degradación).
 */
export async function getSiteImages(section: SiteImageSection): Promise<SiteImage[]> {
  try {
    const rows = await pbGetFullList<Record<string, any>>(
      'site_images',
      { filter: `section="${section}" && active=true`, sort: 'sort_order' },
      { tags: [SITE_IMAGES_TAG] },
    )
    return rows.map(rowToSiteImage)
  } catch {
    return []
  }
}

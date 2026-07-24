import { pbFileUrl } from '@/lib/pocketbase-server'
import type { SiteImage } from './site-images'

/** Mapea un record REST de site_images al tipo público SiteImage. */
export function rowToSiteImage(row: Record<string, unknown>): SiteImage {
  return {
    id: row.id as string,
    url: pbFileUrl(row.collectionId as string, row.id as string, row.image as string),
    alt: (row.alt as string) ?? '',
    caption: (row.caption as string) ?? '',
    focalX: typeof row.focal_x === 'number' ? row.focal_x : 50,
    focalY: typeof row.focal_y === 'number' ? row.focal_y : 50,
  }
}

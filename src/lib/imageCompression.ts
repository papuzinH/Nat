// Compresión client-side de imágenes antes de subir a PocketBase.
//
// Para una tienda de arte privilegiamos detalle (quality 0.9) por sobre tamaño:
// una foto de cámara de ~8 MB queda en ~600-900 KB sin degradación visible,
// suficiente para Retina en una grilla de tienda.

interface CompressOptions {
  /** Lado mayor permitido en píxeles. */
  maxDimension?: number
  /** Calidad JPEG (0-1). Solo aplica a JPEG/WebP. */
  quality?: number
  /** Si el archivo ya está por debajo de este tamaño y dimensión, se sube sin tocar. */
  skipUnderBytes?: number
}

const DEFAULTS: Required<CompressOptions> = {
  maxDimension: 2400,
  quality: 0.9,
  skipUnderBytes: 800_000, // 800 KB
}

/**
 * Devuelve un nuevo File comprimido/redimensionado. Si la imagen no puede
 * procesarse (SVG, GIF animado, decode error, navegador sin soporte), o si
 * la compresión no logra reducir el tamaño, devuelve el archivo original.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const opts = { ...DEFAULTS, ...options }

  // No tocar GIF (puede ser animado) ni SVG (vectorial) ni tipos no-imagen.
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  if (typeof createImageBitmap === 'undefined') return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const { width, height } = bitmap
  const longest = Math.max(width, height)

  // Si ya es chica y liviana, no tiene sentido recomprimir.
  if (longest <= opts.maxDimension && file.size < opts.skipUnderBytes) {
    bitmap.close()
    return file
  }

  const scale = longest > opts.maxDimension ? opts.maxDimension / longest : 1
  const targetW = Math.round(width * scale)
  const targetH = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, targetW, targetH)
  bitmap.close()

  // PNG con posible transparencia → conserva PNG. Resto → JPEG.
  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const outputExt = outputType === 'image/png' ? 'png' : 'jpg'

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      outputType,
      outputType === 'image/jpeg' ? opts.quality : undefined
    )
  })
  if (!blob) return file

  // Si la "comprimida" resultó más grande, dejamos el original.
  if (blob.size >= file.size) return file

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}.${outputExt}`, {
    type: outputType,
    lastModified: Date.now(),
  })
}

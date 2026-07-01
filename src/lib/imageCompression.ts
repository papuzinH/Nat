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

// ─── Helpers internos ────────────────────────────────────────────────────────

function isImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  // Algunos archivos de cámara llegan con type vacío. Caer al match por extensión.
  return /\.(jpe?g|png|webp|bmp|avif|heic|heif)$/i.test(file.name)
}

function isUnprocessable(file: File): boolean {
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return true
  if (/\.(gif|svg)$/i.test(file.name)) return true
  return false
}

/**
 * HEIC/HEIF (formato de iPhone) no se decodifica en Chrome/Firefox ni se puede
 * mostrar en la web. Lo convertimos a JPEG con heic-to (libheif-js actual, con
 * decoder HEVC; el variante /next es el build pensado para Next.js). Import
 * dinámico: el WASM solo se carga cuando aparece un HEIC. El JPEG resultante
 * sigue el pipeline normal de compresión/redimensión.
 */
async function convertHeicIfNeeded(file: File): Promise<File> {
  const looksHeic = /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
  if (!looksHeic) return file
  try {
    const { heicTo } = await import('heic-to/next')
    const blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.92 })
    const baseName = file.name.replace(/\.[^.]+$/, '')
    console.log('[compressImage] HEIC convertido a JPEG:', file.name)
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch (err) {
    console.error('[compressImage] conversión HEIC falló para', file.name, err)
    throw new Error(`No se pudo convertir ${file.name} (HEIC). Probá subirla en JPG o PNG.`)
  }
}

/** Intenta decodificar con createImageBitmap (preferido) o fallback a <img>. */
async function decodeImage(
  file: File
): Promise<{ source: CanvasImageSource; width: number; height: number; cleanup: () => void } | null> {
  // Camino rápido: createImageBitmap
  if (typeof createImageBitmap !== 'undefined') {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      }
    } catch (err) {
      console.warn('[compressImage] createImageBitmap falló, usando fallback <img>', err)
    }
  }

  // Fallback: <img> con object URL (más tolerante con JPEGs raros tipo PORTRAIT)
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        cleanup: () => URL.revokeObjectURL(url),
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      console.warn('[compressImage] fallback <img> también falló para', file.name)
      resolve(null)
    }
    img.src = url
  })
}

// ─── API pública ─────────────────────────────────────────────────────────────

/**
 * Devuelve un nuevo File comprimido/redimensionado. Si la imagen no puede
 * procesarse (SVG, GIF animado, decode error en ambos paths), o si la
 * compresión no logra reducir el tamaño, devuelve el archivo original.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const opts = { ...DEFAULTS, ...options }

  // HEIC/HEIF (iPhone) → JPEG antes de nada; el navegador no los decodifica.
  file = await convertHeicIfNeeded(file)

  if (!isImageFile(file) || isUnprocessable(file)) {
    console.log('[compressImage] skip (no procesable):', file.name, file.type)
    return file
  }

  const decoded = await decodeImage(file)
  if (!decoded) return file

  const { source, width, height, cleanup } = decoded
  const longest = Math.max(width, height)

  // Si ya es chica y liviana, no tiene sentido recomprimir.
  if (longest <= opts.maxDimension && file.size < opts.skipUnderBytes) {
    cleanup()
    console.log('[compressImage] skip (ya optimizada):', file.name, `${width}x${height}`, `${(file.size / 1024).toFixed(0)} KB`)
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
    cleanup()
    return file
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, targetW, targetH)
  cleanup()

  // PNG con posible transparencia → conserva PNG. Resto → JPEG.
  const outputType = file.type === 'image/png' || /\.png$/i.test(file.name)
    ? 'image/png'
    : 'image/jpeg'
  const outputExt = outputType === 'image/png' ? 'png' : 'jpg'

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      outputType,
      outputType === 'image/jpeg' ? opts.quality : undefined
    )
  })
  if (!blob) {
    console.warn('[compressImage] toBlob devolvió null para', file.name)
    return file
  }

  // Si la "comprimida" resultó más grande, dejamos el original.
  if (blob.size >= file.size) {
    console.log('[compressImage] descartada (no redujo):', file.name, `${(file.size / 1024).toFixed(0)} KB → ${(blob.size / 1024).toFixed(0)} KB`)
    return file
  }

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const compressed = new File([blob], `${baseName}.${outputExt}`, {
    type: outputType,
    lastModified: Date.now(),
  })
  console.log(
    '[compressImage] OK',
    file.name,
    `${width}x${height} ${(file.size / 1024).toFixed(0)} KB`,
    '→',
    `${targetW}x${targetH} ${(compressed.size / 1024).toFixed(0)} KB`
  )
  return compressed
}

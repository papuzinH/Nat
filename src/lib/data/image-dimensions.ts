import 'server-only'

/**
 * Lee las dimensiones de una imagen remota sin descargarla entera: pide los
 * primeros KB con un Range y parsea la cabecera del formato.
 *
 * Sirve para que la galería de producto conozca la proporción real de cada obra
 * antes de pintar. Sin eso hay que imponer un ratio fijo, y toda imagen que no
 * calce sobra (aire alrededor) o falta (recorte).
 *
 * Las URLs de PocketBase son inmutables — cada archivo subido recibe un nombre
 * único — así que la respuesta se cachea de forma permanente.
 */

const HEADER_BYTES = 65_535

function parsePng(buf: Buffer): [number, number] | null {
  if (buf.length < 24) return null
  if (buf[0] !== 0x89 || buf[1] !== 0x50) return null
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
}

function parseJpeg(buf: Buffer): [number, number] | null {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    // SOF0..SOF15 llevan las dimensiones; DHT/JPG/DAC no son SOF pese al rango.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]
    }
    const len = buf.readUInt16BE(i + 2)
    if (len <= 0) return null
    i += 2 + len
  }
  return null
}

function parseWebp(buf: Buffer): [number, number] | null {
  if (buf.length < 30) return null
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null
  const chunk = buf.toString('ascii', 12, 16)
  if (chunk === 'VP8X') {
    return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1]
  }
  if (chunk === 'VP8 ') {
    // frame header: sync code 0x9d012a en 23..25, luego 14 bits de w y h
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
  }
  if (chunk === 'VP8L') {
    const bits = buf.readUInt32LE(21)
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]
  }
  return null
}

/** Ancho/alto de una imagen remota, o null si no se pudo determinar. */
export async function getImageSize(url: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(url, {
      headers: { Range: `bytes=0-${HEADER_BYTES}` },
      cache: 'force-cache',
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    return parsePng(buf) ?? parseJpeg(buf) ?? parseWebp(buf)
  } catch {
    return null
  }
}

/** Proporción ancho/alto de una imagen remota, o null. */
export async function getImageRatio(url: string): Promise<number | null> {
  const size = await getImageSize(url)
  if (!size || !size[0] || !size[1]) return null
  return Number((size[0] / size[1]).toFixed(4))
}

/** Proporciones de varias imágenes, en el mismo orden. Resuelve en paralelo. */
export async function getImageRatios(urls: string[]): Promise<(number | null)[]> {
  return Promise.all(urls.map((url) => getImageRatio(url)))
}

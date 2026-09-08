import { ImageResponse } from 'next/og'

/**
 * Imagen de Open Graph del sitio (la que se ve al compartir un link).
 *
 * Se genera acá en vez de servir un archivo suelto de /public porque el
 * anterior (`/og-image.webp`) no existía: el HTML lo declaraba en og:image y
 * en el JSON-LD, pero devolvía 404, así que cada link compartido salía sin
 * preview. Generarla la mantiene siempre en sincronía con la marca y evita
 * que vuelva a quedar colgada una referencia a un archivo que nadie subió.
 *
 * Es deliberadamente tipográfica: cuando Naty defina una imagen de obra para
 * este uso, se reemplaza este archivo por el asset y listo.
 */
export const alt = 'Natalia Heller — Arte original y estudio de tatuajes en Buenos Aires'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Tokens tomados de globals.css para que la preview no desentone con el sitio.
const CREAM = '#faf6f0'
const INK = '#2c2c2c'
const INK_SOFT = '#5a5350'
const SAGE = '#45501f'
const AMBER = '#bc6c25'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: CREAM,
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* Filete superior: los tres tonos de la paleta. */}
        <div style={{ display: 'flex', height: 6, width: 220 }}>
          <div style={{ flex: 1, background: SAGE }} />
          <div style={{ flex: 1, background: AMBER }} />
          <div style={{ flex: 1, background: INK }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              color: AMBER,
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            Buenos Aires
          </div>
          <div style={{ fontSize: 92, color: INK, lineHeight: 1.05, letterSpacing: -2 }}>
            Natalia Heller
          </div>
          <div style={{ fontSize: 38, color: SAGE, marginTop: 14, letterSpacing: -0.5 }}>
            Arte original & estudio de tatuajes
          </div>
          <div style={{ fontSize: 26, color: INK_SOFT, marginTop: 26, maxWidth: 820, lineHeight: 1.5 }}>
            Láminas giclée, cerámica, textiles y stickers. Tatuajes de línea fina y botánica.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 24, color: INK, letterSpacing: 2 }}>NAT.TATT</div>
          <div style={{ fontSize: 22, color: INK_SOFT, letterSpacing: 1 }}>nattatt.com.ar</div>
        </div>
      </div>
    ),
    size,
  )
}

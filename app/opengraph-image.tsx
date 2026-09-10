import { ImageResponse } from 'next/og'
import { leafPath, midribPath } from '@/components/shared/botanical'

/**
 * Imagen de Open Graph del sitio (la que se ve al compartir un link).
 *
 * Se genera acá en vez de servir un archivo suelto de /public porque el
 * anterior (`/og-image.webp`) no existía: el HTML lo declaraba en og:image y
 * en el JSON-LD, pero devolvía 404, así que cada link compartido salía sin
 * preview. Generarla la mantiene siempre en sincronía con la marca y evita
 * que vuelva a quedar colgada una referencia a un archivo que nadie subió.
 *
 * El panel derecho es botánico (misma geometría que NHSprig) a modo de
 * marcador: cuando Naty elija una foto de obra para este uso, ese `<svg>`
 * se reemplaza por una `<img>` con el asset y el resto del layout queda igual.
 */
export const alt = 'NatTatt — Natalia Heller, arte original y estudio de tatuajes en Buenos Aires'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Tokens tomados de globals.css para que la preview no desentone con el sitio.
const CREAM = '#faf6f0'
const INK = '#2c2c2c'
const INK_SOFT = '#5a5350'
const SAGE = '#45501f'
const AMBER = '#a35e20'
const PANEL = '#f1ead9'

const PANEL_WIDTH = 420

// Tres hojas superpuestas, mismo trazo que NHSprig, a distinta escala y profundidad.
const LEAVES = [
  { x: 230, y: 470, rotate: -16, length: 240, width: 48, color: SAGE, opacity: 1 },
  { x: 130, y: 360, rotate: 14, length: 175, width: 35, color: AMBER, opacity: 0.6 },
  { x: 290, y: 230, rotate: -8, length: 130, width: 26, color: SAGE, opacity: 0.35 },
]

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: CREAM,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 64px 72px 80px',
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
            <div style={{ fontSize: 104, color: INK, lineHeight: 1, letterSpacing: -3 }}>
              NatTatt
            </div>
            <div style={{ fontSize: 30, color: INK_SOFT, marginTop: 16, letterSpacing: 0.5 }}>
              Natalia Heller
            </div>
            <div style={{ fontSize: 34, color: SAGE, marginTop: 14, letterSpacing: -0.5 }}>
              Arte original & estudio de tatuajes
            </div>
            <div style={{ fontSize: 23, color: INK_SOFT, marginTop: 24, maxWidth: 560, lineHeight: 1.5 }}>
              Láminas giclée, cerámica, textiles y stickers. Tatuajes de línea fina y botánica.
            </div>
          </div>

          <div style={{ fontSize: 22, color: INK_SOFT, letterSpacing: 1 }}>nattatt.com.ar</div>
        </div>

        <div
          style={{
            width: PANEL_WIDTH,
            height: '100%',
            display: 'flex',
            background: PANEL,
            position: 'relative',
          }}
        >
          <svg
            width={PANEL_WIDTH}
            height={630}
            viewBox={`0 0 ${PANEL_WIDTH} 630`}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {LEAVES.map((leaf) => (
              <path
                key={`${leaf.x}-${leaf.y}`}
                d={leafPath(leaf.length, leaf.width) + midribPath(leaf.length)}
                fill={leaf.color}
                fillOpacity={leaf.opacity}
                fillRule="evenodd"
                transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate})`}
              />
            ))}
          </svg>
        </div>
      </div>
    ),
    size,
  )
}

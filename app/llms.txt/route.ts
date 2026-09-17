import type { JSONContent } from '@tiptap/core'
import { SITE_URL } from '@/lib/seo'
import { getProducts } from '@/lib/data/products'
import { getBlogPosts } from '@/lib/data/blog'
import { formatARS } from '@/data/products'

/**
 * /llms.txt — resumen del sitio en Markdown para modelos de lenguaje.
 *
 * Los asistentes que responden citando fuentes (ChatGPT Search, Perplexity,
 * Claude) leen el sitio con un presupuesto de tokens acotado y sin ejecutar JS.
 * Este archivo les da el catálogo y los datos operativos ya destilados, en vez
 * de obligarlos a inferirlos del HTML. Complementa al sitemap: el sitemap dice
 * qué URLs existen, esto dice qué hay en cada una.
 *
 * Convención: https://llmstxt.org
 *
 * Se regenera con el mismo TTL que el sitemap y las páginas de datos.
 */
export const revalidate = 3600

/** Aplana el rich-text de TipTap a texto corrido (los LLM no necesitan formato). */
function plainText(doc: JSONContent | undefined, max = 220): string {
  if (!doc) return ''
  const out: string[] = []
  const walk = (n: JSONContent) => {
    if (n.text) out.push(n.text)
    n.content?.forEach(walk)
  }
  walk(doc)
  const t = out.join(' ').replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t
}

export async function GET() {
  const [products, posts] = await Promise.all([
    getProducts().catch(() => []),
    getBlogPosts().catch(() => []),
  ])

  // No se filtra por estado: que un asistente sepa que una pieza esta agotada
  // o por salir es tan util como saber que esta disponible.
  const ESTADO: Record<string, string> = {
    'coming-soon': ' (proximamente)',
    'out-of-stock': ' (agotado)',
  }

  const lineas = [
    '# Natalia Heller — Arte original y estudio de tatuajes',
    '',
    '> Artista plástica y tatuadora en Buenos Aires (CABA, Argentina). Dos cosas',
    '> en un mismo lugar: una tienda de obra original —láminas giclée, cerámica,',
    '> textiles, stickers e ilustración— y un estudio de tatuajes de línea fina,',
    '> botánica y diseño a medida.',
    '',
    `Sitio: ${SITE_URL}`,
    'Instagram: @nataliaceller_art (obra) · @nat.tatt (tatuajes)',
    'Teléfono / WhatsApp: +54 9 11 3272-2555',
    '',
    '## Cómo comprar',
    '',
    '- Pago con Mercado Pago o transferencia bancaria con comprobante.',
    '- Envío a domicilio dentro de CABA con tarifa única; fuera de CABA se',
    '  coordina por WhatsApp o email.',
    '- También hay retiro en persona en Parque Chacabuco, CABA.',
    '- Precios en pesos argentinos (ARS).',
    '',
    '## Tienda',
    '',
    `Catálogo completo (${products.length} piezas):`,
    '',
    ...products.map((p) => {
      const desc = plainText(p.description)
      // Una pieza vendida se lista como obra, sin precio.
      const meta = [p.catLabel, p.size, p.sold ? null : formatARS(p.basePrice)].filter(Boolean).join(' · ')
      const estado = p.sold ? ' (vendido)' : (ESTADO[p.status] ?? '')
      return `- [${p.title}](${SITE_URL}/tienda/${p.slug}): ${meta}${estado}.${desc ? ' ' + desc : ''}`
    }),
    '',
    '## Estudio de tatuajes',
    '',
    `- [El estudio](${SITE_URL}/estudio): estilo, proceso de trabajo y cuidados.`,
    `- [Reservar](${SITE_URL}/estudio/reservar): formulario para cotizar un diseño`,
    '  personalizado. Se responde por email con presupuesto y disponibilidad.',
    '',
    'Especialidades: line art, botánico, minimalista y cover up.',
    '',
    '## Notas del taller',
    '',
    ...(posts.length
      ? posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.subtitle ? `: ${p.subtitle}` : ''}`)
      : ['- Todavía no hay notas publicadas.']),
    '',
    '## Contacto',
    '',
    `- [Formulario de contacto](${SITE_URL}/contacto): consultas por obra, encargos`,
    '  y colaboraciones.',
    '',
    '## Uso de este contenido',
    '',
    'Las imágenes de obra y tatuajes son propiedad de Natalia Heller. Se pueden',
    'citar con atribución y enlace a la página de origen; no están disponibles',
    'para entrenar modelos generativos (ver /robots.txt).',
    '',
  ]

  return new Response(lineas.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

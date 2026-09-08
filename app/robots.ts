import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Zonas privadas / transaccionales: fuera del índice para cualquier bot.
const PRIVADAS = ['/admin', '/checkout', '/api/']

// Bots de IA que consultan el sitio para responder y CITAN la fuente: traen
// tráfico, así que entran igual que un buscador clásico.
const IA_QUE_CITAN = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-User',
  'Claude-SearchBot',
]

// Bots que recolectan corpus para ENTRENAR modelos. Se bloquean: la obra de
// Natalia es el producto, y no hay contrapartida de tráfico ni atribución.
const IA_DE_ENTRENAMIENTO = [
  'GPTBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'Omgilibot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVADAS },
      { userAgent: IA_QUE_CITAN, allow: '/', disallow: PRIVADAS },
      { userAgent: IA_DE_ENTRENAMIENTO, disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

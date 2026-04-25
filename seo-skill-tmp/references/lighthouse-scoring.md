# Lighthouse — Scoring, Métricas y Herramientas

## Escala de puntuación

Lighthouse puntúa cada categoría de 0 a 100:
- 🟢 **90-100:** Bueno
- 🟡 **50-89:** Necesita mejoras
- 🔴 **0-49:** Pobre

---

## Performance — Pesos de cada métrica (2024+)

| Métrica | Peso | Target Bueno | Target Mejorable | Target Pobre |
|---------|------|-------------|------------------|--------------|
| **LCP** (Largest Contentful Paint) | 25% | < 2.5s | 2.5s–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | 30% | < 200ms | 200ms–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | 25% | < 0.1 | 0.1–0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | 10% | < 1.8s | 1.8s–3.0s | > 3.0s |
| **TTFB** (Time to First Byte) | 10% | < 800ms | 800ms–1800ms | > 1800ms |

> INP reemplazó a FID como Core Web Vital oficial en **marzo 2024**.

### Diferencia entre Lighthouse Lab vs Field Data

| Tipo | Qué es | Dónde verlo |
|------|--------|-------------|
| **Lab data** | Simulado en condiciones controladas | Lighthouse CLI, DevTools, PageSpeed |
| **Field data (CrUX)** | Datos reales de usuarios de Chrome | PageSpeed Insights, Search Console |

Google usa **field data** para el ranking. Si hay discrepancia, los datos de campo mandan.

---

## SEO — Audits que Lighthouse verifica

### Críticos (afectan score directamente)
- `<title>` presente y descriptivo (no vacío, no genérico)
- `<meta name="description">` presente (mejora CTR, no ranking directo)
- Links con texto descriptivo (no "click aquí", "ver más")
- Imágenes con atributo `alt`
- `robots.txt` válido como `text/plain`
- Página rastreable (sin `noindex` accidental, sin bloqueo en robots.txt)
- Status codes correctos (sin 4xx/5xx en recursos críticos)

### Moderados
- `<link rel="canonical">` definida
- Links internos son rastreables (href válido, no void/javascript:)
- Estructura de headings lógica (h1 único, sin saltos)
- Schema markup válido (verificar con Rich Results Test)
- `<meta name="viewport">` configurado (mobile-friendly)

### Informativos
- Charset declarado (`<meta charset="UTF-8">`)
- hreflang si hay múltiples idiomas/regiones

---

## Accesibilidad — Audits principales

### Críticos (bloquean usuarios con discapacidad)
- Contraste de color ≥ 4.5:1 texto normal, ≥ 3:1 texto grande
- Alt text en imágenes informativas
- Labels asociados a inputs de formulario
- Botones con texto accesible (visible o aria-label)
- Elementos interactivos alcanzables por teclado

### Moderados
- `lang` attribute en `<html>`
- Skip link para navegación por teclado
- Headings en orden lógico
- Focus visible en elementos interactivos

---

## Best Practices — Audits relevantes

- HTTPS obligatorio (HTTP → penalización + warning de browser)
- Sin errores JavaScript en consola
- Sin APIs deprecadas del browser
- Imágenes con aspect-ratio correcto (sin distorsión)
- CSP (Content Security Policy) configurado
- No solicitar permisos intrusivos al cargar (geolocalización, notificaciones)

---

## Herramientas de diagnóstico

### Herramientas online (sin instalar nada)
| Herramienta | URL | Para qué sirve |
|-------------|-----|----------------|
| **PageSpeed Insights** | https://pagespeed.web.dev | CWV lab + field data real de Chrome |
| **Search Console** | https://search.google.com/search-console | CWV campo real, errores de crawl, indexación |
| **Rich Results Test** | https://search.google.com/test/rich-results | Validar JSON-LD schemas |
| **Schema Validator** | https://validator.schema.org | Validar structured data |
| **OG Debugger (Meta)** | https://developers.facebook.com/tools/debug/ | Ver cómo se ve el link en Facebook/WhatsApp |
| **Twitter Card Validator** | https://cards-dev.twitter.com/validator | Preview de Twitter Cards |
| **WebAIM Contrast** | https://webaim.org/resources/contrastchecker/ | Verificar ratios de contraste |
| **WebPageTest** | https://webpagetest.org | Análisis profundo de waterfall, TTFB por CDN |

### CLI (más preciso, sin throttling de red)
```bash
# Instalar Lighthouse
npm install -g lighthouse

# Auditoría completa con reporte HTML
lighthouse https://mi-sitio.com --view --output html --output-path ./lighthouse.html

# Solo performance + CWV
lighthouse https://mi-sitio.com --only-categories=performance --output json

# Simular móvil 3G (condiciones estrictas)
lighthouse https://mi-sitio.com --preset=perf --throttling-method=simulate

# Múltiples runs para promediar (CWV puede variar)
for i in 1 2 3; do lighthouse https://mi-sitio.com --output json --output-path ./run-$i.json; done
```

### Next.js específico
```bash
# Analizar bundle size
ANALYZE=true next build  # requiere @next/bundle-analyzer

# Ver chunks generados
ls -lah .next/static/chunks/*.js | sort -k5 -hr | head -20

# Verificar que ISR/cache funciona
curl -I https://mi-sitio.com | grep -E "cache-control|x-vercel-cache"
```

---

## Estimación de impacto SEO por tipo de mejora

| Mejora | Impacto ranking | Tiempo en ver resultados |
|--------|----------------|--------------------------|
| Arreglar robots.txt/sitemap | **Alto** (desbloqueador de indexación) | 1–4 semanas (esperar re-crawl) |
| LCP < 2.5s | **Alto** (Core Web Vital directo) | 2–4 semanas |
| Eliminar CLS > 0.1 | **Medio-Alto** (ranking + UX) | 2–4 semanas |
| Mejorar INP < 200ms | **Medio** (CWV emergente) | 2–4 semanas |
| Agregar JSON-LD schemas | **Alto** (rich snippets en SERP) | 2–8 semanas |
| Agregar meta descriptions | **Medio** (solo CTR, no ranking) | Inmediato en SERP |
| Agregar OG tags | **Bajo** (solo social sharing) | Inmediato al compartir |
| Links internos | **Medio** (crawlability + PageRank) | 4–12 semanas |
| Backlinks off-page | **Alto** | 3–12 meses |
| Mejoras de contenido / keywords | **Alto** (sostenido) | 1–6 meses |

---

## Frecuencia de auditoría recomendada

| Tipo | Frecuencia |
|------|-----------|
| Críticos (robots, sitemap, meta tags) | Después de cada deploy |
| Core Web Vitals / Performance | Mensual o tras cambios de assets |
| SEO on-page / contenido | Trimestral |
| Off-page / backlinks | Mensual (revisión), continuo (acción) |
| Accesibilidad | Ante cambios de UI significativos |

---
name: seo-lighthouse-audit
description: >
  Auditoría SEO técnica + Lighthouse + Core Web Vitals para cualquier proyecto web
  (Next.js, Remix, Astro, SvelteKit, sitios estáticos, etc.).
  Usá este skill siempre que el usuario mencione: SEO, Lighthouse, Core Web Vitals,
  LCP, CLS, INP, TTFB, FCP, meta tags, Open Graph, robots.txt, sitemap, JSON-LD,
  structured data, rendimiento del sitio, velocidad de carga, accesibilidad WCAG,
  posicionamiento orgánico, PageSpeed, Search Console, puntuación de performance,
  auditoría técnica web, o cualquier mejora de visibilidad/rendimiento del sitio.
  Genera un diagnóstico completo con plan de acción priorizado y código listo para aplicar.
---

# SEO & Lighthouse Audit — Skill Genérico

## Propósito

Este skill convierte cualquier pedido de auditoría en un proceso estructurado y reproducible.
Funciona con cualquier URL pública, cualquier framework, y cualquier nivel de acceso al código.

---

## Paso 0 — Reconocimiento del proyecto

Antes de auditar, recopilá esta información del usuario (si no está disponible en el contexto):

```
URL del sitio:        __________
Framework/stack:      __________  (Next.js, Astro, WordPress, etc.)
Hosting:              __________  (Vercel, Netlify, VPS, etc.)
Acceso al código:     ☐ Sí (repo/carpeta accesible)  ☐ No (solo URL)
Resultados previos:   ☐ Tengo JSON de Lighthouse  ☐ No tengo nada
Áreas prioritarias:   ☐ Performance  ☐ SEO  ☐ Accesibilidad  ☐ Best Practices  ☐ Todas
Contexto del negocio: __________  (portfolio, e-commerce, SaaS, landing page, etc.)
Audiencia target:     __________  (personas que busca atraer)
```

Si el usuario no lo especificó, preguntá brevemente: *"¿Tenés el código disponible o analizamos desde la URL? ¿Hay algún área que te preocupe más?"*

---

## Paso 1 — Recolectar datos del sitio

Según el acceso disponible, usá estas fuentes en orden de confiabilidad:

### 1A. Con acceso al código
Leer los archivos clave según el framework:

| Framework | Dónde buscar meta/SEO | Dónde buscar performance |
|-----------|----------------------|--------------------------|
| Next.js App Router | `app/**/layout.tsx`, `app/**/page.tsx`, `app/robots.ts`, `app/sitemap.ts` | `next.config.js`, `next.config.ts`, `public/` |
| Next.js Pages Router | `pages/_app.tsx`, `pages/_document.tsx`, `pages/*.tsx` | `next.config.js`, `public/` |
| Astro | `src/layouts/`, `src/pages/`, `astro.config.mjs` | `astro.config.mjs`, imágenes en `public/` |
| Remix | `app/root.tsx`, `app/routes/`, `remix.config.js` | `app/entry.server.tsx`, `public/` |
| SvelteKit | `src/routes/+layout.svelte`, `src/app.html` | `svelte.config.js`, `static/` |
| Genérico | `index.html`, archivos de layout/template | Configuración del bundler/host |

### 1B. Solo URL (sin código)
Hacer fetch a estas URLs y analizar el HTML/contenido:

```
https://[dominio]/                    → Homepage
https://[dominio]/robots.txt          → Debe ser text/plain
https://[dominio]/sitemap.xml         → Debe ser text/xml
https://[dominio]/favicon.ico         → Verificar existencia
```

Extraer del HTML source:
- Todos los `<meta>` tags del `<head>`
- `<title>`, `<link rel="canonical">`, `<html lang="">`
- Scripts JSON-LD (`<script type="application/ld+json">`)
- Primer `<h1>` visible
- Imágenes above-the-fold (primeras 3-5) y si tienen `alt` + `loading` + `width/height`

---

## Paso 2 — Auditoría SEO Técnico

Verificá cada punto y anotá ✅ OK / ⚠️ Mejorable / ❌ Faltante/Roto:

### Crawlabilidad e Indexación
```
robots.txt
  - ¿Existe y responde text/plain? (no HTML)
  - ¿Permite indexar las rutas públicas correctas?
  - ¿Apunta a la URL correcta del sitemap?
  - ¿Bloquea rutas de admin/api correctamente?

sitemap.xml
  - ¿Existe y responde text/xml?
  - ¿Lista todas las rutas relevantes?
  - ¿Incluye lastmod y changefreq?
  - ¿Está submiteado en Google Search Console?

noindex / nofollow
  - ¿Alguna página pública tiene meta robots con noindex?
  - ¿Hay redirecciones incorrectas (301 vs 302)?
```

### On-Page Básico
```
<title>
  - ¿Existe en cada página?
  - ¿Es único por ruta?
  - ¿Largo: 50-60 caracteres (se trunca a ~580px en SERP)?
  - ¿Incluye keyword primaria + nombre del sitio?

<meta name="description">
  - ¿Existe en cada página?
  - ¿Largo: 150-160 caracteres?
  - ¿Tiene CTA implícito?

<link rel="canonical">
  - ¿Definida en todas las páginas?
  - ¿Apunta a la URL canónica correcta (con/sin trailing slash)?
  - ¿Coincide con la URL paginada vs base?

Estructura de headings
  - ¿Un solo <h1> por página?
  - ¿Jerarquía lógica (h1 → h2 → h3, sin saltos)?
  - ¿h1 contiene la keyword primaria?

Imágenes
  - ¿alt text presente y descriptivo en todas?
  - ¿alt vacío (alt="") en imágenes decorativas?
```

### Social / Open Graph
```
Open Graph (og:)
  - og:title        → ¿Presente? ¿Diferente al <title> si conviene?
  - og:description  → ¿Presente? ¿Optimizado para social?
  - og:image        → ¿Presente? ¿1200x630px o 1:1 mínimo 800x800px?
  - og:url          → ¿Coincide con canonical?
  - og:type         → website / article / product según el caso
  - og:locale       → ¿Correcto para el idioma/región?

Twitter Cards
  - twitter:card     → summary_large_image (recomendado)
  - twitter:title    → ¿Presente?
  - twitter:description → ¿Presente?
  - twitter:image    → ¿Presente?
```

### Structured Data (JSON-LD)
Identificar qué tipo de sitio es y verificar el schema correspondiente.
Ver `references/schema-patterns.md` para los schemas recomendados por tipo de proyecto.

---

## Paso 3 — Auditoría Core Web Vitals (Performance)

Este es el área de mayor impacto directo en ranking. Auditarla siempre con detalle.

### Las 5 métricas clave

| Métrica | Qué mide | Target "Bueno" | Fuente de datos |
|---------|----------|----------------|-----------------|
| **LCP** (Largest Contentful Paint) | Velocidad de carga percibida | **< 2.5s** | PSI, Search Console, Lighthouse |
| **INP** (Interaction to Next Paint) | Responsividad al interactuar | **< 200ms** | PSI, CrUX, Lighthouse |
| **CLS** (Cumulative Layout Shift) | Estabilidad visual del layout | **< 0.1** | PSI, Lighthouse, DevTools |
| **TTFB** (Time to First Byte) | Velocidad del servidor | **< 800ms** | PSI, WebPageTest |
| **FCP** (First Contentful Paint) | Primer elemento visible | **< 1.8s** | Lighthouse |

> INP reemplazó a FID como Core Web Vital en marzo 2024.

### Diagnóstico por métrica

#### LCP — Causas comunes y fixes

**Identificar el elemento LCP:** suele ser la imagen hero, el h1, o un bloque de texto grande.

Con acceso al código, buscar:
```
❌ Problemas que degradan LCP:
- <img> sin width/height (causa CLS además)
- <img> sin priority en imágenes above-the-fold (Next.js)
- Fuentes cargadas sin preconnect/preload
- CSS bloqueante en <head> sin inline
- Servidor lento (TTFB alto arrastra el LCP)
- Imágenes demasiado grandes (> 200KB para mobile)
- Formatos legacy (JPEG/PNG en vez de WebP/AVIF)

✅ Soluciones:
- Agregar priority a la primera imagen visible
- Usar next/image / <Image> con sizes correcto
- Preload del recurso LCP: <link rel="preload" as="image">
- Servir imágenes en WebP/AVIF
- Habilitar cache aggressive (stale-while-revalidate)
```

#### CLS — Causas comunes y fixes

```
❌ Problemas que generan CLS:
- Imágenes sin width + height explícito (el browser no reserva espacio)
- Anuncios, embeds, iframes sin dimensiones fijas
- Fuentes que causan FOUT (Flash of Unstyled Text)
- Elementos que se insertan sobre contenido existente (banners, cookies)
- Animaciones que modifican top/left/margin/padding (usar transform en su lugar)

✅ Soluciones:
- SIEMPRE definir width y height en <img> (o aspect-ratio en CSS)
- Usar font-display: swap + preload de fuentes críticas
- Reservar espacio para ads/embeds con min-height
- Usar CSS transform para animaciones en lugar de propiedades geométricas
```

#### INP — Causas comunes y fixes

```
❌ Problemas que degradan INP:
- JavaScript que bloquea el main thread (long tasks > 50ms)
- Event listeners costosos sin debounce/throttle
- Re-renders innecesarios en React/frameworks
- Hydration pesada (mucho JS cliente)
- Third-party scripts síncronos

✅ Soluciones:
- Code splitting: cargar solo el JS necesario por ruta
- Lazy loading de componentes pesados (React.lazy, dynamic())
- Reducir bundle size (analizar con @next/bundle-analyzer o similar)
- Cargar third-party scripts con strategy="lazyOnload" (Next.js) o async/defer
- Usar Server Components para reducir hidratación (Next.js / React)
- Implementar virtualization para listas largas
```

#### TTFB — Causas comunes y fixes

```
❌ Problemas que aumentan TTFB:
- Servidor sin CDN o CDN mal configurado
- Queries lentas a base de datos (sin índices, N+1 queries)
- No usar cache de respuestas (sin ISR, sin Cache-Control)
- Origen geográficamente lejos del usuario
- Serverless cold starts frecuentes

✅ Soluciones:
- Habilitar Edge Network / CDN global
- Cache de datos: ISR en Next.js, SWR, stale-while-revalidate
- Optimizar queries DB (índices, connection pooling)
- Reducir cold starts: Vercel Edge Functions, prewarming
- Headers de cache correctos en vercel.json o next.config.js
```

### Análisis con acceso al código — checklist rápido

```bash
# Buscar imágenes sin priority en el viewport inicial (Next.js)
grep -r "<Image" src/ --include="*.tsx" | grep -v "priority"

# Buscar third-party scripts cargados síncronamente
grep -r "<script" src/ --include="*.tsx" | grep -v "next/script"

# Buscar imágenes sin width/height
grep -r "<img " src/ --include="*.tsx" | grep -v "width"

# Ver bundle size aproximado
du -sh .next/static/chunks/*.js 2>/dev/null | sort -hr | head -10
```

---

## Paso 4 — Accesibilidad (a11y)

```
Contraste de colores
  - Texto normal:  ratio ≥ 4.5:1  (WCAG AA)
  - Texto grande:  ratio ≥ 3:1    (≥ 18pt o 14pt bold)
  - Elementos UI:  ratio ≥ 3:1    (botones, inputs, íconos)
  - Herramienta rápida: https://webaim.org/resources/contrastchecker/

Imágenes y multimedia
  - alt texto descriptivo y único en imágenes informativas
  - alt="" en imágenes puramente decorativas
  - Videos: subtítulos y transcripción si contienen info relevante

Navegación y semántica
  - <html lang="[código]"> correcto (es, es-AR, en, etc.)
  - <h1> único y descriptivo por página
  - Jerarquía de headings sin saltos
  - Landmarks semánticos: <main>, <nav>, <header>, <footer>
  - Focus visible en todos los elementos interactivos

Formularios
  - Cada <input> tiene <label> asociado (for/id o wrapping)
  - Campos requeridos marcados (required + aria-required)
  - Mensajes de error vinculados al campo (aria-describedby)

Interactividad
  - Todos los elementos clickeables son alcanzables por teclado
  - Orden de tab lógico (tabindex no rompe el flujo)
  - Modales/dialogs: foco atrapado dentro mientras están abiertos
```

---

## Paso 5 — Best Practices

```
Seguridad
  - HTTPS con HSTS configurado
  - Content-Security-Policy header (aunque sea permisivo al inicio)
  - X-Frame-Options o frame-ancestors en CSP
  - No exponer información sensible en source/headers

JavaScript
  - Sin errores en consola de browser
  - No usar APIs deprecadas (document.write, synchronous XHR)
  - No usar console.log en producción (noise + leve leak de info)

Imágenes
  - Aspect ratio correcto (evita CLS)
  - No imágenes de resolución mayor a la necesaria
  - WebP/AVIF preferido sobre PNG/JPEG
```

---

## Paso 6 — Plan de acción priorizado

Organizá todos los hallazgos en tres niveles. Presentar siempre con código listo.

### Formato de cada ítem

```
[NIVEL] Título corto del problema

Impacto SEO/Performance: ⭐⭐⭐⭐⭐  |  Esfuerzo: ⭐⭐
Métrica afectada: LCP / CLS / INP / TTFB / Ranking / Accesibilidad

Por qué importa: [explicación en 1-2 líneas]

Solución:
```código```
```

### 🔴 CRÍTICOS — Resolver esta semana
Problemas que bloquean indexación, penalizan directamente, o causan CWV en rojo.

- robots.txt / sitemap devolviendo HTML
- Páginas con noindex accidental
- LCP > 4s, CLS > 0.25, INP > 500ms
- Falta de `<title>` o canonical
- Errores 404/500 en rutas públicas

### 🟡 ESTRATÉGICOS — Próximas 2 semanas
Optimizaciones que mejoran posición y CTR.

- Mejorar meta descriptions (longitud, CTA)
- Agregar JSON-LD schemas faltantes
- Optimizar LCP a < 2.5s
- Reducir CLS a < 0.1
- Open Graph / Twitter Cards completos

### 🟢 MEJORAS CONTINUAS — Próximos 30-90 días
Trabajo de fondo que acumula posicionamiento.

- Estrategia de keywords y optimización de contenido
- Link building / SEO off-page
- Mejoras de INP (code splitting, bundle optimization)
- Auditoría trimestral programada

---

## Paso 7 — Output final

Presentá el resultado siempre con esta estructura:

### 1. Resumen ejecutivo
```
Sitio:           [URL]
Framework:       [stack]
Fecha auditoría: [fecha]

Puntuación estimada Lighthouse:
  Performance:    [x/100]  → [estado]
  SEO:            [x/100]  → [estado]
  Accesibilidad:  [x/100]  → [estado]
  Best Practices: [x/100]  → [estado]

Core Web Vitals (campo/lab):
  LCP:  [valor] → [🟢 Bueno / 🟡 Mejoras / 🔴 Pobre]
  INP:  [valor] → [estado]
  CLS:  [valor] → [estado]
```

### 2. Tabla de hallazgos

| Área | Issue | Severidad | Estado |
|------|-------|-----------|--------|
| Performance | LCP > 3.2s (imagen hero sin priority) | 🔴 Crítico | ❌ |
| SEO | robots.txt devuelve 200 HTML | 🔴 Crítico | ❌ |
| ... | ... | ... | ... |

### 3. Plan de acción (ver Paso 6)

### 4. Siguiente auditoría recomendada

Según el estado actual del sitio, sugerir cuándo volver a auditar:
- **Deploy reciente sin SEO técnico:** volver en 1 semana con los críticos resueltos
- **Site en mantenimiento activo:** auditar tras cada feature release
- **Site estable:** auditoría completa trimestral; performance mensual

---

Cerrar siempre con:
> "¿Querés que profundice en alguna métrica específica o que genere el código completo para alguna mejora?"

---

## Referencias

- `references/lighthouse-scoring.md` → Pesos de métricas, herramientas de diagnóstico, impacto por mejora
- `references/schema-patterns.md` → Schemas JSON-LD por tipo de proyecto (portfolio, e-commerce, SaaS, blog, landing)
- `references/cwv-deep-dive.md` → Técnicas avanzadas de optimización por métrica CWV

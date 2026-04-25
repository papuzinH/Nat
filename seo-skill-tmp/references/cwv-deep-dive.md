# Core Web Vitals — Deep Dive por Métrica

Guía técnica avanzada para diagnosticar y optimizar cada CWV.
Para el contexto general (umbrales, herramientas) ver `lighthouse-scoring.md`.

---

## LCP — Largest Contentful Paint

### ¿Qué mide?
El tiempo desde que el usuario navega a la página hasta que el elemento de contenido más grande (imagen o bloque de texto) es visible en el viewport.

### Identificar el elemento LCP

**En DevTools:**
1. Abrir Performance panel → grabar carga
2. Buscar el marcador "LCP" en el timeline
3. Ver qué elemento está marcado

**En Lighthouse JSON:**
```json
"largest-contentful-paint-element": {
  "details": {
    "items": [{ "node": { "nodeLabel": "..." } }]
  }
}
```

**Elementos LCP más comunes:**
- Imagen hero (la más grande above-the-fold)
- Imagen de portada en blog posts
- Bloque de texto grande (h1 + párrafo inicial)
- Video thumbnail

### Causas raíz del LCP lento (árbol de decisión)

```
TTFB alto (> 800ms)?
  → Sí: El servidor es el cuello de botella
    - ¿CDN configurado? → Si no, habilitarlo
    - ¿Cache de HTML? → Usar ISR / Cache-Control
    - ¿Queries lentas? → Optimizar DB o usar Edge
  → No: El problema es en el cliente

Recurso LCP es una imagen?
  → ¿Está siendo preloaded? → Agregar <link rel="preload">
  → ¿Tiene priority prop? (Next.js) → Agregar priority
  → ¿Tamaño en KB? → Si > 200KB para mobile, comprimir/convertir a WebP

Recurso LCP es texto?
  → ¿Fuente web bloqueante? → Agregar font-display: swap + preconnect
  → ¿Render-blocking CSS? → Inline critical CSS
```

### Fixes con código

**Next.js — Imagen hero con priority:**
```tsx
import Image from 'next/image'

// ✅ Correcto: priority en imagen above-the-fold
export default function Hero() {
  return (
    <Image
      src="/hero.webp"
      alt="Hero image"
      width={1200}
      height={600}
      priority  // ← esto hace preload automático
      sizes="100vw"
    />
  )
}
```

**Preload manual para cualquier framework:**
```html
<!-- En el <head>, antes de cualquier otro recurso -->
<link
  rel="preload"
  as="image"
  href="/hero.webp"
  fetchpriority="high"
/>
```

**Preconnect a CDN de imágenes:**
```html
<link rel="preconnect" href="https://cdn.tudominio.com" />
<link rel="dns-prefetch" href="https://cdn.tudominio.com" />
```

**Cache de páginas con Next.js ISR:**
```tsx
// app/page.tsx — revalida cada hora
export const revalidate = 3600

// O fetch con cache
const data = await fetch('https://api.ejemplo.com/data', {
  next: { revalidate: 3600 }
})
```

**Vercel cache headers:**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, stale-while-revalidate=86400"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## CLS — Cumulative Layout Shift

### ¿Qué mide?
La suma de todos los "saltos" inesperados de layout durante la vida de la página. Un CLS de 0 es ideal; > 0.1 es penalizado.

### Score CLS = impact fraction × distance fraction
- **impact fraction:** qué porcentaje del viewport se vio afectado
- **distance fraction:** cuánto se movió el elemento más lejos

### Causas más comunes

**1. Imágenes sin dimensiones:**
```html
<!-- ❌ El browser no sabe cuánto espacio reservar -->
<img src="foto.jpg" alt="...">

<!-- ✅ Con dimensiones explícitas -->
<img src="foto.jpg" alt="..." width="800" height="600">

<!-- ✅ O con aspect-ratio en CSS -->
<style>
.imagen-container {
  aspect-ratio: 4/3;
  width: 100%;
}
</style>
```

**2. Anuncios/iframes sin espacio reservado:**
```css
/* Reservar espacio antes de que cargue el ad */
.ad-container {
  min-height: 250px; /* altura estándar del ad */
  width: 300px;
}
```

**3. Fuentes que causan FOUT (Flash of Unstyled Text):**
```html
<!-- Preconnect al servidor de fuentes -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload de la fuente principal -->
<link
  rel="preload"
  href="/fonts/mi-fuente.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

```css
@font-face {
  font-family: 'MiFuente';
  src: url('/fonts/mi-fuente.woff2') format('woff2');
  font-display: swap; /* muestra fallback mientras carga */
  /* font-display: optional → máximo anti-CLS, puede no mostrar la fuente */
}
```

**4. Banners/cookies que aparecen sobre contenido:**
```css
/* ✅ Usar position: fixed para que no desplace el layout */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
```

**5. Animaciones con propiedades geométricas:**
```css
/* ❌ Genera CLS */
.card:hover {
  margin-top: -10px;
  height: calc(100% + 10px);
}

/* ✅ transform no genera CLS (opera en compositor thread) */
.card:hover {
  transform: translateY(-10px);
}
```

**Next.js — Image con fill para contenedores responsive:**
```tsx
<div style={{ position: 'relative', aspectRatio: '16/9' }}>
  <Image
    src="/imagen.webp"
    alt="..."
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    style={{ objectFit: 'cover' }}
  />
</div>
```

---

## INP — Interaction to Next Paint

### ¿Qué mide?
La latencia desde que el usuario interactúa (click, tap, teclado) hasta que el browser pinta la siguiente frame. Se usa el percentil 75 de todas las interacciones.

### Herramienta de diagnóstico
Usar el **Interaction to Next Paint DevTools** (disponible en Chrome Performance panel desde 2024).

### Causas principales

**1. Long Tasks en el main thread:**
```javascript
// ❌ Tarea larga que bloquea el thread
function procesarDatos(items) {
  items.forEach(item => {
    // operación costosa × muchos items
  })
}

// ✅ Dividir con scheduler.yield() o setTimeout
async function procesarDatosChunks(items) {
  const CHUNK_SIZE = 50
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE)
    chunk.forEach(item => { /* procesar */ })
    await scheduler.yield() // ceder el hilo entre chunks
  }
}
```

**2. Hydration pesada en React/Next.js:**
```tsx
// ✅ Lazy loading de componentes pesados
import dynamic from 'next/dynamic'

const GraficoPesado = dynamic(() => import('./GraficoPesado'), {
  loading: () => <div>Cargando...</div>,
  ssr: false // solo si no necesita SSR
})

// ✅ Server Components para reducir JS cliente
// Mover lógica que no necesita interactividad al servidor
```

**3. Re-renders innecesarios en React:**
```tsx
// ✅ Memoizar componentes costosos
import { memo, useMemo, useCallback } from 'react'

const ListaItem = memo(({ item, onClick }) => (
  <li onClick={() => onClick(item.id)}>{item.nombre}</li>
))

function Lista({ items }) {
  const handleClick = useCallback((id) => {
    // handler estable entre renders
  }, [])

  const itemsFiltrados = useMemo(() =>
    items.filter(i => i.activo), [items]
  )

  return <ul>{itemsFiltrados.map(item =>
    <ListaItem key={item.id} item={item} onClick={handleClick} />
  )}</ul>
}
```

**4. Third-party scripts bloqueantes:**
```tsx
// ❌ Script síncrono en <head>
<script src="https://analytics.ejemplo.com/track.js" />

// ✅ Con Next.js Script component
import Script from 'next/script'

<Script
  src="https://analytics.ejemplo.com/track.js"
  strategy="lazyOnload" // carga después de que la página sea interactiva
/>

// O afterInteractive para scripts que necesitan el DOM
<Script strategy="afterInteractive" />
```

**5. Reducir bundle de JavaScript:**
```bash
# Analizar qué ocupa más en el bundle
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer({})

# Correr
ANALYZE=true npm run build
```

---

## TTFB — Time to First Byte

### ¿Qué mide?
El tiempo desde que el browser inicia la solicitud HTTP hasta que recibe el primer byte de la respuesta del servidor.

### Diagnóstico

En DevTools → Network → click en el documento HTML → pestaña Timing:
- **Waiting (TTFB):** tiempo de espera hasta el primer byte
- **DNS:** resolución de DNS (debería ser < 50ms con buena CDN)
- **Initial connection:** establecer TCP/TLS

### Causas y fixes

**1. Sin CDN o CDN mal configurado:**
- Vercel Edge Network: configurado por defecto en proyectos Vercel
- Verificar que el dominio apunta a Vercel y no a otro origen

```bash
# Verificar headers de caché
curl -I https://mi-sitio.com | grep -E "x-vercel-cache|cache-control|age"
# x-vercel-cache: HIT = sirvió desde CDN
# x-vercel-cache: MISS = fue al origen
```

**2. Páginas sin cache (SSR sin ISR):**
```tsx
// ✅ Next.js — Revalidar la página cada hora
export const revalidate = 3600

// ✅ O cachear el fetch individual
const res = await fetch(url, { next: { revalidate: 3600 } })

// ✅ O staticParams para rutas dinámicas
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map(p => ({ slug: p.slug }))
}
```

**3. Serverless cold starts:**
```typescript
// Vercel Edge Functions (< 1ms cold start vs ~300ms serverless)
// Mover handlers simples a edge runtime

export const runtime = 'edge' // en route handlers o middleware

// next.config.js — Configurar regiones
module.exports = {
  experimental: {
    // Deprecar si ya no es experimental en tu versión de Next
  }
}
```

**4. Queries lentas a DB:**
```typescript
// ✅ Connection pooling (Prisma + PgBouncer o Neon/Supabase)
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Para Vercel: usar directUrl para migrations
  directUrl = env("DIRECT_URL")
}

// ✅ Seleccionar solo campos necesarios
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true } // no traer todo
})

// ✅ Evitar N+1 con include
const posts = await prisma.post.findMany({
  include: { author: { select: { name: true } } }
})
```

---

## FCP — First Contentful Paint

### ¿Qué mide?
Tiempo hasta que el browser renderiza cualquier texto o imagen (no necesariamente el LCP).

### Relación con otros CWV
FCP siempre es ≤ LCP. Si FCP es alto, LCP también será alto. Optimizar TTFB suele ser el fix más efectivo.

### Fixes específicos

**Inline critical CSS:**
```tsx
// Para frameworks que no lo hacen automáticamente
// El CSS crítico (above-the-fold) debe estar inline en el <head>
// Next.js con Tailwind lo optimiza automáticamente con CSS Modules

// Si usás CSS custom, herramientas como 'critical' pueden extraerlo:
// npm install --save-dev critical
```

**Eliminar render-blocking resources:**
```html
<!-- ❌ CSS blocking -->
<link rel="stylesheet" href="/styles.css">

<!-- ✅ Cargar no-crítico async (ejemplo para CSS de terceros) -->
<link rel="preload" href="/fonts.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/fonts.css"></noscript>
```

---

## Checklist rápido de diagnóstico CWV

Correr en este orden:

1. **PageSpeed Insights** → Obtener field data real + Lighthouse
2. **Identificar la métrica más roja** → Focalizarse en la peor primero
3. **DevTools Performance** → Grabar carga y buscar long tasks, LCP element, layout shifts
4. **Lighthouse CLI** con `--output json` → Extraer `audits` para detalles
5. **Network tab** → Verificar TTFB, tamaño de recursos, waterfall
6. **Coverage tab** → Detectar JS/CSS no utilizado (candidatos para lazy loading)

```bash
# Script de diagnóstico rápido para cualquier sitio
lighthouse https://[sitio] \
  --output json \
  --output-path ./audit.json \
  --only-categories=performance \
  --chrome-flags="--headless"

# Extraer solo los CWV del JSON
cat audit.json | python3 -c "
import json, sys
d = json.load(sys.stdin)
audits = d['audits']
metrics = ['largest-contentful-paint', 'cumulative-layout-shift',
           'interaction-to-next-paint', 'first-contentful-paint',
           'server-response-time']
for m in metrics:
    a = audits.get(m, {})
    print(f\"{a.get('title', m)}: {a.get('displayValue', 'N/A')} ({a.get('score', '?')})\")"
```

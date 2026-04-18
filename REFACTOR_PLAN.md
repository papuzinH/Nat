# NatArt — Plan de Refactorización

> **Fecha:** 2026-04-18  
> **Estado:** Planificación — pendiente de ejecución  
> **Objetivo:** Migrar el sitio de portfolio de tatuadora a e-commerce artístico con la tienda como eje central.  
> **Pilares técnicos transversales:** SEO/LLMO clase A, Lighthouse 100/100, GSAP animations.

---

## Nueva arquitectura del sitio

### Routing objetivo

```
/                   → Home (hero + featured productos + CTA tienda)
/tienda             → Tienda (catálogo con filtros)
/tienda/:slug       → Producto individual
/estudio            → El Estudio (ex /tattoo — portfolio + historia + agenda)
/blog               → Blog
/blog/:slug         → Post individual
/contacto           → Contacto (genérico, no solo tattoo)
```

### Rutas eliminadas

| Ruta actual | Destino |
|---|---|
| `/obras` | Eliminada — el contenido migra a `/tienda` |
| `/obras/:slug` | Eliminada |
| `/sobre-mi` | Eliminada como página propia — contenido se integra en `/estudio` |
| `/faqs` | Eliminada como página standalone — FAQs se dividen en dos: componente dentro de `/estudio` y FAQs inline en cada product page |
| `/tattoo` | Renombrada a `/estudio` |
| `/tattoo/:id` | Eliminada — no hay "obras de tattoo", para tatuar se agenda por contacto |

### Navegación (Header)

```
Tienda | El Estudio | Blog | Contacto
```

Logo "N" en el centro (desktop) se mantiene.

---

## Modelo de datos — Productos

### Tipos de producto

```typescript
type ProductType = 'print' | 'sticker' | 'hoja-colorear' | 'abanico'

// Próximamente (no bloquean el lanzamiento):
// 'tote-bag' | 'espejo-grabado' | 'filtro' | 'llavero' | 'mazo-cartas' | 'puzzle' | 'almohadon' | 'funda-celular'
```

### Interfaz Product

```typescript
interface Product {
  id: string
  slug: string
  name: string
  type: ProductType
  description: string
  images: string[]           // array, primera imagen es la principal
  tags: string[]             // para filtros por temática
  basePrice: number          // en ARS
  stock: number
  onDemand: boolean          // si true → mostrar aviso de demora de producción
  variants?: ProductVariant[]
  addons?: ProductAddon[]    // opcionales que suman al precio (ej: marco)
  status: 'active' | 'coming-soon' | 'out-of-stock'
}

interface ProductVariant {
  id: string
  label: string              // 'A4', 'A3', 'A5', 'A6' / 'x1', 'x5', 'x10'
  priceModifier: number      // suma o resta al basePrice
  stock: number
}

interface ProductAddon {
  id: string
  label: string              // 'Sin marco', 'Marco negro', 'Marco invisible', 'Marco madera'
  price: number
}
```

### Variantes por tipo de producto

| Tipo | Variantes de tamaño/cantidad | Addons |
|---|---|---|
| Print | A4, A3, A5, A6 | Marco: negro / invisible / madera |
| Sticker | x1, x5, x10 | — |
| Hoja colorear | x unidad, x pack | — |
| Abanico | x unidad | — |

---

## Waves de implementación

---

### Wave 1 — Fundamentos: routing, nav y cleanup

**Objetivo:** El sitio tiene la nueva arquitectura de rutas y nav sin ningún contenido nuevo todavía.

**Tareas:**

1. **Limpiar rutas eliminadas en `App.tsx`**
   - Eliminar: `/obras`, `/obras/:slug`, `/sobre-mi`, `/faqs`, `/tattoo/:id`
   - Renombrar: `/tattoo` → `/estudio`
   - Agregar: `/tienda`, `/tienda/:slug`

2. **Actualizar Header**
   - Nav items: `Tienda | El Estudio | Blog | Contacto`
   - Actualizar `isActivePath` para las rutas nuevas
   - Actualizar mobile menu CTA: "IR A LA TIENDA" en lugar de "AGENDA TU CITA"

3. **Actualizar Footer**
   - Links: Tienda, El Estudio, Blog, Contacto
   - Info de contacto: hacer genérica (quitar foco solo en tattoo)
   - Lógica `isTransparent`: ajustar paths

4. **Crear páginas placeholder** para las rutas nuevas:
   - `src/pages/Tienda.tsx` — shell vacío
   - `src/pages/ProductDetail.tsx` — shell vacío
   - `src/pages/Estudio.tsx` — mover contenido de `Tattoo.tsx`

5. **Eliminar archivos legacy:**
   - `src/pages/obras-tipos/` (todo el directorio)
   - `src/pages/Obras.tsx`
   - `src/pages/CategoryPage.tsx`
   - `src/pages/SobreMi.tsx`
   - `src/pages/TattooDetail.tsx`
   - `src/pages/FAQs.tsx` (standalone)
   - `src/components/obras/` (directorio)
   - `src/components/sobremi/` (directorio)
   - `src/data/obras.ts`
   - `src/assets/obras/obras-data.ts`

6. **Fix urgentes en `index.html`:**
   - Título: "Natalia Heller — Arte & Tienda"
   - `lang="es"`
   - Meta description base

7. **Refactorizar Home:**
   - Hero CTA: "IR A LA TIENDA" → `/tienda`
   - Reemplazar `FeaturedPortfolioSection` (que muestra tattoos) por `FeaturedProductsSection` (placeholder con texto "Próximamente")
   - Eliminar `HomeFAQSection` del Home

**Archivos modificados:** `App.tsx`, `Header.tsx`, `Footer.tsx`, `Home.tsx`, `index.html`  
**Archivos creados:** `Tienda.tsx`, `ProductDetail.tsx`, `Estudio.tsx`  
**Archivos eliminados:** ver lista arriba

---

### Wave 2 — Modelo de datos y catálogo de tienda

**Objetivo:** La tienda tiene productos reales (o mock realista) con su estructura de datos correcta, y el catálogo muestra el grid con filtros básicos.

**Tareas:**

1. **Crear el modelo de datos de productos**
   - `src/data/products.ts` — tipos TypeScript + mock data inicial con productos reales de Nat
   - Incluir: prints (con variantes A4/A3/A5/A6 y addons de marco), stickers (x1/x5/x10), hojas para colorear, abanicos
   - Marcar productos futuros como `status: 'coming-soon'`

2. **Componentes de tienda:**
   - `src/components/tienda/ProductCard.tsx` — card con imagen, nombre, precio base, badge de tipo
   - `src/components/tienda/ProductGrid.tsx` — grid responsivo
   - `src/components/tienda/FilterBar.tsx` — filtros por tipo y temática (tag)
   - `src/components/tienda/ComingSoonCard.tsx` — card especial para productos futuros

3. **Página `/tienda`:**
   - Hero simple (sin video, más liviano)
   - FilterBar + ProductGrid
   - Sección "Próximamente" al final con las categorías futuras

4. **Hook `useTiendaLogic.ts`:**
   - Estado de filtros activos
   - Filtrado de productos por tipo y tag
   - Lógica de ordenamiento (por defecto, precio, etc.)

**Archivos creados:** `src/data/products.ts`, `src/components/tienda/*`, `src/hooks/useTiendaLogic.ts`  
**Archivos modificados:** `src/pages/Tienda.tsx`

---

### Wave 3 — Product Detail page

**Objetivo:** Cada producto tiene su página individual con selección de variante, addon de marco, y CTA de compra.

**Tareas:**

1. **Página `/tienda/:slug`** (`ProductDetail.tsx`):
   - Galería de imágenes del producto
   - Selector de variante (A4/A3/etc. o x1/x5/x10)
   - Selector de addon (marco, si aplica) con preview de precio total
   - Aviso de "on demand" si corresponde (`onDemand: true`)
   - FAQs específicas del producto (inline, no página separada) — ej: "¿El precio incluye el marco?", "¿Cuánto tarda el envío?"
   - CTA: "Agregar al carrito" (Wave 4) o "Consultar por WhatsApp" (fallback simple para MVP)

2. **Componentes:**
   - `src/components/tienda/VariantSelector.tsx`
   - `src/components/tienda/AddonSelector.tsx`
   - `src/components/tienda/PriceSummary.tsx`
   - `src/components/tienda/OnDemandBadge.tsx`
   - `src/components/tienda/ProductFAQ.tsx` — accordion reutilizable, instanciado con FAQ data específica del producto

**Archivos creados:** `src/pages/ProductDetail.tsx`, `src/components/tienda/VariantSelector.tsx`, `src/components/tienda/AddonSelector.tsx`, `src/components/tienda/PriceSummary.tsx`, `src/components/tienda/OnDemandBadge.tsx`, `src/components/tienda/ProductFAQ.tsx`

---

### Wave 4 — Carrito y checkout (MVP)

**Objetivo:** El usuario puede agregar productos al carrito y completar una compra real con Mercado Pago.

**Tareas:**

1. **Carrito (estado global):**
   - `src/hooks/useCart.ts` — estado del carrito (producto + variante + addon + cantidad)
   - Context o estado elevado en `App.tsx`
   - Componente `CartDrawer.tsx` — slide-in lateral con resumen del pedido
   - Persistencia en `localStorage`

2. **Página de checkout:**
   - `src/pages/Checkout.tsx`
   - Formulario: nombre, email, teléfono, dirección (si envío)
   - Selector de método de envío: "Envío con Ian" / "Retiro en domicilio"
   - Selector de método de pago: Mercado Pago / Transferencia / Efectivo (retiro)

3. **Integración Mercado Pago:**
   - Definir si se usa Checkout Pro (redirect) o Checkout Bricks (embebido)
   - Crear preferencia de pago desde un backend simple (edge function en Supabase o Vercel)
   - Webhook para confirmar pago

4. **Confirmación:**
   - Página `/checkout/confirmacion` con resumen del pedido
   - Email de confirmación (si se implementa backend)

**Nota:** Esta wave requiere decidir el backend (Supabase recomendado) antes de arrancar.

---

### Wave 5 — Panel de admin

**Objetivo:** Natalia puede ver y gestionar pedidos, stock y pagos desde una interfaz simple.

**Tareas:**

1. **Autenticación:** Supabase Auth (email + password, solo Nat)
2. **Ruta protegida:** `/admin`
3. **Vistas:**
   - `/admin/pedidos` — lista de pedidos con estado (pendiente, pagado, enviado)
   - `/admin/stock` — editar stock por variante de producto
   - `/admin/balance` — resumen de ventas y métodos de pago
   - `/admin/blog` — CRUD de posts del blog (reemplaza mock data)

---

### Wave 6 — Estudio (ex Tattoo) + FAQs de Estudio

**Objetivo:** La sección de tattoo queda prolija como "El Estudio", con su identidad propia y las FAQs de tatuaje integradas.

**Tareas:**

1. **Página `/estudio`:**
   - Mantener la historia de Nat (texto actual de `Tattoo.tsx`)
   - Portfolio de trabajos (las fotos de tattoo, sin ruta de detalle individual)
   - CTA único: "Agendar turno" → `/contacto`
   - FAQs de tattoo integradas al final de la página (usando el componente `useFAQLogic` existente, adaptado)

2. **Eliminar `useFAQLogic` standalone** — el componente FAQ se convierte en uno genérico reutilizable tanto en `/estudio` como en product pages.

3. **Actualizar `ContactForm`:**
   - Campo `consultType` ahora tiene opciones: "Tatuaje" / "Consulta sobre un producto" / "Otro"
   - Si `consultType === 'tattoo'`, mostrar campos adicionales de tattoo

**Archivos modificados:** `src/pages/Estudio.tsx`, `src/components/contacto/useContactForm.ts`  
**Archivos creados:** `src/components/shared/FAQSection.tsx` (genérico, reemplaza el actual `FAQAccordion`)

---

---

## Pilares técnicos transversales

Estos tres pilares aplican a **todas las waves** y no son opcionales. Cada componente nuevo o modificado debe cumplirlos.

---

### 1. SEO / LLMO

El objetivo es doble: posicionamiento en buscadores tradicionales (Google) y visibilidad en motores de IA (ChatGPT Search, Perplexity, Gemini).

#### Meta y estructura

- **`index.html`**: `lang="es"`, título, meta description base.
- **Cada página** tiene su propio `<title>` y `<meta name="description">` únicos, descriptivos y con keywords naturales. Formato de título: `[Nombre producto] — Natalia Heller | Arte Original Buenos Aires`.
- **Open Graph + Twitter Cards** en todas las páginas: `og:title`, `og:description`, `og:image` (1200x630), `og:type`, `og:url`.
- **Canonical URL** en todas las páginas para evitar contenido duplicado.
- **`robots.txt`**: permitir todo excepto `/admin`.
- **`sitemap.xml`**: generado dinámicamente, incluye productos y posts. Actualizar al agregar contenido.

#### Schema.org JSON-LD por página

| Página | Schema |
|---|---|
| `/` | `Organization` + `WebSite` (con SearchAction) |
| `/tienda` | `CollectionPage` + `ItemList` |
| `/tienda/:slug` | `Product` (con `offers`, `image`, `description`, `brand`, `aggregateRating` cuando haya reseñas) |
| `/estudio` | `LocalBusiness` + `Service` (tatuaje) |
| `/blog/:slug` | `Article` (con `author`, `datePublished`, `image`) |
| `/contacto` | `ContactPage` |

#### LLMO — contenido estructurado para crawlers de IA

- **Headings jerárquicos estrictos**: H1 único por página, H2 para secciones principales, H3 para subsecciones. Nunca saltar niveles.
- **Texto descriptivo real** en todos los productos: qué es, dimensiones, materiales, proceso de producción, cómo se envía. Sin placeholders.
- **Alt text obligatorio** en todas las imágenes: descriptivo, con contexto ("Acuarela botánica en papel algodón 300g — A4 — Natalia Heller").
- **FAQ structured data** (`FAQPage` schema) en product pages y en `/estudio`.
- **Breadcrumbs** (`BreadcrumbList` schema) en product pages y blog posts.
- **Sección "¿Qué es esto?"** en product pages: texto claro y natural que explique el producto para que los LLMs puedan citarlo correctamente.

#### URLs

- Slugs en español, descriptivos, sin IDs numéricos: `/tienda/acuarela-botanica-a4` no `/tienda/123`.
- Sin `?query=string` en URLs de filtros — usar URL path o state local, no query params indexables.

---

### 2. Lighthouse / Core Web Vitals

Target: **100/100** en Performance, Accessibility, Best Practices y SEO.

#### Performance

**LCP (Largest Contentful Paint) — target < 2.5s:**
- Hero sin `<video>` autoplay como background en mobile — usar imagen estática WebP/AVIF con `fetchPriority="high"` y `loading="eager"`. Video solo en desktop vía media query o lazy load diferido.
- Primera imagen visible de cada página: `loading="eager"`, `fetchPriority="high"`.
- Resto de imágenes: `loading="lazy"`.
- Todos los `<img>` con `width` y `height` explícitos para evitar layout shift.
- Fuentes Google Fonts: preconnect en `<head>`, `display=swap`, subconjunto de caracteres si es posible.
- No cargar GSAP en el critical path — importar de forma async/diferida, animaciones solo se montan post-hydration.

**CLS (Cumulative Layout Shift) — target < 0.1:**
- Todas las imágenes con aspect ratio reservado (CSS `aspect-ratio` o wrapper con padding-bottom trick).
- Skeleton loaders en componentes que cargan datos de Supabase.
- Fuentes con `font-display: swap` y fallback stack correcto para minimizar FOUT.

**INP (Interaction to Next Paint) — target < 200ms:**
- Event handlers ligeros — lógica pesada fuera del handler, diferida con `setTimeout(fn, 0)` o `requestIdleCallback` si no es crítica.
- GSAP ScrollTrigger: usar `will-change: transform` con precaución, solo en elementos que lo necesiten.
- Filtros de tienda: debounce en inputs, evitar re-renders masivos.

#### Imágenes

- Formato: **WebP** como default, **AVIF** cuando el browser lo soporte (usar `<picture>` con sources).
- Generación: convertir todos los assets actuales (jpg → webp) en Wave 1.
- Supabase Storage: configurar transformaciones de imagen (resize on-the-fly) para servir el tamaño correcto según viewport.
- Nunca cargar una imagen de 2000px para mostrarla en 400px.

#### Accesibilidad (a11y) — target 100

- Todos los botones interactivos con `aria-label` descriptivo.
- Focus visible en todos los elementos interactivos (no usar `outline: none` sin reemplazo).
- Contraste mínimo AA (4.5:1 para texto normal, 3:1 para texto grande) — verificar verde lima sobre fondos claros.
- Imágenes decorativas con `alt=""`.
- Formularios con `<label>` asociados a cada `<input>` vía `htmlFor`.
- Navegación por teclado funcional en modales, drawers y dropdowns.
- `role` y `aria-expanded` en acordeones y menú mobile.

#### Best Practices

- No inline scripts salvo GTM (que ya está).
- No `console.log` en producción — usar flags de dev.
- HTTPS only (Vercel lo garantiza).
- Sin librerías con vulnerabilidades conocidas — auditar con `npm audit` en cada wave.

---

### 3. GSAP Animations

**Filosofía:** las animaciones sirven al producto, no al revés. Cada animación tiene un propósito: guiar la atención, comunicar estado, o generar sensación de calidad. Nada es decorativo sin función.

#### Setup

```bash
npm install gsap
```

- Importar `gsap` y plugins de forma lazy por página — no en el bundle principal.
- ScrollTrigger: registrar el plugin una sola vez en un módulo `src/lib/gsap.ts`:

```typescript
// src/lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
```

- Todas las animaciones GSAP se montan en `useLayoutEffect` (no `useEffect`) para evitar flash.
- Siempre hacer cleanup en el return: `ctx.revert()` o `tl.kill()`.
- **Respetar `prefers-reduced-motion`**: si el usuario tiene esta preferencia, no ejecutar animaciones. Implementar con una utilidad global:

```typescript
// src/lib/gsap.ts (agregar)
export const shouldAnimate = () => 
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

#### Animaciones planeadas por sección

**Home — Hero:**
- Entrada del título: `from` `y: 60, opacity: 0` con stagger en palabras o líneas.
- CTA button: scale + opacity con delay.
- Parallax suave del fondo (imagen/video) en scroll con `ScrollTrigger`.

**Home — Featured Products:**
- Cards entran desde abajo con stagger al hacer scroll (`ScrollTrigger` + `batch` para performance).

**Tienda — Catálogo:**
- FilterBar: transición de pills activos.
- Grid: `stagger` de cards al cargar y al cambiar filtro (salida + entrada).

**Tienda — Product Detail:**
- Imagen principal: zoom in suave al cargar (`scale: 1.05 → 1`).
- Selector de variante: highlight animado al seleccionar.
- Precio: contador animado cuando cambia (variant/addon change).

**Estudio:**
- Parallax en hero.
- Portfolio grid: reveal progresivo con ScrollTrigger.
- Historia de Nat: texto aparece línea a línea al hacer scroll (SplitText o manual por párrafo).

**Transiciones entre páginas:**
- Fade out/in simple con GSAP en el unmount/mount de páginas — no usar librerías de transición extra.
- Implementar en el wrapper de `<Layout>` con `AnimatePresence` de Framer Motion **o** reemplazar Framer Motion por GSAP completamente en Wave 1 para no tener dos sistemas de animación.

> **Decisión a tomar en Wave 1:** ¿reemplazar Framer Motion por GSAP o convivir? Recomendación: **reemplazar**. Framer Motion se usa solo en el Header (hamburger menu) — es trivial de reimplementar con GSAP. Tener un solo sistema de animación reduce el bundle ~30KB y elimina conflictos.

#### Reglas de performance para GSAP

- Animar solo propiedades que no triggeren layout: `transform`, `opacity`, `filter`. Nunca `width`, `height`, `top`, `left`, `margin`.
- Usar `gsap.set()` para estados iniciales, no CSS inline.
- `ScrollTrigger.batch()` para listas largas — más eficiente que un trigger por elemento.
- Hacer `kill()` de todos los ScrollTriggers en el cleanup del componente.

---

## Decisiones de arquitectura

| Decisión | Estado | Resolución |
|---|---|---|
| Backend / base de datos | ✅ Confirmado | **Supabase** — PostgreSQL + Auth + Storage + Edge Functions |
| Checkout MP | Pendiente pre-Wave 4 | **Checkout Pro MVP**, migrar a Bricks en v2 |
| Imágenes de productos | ✅ Confirmado | **Supabase Storage** + transformaciones on-the-fly para responsive images |
| Estado del carrito | Pendiente pre-Wave 4 | **Context API** para MVP, migrar si crece |
| Migración a Next.js | Pendiente post-estabilización | **Posterior** — priorizar funcionalidad primero |
| Sistema de animaciones | ⚠️ Decidir en Wave 1 | **Reemplazar Framer Motion por GSAP** — bundle más liviano, un solo sistema |

---

## Resumen de archivos por wave

| Wave | Crea | Modifica | Elimina |
|---|---|---|---|
| 1 | `Tienda.tsx`, `ProductDetail.tsx`, `Estudio.tsx` | `App.tsx`, `Header.tsx`, `Footer.tsx`, `Home.tsx`, `index.html` | `obras/`, `obras-tipos/`, `SobreMi.tsx`, `TattooDetail.tsx`, `FAQs.tsx`, `CategoryPage.tsx` |
| 2 | `products.ts`, `ProductCard`, `ProductGrid`, `FilterBar`, `useTiendaLogic` | `Tienda.tsx` | — |
| 3 | `ProductDetail.tsx`, `VariantSelector`, `AddonSelector`, `PriceSummary`, `ProductFAQ` | — | — |
| 4 | `useCart.ts`, `CartDrawer`, `Checkout.tsx` | `App.tsx` | — |
| 5 | `admin/*` | — | — |
| 6 | `FAQSection.tsx` (genérico) | `Estudio.tsx`, `useContactForm.ts` | componentes FAQ standalone |

# Wave 2 — Prompt para Claude Code

---

## Contexto del proyecto

Sos el lead engineer de **NatArt**, sitio web de Natalia Heller (artista + tatuadora, Buenos Aires). Wave 1 ya está completa: routing, nav, tokens y Home están migrados. Ahora ejecutás **Wave 2**: modelo de datos de la tienda + página `/tienda` completamente funcional + página `/tienda/:slug` (Product Detail) completa.

Lee estos archivos antes de tocar cualquier código:
- `CLAUDE.md` — estado del proyecto, stack, estructura de carpetas
- `REFACTOR_PLAN.md` — plan completo, pilares técnicos (SEO/LLMO, Lighthouse, GSAP)
- `design_handoff_nh/README.md` — tokens, tipografía, spacing, motion, spec de páginas
- `design_handoff_nh/data.jsx` — `NH_CATEGORIES`, `NH_PRODUCTS` (copy y estructura usables directo)
- `design_handoff_nh/shared.jsx` — `NHProductCard`, motivos SVG, utilidades
- `design_handoff_nh/pages-a.jsx` → `NHTienda` y `NHProduct` — diseño de referencia fiel

**Los archivos de `design_handoff_nh/` son de solo lectura. Son prototipos Babel — no código productivo. Tu tarea es implementar esos diseños en React + TypeScript + Tailwind + GSAP.**

---

## Objetivo de Wave 2

Al terminar esta wave:
1. `src/data/products.ts` — modelo de datos TypeScript completo con mock data realista
2. `/tienda` — catálogo funcional con filtros, grid, empty state y animaciones GSAP
3. `/tienda/:slug` — product detail completo: galería, variantes, addon, precio dinámico, specs, relacionados
4. Home actualizada: el mock hardcodeado del Hero se reemplaza por los datos reales de `products.ts`
5. SEO correcto en ambas páginas: meta tags únicos, Schema.org, breadcrumbs, slugs

**Tres pilares que aplican a todo el código:**
1. **SEO/LLMO** — Schema.org por página, meta tags únicos, alt text descriptivo, breadcrumbs, slugs en español
2. **Lighthouse 100/100** — imágenes con dimensiones, sin layout shifts, GSAP fuera del critical path, skeleton loaders
3. **GSAP** — scroll reveals, transición de filtros, animaciones en product detail. Todo en `useLayoutEffect` con cleanup. Respetar `prefers-reduced-motion` via `shouldAnimate()` de `src/lib/gsap.ts`

---

## TAREA 1 — Modelo de datos `src/data/products.ts`

### Tipos TypeScript

```typescript
export type ProductCategory =
  | 'laminas' | 'ceramica' | 'acuarela' | 'gouache'
  | 'textil' | 'ilustracion' | 'mixta' | 'stickers'
  | 'mandalas' | 'abanicos'

export type ProductStatus = 'active' | 'coming-soon' | 'out-of-stock'

export interface ProductVariant {
  size: string            // 'A6' | 'A5' | 'A4' | 'A3'
  priceMultiplier: number // 0.55 | 0.75 | 1 | 1.6
}

export interface Product {
  slug: string
  title: string
  category: ProductCategory
  catLabel: string         // 'Lámina — Giclée', 'Cerámica — Gres esmaltado', etc.
  basePrice: number        // en ARS, precio del tamaño base (A4 o unidad)
  size: string             // descripción de medidas: 'A4 · 21×29,7 cm', '∅ 14 cm', etc.
  tone: 'a' | 'b' | 'c' | 'd' | 'e' | 'f'  // para placeholder mientras no hay foto real
  tall: number             // aspect ratio tall para placeholder: 1.3 = 1:1.3
  medium: string           // 'Impresión giclée sobre papel Hahnemühle 308g'
  edition: string          // 'Edición abierta · firmada', 'Pieza única', etc.
  description: string      // párrafo descriptivo, copy aprobado por cliente
  images: string[]         // paths a imágenes reales (vacío por ahora → usar placeholder)
  tags: string[]           // para filtros adicionales por temática
  variants: ProductVariant[] | null   // null si no tiene variantes de tamaño
  hasFrame: boolean        // si acepta addon de marco (+$12.000 ARS)
  framePrice: number       // precio del addon de marco en ARS (default 12000)
  onDemand: boolean        // si true → mostrar aviso de demora de producción
  status: ProductStatus
}

export interface ProductCategoryMeta {
  slug: string
  label: string
}
```

### Mock data — copiar y adaptar de `design_handoff_nh/data.jsx`

Tomar los 12 productos de `NH_PRODUCTS` y portarlos a la interfaz `Product`. El copy (`description`, `catLabel`, `medium`, `edition`) es el del handoff — ya está aprobado. Completar los campos faltantes:
- `images: []` — vacío, el componente renderiza placeholder cuando el array está vacío
- `tags: []` — vacío por ahora
- `onDemand: false` — default
- `status: 'active'` — todos activos

Agregar los productos de las categorías del plan que no están en el handoff pero sí en el negocio real:
```typescript
// Stickers botánicos: slug 'stickers-botanicos', category 'stickers', variants null, hasFrame false
// ya está en el handoff — portarlo directamente

// Agregar producto coming-soon para cada categoría futura:
// Solo si la categoría no tiene ningún producto activo todavía
```

Exportar también las categorías:
```typescript
export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  { slug: 'todos',        label: 'Todos' },
  { slug: 'laminas',      label: 'Láminas' },
  { slug: 'ceramica',     label: 'Cerámica' },
  { slug: 'acuarela',     label: 'Acuarelas' },
  { slug: 'gouache',      label: 'Gouache' },
  { slug: 'textil',       label: 'Textiles' },
  { slug: 'ilustracion',  label: 'Ilustraciones' },
  { slug: 'mixta',        label: 'Técnica mixta' },
  { slug: 'stickers',     label: 'Stickers' },
  { slug: 'mandalas',     label: 'Mandalas' },
  { slug: 'abanicos',     label: 'Abanicos' },
]

// Helper: calcular precio según variante seleccionada
export function getVariantPrice(product: Product, size: string | null): number {
  if (!product.variants || !size) return product.basePrice
  const variant = product.variants.find(v => v.size === size)
  return variant ? Math.round(product.basePrice * variant.priceMultiplier) : product.basePrice
}

// Helper: formatear precio en ARS
export function formatARS(price: number): string {
  return `$${price.toLocaleString('es-AR')}`
}
```

---

## TAREA 2 — Hook `src/hooks/useTiendaLogic.ts`

```typescript
// Estado: filtro activo (categoría slug), productos filtrados, conteo por categoría
// Input: products array + categories array
// Output:
//   activeCategory: string
//   setActiveCategory: (slug: string) => void
//   filtered: Product[]
//   countForCategory: (slug: string) => number
//   isEmpty: boolean
```

Sin lógica de ordenamiento todavía (Wave 3+). Solo filtrado por categoría. No usar `useEffect` para el filtrado — calcular `filtered` con `useMemo`.

---

## TAREA 3 — Componentes `src/components/tienda/`

### 3.1 — `ProductImagePlaceholder.tsx`

Componente que reemplaza la imagen cuando `product.images` está vacío. Replica visualmente el `NHPh` del handoff:
- Background con tono según `product.tone` (6 variantes, ver `styles.css` → `.nh-ph-tone-*`)
- Overlay de rayas diagonales SVG subtle (sage 7% opacity)
- Label mono centrado con `product.catLabel` + `product.size`
- Acepta `aspectRatio` como prop (default `1 / ${product.tall}`)
- Cuando haya imagen real: `<img>` con `alt` descriptivo, `width`/`height`, `loading="lazy"`/`"eager"` según posición

### 3.2 — `ProductCard.tsx`

Implementar fielmente `NHProductCard` de `shared.jsx`. Adaptado a TypeScript + Tailwind:

```tsx
interface ProductCardProps {
  product: Product
  compact?: boolean   // true en mobile → padding y font reducidos
  priority?: boolean  // true para las primeras cards → img loading="eager"
}
```

**Estructura:**
```
<article> (link a /tienda/:slug)
  <div .card-media>
    ProductImagePlaceholder o <img> si hay images[0]
  </div>
  <div .card-info padding-top-[18px] / 12px compact>
    <div flex justify-between items-baseline>
      <h3 font-display text-[20px]/[17px] font-[400] text-ink>
        {product.title}
      </h3>
      <span font-mono text-[12px] text-sage-700>
        {formatARS(product.basePrice)}
      </span>
    </div>
    <div font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mt-[6px]>
      {product.catLabel}
    </div>
  </div>
</article>
```

**Estilos de card (pressed-flower):**
- `bg-cream-50 rounded-[4px]`
- Shadow idle: `shadow-[0_1px_2px_rgba(44,44,44,0.04),_0_8px_24px_rgba(74,124,89,0.06)]`
- Hover: `translateY(-4px)` + shadow más intensa: `shadow-[0_2px_4px_rgba(44,44,44,0.05),_0_16px_36px_rgba(74,124,89,0.1)]`
- Transición: `transition-all duration-300` con `ease-[var(--ease)]`
- Padding: `p-[18px_18px_22px]` desktop / `p-[12px_12px_16px]` compact

**Accesibilidad:**
- El `<article>` wrappea un `<Link>` de React Router — la card entera es clickeable
- `aria-label={product.title}` en el Link
- `role="img"` + `aria-label` en el placeholder

### 3.3 — `FilterBar.tsx`

```tsx
interface FilterBarProps {
  categories: ProductCategoryMeta[]
  active: string
  onSelect: (slug: string) => void
  countForCategory: (slug: string) => number
}
```

**Diseño (ver `NHTienda` en `pages-a.jsx`):**
- Sticky `top-[78px]` (altura del header desktop) / `top-[57px]` mobile, `z-10`
- `bg-[rgba(250,246,240,0.95)] backdrop-blur-[8px] border-b border-[var(--line-soft)]`
- Padding `12px 48px` desktop / `12px 22px` mobile
- Scroll horizontal en mobile con `overflow-x-auto` y scrollbar oculta
- Pills: `font-body text-[13px] font-[500] px-[14px] py-[8px] rounded-pill border border-[var(--line)] text-ink-soft`
- Activa: `bg-sage-900 text-cream-50 border-sage-900`
- Hover inactiva: `border-sage-500 text-ink`
- Count inline cuando activa: `<span class="ml-[6px] opacity-70">{count}</span>`
- Transición: 200ms `var(--ease)`

**GSAP — transición al cambiar filtro:**
- Cuando cambia `active`: `gsap.fromTo(pill, { scale: 0.95 }, { scale: 1, duration: 0.2 })` solo en la pill recién activada
- Respetar `shouldAnimate()`

**Accesibilidad:**
- `role="tablist"` en el contenedor de pills
- Cada pill: `role="tab"`, `aria-selected={isActive}`, `aria-controls="product-grid"`
- `<div id="product-grid">` en el ProductGrid

### 3.4 — `ProductGrid.tsx`

```tsx
interface ProductGridProps {
  products: Product[]
  isEmpty: boolean
}
```

**Grid:**
- Desktop: `grid-cols-3` gap-[32px]
- Mobile: `grid-cols-2` gap-[16px]
- `id="product-grid"` para el aria-controls del FilterBar

**Empty state** (cuando `isEmpty`):
- Centrado, padding `py-[80px]`
- Fraunces itálica 24px `text-ink-soft`: *"Nada nuevo por acá todavía"*
- Párrafo body 14px: *"Sumate al newsletter para enterarte primero."*
- Sin ícono ni ilustración — solo tipografía

**GSAP — scroll reveal:**
```typescript
// useLayoutEffect con gsap.context()
// ScrollTrigger.batch(cardElements, {
//   onEnter: batch => gsap.fromTo(batch,
//     { opacity: 0, y: 24 },
//     { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
//   ),
//   start: 'top 88%',
// })
// Cleanup: ctx.revert()
```

**GSAP — transición al cambiar filtro:**
Cuando el array `products` cambia (filtro aplicado):
```typescript
// salida: gsap.to(cards, { opacity: 0, y: -8, duration: 0.18, stagger: 0.03 })
// entrada (en callback onComplete): gsap.fromTo(cards, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 })
```

---

## TAREA 4 — Página `src/pages/Tienda.tsx`

Implementar fielmente `NHTienda` de `pages-a.jsx`. Reemplazar el shell de Wave 1.

### Estructura

```tsx
<>
  {/* SEO */}
  <Helmet> o equivalente — ver sección SEO abajo </Helmet>
  <SchemaMarkup type="CollectionPage" data={...} />

  <main>
    {/* Hero header */}
    <section aria-label="Catálogo">
      <p class="eyebrow">Tienda · {activeCount} piezas</p>
      <h1>Obra disponible</h1>
      <p class="subtitle">Piezas únicas y ediciones firmadas. Cada obra sale del estudio con envoltorio en papel reciclado y una nota escrita a mano.</p>
    </section>

    {/* Filtros sticky */}
    <FilterBar ... />

    {/* Grid */}
    <section>
      <ProductGrid ... />
    </section>

    {/* Próximamente — solo si hay productos coming-soon */}
    <ComingSoonSection ... />
  </main>
</>
```

### Hero de la Tienda

- Sin HeroSection genérico, sin video. Solo texto sobre `bg-cream-100`.
- Padding desktop: `56px 48px 32px` / mobile: `28px 22px 24px`.
- Eyebrow: `"Tienda · {filtered.length} piezas"` — count dinámico según filtro activo.
- H1 Fraunces 72px/38px, weight 400, tracking -0.02em: **"Obra disponible"**
- Párrafo 17px/15px `text-ink-soft` max-w-[540px]: *"Piezas únicas y ediciones firmadas. Cada obra sale del estudio con envoltorio en papel reciclado y una nota escrita a mano."*

**GSAP — page enter:**
```typescript
// useLayoutEffect — al montar la página:
// gsap.fromTo([eyebrow, h1, subtitle], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' })
```

### Sección "Próximamente" — `src/components/tienda/ComingSoonSection.tsx`

Mostrar solo si `PRODUCTS.some(p => p.status === 'coming-soon')`.

- `NHDivider label="próximamente"` como separador.
- Eyebrow + H2 Fraunces: *"Lo que viene"*
- Grid igual al ProductGrid, cards con overlay `bg-cream-200/80` + badge pill `"Próximamente"` en sage-700.
- Cards no son links (no hay detalle todavía).

---

## TAREA 5 — Página `src/pages/ProductDetail.tsx`

Implementar fielmente `NHProduct` de `pages-a.jsx`. Reemplazar el shell de Wave 1.

Obtener el slug con `useParams<{ slug: string }>()`. Si el producto no existe → redirect a `/tienda`.

### Estructura

```tsx
<>
  {/* SEO */}
  <SchemaMarkup type="Product" data={productSchema} />

  <main>
    {/* Breadcrumb */}
    <nav aria-label="Breadcrumb">
      tienda / {product.catLabel} / {product.title}
    </nav>

    {/* Layout principal */}
    <section>
      <div class="grid [1.1fr_0.9fr] desktop / 1col mobile">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
    </section>

    {/* Relacionados */}
    <RelatedProducts currentSlug={slug} category={product.category} />
  </main>
</>
```

### Breadcrumb — `src/components/tienda/Breadcrumb.tsx`

```tsx
// font-mono text-[11px] text-ink-soft letter-spacing-[0.08em]
// tienda (link sage-700) / {catLabel} (link) / {title} (texto sage-700, no link)
// Schema.org BreadcrumbList generado aquí también
```

### Galería — `src/components/tienda/ProductGallery.tsx`

```tsx
interface ProductGalleryProps {
  product: Product
}
```

- Imagen principal: `ProductImagePlaceholder` (o `<img>` cuando haya real) con `aspect-ratio: 1 / {product.tall}`, `loading="eager"`, `fetchPriority="high"`.
- 4 thumbnails debajo en grid `grid-cols-4` gap-[12px]/[8px]: siempre placeholder por ahora.
- Click en thumbnail → cambia imagen principal con GSAP fade (opacity 0→1, 200ms).
- En mobile: solo imagen principal, sin thumbnails.

**GSAP — zoom in suave al cargar:**
```typescript
// useLayoutEffect:
// gsap.fromTo(mainImage, { scale: 1.03, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' })
```

### Info del producto — `src/components/tienda/ProductInfo.tsx`

```tsx
interface ProductInfoProps {
  product: Product
}
```

**Sticky desktop:** `position: sticky; top: 100px`.

**Contenido en orden:**
1. Eyebrow: `product.catLabel`
2. H1 Fraunces 52px/34px, weight 400, tracking -0.02em: `product.title`
3. Precio: Fraunces 28px `text-sage-900` + pill mono 11px `text-ink-soft "ARS"`
4. Descripción: body 15px `text-ink-soft` line-height 1.7
5. Selector de variante (si `product.variants !== null`)
6. Addon de marco (si `product.hasFrame`)
7. CTAs
8. Tabla de specs

**Selector de variante — `src/components/tienda/VariantSelector.tsx`:**
```tsx
// Label mono "Tamaño"
// Pills igual que FilterBar pero más pequeños
// Activa: bg-sage-900 text-cream-50
// Al seleccionar: precio se actualiza en tiempo real via getVariantPrice()
// GSAP: cuando cambia el precio, gsap.fromTo(priceEl, { scale: 1.05 }, { scale: 1, duration: 0.25 })
```

**Addon de marco — `src/components/tienda/AddonSelector.tsx`:**
```tsx
// Solo si product.hasFrame === true
// Diseño del handoff: label checkbox con:
//   - Título body 14px weight 600: "Sumar marco de roble"
//   - Subtítulo body 12px text-ink-soft: "Marco artesanal con vidrio antirreflejo · +{formatARS(product.framePrice)}"
// Cuando checked: bg-sage-200, border-sage-500
// Padding: 14px 16px, border border-[var(--line)] rounded-[4px]
// accentColor: sage-700 en el checkbox
// Transición: all 200ms var(--ease)
```

**CTAs:**
```tsx
// Flex gap-[10px]
// Primario (flex-1): "Agregar al carrito" — bg-sage-700 pill
//   → por ahora: onClick dispara solo un toast visual (Wave 4 implementa el carrito real)
// Secundario: ícono corazón ghost pill — solo visual por ahora
```

**Toast "agregado"** — `src/components/tienda/AddedToast.tsx`:
```tsx
// Pill ink en bottom-center de la viewport, position fixed
// Texto mono: "{product.title} · agregado"
// GSAP: fromTo bottom -40px → bottom 24px, opacity 0→1, 300ms
// Auto-dismiss: 2200ms, GSAP reverse
// Solo se monta cuando el usuario hace click en "Agregar al carrito"
```

**Tabla de specs:**
```tsx
// border-top border-[var(--line)] padding-top 24px margin-top 36px
// Filas con grid-cols-[120px_1fr], padding 12px 0, border-bottom border-[var(--line-soft)]
// Key: font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft
// Value: body text-[13px] text-ink
// Filas: Técnica | Medidas | Edición | Envío ("Todo el país · 3-6 días hábiles")
```

### Productos relacionados — `src/components/tienda/RelatedProducts.tsx`

```tsx
interface RelatedProductsProps {
  currentSlug: string
  category: ProductCategory
}
```

- Filtrar `PRODUCTS` por misma categoría, excluir el actual, máximo 3 desktop / 2 mobile.
- Si no hay relacionados → no renderizar la sección.
- Eyebrow: "En la misma técnica"
- H2 Fraunces 34px/24px: "También te puede interesar"
- Grid igual al ProductGrid pero sin filtros.
- GSAP scroll reveal igual que ProductGrid.

---

## TAREA 6 — SEO por página

### `/tienda`

**`<title>`:** `"Tienda de Arte — Natalia Heller | Prints, Stickers, Cerámicas y más"`

**`<meta name="description">`:** `"Comprá obra original de Natalia Heller: láminas giclée, cerámicas, acuarelas, stickers y abanicos. Cada pieza sale del estudio con nota escrita a mano. Envíos a todo el país."`

**Open Graph:**
```html
og:title → igual que <title>
og:description → igual que meta description
og:type → "website"
og:url → "https://tatuajesnaty.com/tienda"
og:image → "https://tatuajesnaty.com/og-tienda.webp"  (placeholder por ahora)
```

**Schema.org `CollectionPage`:**
```typescript
{
  '@type': 'CollectionPage',
  name: 'Tienda de Arte — Natalia Heller',
  description: 'Obra original de Natalia Heller: láminas, cerámicas, acuarelas, stickers y abanicos.',
  url: 'https://tatuajesnaty.com/tienda',
  numberOfItems: PRODUCTS.filter(p => p.status === 'active').length,
  itemListElement: activeProducts.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: p.title,
      url: `https://tatuajesnaty.com/tienda/${p.slug}`,
      description: p.description,
      category: p.catLabel,
    }
  }))
}
```

**Implementación de meta tags:**
El proyecto es una SPA Vite — usar `react-helmet-async` (ya está en `devDependencies`). Instalar si no está en `dependencies`:
```bash
npm install react-helmet-async
```
Wrappear `<App>` con `<HelmetProvider>` en `main.tsx`. Usar `<Helmet>` en cada página.

### `/tienda/:slug`

**`<title>`:** `"{product.title} — {product.catLabel} | Natalia Heller"`

**`<meta name="description">`:** `"{product.description} {product.medium}. {product.edition}. Envíos a todo el país."`

**Open Graph:**
```
og:title → igual que <title>
og:type → "og:product" (o "website" como fallback)
og:url → "https://tatuajesnaty.com/tienda/{product.slug}"
og:image → product.images[0] o placeholder URL
```

**Schema.org `Product`:**
```typescript
{
  '@type': 'Product',
  name: product.title,
  description: product.description,
  image: product.images[0] || `https://tatuajesnaty.com/og-placeholder.webp`,
  brand: { '@type': 'Brand', name: 'Natalia Heller' },
  category: product.catLabel,
  offers: {
    '@type': 'Offer',
    price: currentPrice,          // precio dinámico según variante seleccionada
    priceCurrency: 'ARS',
    availability: product.status === 'active'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    seller: { '@type': 'Person', name: 'Natalia Heller' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', currency: 'ARS' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 6, unitCode: 'DAY' },
      }
    }
  }
}
```

**Schema.org `BreadcrumbList`:**
```typescript
{
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://tatuajesnaty.com' },
    { '@type': 'ListItem', position: 2, name: 'Tienda', item: 'https://tatuajesnaty.com/tienda' },
    { '@type': 'ListItem', position: 3, name: product.catLabel },
    { '@type': 'ListItem', position: 4, name: product.title },
  ]
}
```

**Canonical:** `<link rel="canonical" href="https://tatuajesnaty.com/tienda/{product.slug}" />`

---

## TAREA 7 — Actualizar Home

El `FeaturedProductsSection` creado en Wave 1 tiene mock data hardcodeada. Reemplazarla por los datos reales:

```typescript
// En FeaturedProductsSection.tsx:
import { PRODUCTS } from '@/data/products'
// Usar los primeros 6 productos con status 'active'
const featured = PRODUCTS.filter(p => p.status === 'active').slice(0, 6)
```

Las cards del Home usan el componente `ProductCard` de `src/components/tienda/ProductCard.tsx`. Asegurar que el import funciona.

---

## TAREA 8 — Estructura de carpetas resultante

```
src/
├── components/
│   └── tienda/
│       ├── ProductImagePlaceholder.tsx  (nuevo)
│       ├── ProductCard.tsx              (nuevo)
│       ├── FilterBar.tsx                (nuevo)
│       ├── ProductGrid.tsx              (nuevo)
│       ├── ComingSoonSection.tsx        (nuevo)
│       ├── Breadcrumb.tsx               (nuevo)
│       ├── ProductGallery.tsx           (nuevo)
│       ├── ProductInfo.tsx              (nuevo)
│       ├── VariantSelector.tsx          (nuevo)
│       ├── AddonSelector.tsx            (nuevo)
│       ├── RelatedProducts.tsx          (nuevo)
│       ├── AddedToast.tsx               (nuevo)
│       └── index.ts                     (nuevo — barrel export)
├── data/
│   └── products.ts                      (nuevo)
├── hooks/
│   └── useTiendaLogic.ts               (nuevo)
└── pages/
    ├── Tienda.tsx                       (reemplaza shell de Wave 1)
    └── ProductDetail.tsx               (reemplaza shell de Wave 1)
```

---

## TAREA 9 — Verificación final

```bash
npm run build   # 0 errores TypeScript
npm run lint    # 0 warnings
npm run dev     # verificar manualmente
```

Checklist:
- [ ] `/tienda` carga con eyebrow count correcto
- [ ] Filtros cambian el grid, count se actualiza
- [ ] Empty state aparece cuando el filtro no tiene resultados
- [ ] `/tienda/helecho-i` carga con variantes A6/A5/A4/A3
- [ ] Selector de variante actualiza el precio en tiempo real
- [ ] Addon de marco suma +$12.000 al precio
- [ ] Click "Agregar al carrito" dispara toast
- [ ] Breadcrumb visible y con links funcionales
- [ ] Productos relacionados aparecen (misma categoría)
- [ ] `/tienda/cuenco-musgo` no tiene selector de variantes (sizes: null)
- [ ] Home muestra los productos de `products.ts` (no mock hardcodeado)
- [ ] `npm run build` sin errores ni warnings de TypeScript
- [ ] Schema.org `Product` presente en el DOM de cada product page (inspeccionar `<head>`)
- [ ] `<title>` único en `/tienda` y en cada product page

---

## Restricciones y reglas

- **No instalar librerías nuevas** salvo `react-helmet-async` si no está en dependencies. GSAP ya instalado.
- **No crear archivos `.md`** ni documentación.
- **No tocar** `src/components/contacto/`, `src/components/blog/`, `src/components/faqs/`, `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx`, `src/pages/Contacto.tsx`, `src/pages/Estudio.tsx` — fuera del scope.
- **No crear** lógica de carrito real (`useCart`, `CartDrawer`) — Wave 4. El toast es solo visual.
- **No integrar** Supabase todavía — los datos son mock en `products.ts`. Wave 4+ conecta el backend.
- Los archivos de `design_handoff_nh/` son **solo lectura**.
- Framer Motion no debe aparecer en ningún import.
- Cada componente nuevo: compilar sin errores TS antes de pasar al siguiente.
- Todo `<img>`: `alt` descriptivo con contexto artístico, `width` y `height` explícitos.
- `alt` para productos: `"{product.title} — {product.catLabel}, {product.medium}"`.
- GSAP cleanup obligatorio en cada `useLayoutEffect` que use GSAP: `return () => ctx.revert()`.
- `shouldAnimate()` wrappea todas las animaciones GSAP.
- Precios siempre en ARS usando `formatARS()` — nunca formatear inline.
- Copy en español rioplatense. No modificar el copy del handoff (`description`, `catLabel`, `medium`, `edition`).

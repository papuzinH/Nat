# Wave 1 — Prompt para Claude Code

---

## Contexto del proyecto

Sos el lead engineer de **NatArt**, sitio web de Natalia Heller (artista + tatuadora, Buenos Aires). Estás ejecutando la **Wave 1** de una refactorización documentada. El proyecto es una SPA: **Vite 7 + React 19 + TypeScript + React Router DOM v7 + Tailwind CSS 3**.

Lee estos archivos antes de tocar cualquier código:
- `CLAUDE.md` — estado actual del proyecto, estructura
- `REFACTOR_PLAN.md` — plan completo de refactorización (rutas, componentes, pilares técnicos)
- `design_handoff_nh/README.md` — sistema de diseño completo (tokens, tipografía, spacing, motion)
- `design_handoff_nh/styles.css` — tokens CSS de referencia (colores, fuentes, utilidades)
- `design_handoff_nh/shared.jsx` — componentes de referencia (Header, Footer, Logo, motivos SVG, ProductCard)
- `design_handoff_nh/pages-a.jsx` — diseño de Home, Tienda y Producto
- `design_handoff_nh/pages-b.jsx` — diseño de Estudio y Contacto
- `design_handoff_nh/data.jsx` — datos de productos y categorías (copy usable directo)

**Los archivos de `design_handoff_nh/` son prototipos de referencia en HTML/Babel — NO son código productivo. Tu tarea es recrear estos diseños en el codebase (React + Vite + TypeScript + Tailwind + GSAP), portando los tokens al `tailwind.config.js` y respetando fielmente la estética especificada.**

---

## Objetivo de Wave 1

Reestructurar routing, navegación y home. El sitio pasa de "portfolio de tatuadora" a "e-commerce artístico". **Sin contenido nuevo todavía** — solo la base arquitectónica correcta.

**Tres pilares que aplican a todo el código que toques:**
1. **SEO/LLMO**: HTML semántico estricto, meta tags, lang, alt text, Schema.org donde corresponda
2. **Lighthouse 100/100**: sin layout shifts, imágenes con dimensiones, nada bloqueante en critical path
3. **GSAP reemplaza Framer Motion**: un solo sistema de animaciones, bundle más liviano

---

## Design System — obligatorio aplicar en Wave 1

Esta es la identidad visual del sitio. Toda UI nueva o modificada debe seguirla. La estética es **earthy modern**: cálida, orgánica, botánica. Sin dark mode, sin gradients saturados, sin estética de marketplace.

### TAREA PREVIA — Migrar tokens a `tailwind.config.js`

Reemplazar el `theme.extend` actual por estos tokens. Mantener los breakpoints default de Tailwind.

```js
// tailwind.config.js — theme.extend
colors: {
  cream: {
    50:  '#fdfcfb',
    100: '#faf6f0',   // bg principal de la app
    200: '#f5efe6',   // bg secundario / footer
    300: '#ede4d5',
  },
  taupe: {
    300: '#d4c5b0',
    500: '#b8a898',
    700: '#8a7a6a',
  },
  sage: {
    200: '#c8d5b9',
    400: '#9bb89f',
    500: '#7a9e7e',   // accent claro
    700: '#4a7c59',   // accent principal — CTAs, links, eyebrows
    900: '#2f4a37',   // hover CTA / precios
  },
  ink: {
    DEFAULT: '#2c2c2c',  // texto principal
    soft:    '#5a5350',  // texto secundario
  },
},
fontFamily: {
  display: ['Fraunces', 'Georgia', 'serif'],  // H1–H3, precios, citas — peso 400
  body:    ['Nunito', 'system-ui', 'sans-serif'],  // párrafos, botones, UI — peso 400/600
  mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],  // eyebrows, specs, labels
},
borderRadius: {
  pill: '999px',   // botones
  card: '4px',     // cards
  form: '6px',     // formularios
},
```

Agregar a `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

Reemplazar las variables CSS custom en `index.css` `@layer base`:
```css
:root {
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --line: rgba(44, 44, 44, 0.12);
  --line-soft: rgba(44, 44, 44, 0.06);
}
body {
  font-family: theme('fontFamily.body');
  background-color: theme('colors.cream.100');
  color: theme('colors.ink.DEFAULT');
  -webkit-font-smoothing: antialiased;
}
```

### Componentes globales — especificaciones de diseño

#### Header (ver `shared.jsx` → `NHHeader`)
- Desktop: sticky, `background: rgba(250,246,240,0.92)`, `backdrop-blur-md`, border-bottom `var(--line-soft)`. Padding `22px 40px`. Logo izquierda, nav + carrito derecha.
- Logo: SVG circular con "n" en Fraunces itálica + "natalia heller" en serif itálico 17px (ver `NHLogo` en shared.jsx).
- Nav links: Fraunces body 14px weight 500. Activo: `color: sage-900`, `border-bottom: 1px solid sage-700`. Hover: misma transición.
- Botón carrito: ghost pill pequeño con ícono SVG inline (stroke 1.3, currentColor). Badge circular sage-700 con count.
- Mobile: logo izquierda, íconos carrito + hamburger derecha. Header `bg-cream-100` con border-bottom.
- **No hay overlay full-screen** como el diseño anterior. El mobile usa un drawer/panel lateral o menú simple debajo del header.

#### Footer (ver `shared.jsx` → `NHFooter`)
- `background: cream-200`, padding desktop `64px 48px 40px`, mobile `40px 22px 28px`.
- Grid desktop: `2fr 1fr 1fr 1fr` — Brand (logo + tagline itálica), Navegar, Encontrame, Estudio.
- Brand tagline: "Arte y tatuaje sensible, desde el huerto del estudio en Buenos Aires." — Fraunces itálica 20px, `color: ink-soft`.
- Footer info Estudio: "Villa Crespo · Buenos Aires, AR · Con turno previo"
- Bottom bar: `font-mono` 12px, `color: ink-soft`. Texto: `© 2026 · Natalia Heller · Hecho con paciencia` / `Envíos a todo el país · Retiro en CABA`.
- Sin lógica `isTransparent` — el footer siempre es `cream-200` opaco.

#### Botones
- **Primary**: `bg-sage-700 text-cream-50`, pill `border-radius: 999px`, padding `14px 22px`, font-body 14px weight 600. Hover: `bg-sage-900 translateY(-1px)`. Transición 220ms `var(--ease)`.
- **Ghost**: `bg-transparent text-ink border border-ink`. Hover: `bg-ink text-cream-50`.
- **Small**: padding `10px 16px`, font 13px.

#### Eyebrow
Clase reutilizable: `font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700`. Usado antes de los H1/H2 como etiqueta contextual.

#### Formularios (inputs, textareas, selects)
- Sin `border-radius` en el campo. Solo `border-bottom: 1px solid var(--line)`. Focus: `border-bottom-color: sage-700`, sin outline.
- Label: `font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft`, display block, margin-bottom 4px.
- Error: `text-[12px] text-[#a8503f]`, font-body, margin-top 6px.

#### Motivos botánicos (SVGs — ver `shared.jsx`)
Tres componentes SVG a portar como componentes React en `src/components/shared/`:
- `NHLeafMark` — tallo curvo con hojas circulares. Props: `size`, `color`.
- `NHSprig` — tallo horizontal con hojas elipses alternadas. Props: `size`, `color`, `flip`.
- `NHFlower` — 5 pétalos elipse + círculo central. Props: `size`, `color`.
- `NHDivider` — divider botánico con dos `NHSprig` y texto central mono.

Todos tienen `className="nh-motif"` en el prototipo — en producción, respetar `prefers-reduced-motion` para mostrar/ocultar.

### Tipografía — escalas

| Elemento | Desktop | Mobile | Peso | Familia |
|---|---|---|---|---|
| H1 hero | 78px | 42px | 400 | Fraunces |
| H1 páginas internas | 72–84px | 38–40px | 400 | Fraunces |
| H2 secciones | 44px | 28px | 400 | Fraunces |
| H3 | 20–26px | — | 500 | Fraunces |
| Eyebrow | 11px | 11px | 400 | JetBrains Mono |
| Body | 15–18px | 15–16px | 400 | Nunito |
| Precio | 28px | 22px | 400 | Fraunces |
| Monospace UI | 10–12px | — | 400/500 | JetBrains Mono |

Line-height body: 1.6–1.7. Letter-spacing H1: -0.02em.

### Motion — reglas globales
- Easing global: `cubic-bezier(0.22, 0.61, 0.36, 1)` — disponible como `var(--ease)` en CSS.
- Hover lift de cards: `translateY(-4px)`, 300ms.
- Page enter: `fade + translateY(8px)`, 400ms.
- Drawer: `translateX(100% → 0)`, 420ms.
- Carousel crossfade: opacity 700ms + scale (`1.04→1`) 900ms.
- Nunca animar `width`, `height`, `top`, `left` — solo `transform` y `opacity`.

---

## Tareas — ejecutar en este orden

### TAREA 0 — Instalar GSAP y crear módulo base

```bash
npm install gsap
```

Crear `src/lib/gsap.ts`:
```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
export const shouldAnimate = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

Desinstalar Framer Motion:
```bash
npm uninstall framer-motion
```

---

### TAREA 1 — Fix `index.html`

```html
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Natalia Heller — Arte original, prints, stickers y obras únicas desde Buenos Aires. Tienda online de arte y estudio de tatuajes." />
  <meta property="og:title" content="Natalia Heller — Arte Original Buenos Aires" />
  <meta property="og:description" content="Tienda de arte original: prints, stickers, abanicos y más. Estudio de tatuajes en Buenos Aires." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tatuajesnaty.com/" />
  <meta property="og:image" content="https://tatuajesnaty.com/og-image.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://tatuajesnaty.com/" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <title>Natalia Heller — Arte Original & Tienda | Buenos Aires</title>
</head>
```

---

### TAREA 2 — Eliminar archivos legacy

Eliminar exactamente estos archivos/directorios (verificar que no haya imports que rompan antes de borrar):

```
src/pages/obras-tipos/          ← directorio completo
src/pages/Obras.tsx
src/pages/CategoryPage.tsx
src/pages/SobreMi.tsx
src/pages/TattooDetail.tsx
src/pages/FAQs.tsx
src/components/obras/           ← directorio completo
src/components/sobremi/         ← directorio completo
src/components/home/HomeFAQSection.tsx
src/data/obras.ts
src/assets/obras/obras-data.ts
```

Mantener intactos:
- `src/components/faqs/useFAQLogic.ts` — se reutilizará en Wave 6
- `src/components/faqs/FAQAccordion.tsx` — se reutilizará en Wave 6
- `src/assets/tattoo/` — todo
- `src/components/tattoo/` — todo (migra a estudio)

---

### TAREA 3 — Actualizar `src/pages/index.ts`

Exportar solo las páginas existentes tras el cleanup. Agregar exports para las nuevas páginas a crear en esta wave.

---

### TAREA 4 — Crear `src/pages/Estudio.tsx`

Mover el contenido de `Tattoo.tsx` a `Estudio.tsx`. Cambios sobre el contenido existente:
- Actualizar el Schema.org: mantener `CollectionPage` pero cambiar la URL a `/estudio`
- El título H1 pasa a ser: "El Estudio"
- Eliminar la referencia a `TattooDetail` en cualquier link interno — el CTA de cada foto del grid apunta a `/contacto`, no a un detalle
- Mantener toda la historia de Nat (`content_first`) intacta
- CTA único al final de la página: "Agendar turno" → `/contacto`

Eliminar `Tattoo.tsx` una vez migrado.

---

### TAREA 5 — Crear `src/pages/Tienda.tsx` (shell)

Página placeholder funcional, lista para Wave 2:

```tsx
// Shell semántico con SEO correcto — contenido real en Wave 2
// H1: "La Tienda"
// Meta: title + description específicos de la tienda
// Schema: CollectionPage básico
// Contenido: mensaje "Catálogo en construcción" estilizado con el design system
// Sin imports de datos de productos todavía
```

Requisitos SEO del shell:
- `<title>`: "Tienda de Arte — Natalia Heller | Prints, Stickers y más"
- `<meta name="description">`: "Comprá prints originales, stickers, abanicos y hojas para colorear. Arte de Natalia Heller, Buenos Aires. Envíos a todo el país."
- Schema.org `CollectionPage` con `name`, `description`, `url`
- `<main>` con `<h1>` visible

---

### TAREA 6 — Crear `src/pages/ProductDetail.tsx` (shell)

Shell mínimo con estructura semántica correcta. Lee el `:slug` de la URL vía `useParams`. Placeholder "Producto en construcción". Schema `Product` vacío que se completará en Wave 3.

---

### TAREA 7 — Actualizar `src/App.tsx`

Nuevo routing completo:

```tsx
// Rutas activas:
// /             → Home (Header manual, sin Layout)
// /tienda       → Tienda
// /tienda/:slug → ProductDetail
// /estudio      → Estudio
// /blog         → Blog
// /blog/:slug   → BlogPost
// /contacto     → Contacto

// Rutas eliminadas: /obras, /obras/:slug, /sobre-mi, /faqs, /tattoo, /tattoo/:id

// La ruta /* dentro del Layout ya no incluye las rutas eliminadas
```

Mantener el patrón de Layout actual (Home fuera, resto dentro de `<Layout>`).

---

### TAREA 8 — Reescribir `src/components/shared/Header.tsx`

**Implementar el diseño del handoff** (ver `shared.jsx` → `NHHeader`). Reemplazar completamente el componente actual.

**Desktop:**
- Sticky, `bg-[rgba(250,246,240,0.92)] backdrop-blur-md`, `border-b border-[var(--line-soft)]`.
- Flex row: Logo izquierda (`NHLogo`) + nav + botón carrito derecha.
- Nav items: `Tienda | El Estudio | Blog | Contacto`. Font-body 14px weight 500. Activo: `text-sage-900 border-b border-sage-700`. Hover: idem con transición.
- Botón carrito: ghost pill pequeño, ícono SVG cart inline (ver shared.jsx para el path SVG), badge count `bg-sage-700 text-cream-50 rounded-full w-[18px] h-[18px] font-mono text-[11px]`.

**Mobile:**
- Logo izquierda, íconos (carrito + hamburger) derecha. `bg-cream-100 border-b border-[var(--line-soft)]`. Padding `14px 18px`.
- Hamburger: 3 líneas SVG `stroke="currentColor" strokeWidth="1.3"`. Al abrir → X animado con GSAP.
- Menu mobile: panel que baja debajo del header (no overlay full-screen). Items en columna, font-display serif 24px.

**Implementación GSAP (reemplaza Framer Motion):**
- Hamburger open/close: `gsap.to` sobre las 3 barras SVG — línea superior rota 45°, central hace opacity 0, inferior rota -45°.
- Menu panel: `gsap.fromTo` desde `{ height: 0, opacity: 0 }` a `{ height: 'auto', opacity: 1 }`, 300ms `var(--ease)`.
- Usar `useLayoutEffect` + `gsap.context()`. Cleanup: `ctx.revert()`.

**Componente `NHLogo`** — crear en `src/components/shared/NHLogo.tsx`:
```tsx
// SVG circular con "n" itálica en Fraunces + "natalia heller" en serif itálico
// Props: size (default 32), color (default 'var(--sage-900)')
// Ver implementación exacta en design_handoff_nh/shared.jsx → NHLogo
```

**Nav items:**
```typescript
const navigationItems = [
  { path: '/tienda', label: 'Tienda' },
  { path: '/estudio', label: 'El Estudio' },
  { path: '/blog', label: 'Blog' },
  { path: '/contacto', label: 'Contacto' },
]
```

**Accesibilidad:**
- `aria-label` dinámico en hamburger: "Abrir menú" / "Cerrar menú"
- `aria-expanded={isMenuOpen}` en el botón
- `role="navigation"` + `aria-label="Navegación principal"` en `<nav>`
- Botón carrito: `aria-label="Abrir carrito"`

**Eliminar:** todos los imports de `framer-motion`.

---

### TAREA 9 — Reescribir `src/components/shared/Footer.tsx`

**Implementar el diseño del handoff** (ver `shared.jsx` → `NHFooter`). Reemplazar completamente.

- `bg-cream-200`, `border-t border-[var(--line-soft)]`. Padding desktop `64px 48px 40px`, mobile `40px 22px 28px`.
- Grid desktop: `grid-cols-[2fr_1fr_1fr_1fr]` gap 40px. Mobile: `grid-cols-1` gap 28px.
- **Col 1 — Brand:** `NHLogo size={32}` + tagline Fraunces itálica 20px `text-ink-soft`: *"Arte y tatuaje sensible, desde el huerto del estudio en Buenos Aires."*
- **Col 2 — Navegar:** eyebrow "Navegar" + links: Tienda, El Estudio, Blog, Contacto.
- **Col 3 — Encontrame:** eyebrow "Encontrame" + Instagram `@nataliaceller_art` + "Newsletter mensual · Sumate" (link placeholder).
- **Col 4 — Estudio:** eyebrow "Estudio" + "Villa Crespo · Buenos Aires, AR" + `text-sage-700` "Con turno previo".
- Bottom bar: `font-mono text-[12px] text-ink-soft`, flex between. Izq: `© 2026 · Natalia Heller · Hecho con paciencia`. Der: `Envíos a todo el país · Retiro en CABA`.
- **Sin lógica `isTransparent`** — siempre `cream-200` opaco.
- `<footer role="contentinfo">`, links con texto descriptivo.
- Eliminar imports de `react-router-dom useLocation` (ya no hay lógica condicional por ruta).

---

### TAREA 10 — Reescribir `src/pages/Home.tsx` y sus componentes

**Implementar el diseño del handoff** (ver `pages-a.jsx` → `NHHome`). Eliminar el componente `ContentHero.tsx` y `HeroSection.tsx` — el Home tiene su propio layout, no usa el `HeroSection` genérico.

#### Estructura de la Home

```
<main>
  <section> Hero two-col </section>
  <section> Featured products </section>
  <NHDivider> "estudio + tatuaje" </NHDivider>
  <section> Tattoo teaser </section>
  <section> Story strip / quote </section>
</main>
```

#### Hero — dos columnas (desktop: `grid-cols-[1.05fr_0.95fr]`, mobile: `1fr`)

**Columna izquierda:**
- Motivo `NHLeafMark` absolute top-right (sage-500, 56px desktop / 42px mobile).
- Motivo `NHFlower` absolute bottom-left (sage-500, 46px desktop / 30px mobile, opacity 0.7).
- Eyebrow: `"Estudio · Buenos Aires · desde 2019"` con `NHSprig` inline.
- H1 Fraunces 78px/42px, weight 400, line-height 1.02, tracking -0.02em:
  ```
  Botánica sensible,
  <em style={{ fontStyle: 'italic', color: sage-700 }}>hecha con paciencia.</em>
  ```
- Párrafo 18px/16px, `text-ink-soft`, max-width 480px, line-height 1.65:
  *"Obra en papel, cerámica, textiles y tatuaje de línea fina. Cada pieza nace despacio en el estudio del barrio Villa Crespo, rodeada de plantas."*
- CTAs flex gap-3: Primary sage "Explorar la tienda →" → `/tienda` + Ghost ink "Reservar tatuaje" → `/estudio`.

**Columna derecha — Carrusel 4:5:**
- 5 slides con crossfade GSAP (opacity 700ms + scale 1.04→1 900ms via `gsap.to`).
- Auto-advance `setInterval` 4500ms — limpiar en unmount.
- Counter mono `01 / 05` absolute top-left dentro del carrusel, `bg-cream-50/90`.
- Flechas circulares absolute `top-1/2` — `w-10 h-10 bg-cream-50/90 rounded-full` con SVG `←` / `→`.
- Dots debajo: activo `w-[22px] h-[6px] bg-sage-700 rounded-pill`, inactivos `w-[6px] h-[6px] bg-taupe-500 opacity-40`.
- Box-shadow del carrusel: `0 20px 60px rgba(74,124,89,0.1), 0 2px 6px rgba(44,44,44,0.06)`.
- Slides son placeholder (`bg-cream-200` con label mono) — las fotos reales van en Wave 2.
- **En mobile: el carrusel se apila debajo del texto.** Solo imagen estática (primer slide), sin auto-advance ni flechas.

**GSAP para el carrusel:**
```typescript
// useLayoutEffect con gsap.context()
// En cada cambio de slide:
// gsap.to(slides[prev], { opacity: 0, scale: 1.04, duration: 0.7, ease: 'var(--ease)' })
// gsap.to(slides[current], { opacity: 1, scale: 1, duration: 0.9, ease: 'var(--ease)' })
```

#### Featured products — `src/components/home/FeaturedProductsSection.tsx`

- Eyebrow "Tienda" + H2 Fraunces 44px/28px: *"Piezas que acaban de salir del estudio"*.
- Link "Ver todo →" (`font-mono text-[13px] uppercase tracking-[0.14em]`) a `/tienda`.
- Grid `3col desktop / 2col mobile`, gap 28px/16px.
- Usar los primeros 6 productos de `NH_PRODUCTS` del handoff (`data.jsx`) como mock data hardcodeada en el componente — **solo para Wave 1**. Cada card es un placeholder con imagen rayas, nombre, precio y categoría siguiendo el diseño de `NHProductCard` (ver `shared.jsx`).
- Cards: `bg-cream-50 rounded-[4px]`, shadow `0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)`. Hover: `translateY(-4px)`, shadow más fuerte.
- Scroll reveal con GSAP ScrollTrigger: cards entran con `stagger: 0.08`, `from: { opacity: 0, y: 24 }`.

#### Tattoo teaser — `src/components/home/TattooTeaserSection.tsx`

- Grid `1fr 1fr` desktop / `1fr` mobile.
- Izq: mosaico 2 cols con 3 placeholders (proporciones distintas).
- Der: eyebrow "El estudio" + H2 Fraunces 48px/28px: *"Tatuajes de línea fina, pensados con vos."* + párrafo ink-soft + CTA primary "Conocer el estudio" → `/estudio`.

#### Quote strip

- Max-width 780px, centrado.
- Eyebrow centrado `· Sobre el estudio ·`.
- Párrafo Fraunces itálica 32px/22px, line-height 1.35, `text-ink`: *"Cada obra empieza en el huerto del patio: hojas que seco, flores que dibujo, colores que preparo con ceniza y cebolla. Trabajar con la mano puesta en la tierra."*
- Firma mono 11px sage-700: `— Natalia, desde el estudio`.

#### Schema.org

Actualizar en `Home.tsx`:
- `Organization`: nombre "Natalia Heller", url `https://tatuajesnaty.com`, description que incluya tienda + estudio, `sameAs` con Instagram.
- `WebSite`: con `SearchAction` preparado.

#### Performance del Hero

- En mobile (`< 768px`): el carrusel NO hace auto-advance, GSAP no corre las animaciones de slide. Renderizar solo el primer slide como imagen estática `loading="eager" fetchPriority="high"`.
- Eliminar el componente `HeroSection.tsx` genérico — ya no se usa en la Home. Verificar que no lo use ninguna otra página antes de eliminarlo (Estudio lo usa — mantenerlo por ahora, refactorizar en Wave 6).
- Eliminar `ContentHero.tsx` — reemplazado por el nuevo layout del hero.

---

### TAREA 11 — Verificación final

Ejecutar en orden:

```bash
# 1. Build limpio sin errores TypeScript
npm run build

# 2. Lint
npm run lint

# 3. Dev server — verificar manualmente:
npm run dev
```

Checklist de verificación manual:
- [ ] `/` carga, hero visible, CTA apunta a `/tienda`
- [ ] `/tienda` carga el shell con H1 correcto
- [ ] `/tienda/cualquier-slug` carga el shell de ProductDetail
- [ ] `/estudio` carga con el contenido de Nat
- [ ] `/blog` y `/blog/:slug` siguen funcionando
- [ ] `/contacto` sigue funcionando
- [ ] `/obras`, `/sobre-mi`, `/faqs`, `/tattoo` → 404 o redirect (según cómo maneje React Router rutas no definidas)
- [ ] Header mobile: menú abre/cierra, GSAP anima sin Framer Motion
- [ ] `npm run build` sin errores ni warnings de TypeScript
- [ ] `index.html` tiene `lang="es"`, título correcto, meta description

---

## Restricciones y reglas

- **No instalar librerías nuevas** salvo GSAP (ya indicado). Todo con el stack actual.
- **No crear archivos `.md`** ni documentación adicional.
- **`tailwind.config.js` SÍ se modifica** — reemplazar los tokens de color y tipografía (ver TAREA PREVIA). No tocar `content`, `plugins` ni breakpoints.
- **No tocar** `src/components/contacto/`, `src/components/blog/`, `src/hooks/useBlogLogic.ts`, `src/hooks/useBlogPostLogic.ts` — fuera del scope de Wave 1.
- **No tocar** `src/components/faqs/useFAQLogic.ts` ni `FAQAccordion.tsx` — se reutilizan en Wave 6.
- **No tocar** `src/components/shared/HeroSection.tsx` — Estudio lo sigue usando. Solo modificar si hay un bug que lo rompe.
- **No crear** el modelo de datos de productos (`src/data/products.ts`) — es Wave 2. Los productos del Home son mock hardcodeado local.
- **No crear** la lógica de carrito (`useCart`, `CartDrawer`) — es Wave 4. El botón de carrito en el header es visual únicamente, sin funcionalidad.
- Los archivos de `design_handoff_nh/` son de **solo lectura** — nunca modificarlos.
- Framer Motion debe quedar **completamente desinstalado** al final (`npm uninstall framer-motion`).
- Cada archivo modificado debe compilar sin errores TS antes de pasar al siguiente.
- Las animaciones GSAP deben incluir cleanup (`ctx.revert()` o `tl.kill()`) en el return del hook.
- Respetar `prefers-reduced-motion`: wrappear todas las animaciones GSAP con `if (shouldAnimate())`.
- Todo `<img>` nuevo o modificado: `alt` descriptivo, `width` y `height` explícitos.
- Copy en **español rioplatense** — sin voseo en CTAs, pero "vos" en textos narrativos.

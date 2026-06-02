# Handoff: Natalia Heller — sitio de arte y tatuaje

## Overview
Rediseño del sitio de Natalia Heller — artista visual y tatuadora radicada en Buenos Aires. El sitio combina una tienda de arte (foco principal), portfolio de tatuaje, diario/blog y contacto. La identidad es **earthy modern**: cálida, orgánica, íntima y botánica — nada de minimalismo tech ni lujo frío.

Páginas incluidas: Home, Tienda (catálogo con filtros), Producto (detalle), Estudio (portfolio tatuaje + booking), **Diario (blog listing)**, **Single post**, Contacto.

## About the Design Files
Los archivos de este paquete son **referencias de diseño en HTML/React** — prototipos hechos en Babel standalone para mostrar el look, la jerarquía y las interacciones deseadas. **No son código productivo.** La tarea es **recrear estos diseños en el entorno del codebase**: React + Vite + TypeScript + Tailwind + GSAP, apuntando a migración a Next.js. Usá los patrones, componentes y tokens que ya existan en el proyecto y portá los tokens nuevos al `tailwind.config`.

## Fidelity
**High-fidelity.** Colores, tipografía, espaciado, sombras, estados hover, animaciones de carrusel, transición entre páginas y validación de formularios están especificados. Las imágenes son placeholders a rayas con labels en monospace — reemplazarlas por fotos reales (WebP/AVIF) respetando los aspect ratios indicados.

## Cómo correr el prototipo
```bash
npx serve .
# abre http://localhost:3000/Natalia%20Heller.html
```
Ver `RUNNING.md` para más opciones (Python, Live Server) y notas de implementación en producción.

## Screens

### 1. Home (`/`)
- **Hero a dos columnas** (desktop: 1.05fr / 0.95fr, mobile: 1 col apilado).
  - Izquierda: eyebrow `Estudio · Buenos Aires · desde 2019` con marca botánica, H1 serif 78px con segunda línea en itálica sage-700, párrafo 18px soft, dos CTAs (primary sage + ghost).
  - Derecha: **carrusel** 4:5 con 5 slides, auto-advance 4.5s, flechas circulares sobre fondo cream semitransparente, contador `01 / 05` arriba izquierda, dots debajo (dot activo ancho 22×6, inactivos 6×6).
  - Motivos decorativos: hoja SVG arriba derecha (sage-500), flor prensada abajo izquierda (opacity 0.7).
- **Productos destacados**: grid 3 col desktop / 2 col mobile, cards estilo pressed-flower.
- **Divider botánico** "estudio + tatuaje".
- **Teaser tatuaje**: dos columnas (mosaico de 3 placeholders + bloque de texto con CTA).
- **Quote strip**: cita de Natalia en serif itálica 32px, centrada, max-width 780px.

### 2. Tienda (`/tienda`)
- Hero simple con count `Tienda · 12 piezas` y H1 `Obra disponible`.
- **Barra de filtros sticky** (top ~78px) con pills redondeadas. Categorías: Todos, Cerámica, Acuarelas, Gouache, Textiles, Ilustraciones, Técnica mixta, Stickers, Láminas, Mandalas, Abanicos. La pill activa muestra el count al lado. Scroll horizontal en mobile.
- **Grid** 3 col desktop / 2 col mobile, gap 32px / 16px.
- Empty state cuando filtro no arroja resultados.

### 3. Producto (`/tienda/:slug`)
- Breadcrumb monospace `tienda / categoría / producto`.
- Layout 1.1fr / 0.9fr (desktop) o 1 col (mobile).
  - Izquierda: imagen principal + 4 thumbnails.
  - Derecha: eyebrow, H1 52px, precio serif 28px sage-900 + pill `ARS`, descripción, selector de tamaños (A6/A5/A4/A3 con multiplicadores 0.55/0.75/1/1.6), checkbox "sumar marco de roble" (+$12.000), botón Agregar al carrito (sage) + botón corazón. Tabla de specs (Técnica, Medidas, Edición, Envío).
- **Productos relacionados** al final (misma categoría).

### 4. Estudio (`/estudio`)
- Hero con H1 84px `Línea fina, botánica y una conversación lenta.`
- **Masonry gallery** 4 col desktop / 2 col mobile, `column-count` CSS. Pills `BOCETO` / `EN PIEL` sobre cada pieza.
- Divider botánico "el proceso".
- **Proceso** 4 pasos (01–04) con número serif 56px sage-500 itálica.
- Split: FAQ expandible (+/×) + formulario de reserva con validación.

### 5. Diario / Blog (`/blog`) — **NUEVO**
- Header con eyebrow `Diario del estudio`, H1 72px `Notas sobre proceso, plantas y oficio.`, subtítulo soft.
- **Filtros sticky** (mismo patrón que Tienda): Todos · Estudio · Botánica · Cerámica · Dibujo · Textiles.
- **Post destacado** (primer post filtrado): grid 2 cols, imagen a la izquierda + título 48px + subtítulo + meta (categoría + fecha + tiempo de lectura) + link `Leer nota →` con underline sage-700.
- **Divider botánico** "más notas".
- **Grid** 3 cols desktop / 1 col mobile con cards reutilizando `NHCard`. Cada card: media + categoría/reading + título 22px + subtítulo + fecha mono.

### 6. Single post (`/blog/:slug`) — **NUEVO**
- Breadcrumb mono `diario / slug`.
- Hero (max-width 760px): pills de categoría + meta (`fecha · X min lectura`), H1 68px desktop / 36px mobile, lead serif itálico 22px soft.
- Imagen de portada (max-width 860px), aspect ratio 1/0.55, shadow suave.
- **Body** (max-width 720px):
  - Author strip arriba: avatar circular sage 40px con leaf SVG cream + nombre `Natalia Heller` serif + meta mono `Desde el estudio · fecha`.
  - `<p>`: 18px / 1.75 line-height, margin-bottom 22px.
  - `<h2>`: serif 32px, weight 400, letter-spacing -0.01em, margin 48px 0 18px.
  - `<ul>`: items con border-bottom soft, viñeta = doble-círculo SVG sage-500 (10×10).
- Firma al final: divider line + flor prensada sage-500 + frase serif itálica `Natalia Heller — escrito desde el estudio, Desde el estudio.`
- **Posts relacionados** (2): divider `seguir leyendo` + grid de cards (mismo `NHBlogCard`).

### 7. Contacto (`/contacto`)
- Split: info de contacto a la izquierda (correo, IG, estudio Desde el estudio, horarios) + formulario a la derecha (nombre, email, motivo pills, mensaje).
- Confirmación con icono de hoja.

## Interactions & Behavior

### Navegación
- SPA con estado `{ page, slug? }`. Persistir en `localStorage` (clave `nh-state-desktop` / `nh-state-mobile`).
- Header sticky con backdrop blur. Link activo subrayado sage-700.
- Nav order: **Tienda · Estudio · Diario · Contacto** (carrito + burger en mobile).
- Al cambiar de ruta: scroll al top + animación `nh-page-enter` (fade + translateY 8px, 400ms).

### Carrito
- Drawer lateral derecho, ancho 380px desktop / 86% mobile, `translateX(100%) → 0`, 420ms cubic-bezier(0.22,0.61,0.36,1).
- Backdrop semi-transparente (rgba(44,44,44,0.24)) con fade 300ms.
- Items combinan por `slug + size + frame` (aumentan qty).
- Toast `"<título> · agregado"` al agregar; pill ink en bottom-center, 2.2s.

### Carrusel hero
- Auto-advance cada 4.5s (`setInterval`, limpiar en unmount).
- Crossfade 700ms + scale 1.04→1 900ms.
- Click en flechas o dots reinicia posición.

### Formularios
- Validación al submit:
  - Nombre: no vacío.
  - Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - Mensaje/idea: min 10/20 caracteres.
- Errores debajo del campo en `#a8503f` 12px.
- Éxito reemplaza el form con pantalla de confirmación + botón "enviar otro".

### Tweaks (solo en prototipo)
Panel floating bottom-right con 3 controles persistidos vía `data-*` en `<body>`:
- `data-card`: `pressed` | `gallery` | `linen`
- `data-motif`: `on` | `off`
- `data-pair`: `bitter` | `fraunces` | `eb-work`

**En producción fijar**: `pressed` cards, motifs `on`, type pair `fraunces` + `nunito`.

## Design Tokens

### Colors — Tailwind config
```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      cream: {
        50:  '#fdfcfb',
        100: '#faf6f0',   // bg principal
        200: '#f5efe6',
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
        700: '#4a7c59',   // accent principal (CTA, links)
        900: '#2f4a37',
      },
      ink: {
        DEFAULT: '#2c2c2c',
        soft:    '#5a5350',
      },
    },
  },
},
```

Líneas: `rgba(44,44,44,0.12)` normal, `rgba(44,44,44,0.06)` suave. Error: `#a8503f`.

### Typography
**Recomendado: Fraunces + Nunito** (elección final del cliente).

```css
--font-display: 'Fraunces', Georgia, serif;        /* H1–H3, precios, citas, leads */
--font-body:    'Nunito', system-ui, sans-serif;   /* párrafos, botones, UI */
--font-mono:    'JetBrains Mono', ui-monospace;    /* eyebrows, specs, labels, fechas */
```

Escalas:
- H1 hero: 78px desktop / 42px mobile, line-height 1.02, letter-spacing -0.02em, weight 400.
- H1 blog index: 72px / 38px. H1 single post: 68px / 36px.
- H1 páginas secundarias: 72–84px.
- H2: 44px (tienda/home) / 32px (post body).
- Lead serif itálica (single post): 22px / 1.5.
- Body: 15–18px, line-height 1.6–1.75 (post body usa 1.75).
- Eyebrow (mono): 11px uppercase, letter-spacing 0.14em, color sage-700.

### Spacing / layout
- Padding página: `48px` desktop / `22px` mobile.
- Sección: `72–140px` top / `60–96px` bottom.
- Grid gap: `28–40px` desktop / `16–28px` mobile.
- Article max-width: 720px (post body), 760px (post hero), 860px (cover image).

### Radius / Shadows / Motion
- Buttons: `999px` (pill). Cards pressed: `4px`. Inputs: underline.
- Card pressed idle: `0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)`.
- Card hover: `0 2px 4px rgba(44,44,44,0.05), 0 16px 36px rgba(74,124,89,0.1)` + `translateY(-4px)`.
- Carrusel: `0 20px 60px rgba(74,124,89,0.1), 0 2px 6px rgba(44,44,44,0.06)`.
- Cover post: `0 12px 40px rgba(74,124,89,0.08)`.
- Drawer: `-20px 0 60px rgba(44,44,44,0.18)`.
- Easing global: `cubic-bezier(0.22, 0.61, 0.36, 1)`.

### Motivos botánicos (SVGs)
- **NHLeafMark**: tallo curvo + 3 hojas circulares. Tamaños 20–64px.
- **NHSprig**: tallo horizontal con 6 elipses alternadas (dividers).
- **NHFlower**: 5 pétalos elipse + círculo central (acentos / firma post).

## State Management
Props drilling alcanza para este scope. En producción mover carrito a Context o Zustand:
```ts
// cartStore.ts
{
  items: CartItem[];     // merge por slug+size+frame
  add(item): void;
  remove(idx): void;
  count: number;         // derivado
  total: number;         // derivado
}
```
Persistir items en localStorage.

## Assets
- **Fuentes**: Google Fonts (Fraunces, Nunito, JetBrains Mono). Preconnect + preload recomendados.
- **Imágenes**: no incluidas. Formatos: WebP + AVIF con `<picture>`. Aspect ratios:
  - Hero carrusel: 4:5.
  - Cover post: ~16:9 (tall 0.55).
  - Tattoos masonry: variables.
  - Thumbnails producto: 1:1.
- **Iconos**: inline SVG (carrito, burger, corazón, chevron, hoja). 1.3 stroke, currentColor.

## Files (este bundle)
- `Natalia Heller.html` — shell que monta desktop + mobile.
- `styles.css` — tokens y utilities.
- `data.jsx` — `NH_CATEGORIES`, `NH_PRODUCTS`, `NH_TATTOOS`.
- `blog-data.jsx` — `NH_POSTS` (6 posts con body estructurado).
- `shared.jsx` — `NHLogo`, `NHHeader`, `NHFooter`, `NHProductCard`, `NHPh`, `NHLeafMark`, `NHSprig`, `NHFlower`, `NHDivider`.
- `pages-a.jsx` — Home, Tienda, Producto.
- `pages-b.jsx` — Estudio, Contacto.
- `pages-blog.jsx` — Blog listing, Single post, NHBlogCard.
- `app.jsx` — shell con routing, cart, drawer, toast.
- `browser-window.jsx`, `ios-frame.jsx` — frames del prototipo (no necesarios en producción).
- `RUNNING.md` — instrucciones para correr el prototipo localmente.

## Notas finales
- Copy en español rioplatense (validado).
- Mantener sensación de **calma**: animaciones lentas, cursiva en acentos, amplio whitespace.
- Evitar gradients saturados, emojis, dark mode y estética de marketplace.

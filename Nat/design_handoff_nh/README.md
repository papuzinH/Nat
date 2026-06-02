# Handoff: Natalia Heller — sitio de arte y tatuaje

## Overview
Rediseño del sitio de Natalia Heller — artista visual y tatuadora radicada en Buenos Aires. El sitio combina una tienda de arte (foco principal) con el portfolio de su estudio de tatuaje. La identidad es **earthy modern**: cálida, orgánica, íntima y botánica — nada de minimalismo tech ni lujo frío.

Páginas incluidas: Home, Tienda (catálogo con filtros), Producto (detalle), Estudio (portfolio tatuaje + booking), Contacto.

## About the Design Files
Los archivos de este paquete son **referencias de diseño en HTML/React** — prototipos hechos en Babel standalone para mostrar el look, la jerarquía y las interacciones deseadas. **No son código productivo.** La tarea es **recrear estos diseños en el entorno del codebase**: React + Vite + TypeScript + Tailwind + GSAP, apuntando a migración a Next.js. Usá los patrones, componentes y tokens que ya existan en el proyecto y portá los tokens nuevos al `tailwind.config`.

## Fidelity
**High-fidelity.** Colores, tipografía, espaciado, sombras, estados hover, animaciones de carrusel, transición entre páginas y validación de formularios están especificados. Las imágenes son placeholders a rayas con labels en monospace — reemplazarlas por fotos reales (WebP/AVIF) respetando los aspect ratios indicados.

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
- Split: FAQ expandible (+/×) + formulario de reserva con validación:
  - Campos: nombre, email (regex), zona del cuerpo (select), tamaño (select), idea (textarea, min 20 chars).
  - Confirmación con icono de hoja y mensaje personalizado.

### 5. Contacto (`/contacto`)
- Split: info de contacto a la izquierda (correo, IG, estudio Desde el estudio, horarios) + formulario a la derecha (nombre, email, motivo pills, mensaje).
- Confirmación con icono de hoja.

## Interactions & Behavior

### Navegación
- SPA con estado `{ page, slug? }`. Persistir en `localStorage` (clave `nh-state-desktop` / `nh-state-mobile`).
- Header sticky con backdrop blur. Link activo subrayado sage-700.
- Al cambiar de ruta: scroll al top + animación `nh-page-enter` (fade + translateY 8px, 400ms).

### Carrito
- Drawer lateral derecho, ancho 380px desktop / 86% mobile, `translateX(100%) → 0`, 420ms cubic-bezier(0.22,0.61,0.36,1).
- Backdrop semi-transparente (rgba(44,44,44,0.24)) con fade 300ms.
- Items combinan por `slug + size + frame` (aumentan qty).
- Toast `"<título> · agregado"` al agregar; pill ink en bottom-center, 2.2s.

### Carrusel hero
- Auto-advance cada 4.5s (`setInterval`, limpiar en unmount).
- Crossfade 700ms + scale 1.04→1 900ms.
- Click en flechas o dots reinicia posición (no timer).

### Formularios
- Validación al submit:
  - Nombre: no vacío.
  - Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - Mensaje/idea: min 10/20 caracteres.
  - Zona del cuerpo (estudio): requerida.
- Errores debajo del campo en `#a8503f` 12px.
- Éxito reemplaza el form con pantalla de confirmación + botón "enviar otro".

### Tweaks (solo en prototipo)
Panel floating bottom-right con 3 controles persistidos vía `data-*` en `<body>`:
- `data-card`: `pressed` | `gallery` | `linen`
- `data-motif`: `on` | `off`
- `data-pair`: `bitter` | `fraunces` | `eb-work`

**En producción fijar**: `pressed` cards, motifs `on`, type pair según elección final (ver Typography).

## Design Tokens

### Colors — Tailwind config
```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      cream: {
        50:  '#fdfcfb',
        100: '#faf6f0',   // bg principal
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
        700: '#4a7c59',   // accent principal (CTA, links)
        900: '#2f4a37',   // hover CTA / precios
      },
      ink: {
        DEFAULT: '#2c2c2c',   // texto
        soft:    '#5a5350',   // texto secundario
      },
    },
  },
},
```

Líneas: `rgba(44,44,44,0.12)` normal, `rgba(44,44,44,0.06)` suave.
Error: `#a8503f`.

### Typography
3 pairs disponibles (por Tweaks). **Recomendado: Fraunces + Nunito** (fue la elección del cliente).

```
--font-display: 'Fraunces', Georgia, serif;    // H1–H3, precios, citas
--font-body:    'Nunito', system-ui, sans;     // párrafos, botones, UI
--font-mono:    'JetBrains Mono', ui-monospace; // eyebrows, specs, labels
```

Escalas:
- H1 hero: 78px desktop / 42px mobile, line-height 1.02, letter-spacing -0.02em, weight 400.
- H1 páginas secundarias: 72–84px / 38–40px.
- H2: 44px / 28px.
- H3: 20–26px.
- Body: 15–18px, line-height 1.6–1.7.
- Eyebrow (mono): 11px uppercase, letter-spacing 0.14em, color sage-700.

### Spacing / layout
- Padding página: `48px` desktop / `22px` mobile.
- Sección: `72–140px` top / `60–96px` bottom.
- Grid gap: `28–32px` desktop / `16px` mobile.

### Radius
- Buttons: `999px` (pill).
- Cards pressed: `4px`.
- Inputs: underline únicamente (border-bottom, no radius).
- Tweaks panel / forms card: `6px–12px`.

### Shadows
- Card pressed idle: `0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)`.
- Card pressed hover: `0 2px 4px rgba(44,44,44,0.05), 0 16px 36px rgba(74,124,89,0.1)` + `translateY(-4px)`.
- Carrusel: `0 20px 60px rgba(74,124,89,0.1), 0 2px 6px rgba(44,44,44,0.06)`.
- Drawer: `-20px 0 60px rgba(44,44,44,0.18)`.

### Motion
- Easing global: `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- Hover lift: 220–300ms.
- Page enter fade-up: 400ms.
- Drawer: 420ms.
- Carrusel crossfade: 700–900ms.

### Placeholders
Las imágenes del prototipo son `.nh-ph` (rayas diagonales 135° sobre tono cream) con label monospace 10px. Reemplazar por fotos reales respetando el `aspectRatio` indicado.

### Motivos botánicos (SVGs simples)
- **NHLeafMark**: tallo curvo + 3 circulos (hojas). Tamaños 20–64px, color sage-500.
- **NHSprig**: tallo horizontal con 6 elipses (hojas) alternadas. Usar en dividers.
- **NHFlower**: 5 pétalos elipse + círculo central. Usar como acento abajo-izquierda.

## State Management
Props drilling es suficiente para este scope. En producción, mover carrito a Context o Zustand:
```ts
// cartStore.ts
{
  items: CartItem[];
  add(item): void;    // merge por slug+size+frame
  remove(idx): void;
  count: number;      // derivado
  total: number;      // derivado
}
```
Persistir items en localStorage.

## Assets
- **Fuentes**: Google Fonts (Fraunces, Nunito, JetBrains Mono). Preconnect + preload recomendados.
- **Imágenes**: no incluidas. Formatos: WebP + AVIF con `<picture>`. Aspect ratios críticos:
  - Hero carrusel: 4:5.
  - Producto principal: variable por tall (`0.95`–`1.5`).
  - Tattoos masonry: variables (masonry CSS columns).
  - Thumbnails producto: 1:1.
- **Iconos**: inline SVG en el código (carrito, burger, corazón, chevron). 1.3 stroke, currentColor.

## Files
Archivos en `design_handoff_nh/`:
- `Natalia Heller.html` — shell que monta desktop + mobile.
- `styles.css` — tokens y utilities (CSS custom props + data-attributes para variantes).
- `data.jsx` — `NH_CATEGORIES`, `NH_PRODUCTS`, `NH_TATTOOS` (copy es usable directo).
- `shared.jsx` — `NHLogo`, `NHHeader`, `NHFooter`, `NHProductCard`, `NHPh`, `NHLeafMark`, `NHSprig`, `NHFlower`, `NHDivider`.
- `pages-a.jsx` — Home, Tienda, Producto.
- `pages-b.jsx` — Estudio, Contacto.
- `app.jsx` — shell con routing, cart, drawer.

## Notas finales
- Copy en español rioplatense (ya validado con cliente).
- Mantener sensación de **calma**: animaciones lentas, cursiva en acentos, amplio whitespace. Nada rápido, nada cortante.
- Evitar gradients saturados, emojis, dark mode y estética de marketplace.

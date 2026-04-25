# Cómo correr el prototipo

El prototipo es HTML + JSX (Babel standalone). No tiene build step. Necesita un servidor estático porque los `<script src="...">` no cargan desde `file://`.

## Opción A — `npx serve` (recomendada)
```bash
npx serve .
# abre http://localhost:3000/Natalia%20Heller.html
```

## Opción B — Python
```bash
python3 -m http.server 8080
# abre http://localhost:8080/Natalia%20Heller.html
```

## Opción C — VS Code Live Server
Instalá la extensión **Live Server** (Ritwick Dey), click derecho sobre `Natalia Heller.html` → *Open with Live Server*.

---

## Estructura de archivos

```
.
├── Natalia Heller.html   # shell — abrir este
├── styles.css            # tokens + utilidades
├── data.jsx              # productos, categorías, tattoos
├── blog-data.jsx         # posts del diario
├── shared.jsx            # Logo, Header, Footer, Cards, Motifs
├── pages-a.jsx           # Home, Tienda, Producto
├── pages-b.jsx           # Estudio, Contacto
├── pages-blog.jsx        # Blog listing, Single post
├── app.jsx               # router SPA, carrito, drawer
├── browser-window.jsx    # chrome desktop
└── ios-frame.jsx         # frame iPhone
```

El HTML monta dos instancias React independientes: `#desktop-root` (1180×820 dentro de ChromeWindow) y `#mobile-root` (402×874 dentro de IOSDevice). Cada una tiene su propio estado de ruta en `localStorage`.

## Rutas (`page` en el state)

| `page` | Archivo | Descripción |
|---|---|---|
| `home` | `pages-a.jsx` | Hero con carrusel + featured |
| `tienda` | `pages-a.jsx` | Catálogo con filtros |
| `product` + `slug` | `pages-a.jsx` | Detalle de producto |
| `estudio` | `pages-b.jsx` | Portfolio + booking |
| `blog` | `pages-blog.jsx` | Listing con featured + grid |
| `post` + `slug` | `pages-blog.jsx` | Single post + relacionados |
| `contacto` | `pages-b.jsx` | Formulario |

## Implementación en producción

Stack recomendado: **Next.js 14 App Router + TypeScript + Tailwind CSS**.

Mapeo directo:
- `home` → `app/page.tsx`
- `tienda` → `app/tienda/page.tsx`
- `product` → `app/tienda/[slug]/page.tsx`
- `estudio` → `app/estudio/page.tsx`
- `blog` → `app/blog/page.tsx`
- `post` → `app/blog/[slug]/page.tsx`
- `contacto` → `app/contacto/page.tsx`

Tokens de color y tipografía → ver `README.md` (sección Design Tokens), copiar a `tailwind.config.ts`.

Carrito → mover a Zustand o Context, persistir en localStorage.

Imágenes → reemplazar `<NHPh>` por `<Image>` de Next, formatos WebP/AVIF.

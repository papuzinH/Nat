# CLAUDE.md — NatArt Project

## Visión general del proyecto

**NatArt** es el sitio web de **Natalia Heller**, artista plástica y tatuadora con base en Buenos Aires, Argentina. El proyecto cubre dos universos en un mismo dominio:

1. **Obras artísticas** — portfolio y venta de arte original (acuarelas, acrílicos, cerámicas, flores prensadas, gouache, ilustraciones, técnicas mixtas, marcadores, stickers).
2. **Tattoo Studio** — agenda de citas para tatuajes personalizados (line art, botánico, minimalista, cover up).

> ⚠️ **El enfoque del proyecto está cambiando.** La app está siendo refactorizada hacia un e-commerce artístico con la tienda como eje central. Este documento refleja el estado *previo* a la refactorización. Ver `REFACTOR_PLAN.md` para el plan de implementación completo por waves.

---

## Stack técnico actual

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.1 | UI framework |
| Vite | 7.0 | Bundler / dev server |
| TypeScript | 5.8 | Tipado estático |
| React Router DOM | 7.6 | Client-side routing |
| Tailwind CSS | 3.4 | Estilos utility-first |
| Framer Motion | 12.23 | Animaciones |
| yet-another-react-lightbox | 3.25 | Galería de imágenes |
| Google Tag Manager | GTM-WXL45DSC | Analytics / tracking |

> **No es Next.js.** Es una SPA con Vite + React Router. Los project instructions mencionan Next.js como objetivo de stack futuro.

---

## Estructura de carpetas

```
src/
├── assets/
│   ├── obras/          # Imágenes de obras (jpg, webp)
│   │   └── obras-data.ts   # Data mock de categorías y obras
│   ├── tattoo/
│   │   ├── mock-data.ts    # Data mock de tatuajes (4 items con SEO)
│   │   └── tat1-4.jpg
│   └── *.webp / *.mp4      # Assets hero (videos, fotos)
├── components/
│   ├── blog/           # BlogPostCard, PostCard
│   ├── contacto/       # ContactForm, useContactForm hook
│   ├── faqs/           # FAQAccordion, FAQSearch, useFAQLogic
│   ├── home/           # ContentHero, FeaturedPortfolio, HomeFAQ, Instagram, SocialProof
│   ├── obras/          # CategoryNavigation, ObrasGrid
│   ├── shared/         # Componentes reutilizables (ver abajo)
│   ├── sobremi/        # AboutSobreMi, ContentImage
│   └── tattoo/         # CTATattoo, ContenidoText, StudioCTA, TattooGridList
├── data/
│   └── obras.ts        # tiposObras: array con las 9 categorías de obras
├── hooks/
│   ├── data-loader.ts
│   ├── useBlogLogic.ts      # Mock data blog (10 posts) + lógica de navegación
│   └── useBlogPostLogic.ts
├── pages/
│   ├── Home.tsx
│   ├── Obras.tsx
│   ├── CategoryPage.tsx     # Página dinámica por slug de categoría
│   ├── Tattoo.tsx
│   ├── TattooDetail.tsx     # Detalle por ID de tatuaje
│   ├── SobreMi.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx
│   ├── FAQs.tsx
│   ├── Contacto.tsx
│   └── obras-tipos/         # Páginas legacy por tipo (Acrilicos, Acuarelas, etc.)
└── App.tsx                  # Router principal
```

---

## Routing

```
/                   → Home (Header manual, sin Layout wrapper)
/obras              → Obras (grid de categorías)
/obras/:slug        → CategoryPage (dinámica por slug)
/tattoo             → Tattoo (portfolio de tatuajes)
/tattoo/:id         → TattooDetail
/sobre-mi           → SobreMi
/blog               → Blog
/blog/:slug         → BlogPost
/faqs               → FAQs
/contacto           → Contacto
```

**Patrón de Layout:** La Home usa `<Header />` + `<Home />` directamente (sin padding-top). Todas las demás rutas usan `<Layout>` (Header + main con `pt-18` + Footer).

---

## Componentes shared clave

| Componente | Descripción |
|---|---|
| `Header` | Fixed, transparente → blur on scroll. Nav centrada desktop, hamburger mobile con overlay animado (Framer Motion). Active path con `text-green-400 border-b-2`. Logo "N" circular verde. |
| `Footer` | Adaptive: transparente (`/` y `/contacto`), opaco resto. 3 columnas: Brand, Links, Contacto. |
| `Layout` | Header + `<main pt-18>` + Footer. `bg-cream-50`. |
| `HeroSection` | Full-height con video o imagen de fondo + overlay `bg-black/40`. SVG wave en el bottom. |
| `SchemaMarkup` | Inyecta JSON-LD en `<head>` via `useEffect`. Soporta LocalBusiness, Person, Organization, Article, Product, CollectionPage, etc. |
| `Button` | Variantes: primary, secondary, outline, ghost. Sizes: small, medium, large. Puede renderizar como `<button>`, `<Link>` o `<a>`. |
| `GTMTag` / `NoscriptGTM` | Google Tag Manager (GTM-WXL45DSC). |
| `ScrollToTop` | Reset scroll en navegación. |

---

## Design System / Tokens

### Paleta de colores (Tailwind custom)

| Token | Uso principal |
|---|---|
| `cream-*` | Background base (`cream-50 = #fdfcfb`), bordes, secundarios |
| `green-*` | Acentos activos, CTAs, hover states (`green-400` = mint/lima) |
| `brown-*` | Tonos cálidos complementarios |
| `nude-*` | Variantes muy neutras |

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `font-title` | Aboreto (serif) | Headings, logo, nav mobile |
| `font-body` | Gayathri (sans-serif) | Nav desktop, body copy |
| `body` default | Lato | Texto general |

Fuentes cargadas desde Google Fonts en `index.css`.

---

## Datos / Estado

**Todo el contenido es mock data hardcodeada** — no hay CMS ni API externa aún:

- **Obras:** `src/data/obras.ts` (9 categorías) + `src/assets/obras/obras-data.ts` (obras con detalle por categoría)
- **Tatuajes:** `src/assets/tattoo/mock-data.ts` (4 tattoos con descripciones SEO-optimizadas)
- **Blog:** definido dentro de `src/hooks/useBlogLogic.ts` (10 posts mock)

---

## SEO / Analytics implementado

- **Schema.org JSON-LD** via `SchemaMarkup` (LocalBusiness en Home, Person en SobreMi)
- **GTM** integrado (GTM-WXL45DSC) con push a `dataLayer` en submit del formulario de contacto
- **GTM event:** `form_submitted_success` con `conversion_value`, `lead_type`, `design_id`
- **`index.html`** aún tiene el título default de Vite (`Vite + React + TS`) — pendiente de actualizar
- **`lang="en"`** en `<html>` — debería ser `lang="es"`

---

## Formulario de Contacto

Hook `useContactForm` con campos: name, email, phone, consultType, message. Soporta pre-llenado con `designId` / `designTitle` (para CTAs desde tattoo detail). Submit simulado (sin endpoint real). Dispara evento GTM al submitear.

---

## Issues conocidos / Deuda técnica

1. `index.html` — título "Vite + React + TS", sin meta SEO, `lang="en"` → debe ser `lang="es"`
2. Todo el contenido es **mock data** — sin CMS, sin API, sin Supabase/cualquier backend
3. **No es Next.js** — el stack objetivo del proyecto es Next.js App Router (pendiente de migración)
4. `SchemaMarkup` usa `useEffect` para inyectar JSON-LD → no es SSR-friendly (relevante para la migración a Next.js)
5. Blog posts tienen `content: 'Contenido completo...'` — placeholder, sin contenido real
6. Las páginas en `src/pages/obras-tipos/` (Acrilicos.tsx, Acuarelas.tsx, etc.) parecen ser rutas legacy no conectadas al router actual
7. HeroSection usa `<video>` sin lazy loading ni placeholder — potencial impacto en LCP
8. El formulario de contacto no tiene endpoint real de envío

---

## Contexto de negocio

- **Cliente:** Natalia Heller, Buenos Aires, CABA, Argentina
- **Dominio:** `tatuajesnaty.com` (referenciado en schema data)
- **Instagram:** `@nataliaceller_art` (referenciado en schema + footer)
- **Teléfono:** +54 9 11 3272-2555
- **Horarios:** Lun-Vie 10:00-19:00, Sáb 11:00-17:00
- **Precio estimado:** `$$` (schema priceRange)

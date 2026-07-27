# CLAUDE.md — NatArt Project

## Visión general del proyecto

**NatArt** = sitio de **Natalia Heller**, artista plástica y tatuadora, Buenos Aires. Dos universos, un dominio:

1. **Obras artísticas / Tienda** — e-commerce de arte original (láminas/giclée, cerámicas, stickers, ilustraciones, técnicas mixtas, etc.) con carrito, checkout y pagos por Mercado Pago.
2. **Estudio (Tattoo)** — sección del estudio + formulario de reserva de tatuajes (line art, botánico, minimalista, cover up).

> La tienda es el eje del producto. El contenido (productos, blog, stock, envíos) vive en **PocketBase** y se administra desde el panel `/admin`.

---

## Stack técnico actual

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js (App Router, Turbopack) | 16.2 | Framework full-stack (SSR/SSG/ISR + Route Handlers) |
| React | 19.1 | UI |
| TypeScript | 5.8 | Tipado estático |
| Tailwind CSS | 3.4 | Estilos utility-first |
| PocketBase (SDK) | 0.26 | Backend / DB (`https://nat.lhstudio.com.ar`) |
| GSAP | 3.x | Animaciones |
| TipTap | 3.x | Editor rich-text (admin) + render server (`@tiptap/html`) |
| yet-another-react-lightbox | 3.25 | Galería de imágenes |
| Mercado Pago + Brevo | — | Pagos + emails transaccionales |
| Google Tag Manager | GTM-WXL45DSC | Analytics (vía `next/script`) |

> **Es Next.js App Router.** Migrado desde Vite + React Router (SPA). Objetivo de la migración: SEO + LCP (HTML indexable por ruta, ISR, `next/image`, JSON-LD en el HTML del servidor). Fuentes vía `next/font/google` (Fraunces / Nunito / JetBrains Mono).

---

## Estructura de carpetas

```
app/                        # App Router (rutas + layouts + handlers)
├── layout.tsx              # Root: <html>, fuentes, GTM, providers (Cart/Toast), metadata base
├── globals.css             # Estilos globales (CSS vars, tokens, directivas Tailwind)
├── (home)/                 # Grupo: home sin padding-top
│   ├── layout.tsx          #   Header + main + Footer (sin pt)
│   └── page.tsx            #   Home (server + JSON-LD)
├── (site)/                 # Grupo: resto del sitio con pt-18
│   ├── layout.tsx          #   Header + main pt-18 + Footer
│   ├── tienda/             #   page (ISR) + [slug] (SSG + generateMetadata + Product JSON-LD)
│   ├── blog/               #   page (ISR) + [slug] (SSG + Article) + [slug]/preview (admin)
│   ├── estudio/            #   estudio + estudio/reservar
│   ├── contacto/
│   └── checkout/           #   checkout + confirmacion + error (noindex)
├── admin/                  # Panel (Client Components)
│   ├── layout.tsx          #   noindex
│   ├── login/
│   └── (panel)/            #   layout shell (nav + guard) + dashboard/ordenes/stock/envios/productos/blog
├── api/                    # Route Handlers (create-mp-preference, mp-webhook, send-booking-email, send-contact-email, revalidate)
├── sitemap.ts              # Sitemap dinámico (ISR)
└── robots.ts               # robots.txt

proxy.ts                    # Auth de /admin/* (convención Next 16, ex-middleware)

src/
├── lib/
│   ├── pocketbase.ts          # Cliente browser (+ sync cookie pb_auth para el proxy)
│   ├── pocketbase-server.ts   # Cliente/fetch server con ISR (tags + revalidate)
│   ├── data/                  # Fetchers server (products, blog) + mappers
│   ├── seo.ts                 # buildMetadata() (reemplaza SEOMeta/react-helmet)
│   ├── tiptap.ts              # renderTiptapHtml() (TipTap → HTML server-side)
│   ├── revalidate-client.ts   # triggerRevalidate(tag) llamado desde el admin
│   └── gsap.ts, animations.ts, imageCompression.ts
├── components/
│   ├── shared/   # Header, Footer, NHLogo, Button*, JsonLd, tipografía hero, etc.
│   ├── home/ tienda/ blog/ estudio/ contacto/ cart/ checkout/
│   └── admin/    # TipTapEditor, toolbar, modales, tabla shared
├── context/      # CartContext, ToastContext ('use client')
├── hooks/        # useProducts, useCheckoutForm, useShippingZones, useCategories…
├── data/         # products.ts (tipos/helpers: formatARS, normalize…), blog-posts.ts (tipos)
├── screens/admin/ # Pantallas del panel ('use client'), renderizadas por app/admin/**
└── assets/        # Imágenes/SVG (tattoo mock-data con StaticImageData)
```

---

## Routing (App Router)

```
/                      → (home)/page             Home
/tienda                → (site)/tienda           Catálogo (ISR)
/tienda/[slug]         → (site)/tienda/[slug]    Detalle producto (SSG + ISR)
/estudio               → (site)/estudio
/estudio/reservar      → (site)/estudio/reservar Form reserva tatuaje
/blog                  → (site)/blog             Listado (ISR)
/blog/[slug]           → (site)/blog/[slug]      Post (SSG + ISR)
/blog/[slug]/preview   → vista previa admin (client, noindex)
/contacto              → (site)/contacto
/checkout              → (site)/checkout (+ /confirmacion, /error)  noindex
/admin                 → admin/(panel)           Dashboard (Client)
/admin/{ordenes,stock,envios,productos,blog,blog/nuevo,blog/[id]}
/admin/login           → admin/login
/api/*                 → Route Handlers
```

**Render:** páginas públicas de datos = **Server Components con ISR** (`export const revalidate`, `fetch` con `next: { tags, revalidate }`). Las secciones interactivas/animadas son **client islands** (`'use client'`). El panel `/admin` es íntegramente Client Components reutilizando el SDK PocketBase.

**Auth admin:** [proxy.ts](proxy.ts) protege `/admin/:path*` (salvo `/admin/login`) leyendo la cookie `pb_auth` (la sincroniza el cliente en [src/lib/pocketbase.ts](src/lib/pocketbase.ts)). La validación fina del token (`pb.authStore.isValid`) ocurre en el shell del panel.

**Revalidación on-demand:** al guardar/publicar en el admin se llama a `/api/revalidate` ([src/lib/revalidate-client.ts](src/lib/revalidate-client.ts)), que hace `revalidateTag(tag, 'max')` para los tags `products` / `blog_posts`. El endpoint autoriza por secreto **o** token de superuser PocketBase.

---

## SEO / Analytics

- **Metadata API** por ruta vía `buildMetadata()` ([src/lib/seo.ts](src/lib/seo.ts)) y `generateMetadata` (title/description/canonical/OG/Twitter). Defaults + `metadataBase` en el root layout.
- **JSON-LD en el HTML del servidor** vía `<JsonLd>` ([src/components/shared/JsonLd.tsx](src/components/shared/JsonLd.tsx)): ArtGallery (home), Product/BreadcrumbList (producto), Article (post), CollectionPage (listados), etc.
- **`app/sitemap.ts`** (rutas estáticas + slugs de PocketBase) y **`app/robots.ts`** (`Disallow: /admin, /checkout, /api/`).
- **`next/image`** en componentes públicos (productos, blog, galería estudio) con `priority`/`sizes` para LCP. Excepciones a propósito: SVG (NHLogo), blob URLs (previews de upload).
- **GTM** vía `next/script` (`afterInteractive`) en el root layout.

---

## Datos / Backend (PocketBase)

Colecciones: `products`, `product_stock`, `blog_posts`, `orders`, `shipping_zones`, `media`, `_superusers` (admin). Lectura pública abierta en las colecciones de catálogo/blog para permitir SSG/ISR sin autenticar el server. Las imágenes se sirven desde PocketBase (`remotePatterns` en [next.config.ts](next.config.ts)).

> `src/data/blog-posts.ts` y `src/assets/tattoo/mock-data.ts` aún tienen datos mock (tipos + fallbacks); el contenido real de tienda/blog viene de PocketBase.

---

## Flujos clave

- **Carrito/Checkout:** carrito en cliente (CartContext, persistido en sessionStorage). Checkout crea la orden en PocketBase y llama a `/api/create-mp-preference`; redirige a Mercado Pago. `/api/mp-webhook` valida HMAC, actualiza la orden y envía email de confirmación (Brevo).
- **Reserva tatuaje:** [src/components/estudio](src/components/estudio) → `/api/send-booking-email` (Brevo, con adjuntos de referencia).
- **Contacto:** [src/components/contacto](src/components/contacto) → `/api/send-contact-email` (Brevo, reply-to al visitante).
- **Blog:** editor TipTap en admin; render público server-side con `renderTiptapHtml`. Preview de borradores vía `/blog/[slug]/preview` (lee localStorage).

---

## Variables de entorno

`.env.local` (gitignored). En Vercel deben existir:
- `NEXT_PUBLIC_POCKETBASE_URL`, `POCKETBASE_URL` (server) — URL de PocketBase
- `REVALIDATE_SECRET` — revalidación server-to-server (opcional; el admin usa su token PB)
- `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET` — Mercado Pago
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` (remitente global, debe estar verificado en Brevo), `BOOKING_*`, `CONTACT_TO_EMAIL` (opcional, fallback a `BOOKING_TO_EMAIL`), `SITE_URL` — emails
- `PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD` — auth admin server (webhook)

---

## Contexto de negocio

- **Cliente:** Natalia Heller, Buenos Aires, CABA, Argentina
- **Dominio:** `tatuajesnaty.com`
- **Instagram:** `@nataliaceller_art` (arte) · `@nat.tatt` (tatuajes)
- **Teléfono:** +54 9 11 3272-2555
- **Deploy:** Vercel (`framework: nextjs`).

## Panchito Kit
- nivel: lite
- status: 40-PROYECTOS/Nat/Nat - Status & Roadmap.md
- fuente_producto: vault
- verificacion: npm run lint && npx tsc --noEmit
- branch_base: main

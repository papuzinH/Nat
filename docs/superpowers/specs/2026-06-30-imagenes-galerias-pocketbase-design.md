# SPEC 2 — Imágenes de galerías editables por PocketBase

**Fecha:** 2026-06-30
**Estado:** Diseño aprobado, pendiente plan de implementación
**Depende de:** SPEC 1 (mergeado). Continúa el objetivo "contenido en PocketBase, gestionado desde /admin".

---

## Resumen

Las imágenes artísticas del sitio hoy son **placeholders hardcodeados** (degradados con tono). Este spec las hace **editables desde el admin** vía una colección de PocketBase, replicando los patrones ya existentes (productos/blog: fetch server con ISR + admin CRUD + revalidación on-demand).

Cuatro superficies:
1. **Carrusel del home** ("Te invito a mi universo creativo") — `HomeHeroSection`.
2. **"Tatuajes pensados especialmente para vos"** (teaser del home) — `TattooTeaserSection`.
3. **Galería de tatuajes del estudio** (masonry) — `MasonryGallery`.
4. **"El espacio"** (fotos del estudio, hoy deshabilitada) — `StudioPhotosGallery`.

### Decisiones tomadas (brainstorm)
1. **Una sola colección** `site_images` con campo `section` (no una colección por galería).
2. **Carga inicial:** la hace Natalia desde el admin nuevo (sin precarga automática).
3. **Encuadre:** **punto focal** editable en el admin (no recorte destructivo): se guarda `focal_x`/`focal_y` y el front usa `object-cover` + `object-position`.
4. **Cantidad del teaser:** mosaico fijo de 3 cards → se usan las **primeras 3** por orden.
5. **Comportamiento con galería vacía:**
   - `home_hero`: mantiene los **placeholders actuales** (el hero no se puede ocultar).
   - `home_teaser`: **sección oculta** completa (título + CTA incluidos) hasta que haya imágenes.
   - `estudio_espacio`: **oculta** (re-habilitada solo cuando hay fotos).
   - `estudio_tattoos`: se mantiene **siempre la cajita "Mi portfolio completo"** (CTA a Instagram); el grid de tatuajes aparece cuando hay imágenes.

---

## Arquitectura

```
PocketBase (site_images)  ──fetch ISR (tags)──>  Server pages  ──props──>  Client components
        ▲                                                                        (next/image + focal)
        │ CRUD (upload/orden/alt/focal/active)
   Admin /admin/galerias  ──triggerRevalidate('site_images')──> /api/revalidate
```

- **Lectura pública** (front anónimo) + **fetch server con ISR** para que el HTML del hero traiga la imagen (LCP/SEO).
- **Escritura** solo desde el admin autenticado (superuser).

---

## 1. Modelo de datos — colección `site_images` (PocketBase, base collection)

| Campo | Tipo | Notas |
|---|---|---|
| `section` | select (req., single) | valores: `home_hero`, `home_teaser`, `estudio_tattoos`, `estudio_espacio` |
| `image` | file (req., single; mime images) | archivo directo en el record |
| `alt` | text (req.) | accesibilidad/SEO |
| `caption` | text (opc.) | visible solo en el slide del home (ej. "Helecho · acuarela"); vacío en el resto |
| `sort_order` | number (def. 0) | orden dentro de la sección |
| `focal_x` | number (def. 50) | 0–100, posición focal horizontal |
| `focal_y` | number (def. 50) | 0–100, posición focal vertical |
| `active` | bool (def. true) | ocultar sin borrar |

**API Rules:**
- **List/Search** y **View**: regla **vacía = pública** (el front la lee anónimo). ⚠️ Sin esto, las galerías quedan vacías en producción aunque se vean en el admin (lección registrada en memoria del proyecto).
- **Create/Update/Delete**: solo superuser/admin (mismas reglas que `product_categories`).

> Crear la colección y sus reglas es un **paso manual** en el admin de PocketBase (`https://nat.lhstudio.com.ar/_/`), como se hizo con `blog_categories`. Documentado como prerequisito del plan. El código degrada a vacío si la colección no existe (catch silencioso del fetch).

**`next.config.ts`** ya tiene `remotePatterns` para PocketBase, así que `next/image` sirve las URLs de archivo sin cambios.

---

## 2. Capa server — `src/lib/data/site-images.ts`

Nuevo fetcher con el patrón de `src/lib/data/blog.ts`:

```ts
export const SITE_IMAGES_TAG = 'site_images'

export type SiteImageSection = 'home_hero' | 'home_teaser' | 'estudio_tattoos' | 'estudio_espacio'

export interface SiteImage {
  id: string
  url: string       // pbFileUrl(collectionId, id, image)
  alt: string
  caption: string   // '' si no hay
  focalX: number    // 0–100
  focalY: number    // 0–100
}

export async function getSiteImages(section: SiteImageSection): Promise<SiteImage[]>
```

- Usa `pbGetFullList('site_images', { filter: \`section="${section}" && active=true\`, sort: 'sort_order' }, { tags: [SITE_IMAGES_TAG] })`.
- Mapper puro en `src/lib/data/site-images-mappers.ts` (`rowToSiteImage`) que arma `url` con `pbFileUrl(row.collectionId, row.id, row.image)` (los records REST de PocketBase incluyen `collectionId`).
- El fetcher tolera la colección inexistente (try/catch → `[]`), igual que `useCategories`.

---

## 3. Cableado por página (data flow)

Las **páginas server** fetchean y pasan las imágenes como **props** (no client-fetch), para LCP/SEO del hero.

- **`app/(home)/page.tsx`** (server): `const [heroImages, teaserImages] = await Promise.all([getSiteImages('home_hero'), getSiteImages('home_teaser')])`. Pasa `heroImages` a `HomeHeroSection` y `teaserImages` a `TattooTeaserSection`. El teaser **solo se renderiza si `teaserImages.length > 0`**.
- **`app/(site)/estudio/page.tsx`** (server): `getSiteImages('estudio_tattoos')` y `getSiteImages('estudio_espacio')`. Pasa a `MasonryGallery` y `StudioPhotosGallery`. La sección "El espacio" (divider + galería) **solo se renderiza si `espacioImages.length > 0`** (re-habilitación condicional de lo que SPEC 1 deshabilitó).

---

## 4. Cambios por componente (cliente)

Cada componente recibe `images: SiteImage[]` y, cuando hay imágenes, renderiza `next/image` con `object-cover` + `style={{ objectPosition: \`${focalX}% ${focalY}%\` }}`.

- **`HomeHeroSection`** — acepta `images`. Si `images.length > 0`: el carrusel (desktop crossfade + mobile touch) usa las imágenes reales; `caption` = label del slide; **primer slide con `priority`** (LCP). Si vacío: mantiene los `SLIDES` placeholder actuales. Se conserva toda la lógica de carrusel/animación.
- **`TattooTeaserSection`** — acepta `images` (renderizado solo si hay, por la página). Las **primeras 3** llenan el mosaico de 3 cards existente (1 alta + 2 chicas), respetando los aspect ratios actuales. Sin etiquetas (ya removidas en SPEC 1).
- **`MasonryGallery`** — acepta `images`. Si hay: el masonry renderiza las imágenes reales (reemplaza `TATTOO_CARDS` mock) con sus aspect ratios; **la cajita "Mi portfolio completo" se mantiene siempre**. Si vacío: se muestra solo la cajita de portfolio centrada (sin grid detrás). Se quita la dependencia de `@/assets/tattoo/mock-data` para el render real (el mock puede quedar como fallback de tipo/medidas si hace falta, pero no se renderiza con datos vacíos).
- **`StudioPhotosGallery`** — acepta `images` (renderizado solo si hay). Usa las imágenes reales en el carrusel + `Lightbox` (que ya existe). Se elimina el estado de placeholders "Pronto".

**Punto focal:** todos los `next/image` de galería aplican `objectPosition` desde `focalX/focalY`. Default 50/50 = centrado (equivale al `object-cover` actual).

---

## 5. Admin — nueva pantalla "Galerías"

- **Ruta:** `app/admin/(panel)/galerias/page.tsx` (server shell) → `src/screens/admin/AdminImages.tsx` (client).
- **Nav:** agregar `{ to: '/admin/galerias', label: 'Galerías' }` a `NAV_ITEMS` en `app/admin/(panel)/layout.tsx`.
- **UI:**
  - **Pestañas por sección**: Hero · Especialmente para vos · Tatuajes · El espacio.
  - Por sección, lista de imágenes con: **subir** (drag-drop + `compressImage`, igual que productos), **reordenar arrastrando** (patrón de `AdminCategoriesModal`), editar **`alt`** y **`caption`**, **punto focal** (click sobre la preview fija `focal_x`/`focal_y` en % → se previsualiza con `object-position`), **activar/desactivar** (`active`), **eliminar**.
  - Subida: `pb.collection('site_images').create(formData)` con `file` (campo `image`), `section`, `sort_order` (al final), `alt` (default = nombre de archivo, editable). Se reutiliza `compressImage` de `@/lib/imageCompression`.
- Tras cualquier alta/edición/borrado/orden → `triggerRevalidate('site_images')` (de `@/lib/revalidate-client`).

---

## 6. Revalidación

`/api/revalidate` ya hace `revalidateTag(tag, 'max')`. Agregar `site_images` a los tags permitidos (junto a `products` / `blog_posts`). El admin dispara la revalidación al guardar, igual que el resto del panel.

---

## 7. Manejo de errores / estados

- **Colección inexistente / fetch falla** → fetcher devuelve `[]` → comportamiento "vacío" de cada sección (sección oculta o placeholders del hero). El sitio nunca rompe.
- **Imagen sin `alt`** → el campo es requerido en el admin; el front igual usa `alt ?? ''` defensivo.
- **Animaciones:** se respeta la regla del proyecto — contenido visible por defecto, animaciones solo con `shouldAnimate()`; no introducir `opacity:0` inline.

---

## 8. Verificación

- **No hay test harness** en el proyecto → verificación por `next build` + `lint` + **chequeo visual**.
- Visual: `/` (hero con imágenes y fallback; teaser aparece/oculto), `/estudio` (masonry con cajita siempre; "El espacio" aparece/oculto), `/admin/galerias` (subir, reordenar, alt/caption, punto focal, activar, borrar; revalidación refleja en el front).
- Confirmar **read rule pública** en `site_images` probando `/` y `/estudio` **deslogueado/incógnito**.

---

## 9. Fuera de alcance

- **Precarga** de imágenes (la hace Natalia por el admin).
- Tocar imágenes de **productos/blog** (ya funcionan con `media`).
- Recorte destructivo del archivo (se usa punto focal, no se modifica el archivo subido).
- **SPEC 3** (códigos postales del admin).

---

## Estructura de archivos (resumen)

```
PocketBase: colección site_images (manual)
src/lib/data/site-images.ts            # getSiteImages(section) + SITE_IMAGES_TAG + tipos (nuevo)
src/lib/data/site-images-mappers.ts    # rowToSiteImage (nuevo)
app/(home)/page.tsx                    # fetch hero+teaser, pasa props, condiciona teaser (mod)
app/(site)/estudio/page.tsx            # fetch tattoos+espacio, pasa props, condiciona espacio (mod)
src/components/home/HomeHeroSection.tsx       # prop images + fallback (mod)
src/components/home/TattooTeaserSection.tsx   # prop images, primeras 3 (mod)
src/components/estudio/MasonryGallery.tsx     # prop images + cajita siempre (mod)
src/components/estudio/StudioPhotosGallery.tsx# prop images + lightbox (mod)
app/admin/(panel)/galerias/page.tsx    # shell (nuevo)
src/screens/admin/AdminImages.tsx      # pantalla admin con tabs + uploader + focal (nuevo)
app/admin/(panel)/layout.tsx           # NAV_ITEMS += Galerías (mod)
app/api/revalidate/route.ts            # permitir tag site_images (mod)
```

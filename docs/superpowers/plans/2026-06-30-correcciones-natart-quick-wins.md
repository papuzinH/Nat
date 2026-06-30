# Correcciones NatArt — Quick Wins (SPEC 1) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el lote de correcciones de bajo riesgo del documento del cliente (textos, layout, quitar elementos, datos de pago) más la gestión de categorías del blog.

**Architecture:** Cambios localizados en componentes existentes (React/Next.js App Router). Sin nuevas dependencias salvo una colección PocketBase (`blog_categories`) para la feature de categorías. Las imágenes editables y el fix de códigos postales NO entran acá (specs aparte).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.8, Tailwind 3.4, PocketBase SDK 0.26, GSAP.

## Global Constraints

- **No hay test harness en el proyecto** (sin vitest/jest/playwright; scripts solo `dev`/`build`/`start`/`lint`). La verificación de cada tarea es: `rtk next build` sin errores nuevos + `rtk lint` + chequeo visual en la ruta afectada. **No** se introduce un framework de tests.
- **Regla de animaciones (del proyecto):** el contenido debe ser **visible por defecto**; nunca `opacity:0` inline. Las animaciones (`splitWords`, GSAP) se aplican solo si `shouldAnimate()`. Validar que los cambios de layout no dejen contenido oculto.
- **Datos de pago — valores verbatim del documento:** alias `nat.tatt`, CVU `0000003100011890692022`, WhatsApp `+54 9 11 3272-2555` (formato wa.me: `5491132722555`).
- **Rama de trabajo:** `correcciones-natart-quick-wins` (ya creada, con el spec commiteado).
- **Comandos:** prefijar con `rtk` (instrucción global del usuario).
- El texto post-checkout "Natalia se va a comunicar…" (`getBodyMessage`) **se deja como está** — no se toca.

---

## Task 1: Direcciones y navegación

**Files:**
- Modify: `src/components/shared/Header.tsx:12`
- Modify: `src/components/shared/Footer.tsx:46`, `src/components/shared/Footer.tsx:132`
- Modify: `src/components/contacto/ContactInfo.tsx:10`

**Interfaces:** Sin interfaces compartidas. Cambios de strings.

- [ ] **Step 1: Nav del Header → "Tatuajes"**

En `Header.tsx`, en el array `navigationItems`:

```tsx
// Antes
{ path: '/estudio', label: 'El Estudio' },
// Después
{ path: '/estudio', label: 'Tatuajes' },
```

- [ ] **Step 2: Nav del Footer → "Tatuajes" y dirección**

En `Footer.tsx`, en el array de nav (~línea 46):

```tsx
// Antes
{ to: '/estudio', label: 'El Estudio' },
// Después
{ to: '/estudio', label: 'Tatuajes' },
```

Y en la columna Estudio (~línea 132), el texto del link de mapa:

```tsx
// Antes
Parque Chacabuco · Buenos Aires, AR
// Después
CABA · Buenos Aires, AR.
```

- [ ] **Step 3: Dirección de Contacto**

En `ContactInfo.tsx`, en el array `INFO_ITEMS` (~línea 10):

```tsx
// Antes
{ label: 'Estudio', value: 'Parque Chacabuco · CABA\nCon turno previo' },
// Después
{ label: 'Estudio', value: 'CABA · Buenos Aires, AR.\nCon turno previo' },
```

- [ ] **Step 4: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores nuevos; sin warnings de lint nuevos.

- [ ] **Step 5: Verificación visual**

Abrir cualquier página (header/footer son globales) y `/contacto`. Confirmar: nav dice "Tatuajes" (desktop y menú mobile), footer y contacto muestran "CABA · Buenos Aires, AR.". La ruta sigue siendo `/estudio` (no cambia el `href`).

- [ ] **Step 6: Commit**

```bash
rtk git add src/components/shared/Header.tsx src/components/shared/Footer.tsx src/components/contacto/ContactInfo.tsx
rtk git commit -m "fix(nav): renombrar 'El Estudio' a 'Tatuajes' y actualizar direcciones a CABA"
```

---

## Task 2: Home — quote sin huérfano y quitar etiquetas de tatuaje

**Files:**
- Modify: `src/components/home/QuoteStripSection.tsx:88-92`
- Modify: `src/components/home/TattooTeaserSection.tsx:146-187`

**Interfaces:** Ninguna compartida.

- [ ] **Step 1: Quote del home — evitar "proceso" huérfano con `text-balance`**

En `QuoteStripSection.tsx`, agregar la clase `text-balance` al `<p>` de la cita (Tailwind 3.4 incluye `text-balance` → `text-wrap: balance`, que equilibra los renglones; coincide con el pedido "4 renglones más similares entre sí"). El `<p>` actual:

```tsx
<p
  ref={quoteRef}
  className="font-display font-normal text-ink"
  style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontStyle: 'italic', lineHeight: 1.35 }}
>
```

Cambiar el `className` a:

```tsx
  className="font-display font-normal text-ink text-balance"
```

No tocar el texto de `QUOTE` ni la animación `splitWords`.

- [ ] **Step 2: Quitar etiquetas "En piel" / "Boceto" del teaser**

En `TattooTeaserSection.tsx`, eliminar los **tres** `<span>` de etiqueta dentro de las `teaser-card`. Son los bloques (líneas ~146-151, ~164-169, ~182-187):

```tsx
<span
  className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
  style={{ color: 'var(--ink-soft)', background: 'rgba(253,252,251,0.85)' }}
>
  En piel
</span>
```

(y los equivalentes "Boceto" y el segundo "En piel"). Eliminar los tres `<span>` completos. Dejar intactos los `<div className="teaser-card-bg ...">` (el fondo).

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores; sin variables sin usar.

- [ ] **Step 4: Verificación visual**

En `/`: la cita ya no deja "proceso" solo en un renglón (renglones más parejos). Las tarjetas de tatuaje del bloque "Tatuajes pensados especialmente para vos" no muestran etiquetas "En piel"/"Boceto".

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/home/QuoteStripSection.tsx src/components/home/TattooTeaserSection.tsx
rtk git commit -m "fix(home): balancear la cita y quitar etiquetas en piel/boceto del teaser"
```

---

## Task 3: Estudio — hero, cajita portfolio, etiqueta masonry y deshabilitar "El espacio"

**Files:**
- Modify: `src/components/estudio/EstudioHero.tsx:11-12` (o el render del `<em>`)
- Modify: `src/components/estudio/MasonryGallery.tsx:85-92`, `src/components/estudio/MasonryGallery.tsx:119-121`
- Modify: `app/(site)/estudio/page.tsx:6`, `app/(site)/estudio/page.tsx:31-32`

**Interfaces:** Ninguna compartida.

- [ ] **Step 1: Hero — "y un recuerdo para siempre." en renglón aparte**

En `EstudioHero.tsx`, el título está partido en `TITLE_PRE` + `<em>TITLE_EM</em>`. Hacer que el `<em>` arranque en un renglón nuevo poniéndolo en `display: block`. El `<em>` actual (dentro del `<span>` del `HeroTitle`):

```tsx
<em>
  {splitWords(TITLE_EM).map((token, i) =>
```

Cambiar a:

```tsx
<em style={{ display: 'block' }}>
  {splitWords(TITLE_EM).map((token, i) =>
```

No tocar `TITLE_PRE`/`TITLE_EM` ni la animación.

- [ ] **Step 2: Cajita portfolio — nuevo texto**

En `MasonryGallery.tsx` (~línea 119-121):

```tsx
// Antes
<p className="text-sm font-body text-ink-soft leading-relaxed max-w-[280px]">
  Podés ver mi trabajo completo haciendo click en el link
</p>
// Después
<p className="text-sm font-body text-ink-soft leading-relaxed max-w-[280px]">
  Te invito a ver más de mi trabajo haciendo click en el link
</p>
```

- [ ] **Step 3: Quitar la etiqueta sobre las imágenes del masonry**

En `MasonryGallery.tsx` (~línea 85-92), eliminar el bloque de etiqueta que se superpone a cada tatuaje:

```tsx
<div className="absolute bottom-2 left-2">
  <span
    className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-[3px]"
    style={{ background: 'rgba(253, 252, 251, 0.82)', color: '#5a5350' }}
  >
    {card.label}
  </span>
</div>
```

Eliminar ese `<div>` completo. (El `card.label` deja de usarse en el render; no genera error de TS porque `card` se sigue usando para `image`/`tall`/`tone`.)

- [ ] **Step 4: Deshabilitar la sección "El espacio"**

En `app/(site)/estudio/page.tsx`, eliminar el divider y la galería de fotos del espacio (líneas 31-32):

```tsx
// Eliminar estas dos líneas:
<NHDivider label="el espacio" />
<StudioPhotosGallery />
```

Y eliminar el import ahora sin uso (línea 6):

```tsx
import StudioPhotosGallery from '@/components/estudio/StudioPhotosGallery'
```

(El componente `StudioPhotosGallery.tsx` se conserva en el repo para reactivarlo en el futuro.)

- [ ] **Step 5: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores; sin imports/variables sin usar.

- [ ] **Step 6: Verificación visual**

En `/estudio`: "y un recuerdo para siempre." queda en su propio renglón debajo de "Un momento para vos"; la cajita del portfolio muestra el texto nuevo; las imágenes de tatuajes no tienen etiquetas; la sección "El espacio" (carrusel de fotos) ya no aparece.

- [ ] **Step 7: Commit**

```bash
rtk git add src/components/estudio/EstudioHero.tsx src/components/estudio/MasonryGallery.tsx "app/(site)/estudio/page.tsx"
rtk git commit -m "fix(estudio): salto de linea en hero, texto portfolio, quitar etiquetas y deshabilitar El espacio"
```

---

## Task 4: Formulario de reserva — textos

**Files:**
- Modify: `src/components/estudio/ReservarIntro.tsx:48-54`
- Modify: `src/components/estudio/BookingForm.tsx:166-173`, `:234-236`, `:277`, `:328-330`

**Interfaces:** Ninguna compartida.

- [ ] **Step 1: Intro del formulario**

En `ReservarIntro.tsx`, reemplazar el contenido del `<p>` (líneas 48-54):

```tsx
// Antes
<p
  className="hero-line font-body text-ink-soft mb-12 leading-[1.65]"
  style={{ fontSize: '16px', maxWidth: '520px' }}
>
  Tomate unos minutos. Cuanto más detalle me des, mejor puedo entender lo que tenés en
  mente y armar una propuesta que se acerque a tu idea.
</p>
// Después
<p
  className="hero-line font-body text-ink-soft mb-12 leading-[1.65]"
  style={{ fontSize: '16px', maxWidth: '520px' }}
>
  Completando este formulario vas a poder agendar un turno de manera muy fácil. Por favor te pido que detalles tu idea lo mejor posible, esto me ayuda a presupuestar correctamente el trabajo. Si tenes cualquier duda, queres dejar alguna aclaración o comentario, podes escribir en la parte de Notas al final del formulario.
</p>
```

- [ ] **Step 2: Eliminar la línea "Sé lo más detallado posible…"**

En `BookingForm.tsx` (líneas 234-236), eliminar el `<p>` completo:

```tsx
<p className="booking-field font-body text-ink-soft mb-8" style={{ fontSize: '13px' }}>
  Sé lo más detallado posible para entender bien tu idea.
</p>
```

- [ ] **Step 3: Placeholder de Instagram sin "(opcional)"**

En `BookingForm.tsx` (~línea 277):

```tsx
// Antes
placeholder="tu_usuario (opcional)"
// Después
placeholder="tu_usuario"
```

- [ ] **Step 4: Ayuda del tamaño en cm**

En `BookingForm.tsx` (~línea 328-330):

```tsx
// Antes
<p className="mt-1 font-body text-[11px] text-ink-soft">
  Aprox, redondeá si no estás segura/o
</p>
// Después
<p className="mt-1 font-body text-[11px] text-ink-soft">
  Tomá la medida con una regla
</p>
```

- [ ] **Step 5: Pantalla de éxito**

En `BookingForm.tsx` (bloque `if (submitted)`, líneas 166-173). Reemplazar el título y el cuerpo:

```tsx
// Antes
<SectionTitle>Llegó tu mensaje</SectionTitle>
<p
  className="font-body text-ink-soft leading-[1.6]"
  style={{ fontSize: '15px', maxWidth: '360px' }}
>
  Gracias, {firstName}. Te voy a contestar en los próximos días desde
  agendanattatt@gmail.com. Mientras tanto, respirá hondo ✶
</p>
// Después
<SectionTitle>Tu consulta fue enviada!</SectionTitle>
<p
  className="font-body text-ink-soft leading-[1.6]"
  style={{ fontSize: '15px', maxWidth: '360px' }}
>
  Gracias, {firstName}. En los próximos días te voy a estar enviando la respuesta desde
  agendanattatt@gmail.com. Estate atento/a a la casilla de spam (estrellita)
</p>
```

> **Nota al implementador:** "(estrellita)" se deja literal según el documento aprobado. Si en revisión visual se prefiere el ícono de estrella (✶, como en el texto original), reemplazar "(estrellita)" por "✶". Confirmar con el usuario antes de cambiarlo.

- [ ] **Step 6: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores.

- [ ] **Step 7: Verificación visual**

En `/estudio/reservar`: la intro muestra el texto nuevo; no aparece "Sé lo más detallado…"; el campo de IG no dice "(opcional)"; bajo el tamaño en cm dice "Tomá la medida con una regla". Completar y enviar el formulario (o forzar `submitted`) para ver la pantalla de éxito con "Tu consulta fue enviada!" y el cuerpo nuevo.

- [ ] **Step 8: Commit**

```bash
rtk git add src/components/estudio/ReservarIntro.tsx src/components/estudio/BookingForm.tsx
rtk git commit -m "fix(reserva): actualizar textos del formulario y pantalla de exito"
```

---

## Task 5: Blog — copy del hero, centrar el post y quitar el slug

**Files:**
- Modify: `src/components/blog/BlogHeroSection.tsx:13`, `:50-52`
- Modify: `src/components/blog/BlogPostArticle.tsx:93-100`, `:104`, `:125`, `:151`

**Interfaces:** Ninguna compartida.

- [ ] **Step 1: Título del hero del blog**

En `BlogHeroSection.tsx` (línea 13):

```tsx
// Antes
const TITLE = 'Guías, reflexiones e historias que quiero compartir.'
// Después
const TITLE = 'Guías y reflexiones que quiero compartir.'
```

- [ ] **Step 2: Subtítulo del hero del blog**

En `BlogHeroSection.tsx` (líneas 50-52), el `HeroSubtitle`:

```tsx
// Antes
<HeroSubtitle className="hero-subtitle blog-subtitle">
  Sí, también disfruto mucho la escritura. En esta sección te cuento más sobre mi universo creativo y personal. Espero que lo disfrutes!
</HeroSubtitle>
// Después
<HeroSubtitle className="hero-subtitle blog-subtitle">
  También disfruto mucho de la escritura. En esta sección te cuento más sobre mi universo creativo y personal para que puedas conocerme más en profundidad. Espero que lo disfrutes!
</HeroSubtitle>
```

(El eyebrow "Conocé mi lado más íntimo" ya está bien — no se toca.)

- [ ] **Step 3: Quitar el slug del breadcrumb**

En `BlogPostArticle.tsx` (líneas 93-100), el breadcrumb muestra `diario / {post.slug}`. Quitar el separador y el slug:

```tsx
// Antes
<nav className="px-[22px] md:px-12 pt-[18px] font-mono text-[11px] text-ink-soft tracking-[0.08em]" aria-label="Migas de pan">
  <Link href="/blog" className="text-inherit no-underline hover:text-sage-700 transition-colors">
    diario
  </Link>
  {' / '}
  <span className="text-sage-700">{post.slug}</span>
</nav>
// Después
<nav className="px-[22px] md:px-12 pt-[18px] font-mono text-[11px] text-ink-soft tracking-[0.08em]" aria-label="Migas de pan">
  <Link href="/blog" className="text-inherit no-underline hover:text-sage-700 transition-colors">
    diario
  </Link>
</nav>
```

- [ ] **Step 4: Centrar el contenido del post**

En `BlogPostArticle.tsx`, agregar `mx-auto` a los tres contenedores con ancho máximo:

```tsx
// Línea 104 — hero
<div className="max-w-[760px]">           →  <div className="max-w-[760px] mx-auto">

// Línea 125 — cover image
<div className="px-[22px] md:px-12 mt-6 max-w-[860px]">
  →  <div className="px-[22px] md:px-12 mt-6 max-w-[860px] mx-auto">

// Línea 151 — article body
<article ref={bodyRef} className="px-[22px] md:px-12 pt-11 md:pt-16 pb-5 max-w-[720px]">
  →  <article ref={bodyRef} className="px-[22px] md:px-12 pt-11 md:pt-16 pb-5 max-w-[720px] mx-auto">
```

- [ ] **Step 5: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores.

- [ ] **Step 6: Verificación visual**

En `/blog`: hero con título y subtítulo nuevos. En un post (`/blog/[slug]`): el contenido (meta, título, cover, cuerpo) queda **centrado** en la pantalla, no pegado a la izquierda; el breadcrumb debajo del logo dice solo "diario" (sin el slug).

- [ ] **Step 7: Commit**

```bash
rtk git add src/components/blog/BlogHeroSection.tsx src/components/blog/BlogPostArticle.tsx
rtk git commit -m "fix(blog): copy del hero, centrar el post y quitar el slug del breadcrumb"
```

---

## Task 6: Datos de pago (sensible)

**Files:**
- Modify: `src/lib/bankDetails.ts:6-17`
- Modify: `src/components/checkout/BankTransferPanel.tsx:33-39`

**Interfaces:**
- Produces: `BANK_DETAILS` (objeto sin `banco`/`tipoCuenta`; `cbu` ahora contiene el CVU), `WHATSAPP_PHONE = '5491132722555'`, `WHATSAPP_DISPLAY = '+54 9 11 3272-2555'`.

- [ ] **Step 1: Actualizar `bankDetails.ts`**

Reemplazar el objeto `BANK_DETAILS` y las constantes de WhatsApp:

```ts
// Antes
export const BANK_DETAILS = {
  // TODO: completar con el nombre real del banco.
  banco: 'TODO — completar nombre del banco',
  // TODO: completar tipo de cuenta (ej. "Caja de ahorro en pesos").
  tipoCuenta: 'TODO — completar tipo de cuenta',
  cbu: '0000003100062588008793',
  alias: 'natalia.arte',
  titular: 'Natalia Heller',
} as const

/** Teléfono de WhatsApp en formato wa.me (solo dígitos, con código de país). +54 9 11 6619-1209 */
export const WHATSAPP_PHONE = '5491166191209'
```

```ts
// Después
export const BANK_DETAILS = {
  // CVU de cuenta virtual (sin banco / tipo de cuenta asociados).
  cbu: '0000003100011890692022',
  alias: 'nat.tatt',
  titular: 'Natalia Heller',
} as const

/** Teléfono de WhatsApp en formato wa.me (solo dígitos, con código de país). +54 9 11 3272-2555 */
export const WHATSAPP_PHONE = '5491132722555'

/** WhatsApp en formato legible para mostrar en pantalla. */
export const WHATSAPP_DISPLAY = '+54 9 11 3272-2555'
```

> El nombre interno del campo se deja como `cbu` para no romper otros consumidores; el **valor** es el CVU y la **etiqueta visible** pasa a "CVU" (Step 2).

- [ ] **Step 2: Actualizar `BankTransferPanel.tsx`**

Importar `WHATSAPP_DISPLAY` y reescribir el array `rows` (líneas 33-39) quitando Banco y Tipo de cuenta, reetiquetando CBU→CVU y agregando WhatsApp:

```tsx
// Import (línea 5)
import { BANK_DETAILS, WHATSAPP_DISPLAY, buildWhatsappProofUrl } from '@/lib/bankDetails'
```

```tsx
// Antes
const rows: { label: string; value: string; copy?: string }[] = [
  { label: 'Banco', value: BANK_DETAILS.banco },
  { label: 'Tipo de cuenta', value: BANK_DETAILS.tipoCuenta },
  { label: 'CBU', value: BANK_DETAILS.cbu, copy: BANK_DETAILS.cbu },
  { label: 'Alias', value: BANK_DETAILS.alias, copy: BANK_DETAILS.alias },
  { label: 'Titular', value: BANK_DETAILS.titular },
].filter((r) => isFilled(r.value))
// Después
const rows: { label: string; value: string; copy?: string }[] = [
  { label: 'CVU', value: BANK_DETAILS.cbu, copy: BANK_DETAILS.cbu },
  { label: 'Alias', value: BANK_DETAILS.alias, copy: BANK_DETAILS.alias },
  { label: 'Titular', value: BANK_DETAILS.titular },
  { label: 'WhatsApp', value: WHATSAPP_DISPLAY, copy: WHATSAPP_DISPLAY },
].filter((r) => isFilled(r.value))
```

(La función `isFilled` queda igual; ahora ningún valor empieza con "TODO", así que no filtra nada — es inocua. Se puede dejar para mínima diff.)

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores. ⚠ Si algún otro archivo referenciaba `BANK_DETAILS.banco` o `BANK_DETAILS.tipoCuenta`, el build fallará con error de TS — en ese caso, quitar esas referencias en el archivo que lo reporte (mostrar el error y corregir la línea señalada).

- [ ] **Step 4: Verificación visual**

En `/checkout/confirmacion` con una orden de **transferencia** (o forzando el render del panel): el panel "Datos para transferir" muestra **CVU** `0000003100011890692022`, **Alias** `nat.tatt`, **Titular** Natalia Heller y **WhatsApp** +54 9 11 3272-2555 (con botón copiar). **No** aparecen filas Banco ni Tipo de cuenta. El botón "Enviar por WhatsApp" apunta a wa.me/5491132722555.

> **Nota:** Otras superficies que usan `BANK_DETAILS` (emails, admin) ahora muestran el mismo valor nuevo. Si alguna sigue etiquetándolo "CBU", es un ajuste cosmético menor fuera del alcance de este SPEC — dejar anotado para un follow-up si el cliente lo pide.

- [ ] **Step 5: Commit**

```bash
rtk git add src/lib/bankDetails.ts src/components/checkout/BankTransferPanel.tsx
rtk git commit -m "fix(checkout): actualizar datos de pago (CVU/alias/WhatsApp) segun documento"
```

---

## Task 7: Generalizar `useCategories` para que sirva a productos y blog

**Files:**
- Modify: `src/hooks/useCategories.ts`
- Modify: `src/screens/admin/AdminProducts.tsx:650-655` (call site — pasar config explícita opcional)

**Interfaces:**
- Produces: `useCategories(config?: CategoriesConfig)` que retorna `{ categories, loading, reload, createCategory, updateCategory, deleteCategory, countByCategory }`.
  - `CategoriesConfig = { categoriesCollection: string; itemsCollection: string; itemsCategoryField: string; matchBy: 'slug' | 'label' }`.
  - `countByCategory(cat: Category): Promise<number>`.
  - El default de `config` reproduce el comportamiento actual de productos (backward compatible).

- [ ] **Step 1: Parametrizar el hook**

Reemplazar `src/hooks/useCategories.ts` por esta versión (mantiene la API actual y agrega `config` + `countByCategory`):

```ts
import { useState, useEffect, useCallback } from 'react'
import { pb } from '@/lib/pocketbase'

export interface Category {
  id: string
  slug: string
  label: string
  sort_order: number
}

export interface CategoriesConfig {
  /** Colección de categorías administradas. */
  categoriesCollection: string
  /** Colección de items que referencian una categoría (para contar/guardar el borrado). */
  itemsCollection: string
  /** Campo del item que guarda la categoría. */
  itemsCategoryField: string
  /** Si los items guardan el `slug` o el `label` de la categoría. */
  matchBy: 'slug' | 'label'
}

/** Config por defecto: productos (preserva el comportamiento previo). */
export const PRODUCT_CATEGORIES_CONFIG: CategoriesConfig = {
  categoriesCollection: 'product_categories',
  itemsCollection: 'products',
  itemsCategoryField: 'category',
  matchBy: 'slug',
}

function sortCategories(cats: Category[]): Category[] {
  return [...cats].sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label, 'es'))
}

export function useCategories(config: CategoriesConfig = PRODUCT_CATEGORIES_CONFIG) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await pb.collection(config.categoriesCollection).getFullList({
        sort: 'sort_order,label',
        requestKey: null,
      })
      setCategories(
        data.map((r) => ({
          id: r.id,
          slug: r.slug as string,
          label: r.label as string,
          sort_order: (r.sort_order as number) ?? 0,
        }))
      )
    } catch {
      // La colección puede no existir aún; se queda en lista vacía
    } finally {
      setLoading(false)
    }
  }, [config.categoriesCollection])

  useEffect(() => {
    load()
  }, [load])

  const countByCategory = useCallback(
    async (cat: Category): Promise<number> => {
      const value = config.matchBy === 'slug' ? cat.slug : cat.label
      const res = await pb.collection(config.itemsCollection).getList(1, 1, {
        filter: `${config.itemsCategoryField}="${value}"`,
        requestKey: null,
      })
      return res.totalItems
    },
    [config.itemsCollection, config.itemsCategoryField, config.matchBy]
  )

  const createCategory = async (slug: string, label: string, sort_order = 0): Promise<Category> => {
    const record = await pb.collection(config.categoriesCollection).create({ slug, label, sort_order })
    const cat: Category = {
      id: record.id,
      slug: record.slug as string,
      label: record.label as string,
      sort_order: (record.sort_order as number) ?? 0,
    }
    setCategories((prev) => sortCategories([...prev, cat]))
    return cat
  }

  const updateCategory = async (
    id: string,
    data: Partial<Pick<Category, 'label' | 'sort_order'>>
  ): Promise<Category> => {
    const record = await pb.collection(config.categoriesCollection).update(id, data)
    const updated: Category = {
      id: record.id,
      slug: record.slug as string,
      label: record.label as string,
      sort_order: (record.sort_order as number) ?? 0,
    }
    setCategories((prev) => sortCategories(prev.map((c) => (c.id === id ? updated : c))))
    return updated
  }

  const deleteCategory = async (id: string): Promise<void> => {
    const cat = categories.find((c) => c.id === id)
    if (!cat) throw new Error('Categoría no encontrada')

    const count = await countByCategory(cat)
    if (count > 0) {
      throw new Error(`Hay ${count} item${count > 1 ? 's' : ''} con esta categoría`)
    }

    await pb.collection(config.categoriesCollection).delete(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return { categories, loading, reload: load, createCategory, updateCategory, deleteCategory, countByCategory }
}
```

- [ ] **Step 2: Confirmar el call site de productos**

En `AdminProducts.tsx` (~línea 650-655), el llamado `useCategories()` sin argumentos sigue funcionando (usa el default de productos). No es necesario cambiarlo, pero verificar que sigue compilando. Opcionalmente, hacerlo explícito:

```tsx
const {
  categories,
  createCategory,
  updateCategory,
  deleteCategory,
  countByCategory,
} = useCategories() // default = productos
```

(Se agrega `countByCategory` al destructuring porque se usará al pasar el modal en Task 8.)

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores. La pantalla de productos sigue funcionando igual (mismo comportamiento por default).

- [ ] **Step 4: Commit**

```bash
rtk git add src/hooks/useCategories.ts src/screens/admin/AdminProducts.tsx
rtk git commit -m "refactor(categories): parametrizar useCategories por coleccion y exponer countByCategory"
```

---

## Task 8: Generalizar `AdminCategoriesModal` (conteo inyectado + sustantivo configurable)

**Files:**
- Modify: `src/components/admin/shared/AdminCategoriesModal.tsx`
- Modify: `src/screens/admin/AdminProducts.tsx:1320-1327` (pasar las nuevas props)

**Interfaces:**
- Consumes: `countByCategory` de `useCategories` (Task 7).
- Produces: `AdminCategoriesModal` con props nuevas: `getCount: (cat: Category) => Promise<number>` y `itemNoun?: { singular: string; plural: string }` (default `{ singular: 'producto', plural: 'productos' }`).

- [ ] **Step 1: Quitar el conteo hardcodeado e inyectarlo por prop**

En `AdminCategoriesModal.tsx`:

1. Quitar el import de `pb` (ya no se usa directamente para contar):

```tsx
// Eliminar:
import { pb } from '@/lib/pocketbase'
```

2. Extender la interfaz de props:

```tsx
interface AdminCategoriesModalProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  onCreateCategory: (slug: string, label: string, sort_order: number) => Promise<Category>
  onUpdateCategory: (id: string, data: Partial<Pick<Category, 'label' | 'sort_order'>>) => Promise<Category>
  onDeleteCategory: (id: string) => Promise<void>
  /** Cuenta cuántos items usan la categoría (para badges y guardar el borrado). */
  getCount: (cat: Category) => Promise<number>
  /** Sustantivo para los textos (default: producto/productos). */
  itemNoun?: { singular: string; plural: string }
}
```

3. Aceptar las props nuevas en la firma:

```tsx
const AdminCategoriesModal: React.FC<AdminCategoriesModalProps> = ({
  open,
  onClose,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  getCount,
  itemNoun = { singular: 'producto', plural: 'productos' },
}) => {
```

4. Reemplazar el `useEffect` que carga los conteos (líneas ~86-101) para usar `getCount` en vez de `pb.collection('products')`:

```tsx
// Cargar conteos cuando abre el modal
useEffect(() => {
  if (!open || categories.length === 0) return
  setCountsLoading(true)
  Promise.all(
    categories.map(async (cat) => [cat.slug, await getCount(cat)] as [string, number])
  )
    .then((entries) => setCounts(Object.fromEntries(entries)))
    .catch(() => {})
    .finally(() => setCountsLoading(false))
}, [open, categories, getCount])
```

- [ ] **Step 2: Usar `itemNoun` en los textos**

Reemplazar el texto de advertencia de edición (líneas ~319-323) para usar el sustantivo:

```tsx
<p className="font-body text-[12px]" style={{ color: '#7a5c00' }}>
  ⚠ {editWarning.count} {editWarning.count > 1 ? itemNoun.plural : itemNoun.singular}{' '}
  {editWarning.count > 1 ? 'tienen' : 'tiene'} esta categoría y{' '}
  {editWarning.count > 1 ? 'verán' : 'verá'} su nombre actualizado.
</p>
```

Y el `title` del botón "Eliminar" deshabilitado (líneas ~404):

```tsx
title={`Hay ${count} ${count > 1 ? itemNoun.plural : itemNoun.singular} con esta categoría. Primero reasignálos o eliminá los ${itemNoun.plural}.`}
```

- [ ] **Step 3: Pasar las props nuevas desde AdminProducts**

En `AdminProducts.tsx` (~línea 1320-1327):

```tsx
<AdminCategoriesModal
  open={showCatModal}
  onClose={() => setShowCatModal(false)}
  categories={categories}
  onCreateCategory={createCategory}
  onUpdateCategory={updateCategory}
  onDeleteCategory={deleteCategory}
  getCount={countByCategory}
/>
```

(No se pasa `itemNoun` → usa el default "producto/productos".)

- [ ] **Step 4: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores; sin imports sin usar (se quitó `pb`).

- [ ] **Step 5: Verificación visual (productos)**

En `/admin/productos` → botón "Categorías": el modal abre, muestra los conteos por categoría (badges), permite crear/editar/reordenar/eliminar igual que antes. Confirmar que el guard de borrado (categoría con productos no se puede borrar) sigue funcionando.

- [ ] **Step 6: Commit**

```bash
rtk git add src/components/admin/shared/AdminCategoriesModal.tsx src/screens/admin/AdminProducts.tsx
rtk git commit -m "refactor(categories): modal con conteo inyectado y sustantivo configurable"
```

---

## Task 9: Crear colección `blog_categories` y wirear gestión en AdminBlog

**Files:**
- (PocketBase, manual) Colección `blog_categories`
- Modify: `src/screens/admin/AdminBlog.tsx`

**Interfaces:**
- Consumes: `useCategories(config)` (Task 7), `AdminCategoriesModal` con `getCount`/`itemNoun` (Task 8).
- Config de blog: `{ categoriesCollection: 'blog_categories', itemsCollection: 'blog_posts', itemsCategoryField: 'category', matchBy: 'label' }` (los posts guardan el **label** en `category`).

- [ ] **Step 1: Crear la colección `blog_categories` en PocketBase (prerequisito manual)**

En el admin de PocketBase (`https://nat.lhstudio.com.ar/_/`), crear una colección **base** llamada `blog_categories` con los campos:
- `slug` — Plain text, requerido, único.
- `label` — Plain text, requerido.
- `sort_order` — Number, default 0.
- API rules: lectura para autenticados/superuser (igual que `product_categories`); create/update/delete restringidos a superuser/admin (replicar las reglas de `product_categories`).

Cargar las categorías iniciales para que coincidan con los posts existentes (que guardan estos labels): `Estudio`, `Botánica`, `Cerámica`, `Dibujo`, `Textiles` (slug en minúscula/sin tildes, label tal cual). 

> Si esta colección no existe todavía, `useCategories` cae con lista vacía (catch silencioso) y el resto del SPEC sigue mergeable; el select de categorías quedaría vacío hasta crearla. Coordinar este paso con quien administre PocketBase.

- [ ] **Step 2: Wirear el modal y el filtro en AdminBlog**

En `AdminBlog.tsx`:

1. Agregar imports:

```tsx
import AdminCategoriesModal from '@/components/admin/shared/AdminCategoriesModal'
import { useCategories } from '@/hooks/useCategories'
```

2. Eliminar la constante hardcodeada:

```tsx
// Eliminar:
const BLOG_CATEGORIES = ['Estudio', 'Botánica', 'Cerámica', 'Dibujo', 'Textiles']
```

3. Dentro del componente, agregar estado del modal y el hook con la config de blog (después de `const [loading, setLoading] = useState(true)`):

```tsx
const [showCatModal, setShowCatModal] = useState(false)
const {
  categories,
  createCategory,
  updateCategory,
  deleteCategory,
  countByCategory,
} = useCategories({
  categoriesCollection: 'blog_categories',
  itemsCollection: 'blog_posts',
  itemsCategoryField: 'category',
  matchBy: 'label',
})
```

4. Agregar el botón "Categorías" junto a "+ Nuevo post" (en el header, ~línea 118-125). Envolver los dos botones en un contenedor flex:

```tsx
<div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() => setShowCatModal(true)}
    className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-cream-100"
    style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
    title="Gestionar categorías"
  >
    Categorías
  </button>
  <button
    type="button"
    onClick={() => router.push('/admin/blog/nuevo')}
    className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-sage-700 hover:text-cream-50 hover:border-sage-700"
    style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
  >
    + Nuevo post
  </button>
</div>
```

5. Reemplazar las opciones del `<select>` de filtro de categoría (líneas ~147-148) para usar las categorías administradas (los posts guardan el label, así que el value es el label):

```tsx
<option value="all">Todas las categorías</option>
{categories.map((c) => <option key={c.id} value={c.label}>{c.label}</option>)}
```

6. Antes del cierre del `</div>` raíz del componente, montar el modal:

```tsx
<AdminCategoriesModal
  open={showCatModal}
  onClose={() => setShowCatModal(false)}
  categories={categories}
  onCreateCategory={createCategory}
  onUpdateCategory={updateCategory}
  onDeleteCategory={deleteCategory}
  getCount={countByCategory}
  itemNoun={{ singular: 'post', plural: 'posts' }}
/>
```

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores; `BLOG_CATEGORIES` ya no se referencia en AdminBlog.

- [ ] **Step 4: Verificación visual**

En `/admin/blog`: aparece el botón "Categorías". El modal permite crear/editar/reordenar/eliminar categorías de blog; los badges muestran cuántos **posts** usan cada una (texto "post/posts"). El filtro de categorías del listado se llena con las categorías administradas y filtra correctamente.

- [ ] **Step 5: Commit**

```bash
rtk git add src/screens/admin/AdminBlog.tsx
rtk git commit -m "feat(admin-blog): gestion de categorias de blog reutilizando el modal compartido"
```

---

## Task 10: Conectar el select de categoría del editor de blog a las categorías administradas

**Files:**
- Modify: `src/screens/admin/AdminBlogEditor.tsx:14`, `:607-613`

**Interfaces:**
- Consumes: `useCategories(blogConfig)` (Task 7).

- [ ] **Step 1: Reemplazar la constante por el hook**

En `AdminBlogEditor.tsx`:

1. Eliminar la constante (línea 14):

```tsx
// Eliminar:
const BLOG_CATEGORIES = ['Estudio', 'Botánica', 'Cerámica', 'Dibujo', 'Textiles']
```

2. Agregar el import y el hook dentro del componente:

```tsx
import { useCategories } from '@/hooks/useCategories'
```

```tsx
// Dentro del componente, junto a los otros hooks:
const { categories } = useCategories({
  categoriesCollection: 'blog_categories',
  itemsCollection: 'blog_posts',
  itemsCategoryField: 'category',
  matchBy: 'label',
})
```

- [ ] **Step 2: Usar las categorías en el `<select>`**

En el `<select>` de categoría (líneas ~607-613), reemplazar el `.map` de `BLOG_CATEGORIES`:

```tsx
// Antes
{BLOG_CATEGORIES.map((c) => (
  <option key={c} value={c}>{c}</option>
))}
// Después
{categories.map((c) => (
  <option key={c.id} value={c.label}>{c.label}</option>
))}
```

> El default `category: 'Estudio'` (líneas ~44 y ~369) se deja: si "Estudio" existe como categoría administrada, el select lo selecciona; los posts existentes conservan su label. (Si se renombró/eliminó "Estudio" en PocketBase, el valor guardado sigue mostrándose como texto plano en el listado — comportamiento aceptable.)

- [ ] **Step 3: Build + lint**

Run: `rtk next build` y `rtk lint`
Expected: compila sin errores; `BLOG_CATEGORIES` eliminado del editor.

- [ ] **Step 4: Verificación visual**

En `/admin/blog/nuevo` (y editar un post existente): el desplegable de categoría se llena con las categorías administradas en PocketBase. Al guardar, el post almacena el label elegido. Crear una categoría nueva desde el modal (Task 9) y confirmar que aparece en el select del editor.

- [ ] **Step 5: Commit**

```bash
rtk git add src/screens/admin/AdminBlogEditor.tsx
rtk git commit -m "feat(admin-blog): editor usa categorias administradas en el select"
```

---

## Self-Review (completado al escribir el plan)

**Cobertura del spec (SPEC 1):**
- A1 → Task 1 · A2 → Task 1 · A3 → Task 1 · A4 → Task 3 · A5 → Task 5 · A6 → Task 4 · A7 → Task 4 · A8 → Task 4 · A9 → Task 4 · A10 → Task 4
- B1 → Task 2 · B2 → Task 3 · B3 → Task 5
- C1 → Task 2 (home) + Task 3 (estudio) · C2 → Task 3 · C3 → Task 5
- D1–D5 → Task 6
- E1 → Tasks 7–10
- Texto "Natalia se va a comunicar" → intencionalmente NO se toca (Global Constraints). ✓

**Placeholders:** Sin TBD/TODO en pasos (el `TODO` que se menciona es código existente que se elimina). Cada paso muestra el código real. ✓

**Consistencia de tipos:** `Category`, `CategoriesConfig`, `countByCategory(cat): Promise<number>`, `getCount`, `itemNoun` usados de forma consistente entre Tasks 7–10. La config de blog (`matchBy: 'label'`) es coherente con que los posts guardan el label. ✓

**Notas de riesgo:**
- Task 6: si otro archivo referenciaba `BANK_DETAILS.banco`/`.tipoCuenta`, el build lo señalará (Step 3 lo cubre).
- Task 9: la colección `blog_categories` es un prerequisito manual en PocketBase; sin ella el resto sigue mergeable (lista vacía).
- Tasks 2/3 tocan títulos animados con `splitWords` — validar sin flash de contenido oculto (Global Constraints).

# Correcciones NatArt — Quick Wins (SPEC 1)

**Fecha:** 2026-06-30
**Origen:** [Documento de correcciones del cliente](https://docs.google.com/document/d/1nIqyrjrHeKVH5qkro7fmDCHEATx6ev-koy8GK2m8JKo/edit) — "CORRECCIONES WEB - NAT ART"
**Estado:** Diseño aprobado, pendiente plan de implementación

---

## Resumen

El cliente entregó un documento con 23 correcciones repartidas por toda la web (`nat-eta.vercel.app`).
Este spec cubre **solo los "quick wins"**: cambios de código de bajo riesgo (texto, layout, quitar
elementos, datos de pago) más una feature chica (categorías de blog). Las dos piezas grandes
—sistema de imágenes editables y fix de códigos postales— se separan en sus propios specs.

### Decisiones de alcance tomadas

1. **Imágenes artísticas → PocketBase.** Hoy son placeholders hardcodeados. Se refactorizarán para
   ser editables desde el admin, pero eso es un **sub-proyecto aparte** (SPEC 2), no entra acá.
2. **Datos de pago → solo lo del documento.** Se aplican alias/CVU/WhatsApp del doc; los campos
   Banco y Tipo de cuenta **no van** (se eliminan del panel).
3. **Quick wins primero.** Este spec es mergeable de forma independiente. Imágenes y códigos postales
   son specs posteriores.

---

## En alcance (SPEC 1)

### A. Cambios de texto / copy

| # | Cambio | Ubicación |
|---|--------|-----------|
| A1 | Nav "El Estudio" → **"Tatuajes"** (la ruta sigue siendo `/estudio`) | `navigationItems` en `src/components/shared/Header.tsx:12` y el array de nav en `src/components/shared/Footer.tsx:46` |
| A2 | Footer dirección: "Parque Chacabuco · Buenos Aires, AR" → **"CABA · Buenos Aires, AR."** | `src/components/shared/Footer.tsx:132` |
| A3 | Contacto: "Parque Chacabuco · CABA\nCon turno previo" → **"CABA · Buenos Aires, AR.\nCon turno previo"** | `INFO_ITEMS` en `src/components/contacto/ContactInfo.tsx:10` |
| A4 | Cajita portfolio: "Podés ver mi trabajo completo haciendo click en el link" → **"Te invito a ver más de mi trabajo haciendo click en el link"** | `src/components/estudio/MasonryGallery.tsx:119-121` |
| A5 | Blog hero: título y subtítulo nuevos (ver textos exactos abajo). El eyebrow "Conocé mi lado más íntimo" **ya está bien**, no se toca. | `src/components/blog/BlogHeroSection.tsx` |
| A6 | Form reservar — intro: "Tomate unos minutos. Cuanto más detalle…" → texto nuevo del doc (ver abajo) | `src/components/estudio/ReservarIntro.tsx:52` |
| A7 | Form — ayuda del tamaño en cm: "Aprox, redondeá si no estás segura/o" → **"Tomá la medida con una regla"** | `src/components/estudio/BookingForm.tsx:328-330` |
| A8 | Form — placeholder de Instagram: quitar **"(opcional)"** → `"tu_usuario"` | `src/components/estudio/BookingForm.tsx:277` |
| A9 | Form — pantalla de éxito: título y cuerpo nuevos (ver abajo) | `src/components/estudio/BookingForm.tsx:166-173` |
| A10 | Form — **eliminar** la línea "Sé lo más detallado posible para entender bien tu idea." | `src/components/estudio/BookingForm.tsx:234-236` |

#### Textos exactos

**A5 — Blog hero** (`BlogHeroSection.tsx`):
- Eyebrow (sin cambios): `Conocé mi lado más íntimo`
- Título (`TITLE`, hoy "Guías, reflexiones e historias que quiero compartir."):
  `Guías y reflexiones que quiero compartir.`
- Subtítulo (hoy "Sí, también disfruto mucho la escritura…"):
  `También disfruto mucho de la escritura. En esta sección te cuento más sobre mi universo creativo y personal para que puedas conocerme más en profundidad. Espero que lo disfrutes!`

**A6 — Form intro** (`ReservarIntro.tsx`), reemplaza el `<p>` actual:
> Completando este formulario vas a poder agendar un turno de manera muy fácil. Por favor te pido que detalles tu idea lo mejor posible, esto me ayuda a presupuestar correctamente el trabajo. Si tenes cualquier duda, queres dejar alguna aclaración o comentario, podes escribir en la parte de Notas al final del formulario.

**A9 — Form éxito** (`BookingForm.tsx`, bloque `if (submitted)`):
- Título (hoy "Llegó tu mensaje"): `Tu consulta fue enviada!`
- Cuerpo (hoy "Gracias, {firstName}. Te voy a contestar…"):
  `Gracias, {firstName}. En los próximos días te voy a estar enviando la respuesta desde agendanattatt@gmail.com. Estate atento/a a la casilla de spam (estrellita)`
  *(Se mantiene la interpolación de `{firstName}` existente.)*

### B. Layout / tipografía

| # | Cambio | Ubicación | Enfoque |
|---|--------|-----------|---------|
| B1 | Quote del home: que **"sino con todo el proceso"** no deje "proceso" colgado solo en un renglón | `src/components/home/QuoteStripSection.tsx:9` | El texto se renderiza palabra por palabra con `splitWords` (cada palabra es `inline-block`). Agrupar las últimas palabras ("sino con todo el proceso") en un wrapper `white-space: nowrap` o usar `&nbsp;` entre ellas, respetando la animación de words existente. |
| B2 | Estudio hero: **"y un recuerdo para siempre."** en un renglón aparte, debajo de "Un momento para vos" | `src/components/estudio/EstudioHero.tsx:11-12` | El título ya está partido en `TITLE_PRE` + `<em>TITLE_EM</em>`. Forzar salto de línea antes del `<em>` (ej. `display:block` en el em o un `<br>` controlado), sin romper la animación `splitWords`. |
| B3 | Blog post: **centrar** el contenido (hoy todo pegado a la izquierda) | `src/components/blog/BlogPostArticle.tsx` | Los contenedores usan `max-w-[760px]`/`max-w-[860px]`/`max-w-[720px]` sin `mx-auto`. Agregar `mx-auto` a los bloques (hero, cover, article) para centrarlos. |

### C. Quitar elementos

| # | Cambio | Ubicación |
|---|--------|-----------|
| C1 | Quitar las etiquetas **"En piel" / "Boceto"** que aparecen sobre las imágenes de tatuajes | Home: `src/components/home/TattooTeaserSection.tsx:146-187` (3 `<span>` "En piel"/"Boceto"). Estudio: `card.label` en `src/components/estudio/MasonryGallery.tsx:85-92`. |
| C2 | **Inhabilitar la sección "El espacio"** hasta nuevo aviso | `app/(site)/estudio/page.tsx:31-32` — remover/comentar `<NHDivider label="el espacio" />` y `<StudioPhotosGallery />`. (El componente `StudioPhotosGallery.tsx` se deja en el repo, solo se desmonta de la página.) |
| C3 | Blog post: **quitar el slug** del posteo visible en el breadcrumb debajo del logo | `src/components/blog/BlogPostArticle.tsx:94-100` — el breadcrumb muestra `diario / {post.slug}`. Quitar el segmento del slug (o reemplazarlo por el título). |

### D. Datos de pago (sensible — confirmado: solo lo del doc)

| # | Cambio | Ubicación |
|---|--------|-----------|
| D1 | `alias`: `natalia.arte` → **`nat.tatt`** | `src/lib/bankDetails.ts:13` |
| D2 | Campo `cbu` → reetiquetar visualmente a **"CVU"** con valor **`0000003100011890692022`** | `src/lib/bankDetails.ts:11` (valor) + etiqueta del row en `src/components/checkout/BankTransferPanel.tsx:36` |
| D3 | **Eliminar** los campos Banco y Tipo de cuenta (no van) | `src/lib/bankDetails.ts:8-10` + filas correspondientes en `BankTransferPanel.tsx:34-35` |
| D4 | `WHATSAPP_PHONE`: `5491166191209` → **`5491132722555`** (unifica con el del footer) | `src/lib/bankDetails.ts:17` |
| D5 | Mostrar el **WhatsApp como dato visible** (+54 9 11 3272-2555) en el panel de transferencia | `src/components/checkout/BankTransferPanel.tsx` (agregar fila, opcionalmente con botón copiar) |

> **Nota:** El texto post-checkout "Natalia se va a comunicar…" (`getBodyMessage` en
> `CheckoutConfirmacionContent.tsx:31-42`) **se deja como está** — decisión del cliente. No se reemplaza.

### E. Feature chica — Categorías del blog

| # | Cambio | Detalle |
|---|--------|---------|
| E1 | Gestión de categorías del blog (crear / editar / reordenar / eliminar) **como en la tienda** | Reutilizar `src/components/admin/shared/AdminCategoriesModal.tsx` y `src/hooks/useCategories.ts`, hoy hardcodeados a la colección `product_categories` y al conteo sobre `products`. |

**Dependencias y trabajo de E1:**
- **Backend:** crear una colección `blog_categories` en PocketBase (mismos campos: `slug`, `label`,
  `sort_order`). ⚠️ Esto requiere acceso al admin de PocketBase / migración — es la única quick win
  con dependencia de backend.
- **Refactor:** generalizar `useCategories` y `AdminCategoriesModal` para que reciban por parámetro
  la colección de categorías y la colección/campo a contar (productos vs posts). Evitar romper el uso
  actual de la tienda.
- **UI:** wirear un botón "Categorías" en `src/screens/admin/AdminBlog.tsx` que abra el modal, y que el
  filtro de categorías del listado lea de la colección administrada.

Es la tarea más pesada del SPEC 1; se ejecuta **al final**. Si la creación de la colección en PocketBase
bloquea, el resto del SPEC 1 puede mergearse sin ella.

---

## Fuera de alcance

### Bucket B — Bloqueado en datos (lo carga el cliente / Natalia)
- **"Una publicación más en Últimas creaciones"**: la grilla muestra los **3 productos `active` más
  recientes** (`FeaturedProductsSection.tsx:17-25`). Interpretación: falta **publicar 1 producto** en el
  admin para completar la fila en desktop — es carga de contenido, no código. *(Si en cambio se quisiera
  mostrar 4 por fila, sería un cambio de código menor; no asumido acá.)*
- **Logo definitivo** (en revisión) — se reemplaza cuando esté el asset final.

### Bucket C — No-dev (diseño / decisión del cliente)
- Diseñar y vectorizar las hojitas/flores ornamentales para distribuir por la web.
- "Repensar el logo".

### SPEC 2 (posterior) — Imágenes editables por PocketBase
Refactor de las secciones con placeholders hardcodeados para que las imágenes vengan de PocketBase y
Natalia las edite desde el admin: carrusel del home ("universo creativo"), "Tatuajes pensados
especialmente para vos", las 12 imágenes de tatuajes del estudio, y las fotos de "El espacio".
Implica colección(es) nueva(s) + UI de admin + refactor de 4 componentes (`HomeHeroSection`,
`TattooTeaserSection`, `MasonryGallery`, `StudioPhotosGallery`).

### SPEC 3 (posterior) — Fix de códigos postales del admin
"Revisar cómo solucionar el problema de los códigos postales de los envíos para que funcione mejor
para todos." Investigación abierta: diagnóstico del sistema actual (`AdminEnvios.tsx`, `lib/shipping.ts`,
zonas en PocketBase) + propuesta. Requiere reproducir el problema antes de diseñar la solución.

---

## Verificación

- **Build / tipos:** `rtk next build` (o `rtk tsc`) sin errores nuevos.
- **Visual / manual** sobre `/`, `/estudio`, `/estudio/reservar`, `/blog`, `/blog/[slug]`, `/contacto`,
  `/checkout/confirmacion` (rama transferencia):
  - Nav y footer dicen "Tatuajes"; direcciones actualizadas.
  - Quote del home no deja "proceso" colgado; hero de estudio parte "y un recuerdo para siempre.".
  - No aparecen etiquetas "En piel"/"Boceto"; "El espacio" no se renderiza en `/estudio`.
  - Form: intro nueva, sin "(opcional)", sin la línea "Sé lo más detallado…", ayuda de cm "Tomá la
    medida con una regla", pantalla de éxito con el texto nuevo.
  - Blog: hero con copy nuevo, post centrado, sin slug en el breadcrumb.
  - Checkout transferencia: alias `nat.tatt`, **CVU** `0000003100011890692022`, WhatsApp visible
    +54 9 11 3272-2555, sin filas Banco/Tipo de cuenta.
  - Admin blog: alta/edición/orden/baja de categorías funciona y el filtro las refleja.
- **Animaciones:** respetar la regla del proyecto — el contenido visible por defecto; las animaciones
  (`splitWords`, GSAP) solo si `shouldAnimate()`. Validar B1/B2 sin flash de contenido oculto.

---

## Riesgos / notas

- **B1 / B2** tocan títulos animados con `splitWords`: el salto de línea / nowrap no debe romper el
  `inline-block` por palabra ni dejar contenido en `opacity:0`. Probar con animaciones on y off.
- **D (datos de pago)**: es información de cobro real; verificar el alias/CVU contra el documento antes
  de mergear. El CVU corresponde a una cuenta virtual (sin "banco"/"tipo de cuenta"), por eso esas filas
  se eliminan en vez de completarse.
- **E1** depende de crear la colección `blog_categories` en PocketBase; coordinar ese paso o dejarlo
  como sub-tarea bloqueante sin frenar el resto del merge.

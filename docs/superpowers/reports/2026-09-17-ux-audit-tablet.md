# Auditoría UX/UI — tablet (768 / 834 / 1024)

**Fecha:** 2026-09-17 · **Sobre:** build de producción local (`next start`), commit previo a los arreglos de esta auditoría.
**Motivo:** el sitio nunca se había revisado entre 768 y 1024 px; estaba anotado como pendiente desde el 2026-09-11.

## Resumen

Se recorrieron 8 rutas públicas en 3 anchos (24 combinaciones), midiendo desborde horizontal, elementos fuera de la ventana, áreas táctiles, texto invisible sin scroll, jerarquía de encabezados, `alt` de imágenes y tamaño del cuerpo de texto. **Un problema real de layout, tres de áreas táctiles y uno de contraste.** Todos corregidos el mismo día. El resto de lo que marcó la herramienta es ruido esperable, explicado abajo.

## Corregido

| # | Hallazgo | Dónde | Detalle |
|---|---|---|---|
| 1 | **Scroll horizontal de 32 px** | `/tienda/[slug]` a **768 px exactos** | La grilla `md:grid-cols-[1.1fr_0.9fr]` no dejaba encoger la columna de la foto (las celdas no bajan de su contenido mínimo), y empujaba la columna de texto hasta los 800 px. Se agregó `[&>*]:min-w-0`. A 834 y 1024 no pasaba. |
| 2 | Área táctil de 28×28 px | Botón de pausa del carrusel del hero | A 44×44 (WCAG 2.5.5). |
| 3 | Áreas táctiles de 40×40 px | Flechas del carrusel del hero | A 44×44. |
| 4 | Áreas táctiles de 36×36 px | Flechas de la galería del estudio | A 44×44. |
| 5 | Contraste 4,04:1 | Fecha de las cards del blog (`text-taupe-700`, 10 px) | Necesita 4,5:1. Pasó a `text-ink-soft`. **`taupe-700` no sirve para texto sobre crema**, quedó anotado en el script de contraste. |

## Revisado y descartado (no son problemas)

- **Elementos "fuera de la ventana"**: el carrito lateral (`translateX(100%)`), el menú mobile y las diapositivas de los carruseles viven fuera de pantalla a propósito.
- **Links del nav con menos de 44 px de alto**: son texto en línea dentro de un header de 72 px, caso exceptuado por WCAG 2.5.5.
- **`sage-500` con 2,92:1**: solo se usa en los motivos botánicos decorativos, no en focos ni estados.
- **Puntos inactivos del carrusel (`taupe-500`, 2,25:1)**: decorativos; el punto activo, que es el que marca la posición, contrasta bien.
- **Cuerpo de 14 px** en el aviso de cerámica y en los pasos del estudio, y **12 px** en el pie: es texto secundario, por decisión de diseño.

## Verificación

- Desborde a 768 / 834 / 1024 y también a 390: **0 px** en todas.
- Los cinco controles de carrusel: **44×44**.
- Contraste: **15 de 15** combinaciones pasan AA.
- Sin texto invisible sin scroll, un solo `<main>` y un solo `<h1>` por página, ninguna imagen sin `alt`.
- `lint`, `tsc` y build de producción en verde.

Capturas de las 24 combinaciones: quedaron en el scratchpad de la sesión (no se versionan).

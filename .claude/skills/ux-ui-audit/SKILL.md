---
name: ux-ui-audit
description: "Auditoría UX/UI del sitio de NatArt (Natalia Heller): diseño responsive, accesibilidad WCAG 2.1 AA, contraste, tamaño de áreas táctiles y calidad visual. Usar cuando se pida auditar la interfaz, revisar cómo se ve en celular o tablet, validar breakpoints, revisar contraste o accesibilidad, hacer QA visual del front, 'revisá el diseño', 'mirá cómo se ve en mobile' o 'auditá el frontend'."
---

# Auditoría UX/UI — NatArt

Sos ingeniero/a de frontend senior especializado en responsive, accesibilidad (WCAG 2.1 AA) y tiendas online.

## Contexto del proyecto

Sitio de **Natalia Heller**: tienda de arte + estudio de tatuajes. Next.js 16 (App Router), React 19, Tailwind 3, backend PocketBase. Detalle en `CLAUDE.md`.

- **Paleta** (tokens en `app/globals.css` y `tailwind.config.js`): cream 50 `#fdfcfb` · 100 `#faf6f0` · 200 `#f5efe6` · 300 `#ede4d5`; taupe 300 `#d4c5b0` · 500 `#b8a898` · 700 `#8a7a6a`; sage 200 `#c8d5b9` · 400 `#9bb89f` · 500 `#7a9e7e` · 700 `#4a7c59` · 900 `#2f4a37`; amber 400 `#dda15e` · 700 `#a35e20`; ink `#2c2c2c`; ink-soft `#5a5350`.
- **Tipografías** (`next/font`): Fraunces (display), Nunito (cuerpo), JetBrains Mono (etiquetas y datos).
- **Breakpoints a cubrir**: 390 (celular), **768 · 834 · 1024 (tablet, el menos mirado)**, 1366 (escritorio).

## Reglas propias del proyecto (violarlas es un hallazgo)

1. **Ninguna animación puede ocultar contenido.** Nada de `opacity: 0` previo ni `gsap.set` que esconda; los reveals van con `immediateRender: false` y solo desplazamiento o desenfoque. Se mide **sin scrollear**, como lo ve un bot o una captura.
2. **Áreas táctiles de 44×44 px** como mínimo (WCAG 2.5.5), sobre todo en el header mobile, los puntos de los carruseles y las miniaturas.
3. **En el detalle de producto nunca `object-cover`**: es una tienda de arte y recortar la obra es peor que dejar aire. En la grilla de `/tienda` sí se recorta, a propósito.
4. **Un solo `<main>` por página**: lo pone el layout de `(site)` o `(home)`.
5. El **recorte de la grilla** de `/tienda` y el **punto focal** están descartados por Lauti: no volver a proponerlos.

## Páginas a auditar

Públicas: `/` · `/tienda` · `/tienda/[slug]` · `/estudio` · `/estudio/reservar` · `/blog` · `/blog/[slug]` · `/contacto` · `/checkout` (con el carrito cargado; con carrito vacío redirige).
Admin (requiere login, credenciales en `.env.local`): `/admin` · `/admin/productos` · `/admin/productos/orden` · `/admin/stock` · `/admin/ordenes` · `/admin/envios` · `/admin/galerias` · `/admin/blog`.

## Cómo correrla

1. **Servidor**: build de producción propio para no pisar el dev server de Lauti — `npx next build && npx next start -p 3917`. Confirmar el `<title>` antes de medir: suele haber otros proyectos en puertos vecinos.
2. **Navegador**: en esta PC no hay Chrome. `playwright-core` desde el scratchpad con `chromium.launch({ channel: 'msedge' })`. Detalle en la memoria del proyecto.
3. **Escrituras**: el admin local escribe en el PocketBase **de producción**. Interceptar con `page.route` y abortar todo lo que no sea GET.

## Checklist

### A. Layout responsive
- Sin scroll horizontal (`document.scrollWidth > clientWidth`) en ningún ancho.
- Ningún elemento que se pase del ancho de la ventana.
- Las grillas bajan de columnas sin dejar una fila con un solo huérfano.
- Áreas táctiles ≥ 44 px; espacio suficiente entre ellas.
- Los modales y el carrito lateral entran en la pantalla y se pueden cerrar.
- Las tablas del admin scrollean o se apilan.

### B. Tipografía
- Cuerpo ≥ 16 px en celular, interlineado ≥ 1.5.
- Los títulos fluidos (`clamp`) no se comen la pantalla en tablet.
- Nada de texto cortado ni desbordado.

### C. Contraste (WCAG AA)
Correr `python .claude/skills/ux-ui-audit/scripts/contrast_check.py`. Mirar además el texto sobre fotos (hero, teaser del estudio) y los estados deshabilitados.

### D. Componentes y flujos
- Carrusel del hero y de destacados: controles ocultos con un solo slide, puntos táctiles.
- Galería de producto: flechas visibles, cambio de foto con aviso de carga, miniatura seleccionada con su borde entero.
- Checkout: errores al lado del campo, envío según CP, dos métodos de pago claros.
- Reserva de tatuaje: adjuntos, mensaje de éxito.
- Estados vacíos con texto útil, nunca una página en blanco.

### E. Accesibilidad
- Un `<h1>` por página y jerarquía sin saltos.
- Imágenes con `alt` con sentido; las decorativas con `alt=""` o `aria-hidden`.
- Campos con etiqueta asociada; foco visible; el color no es el único indicador.
- Los links con ícono contienen su texto accesible.

## Informe

Guardar en `docs/superpowers/reports/YYYY-MM-DD-ux-audit.md`: resumen, hallazgos por severidad (críticos, altos, medios, bajos), tabla de contraste, y página por página con el ancho donde aparece cada cosa. Cada hallazgo con **evidencia medida** (número, selector o captura), nunca "se ve raro".

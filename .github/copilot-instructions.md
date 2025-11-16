# Copilot Instructions para NatArt

## Proyecto NatArt - Sitio Web Portfolio Artístico

Sitio web portfolio para Natalia Heller, artista y tatuadora. Objetivo: mostrar obras de arte, trabajos de tatuajes y facilitar el contacto con clientes.

## Stack Tecnológico

- **React 19.1** con **TypeScript** (functional components)
- **Vite 7** como build tool y dev server
- **React Router DOM 7.6** para navegación SPA
- **Tailwind CSS 3.4** para estilos (configuración personalizada)
- **Framer Motion 12** para animaciones avanzadas
- **yet-another-react-lightbox 3** para galerías de imágenes con modal

## Arquitectura y Estructura

### Configuración de Rutas (App.tsx)

- **Ruta especial `/`**: Home sin Layout (sin header/navbar), con footer transparente
- **Todas las demás rutas**: Envueltas en `<Layout>` que incluye `<Header>` + contenido + `<Footer>`
- Subrutas de obras: `/obras/acrilicos`, `/obras/acuarelas`, etc. (9 categorías de arte)

### Organización de Componentes

```
src/
├── components/
│   ├── shared/          # Componentes reutilizables base
│   │   ├── Layout.tsx   # Wrapper con Header + main + Footer
│   │   ├── Header.tsx   # Navbar con scroll effect (transparente → backdrop-blur)
│   │   ├── Footer.tsx   # Footer adaptativo (transparente en Home/Contacto)
│   │   ├── Title.tsx    # Component con variants: titlePage|titleSection|titleCard
│   │   ├── Subtitle.tsx # Component con variants: small|medium|large
│   │   ├── Button.tsx   # Component con variants + support para Link/anchor
│   │   ├── HeroSection.tsx      # Hero reutilizable con video background
│   │   ├── ImageGallery.tsx     # Galería con lightbox (yet-another-react-lightbox)
│   │   ├── ScrollToTop.tsx      # Scroll restoration en cambios de ruta
│   │   └── index.ts     # Barrel exports
│   ├── blog/            # Módulo completo de blog (17 componentes)
│   ├── contacto/        # Formulario de contacto modular (7 archivos)
│   ├── faqs/            # Sistema de FAQ con búsqueda (6 archivos)
│   ├── obras/           # Componentes específicos de obras
│   ├── sobremi/         # Componentes de página "Sobre Mi"
│   └── tattoo/          # Componentes específicos de tatuajes
├── pages/
│   ├── Home.tsx         # Landing page con video fullscreen + grid navigation
│   ├── Obras.tsx        # Grid de categorías de arte (9 tipos)
│   ├── Tattoo.tsx       # Portfolio de tatuajes + info estudio
│   ├── SobreMi.tsx      # Página sobre la artista
│   ├── Blog.tsx         # Lista de posts (actualmente placeholder)
│   ├── BlogPost.tsx     # Detalle de post individual
│   ├── FAQs.tsx         # Preguntas frecuentes con búsqueda
│   ├── Contacto.tsx     # Formulario de contacto
│   └── obras-tipos/     # 9 subpáginas de categorías (Acrilicos, Acuarelas, etc.)
├── hooks/
│   ├── useBlogLogic.ts      # Lógica de estado para blog
│   └── useBlogPostLogic.ts  # Lógica para post individual
└── assets/
    ├── obras/           # Imágenes de obras de arte
    └── tattoo/          # Imágenes de tatuajes
```

### Sistema de Rutas

- `/` - Home (sin Layout, video fullscreen)
- `/obras` - Grid de categorías
  - `/obras/acrilicos`, `/obras/acuarelas`, `/obras/flores-prensadas`, etc.
- `/tattoo` - Portfolio de tatuajes
- `/sobre-mi` - Biografía artista
- `/blog` - Posts (coming soon placeholder)
- `/faqs` - Preguntas frecuentes
- `/contacto` - Formulario

## Patrones de Diseño Implementados

### 1. Component Composition Pattern

Componentes modulares pequeños que se componen. Ejemplo en `pages/Tattoo.tsx`:
```tsx
<HeroSection video={heroVideo} content={contentHero()} />
<ContenidoText content={content_first} />
<StudioCTA />
<CTATattooSection />
<GallerySection tattoos={tattoos} />
```

### 2. Custom Hooks para Lógica de Estado

- `useBlogLogic()` - Gestiona posts, loading, error, navegación
- `useFAQLogic()` - Gestiona accordion, búsqueda, scroll to question
- `useContactForm()` - Gestiona formulario, validación, submit

### 3. Barrel Exports

Todos los módulos usan `index.ts` para exports centralizados:
```ts
// src/components/shared/index.ts
export { default as Header } from './Header';
export { default as Footer } from './Footer';
// ... etc
```

### 4. Variant Props Pattern

Componentes como `Title`, `Subtitle`, `Button` usan prop `variant` para diferentes estilos:
```tsx
<Title variant="titlePage" as="h1">
<Button variant="primary" size="large">
```

### 5. Props Polymorphism

`Button` puede renderizar como `<button>`, `<Link>` o `<a>` según props `as`, `to`, `href`.

## Sistema de Estilos

### Paleta de Colores Personalizada (tailwind.config.js)

- **cream**: 50-900 (colores primarios: #fdfcfb → #6c635b)
- **nude**: 50-900 (neutros cálidos)
- **green**: 50-900 (acentos: #f5fdf9 → #1d523b)
- **brown**: 50-900 (acentos tierra)

### Tipografía

- **font-title**: `'Aboreto', serif` (títulos, h1-h6)
- **font-body**: `'Gayathri', sans-serif` (texto general)
- **Fallback global**: `'Lato', sans-serif` (body base en index.css)

### Clases CSS Personalizadas (index.css)

```css
.scrollbar-hide          /* Ocultar scrollbar (carruseles) */
.line-clamp-2 / .line-clamp-3  /* Truncar texto con ellipsis */
.transition-smooth       /* Transición cubic-bezier personalizada */
@keyframes fade-in, slide-in-right, slide-in-left
.animate-fade-in, .animate-slide-in-right, .animate-slide-in-left
.animation-delay-150 / .animation-delay-300
```

### Path Alias

Configurado en `vite.config.ts` y `tsconfig.json`:
```ts
import Component from '@/components/shared/Component';
```

## Efectos Visuales Específicos

### Header con Scroll Effect

El `Header` cambia de `bg-transparent` a `bg-black/30 backdrop-blur-md` cuando `scrollY > 50px`. Los items de navegación también se achican.

### Footer Adaptativo

- **Transparente**: en rutas `/` y `/contacto` → `bg-black/20 backdrop-blur-md`
- **Sólido**: resto de rutas → `bg-cream-100/50 backdrop-blur-sm`

### Home Page Video Background

- Video fullscreen con overlay `bg-gradient-to-b from-black/50 via-black/40 to-black/60`
- Grid de 6 tarjetas con glassmorphism: `backdrop-blur-md bg-white/10`
- Animaciones de entrada escalonadas con delays

### HeroSection Reutilizable

Componente que acepta `video` y `content` como props, usado en Obras, Tattoo, Blog, etc.

### ImageGallery con Lightbox

- Grid responsive con aspect ratio configurable
- Hover overlay con título/descripción
- Lightbox modal con navegación, zoom, swipe

## Workflows de Desarrollo

### Comandos (package.json)

```bash
npm run dev      # Inicia Vite dev server (default: http://localhost:5173)
npm run build    # TypeScript check + Vite build (dist/)
npm run preview  # Preview build production local
npm run lint     # ESLint con reglas React hooks + refresh
```

### Estructura de Páginas Tipo

1. Import componentes específicos del módulo
2. Definir datos/estado (puede ser mock data)
3. Renderizar con composición de componentes
4. Exportar como default

### Crear Nueva Categoría de Obra

1. Agregar ruta en `App.tsx`
2. Crear `src/pages/obras-tipos/NuevaCategoria.tsx`
3. Usar `HeaderObras` + `GridObras` con datos específicos
4. Agregar export en `src/pages/obras-tipos/index.ts`
5. Actualizar grid en `src/pages/Obras.tsx` con nueva card

## Convenciones Específicas del Proyecto

### Naming

- **Componentes**: PascalCase (`HeaderObras.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useBlogLogic.ts`)
- **Assets**: kebab-case (`hero-acrilico.webp`)
- **Props interfaces**: `<ComponentName>Props`

### TypeScript

- Siempre tipar props con `interface` o `type`
- Usar `React.FC<Props>` para componentes funcionales
- Export interfaces cuando se reutilizan (ej: `GalleryImage`)

### Responsive Design

- Mobile-first approach con breakpoints Tailwind: `sm:`, `md:`, `lg:`, `xl:`
- Testear en móvil: navegación colapsable, touch interactions, video autoplay

### Assets

- Videos: `.mp4`, `.mov` en `src/assets/`
- Imágenes: `.jpg`, `.webp`, `.png` organizadas por categoría
- Usar `import` para assets, no paths relativos en strings

### Estado y Data

- Actualmente mock data hardcodeado en componentes/hooks
- Preparado para migrar a API: ver `useBlogLogic` (simula async con timeout)
- Formularios: estado local con custom hooks

## Aspectos Clave para Nuevos Agentes

### 1. La Home es Diferente

No uses `Layout` en `/`. Tiene estructura única: video fullscreen + grid navigation + footer transparente.

### 2. Componentes Shared son la Base

Antes de crear componentes nuevos, revisa `components/shared/`. Hay utilidades reutilizables como `Title`, `Section`, `HeroSection`.

### 3. El Sistema de Tipos de Obras

Hay 9 categorías hardcodeadas. Si agregas una nueva, actualiza 3 lugares: `App.tsx` routes, `obras-tipos/`, y el array en `Obras.tsx`.

### 4. Estilo Visual Coherente

- Colores: cream/nude como base, green como acento
- Transparencias y backdrop-blur son frecuentes
- Animaciones suaves (fade-in, slide-in) con delays escalonados
- Hover states: `scale-105`, `shadow-2xl`, overlay con `bg-black/60`

### 5. Custom Hooks Encapsulan Lógica

No pongas lógica compleja en componentes. Crea hooks personalizados (ver `hooks/`).

### 6. Blog Está en Construcción

Componentes existen pero páginas muestran "Coming Soon". Mock data está preparado en `useBlogLogic`.

### 7. Importaciones con Alias

Usa `@/` para imports absolutos desde `src/`. Configurado en Vite y TS.

## Testing y Debug

- **No hay tests configurados** - considera agregar Vitest + Testing Library
- **Dev tools**: React DevTools, Vite dev server con HMR
- **Errores comunes**: 
  - Videos no cargan: verificar formato y path
  - Rutas no funcionan: revisar anidación en `App.tsx`
  - Estilos no aplican: verificar orden de imports en index.css

## Próximos Pasos Sugeridos

- Implementar CMS o API para contenido dinámico
- Agregar sistema de i18n (español/inglés)
- Optimizar imágenes (WebP, lazy loading avanzado)
- Agregar Google Analytics o similar
- Implementar formulario de contacto funcional (backend)
- Activar sección de Blog con posts reales

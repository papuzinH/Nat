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
│   ├── Home.tsx         # Landing page dinámica (SEO + conversión, 461 líneas)
│   ├── Obras.tsx        # Grid de categorías de arte (9 tipos)
│   ├── Tattoo.tsx       # Portfolio de tatuajes + info estudio
│   ├── SobreMi.tsx      # Página sobre la artista
│   ├── Blog.tsx         # Lista de posts con grid responsive (147 líneas)
│   ├── BlogPost.tsx     # Detalle de post individual con SEO (220 líneas)
│   ├── FAQs.tsx         # Preguntas frecuentes con búsqueda
│   ├── Contacto.tsx     # Formulario de contacto
│   └── obras-tipos/     # 9 subpáginas de categorías (Acrilicos, Acuarelas, etc.)
├── hooks/
│   ├── useBlogLogic.ts      # Lógica de estado para blog
│   └── useBlogPostLogic.ts  # Lógica para post individual
└── assets/
    ├── obras/           # Imágenes de obras de arte
    └── tattoo/          # Imágenes de tatuajes + mock-data.ts (interface Tattoo)
```

### Sistema de Rutas

- `/` - Home (sin Layout, video fullscreen)
- `/obras` - Grid de categorías
  - `/obras/acrilicos`, `/obras/acuarelas`, `/obras/flores-prensadas`, etc.
- `/tattoo` - Listado de tatuajes
  - `/tattoo/:id` - Detalle individual de tatuaje
- `/sobre-mi` - Biografía artista
- `/blog` - Listado de posts (grid 2 columnas)
  - `/blog/:slug` - Detalle individual de post (estructura SEO)
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
.animation-delay-150 / .animation-delay-300 / .animation-delay-450 / .animation-delay-600
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

### Home Page - Landing Dinámica (Actualizada Nov 2025)

**Arquitectura de Conversión** - 6 secciones modulares con funnel + **voz personal (primera persona)**:

1. **Hero Section** (ContentHero)
   - Usa componente reutilizable `<HeroSection>` con video background
   - H1 optimizado SEO: "Diseños de Tatuajes Únicos y Personalizados en Buenos Aires"
   - Subtitle personal: "Transformo tu historia y esencia en un diseño único, permanente. En mi estudio, la naturaleza y la simetría guían cada trazo."
   - CTA primario: "AGENDA MI CITA" → /contacto (singular)
   - Animaciones: fade-in con delays 0ms, 150ms, 300ms

2. **Social Proof Section** (SocialProofSection)
   - Título: "Mi Universo Creativo y Tu Historia"
   - Subtitle: "Enfocada en el detalle, te invito a co-crear un diseño exclusivo, con la confianza y seguridad de 8+ años de experiencia."
   - 3 bloques con voz personal:
     - "500+ Diseños de Autor" - "Cada pieza refleja la esencia única de quien la lleva."
     - "Mi Experiencia: 8+ Años" - "Perfeccionando el arte del tatuaje con pasión y dedicación."
     - "Estudio Personal & Seguro" - "Trabajo bajo los más altos estándares de higiene y cuidado."
   - Grid responsive: 1 col móvil → 3 cols desktop
   - CTA secundario: "Ver Portfolio de Tatuajes" → /tattoo
   - Estilo: `bg-cream-50`, icons emoji, hover effects

3. **Featured Portfolio Section** (FeaturedPortfolioSection)
   - Importa `tattoos` desde `@/assets/tattoo/mock-data`
   - Grid 4 tatuajes destacados (aspect ratio 3:4)
   - Cards con Link a /tattoo, overlay en hover, badge categoría
   - CTA: "VER PORTAFOLIO COMPLETO" con bg-green-600
   - Estilo: gradient `from-nude-50 to-brown-50`

4. **Instagram Section** (InstagramSection)
   - Título: "Mi Diario de Arte: Proceso y Reflexiones"
   - Subtitle: "Sígueme en Instagram para ver mis sketches, mis últimos trabajos y las inspiraciones que guían mi proceso creativo."
   - Stats row: 10K+ seguidores, 500+ posts, 4.9★ valoración
   - CTA externo: "📱 Sígueme en Instagram" con Props Polymorphism (href + target="_blank")
   - Handle: @nataliaceller_art
   - Elementos decorativos: círculos blur-3xl en esquinas
   - Estilo: gradient `from-brown-100 via-nude-100 to-cream-100`

5. **FAQ Section** (FAQSection + FAQItem)
   - Título: "¿Tenés dudas? Te ayudo"
   - Subtitle: "Respondí las preguntas más frecuentes para que tomes la mejor decisión. Si tienes más dudas, hablemos personalmente."
   - Componente accordion interactivo (estado local con useState)
   - 2 preguntas clave: precios y proceso de reserva
   - Interface TypeScript: `FAQItemProps` (question, answer, delay)
   - CTA terciario: "PREGUNTAS FRECUENTES (FAQs)" → /faqs (outline variant)
   - Accesibilidad: aria-expanded, keyboard navigation
   - Estilo: `bg-cream-100 to cream-50`, icono "+" rotatorio

6. **Footer** (transparente)

**Características técnicas:**
- **Voz en primera persona** (yo/mi) en todo el copy - marca personal auténtica
- Path alias `@/` en todos los imports
- TypeScript strict: interfaces para props, arrays tipados
- Mock data: `src/assets/tattoo/mock-data.ts` (interface Tattoo, 4 items)
- Animaciones escalonadas: delays 150ms, 300ms, 450ms, 600ms
- Responsive: mobile-first con breakpoints sm/md/lg
- 461 líneas totales, modularizado en 6 componentes

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

### 1. La Home es Landing de Conversión (Actualizada)

No uses `Layout` en `/`. Estructura única: 6 secciones modulares con funnel de conversión. Hero con video + 5 CTAs estratégicos + footer transparente. Usa path alias `@/` para imports, componentes tipados con `React.FC<Props>`, y mock data desde `@/assets/tattoo/mock-data`.

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

### 6. Blog Totalmente Funcional (Actualizado Nov 2025)

El módulo de blog está **completamente implementado** con arquitectura SEO/LLMO optimizada:

**Páginas Activas:**
- `/blog` - Listado con Hero (imagen), stats, grid 2 columnas, estados loading/error/empty
- `/blog/:slug` - Detalle con breadcrumb, H1 SEO, metadata, contenido extenso, tags, CTA conversión

**Componentes:**
- `PostCard` (93 líneas) - Card con hover effects, animaciones escalonadas, Link a detalle
- Reutiliza: `BlogPostCard` (interface BlogPost), `ContenidoText` (renderizado de párrafos)

**Hooks:**
- `useBlogLogic()` - 10 posts mock, loading state, error handling
- `useBlogPostLogic(slug)` - Busca post por slug, retorna {post, loading, error}, 2 posts con contenido completo (5 párrafos c/u)

**Características SEO:**
- H1 único en BlogPost.tsx: título del post
- Breadcrumb navigation (Blog / Título)
- Metadata visible: autor, fecha con `<time dateTime>`, categoría, readTime
- Tags interactivos (#cuidados, #cicatrización, etc.)
- Contenido: array de párrafos limpios (200+ palabras c/u)
- CTA al final: "¿Te inspiraste? Charlemos sobre tu tatuaje" → /contacto

### 7. Importaciones con Alias (Obligatorio)

**SIEMPRE** usa `@/` para imports absolutos desde `src/`. Configurado en Vite y TS. Ejemplo:
```tsx
// ✅ CORRECTO
import { HeroSection } from '@/components/shared';
import sobremiHeroVideo from '@/assets/sobremi_hero.mp4';
import { tattoos } from '@/assets/tattoo/mock-data';

// ❌ INCORRECTO
import { HeroSection } from '../components/shared';
import sobremiHeroVideo from '../assets/sobremi_hero.mp4';
```

## Testing y Debug

- **No hay tests configurados** - considera agregar Vitest + Testing Library
- **Dev tools**: React DevTools, Vite dev server con HMR
- **Errores comunes**: 
  - Videos no cargan: verificar formato y path
  - Rutas no funcionan: revisar anidación en `App.tsx`
  - Estilos no aplican: verificar orden de imports en index.css

## Changelog Reciente (Nov 2025)

### Home.tsx - Landing Page Dinámica
- ✅ Reestructuración completa: de grid estático a funnel de conversión (6 secciones)
- ✅ SEO: H1 optimizado "Diseños de Tatuajes Únicos y Personalizados en Buenos Aires"
- ✅ **Copywriting en primera persona**: toda la página usa voz personal (yo/mi) eliminando lenguaje corporativo
- ✅ 5 CTAs estratégicos: agenda (singular), portfolio (x2), Instagram, FAQs
- ✅ Componentes nuevos: `ContentHero`, `SocialProofSection`, `FeaturedPortfolioSection`, `InstagramSection`, `FAQSection`, `FAQItem`
- ✅ Mock data: `@/assets/tattoo/mock-data.ts` (interface Tattoo, 4 items con imágenes reales)
- ✅ TypeScript: interfaces `FAQItemProps`, arrays tipados, React.FC<Props>
- ✅ Path alias: todos los imports usan `@/` (no rutas relativas)
- ✅ CSS: animation-delay-450 y animation-delay-600 agregados a index.css
- ✅ HeroSection: detección automática tipo de video (mp4/webm/mov)

### Refactorización de Copy (Nov 2025)
- ✅ ContentHero: "Transformo tu historia..." + "AGENDA MI CITA"
- ✅ SocialProofSection: "Mi Universo Creativo", "500+ Diseños de Autor", "Mi Experiencia: 8+ Años", "Estudio Personal & Seguro"
- ✅ InstagramSection: "Mi Diario de Arte", "Sígueme... mis sketches, mis últimos trabajos"
- ✅ FAQSection: "¿Tenés dudas? Te ayudo", "Respondí las preguntas...", "hablemos personalmente"

### Módulo Tattoo - Arquitectura Indexable (Nov 2025)
- ✅ Refactorización completa: de galería estática a sistema de páginas indexables
- ✅ Mock data expandido: 4 tatuajes con 3 párrafos c/u (600+ palabras por tatuaje)
- ✅ Interface Tattoo: id, slug, title, image, category, location, description[], tags[]
- ✅ TattooGridList.tsx: Grid responsive 3 columnas con Links a detalle
- ✅ TattooDetail.tsx (196 líneas): breadcrumb, H1 SEO, contenido extenso, CTA con query params, sección related
- ✅ Ruta dinámica: `/tattoo/:id` configurada en App.tsx
- ✅ 404 handling: página de error personalizada si tatuaje no existe
- ✅ CTA conversión: Link a `/contacto?design=${tattoo.id}`

### Módulo Blog - Implementación Completa SEO/LLMO (Nov 2025)
- ✅ Blog.tsx (147 líneas): Hero con imagen `hero_room_image.webp`, H1 "Blog: Guías, Reflexiones y el Universo del Tatuaje"
- ✅ Stats section: 10+ Artículos, 5 Categorías, 8 min Lectura Promedio
- ✅ Grid responsive: 2 columnas desktop, 1 móvil
- ✅ PostCard.tsx (93 líneas): Nuevo componente con hover effects, animaciones escalonadas (100ms por card)
- ✅ Estados UI: Loading (skeleton loaders), Error (mensaje estilizado), Empty, Success (grid de posts)
- ✅ BlogPost.tsx (220 líneas): Detalle SEO-optimizado con useParams, breadcrumb, H1, metadata completa
- ✅ Estructura semántica: `<article>`, `<h1>`, `<time dateTime>`, tags array
- ✅ CTA conversión: "¿Te inspiraste? Charlemos sobre tu tatuaje" → /contacto
- ✅ useBlogLogic refactorizado: 10 posts mock con metadata completa
- ✅ useBlogPostLogic refactorizado: Acepta slug, retorna {post, loading, error}, 2 posts con 5 párrafos c/u (1,000+ palabras)
- ✅ Ruta dinámica: `/blog/:slug` activada en App.tsx
- ✅ 404 handling: Página error con 2 CTAs (blog, contacto)
- ✅ TypeScript: 0 errores de compilación, tipado explícito en tags map
- ✅ Reutilización: ContenidoText (compartido con Tattoo), Button (Props Polymorphism), Layout, Title, Subtitle

## Módulo Blog - Guía de Implementación Detallada

### Estructura de Archivos

**Páginas:**
- `Blog.tsx` (147 líneas) - Listado principal con Hero + Grid
- `BlogPost.tsx` (220 líneas) - Detalle individual SEO-optimizado

**Componentes:**
- `PostCard.tsx` (93 líneas) - Card para grid de blog
- Reutiliza de módulo existente: `BlogPostCard.tsx` (interface BlogPost)

**Hooks:**
- `useBlogLogic.ts` - Estado para listado: {posts, loading, error, handlePostClick}
- `useBlogPostLogic.ts` - Estado para detalle: {post, loading, error}

### Blog.tsx - Página Listado

**Hero Section:**
```tsx
<HeroSection image={heroBlogImage} content={heroContent} />
```
- Usa imagen estática: `hero_room_image.webp`
- H1: "Blog: Guías, Reflexiones y el Universo del Tatuaje"
- Subtitle: "Comparto mi proceso creativo, técnicas profesionales..."
- Stats: 10+ Artículos, 5 Categorías, 8 min Lectura Promedio
- Animaciones: fade-in con delays 0ms, 150ms, 300ms, 450ms

**Grid Section:**
- Container: `max-w-7xl mx-auto`
- Grid: `grid-cols-1 md:grid-cols-2 gap-8`
- Estados: loading (4 skeleton cards), error (mensaje rojo), empty (placeholder), success (PostCard loop)
- Background: `bg-gradient-to-b from-cream-50 to-nude-50`

**Lógica:**
```tsx
const { posts, loading, error } = useBlogLogic();
```

### BlogPost.tsx - Página Detalle

**Estructura SEO:**
```tsx
<Layout>
  <Breadcrumb /> // Blog / [Título]
  <article>
    <CategoryBadge />
    <h1>{post.title}</h1> // ← H1 único
    <PostMeta /> // autor, fecha, readTime
    <FeaturedImage /> // si existe
    <ContenidoText content={post.content} />
    <Tags />
    <CTAConversion />
  </article>
</Layout>
```

**Metadata Visible:**
- Autor: Avatar circular con gradiente green-400 to green-600, nombre, subtitle "Artista & Tatuadora"
- Fecha: `<time dateTime={post.date}>{post.date}</time>` (schema.org ready)
- Categoría: Badge verde con uppercase tracking-wide
- ReadTime: "8 min de lectura" con icono reloj
- Tags: Array de badges clicables `#{tag}`

**CTA de Conversión:**
- Background: `bg-gradient-to-br from-green-50 to-cream-50`
- Título: "¿Te inspiraste? Charlemos sobre tu tatuaje"
- Copy: "Cada diseño cuenta una historia única. Si este artículo te inspiró..."
- Button: "Agenda tu consulta gratuita" → `/contacto`
- Posición: Al final del contenido, después de tags

**Estados:**
- Loading: Spinner verde con mensaje "Cargando artículo..."
- Error/404: Icono alerta, título "404 - Artículo no encontrado", 2 CTAs (blog/contacto)

**Lógica:**
```tsx
const { slug } = useParams<{ slug: string }>();
const { post, loading, error } = useBlogPostLogic(slug);
```

### PostCard.tsx - Componente Card

**Estructura:**
```tsx
<Link to={`/blog/${post.id}`}>
  <article style={{ animationDelay: `${index * 100}ms` }}>
    <ImageContainer>
      {post.image ? <img /> : <IconPlaceholder />}
      {post.featured && <Badge>Destacado</Badge>}
    </ImageContainer>
    <Content>
      <MetaRow /> // categoría + readTime
      <Title /> // h3 con line-clamp-2, min-h-[3.5rem]
      <Excerpt /> // line-clamp-3
      <Footer>
        <AuthorMeta /> // avatar + nombre + fecha
        <ReadMore /> // "Leer más →" con arrow icon
      </Footer>
    </Content>
  </article>
</Link>
```

**Estilos Clave:**
- Hover: `hover:shadow-xl hover:scale-105`
- Image hover: `group-hover:scale-110`
- Title hover: `group-hover:text-green-700`
- Arrow hover: `group-hover:translate-x-1`
- Background: `bg-white` con border `border-cream-200`

**Props:**
```tsx
interface PostCardProps {
  post: BlogPost;
  index: number; // Para animaciones escalonadas
}
```

### useBlogLogic - Hook Listado

**Mock Data:**
- 10 posts completos con metadata
- Categorías: Cuidados, Inspiración, Técnicas, Diseño, Historia
- Featured: posts 1 y 4
- Tags: 4 tags por post

**Return:**
```tsx
{
  posts: BlogPost[], // Array de 10 posts
  loading: boolean,   // Simula 500ms delay
  error: string | null,
  handlePostClick: (post: BlogPost) => void // Navigate to /blog/${post.id}
}
```

### useBlogPostLogic - Hook Detalle

**Parámetro:**
```tsx
useBlogPostLogic(slug: string | undefined)
```

**Mock Data:**
- 2 posts con contenido completo:
  - Post 1: "El cuidado de tatuajes recién hechos" (5 párrafos, 1,200+ palabras)
  - Post 2: "Inspiración para tu próximo tatuaje" (5 párrafos, 1,000+ palabras)
- Cada párrafo: 200+ palabras
- content: `string[]` (array de párrafos para ContenidoText)

**Return:**
```tsx
{
  post: BlogPost | null,
  loading: boolean,  // Simula 500ms delay
  error: string | null
}
```

**Validación:**
- Si `!slug`: setError('No se proporcionó un identificador de post')
- Si post no encontrado: setError('Post no encontrado')

### Interface BlogPost

Definida en `BlogPostCard.tsx`:
```tsx
export interface BlogPost {
  id: number;
  slug?: string;        // Para SEO-friendly URLs (futuro)
  title: string;
  excerpt: string;
  date: string;         // Format: 'YYYY-MM-DD'
  category: string;     // 'Cuidados', 'Inspiración', 'Técnicas', etc.
  readTime: string;     // '8 min', '12 min', etc.
  image?: string;       // Optional featured image
  featured?: boolean;   // Para badge "Destacado"
  author?: string;      // Default: 'Natalia Heller'
  tags?: string[];      // Array de tags para SEO
  content?: string | string[]; // Array de párrafos o HTML string
}
```

### Reutilización de Componentes

**ContenidoText** (de módulo Tattoo):
```tsx
<ContenidoText content={post.content} />
// Acepta string[] y renderiza párrafos con spacing
```

**Button** (Props Polymorphism):
```tsx
<Button variant="primary" size="large" as="link" to="/contacto">
```

**Title, Subtitle** (Variant Props Pattern):
```tsx
<Title variant="titleSection" as="h2">
<Subtitle variant="medium">
```

### Convenciones de Estilo Blog

**Colores:**
- Accent primario: `green-600` (CTAs, hover states)
- Accent secundario: `cream-600` (metadata, borders)
- Backgrounds: gradientes `from-cream-50 to-nude-50`, `from-green-50 to-cream-50`
- Text: `gray-900` (títulos), `gray-600` (body), `gray-500` (meta)

**Tipografía:**
- Títulos: `font-title` (Aboreto serif)
- Body: `font-body` (Gayathri sans-serif)
- H1: `text-4xl md:text-5xl lg:text-6xl`
- H3 (PostCard): `text-xl`

**Animaciones:**
- PostCard: `animate-fade-in` con delay `${index * 100}ms`
- BlogPost: delays 150ms, 300ms, 450ms, 600ms
- Hover: `transition-all duration-300`

## Próximos Pasos Sugeridos

- Implementar CMS o API para contenido dinámico (reemplazar mock-data.ts en blog y tattoo)
- Migrar de `/blog/:id` a `/blog/:slug` con slugs SEO-friendly
- Agregar react-helmet para meta tags dinámicos por post
- Implementar filtrado por categoría en Blog.tsx
- Agregar paginación si posts > 12
- Sistema de búsqueda en blog (similar a FAQs)
- Related posts section en BlogPost.tsx
- Agregar sistema de i18n (español/inglés)
- Optimizar imágenes (WebP, lazy loading avanzado)
- Agregar Google Analytics o similar
- Implementar formulario de contacto funcional (backend)
- A/B testing en CTAs de Home para optimizar conversión

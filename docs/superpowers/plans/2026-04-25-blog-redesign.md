# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/blog` y `/blog/:slug` para coincidir con el design handoff: header editorial, filtros sticky, post destacado, grid 3-col, single post con body renderer de bloques, GSAP scroll animations y semántica SEO correcta.

**Architecture:** Reemplazar el mock data basado en ID numérico con `src/data/blog-posts.ts` (6 posts del diario de Natalia, typed). Los hooks se convierten en selectores sincrónicos sin fake delay. Blog.tsx adopta el layout del handoff (eyebrow + H1 Fraunces 72px + filtros sticky + featured + grid). BlogPost.tsx renderiza bloques `{ t, c }` (p/h2/ul) con su propio `BodyRenderer`. GSAP vía `gsap.context()` + `shouldAnimate()` en cada componente.

**Tech Stack:** React 19, TypeScript, React Router DOM 7, Tailwind CSS (tokens: sage/taupe/ink/cream, fuentes: font-display/font-body/font-mono), GSAP + ScrollTrigger (`@/lib/gsap`), shared components (Layout, NHLeafMark, NHDivider, NHFlower, SchemaMarkup).

---

## File Map

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/data/blog-posts.ts` | Crear | Tipos TS + 6 posts del diario |
| `src/hooks/useBlogLogic.ts` | Reescribir | Filtro por categoría, split featured/rest |
| `src/hooks/useBlogPostLogic.ts` | Reescribir | Lookup por slug + hydrate related |
| `src/components/blog/BlogPlaceholder.tsx` | Crear | Placeholder de imagen (card + cover) |
| `src/components/blog/BlogCard.tsx` | Crear | Card para grid (reemplaza PostCard) |
| `src/components/blog/index.ts` | Actualizar | Exportar nuevos componentes |
| `src/components/shared/index.ts` | Actualizar | Exportar NHFlower (faltante) |
| `src/pages/Blog.tsx` | Reescribir | Listing con filtros + GSAP |
| `src/pages/BlogPost.tsx` | Reescribir | Single post con body renderer + GSAP |
| `index.html` | Modificar | Agregar stylesheet de Google Fonts |

---

### Task 1: Data layer — `src/data/blog-posts.ts`

**Files:**
- Create: `src/data/blog-posts.ts`

- [ ] **Step 1: Crear el archivo de datos**

```typescript
// src/data/blog-posts.ts

export type BodyBlock =
  | { t: 'p'; c: string }
  | { t: 'h2'; c: string }
  | { t: 'ul'; c: string[] }

export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  category: string
  date: string
  reading: string
  body: BodyBlock[]
  related: string[]
}

export const BLOG_CATEGORIES = [
  'Todos', 'Estudio', 'Botánica', 'Cerámica', 'Dibujo', 'Textiles',
] as const

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'cicatrizar-despacio',
    title: 'Cicatrizar despacio',
    subtitle: 'Lo que aprendí sobre el cuidado del tatuaje después de mil sesiones.',
    category: 'Estudio',
    date: '18 abr 2026',
    reading: '5 min',
    body: [
      { t: 'p', c: 'Hay una etapa del tatuaje que nadie fotografía: la semana después. La piel descama, el negro se ve apagado, y la persona que te confió su cuerpo empieza a mandar mensajes con fotos un poco alarmadas.' },
      { t: 'p', c: 'Después de trabajar seis años, lo que más cambió en mi práctica no fue el trazo ni el equipo. Fue la manera en que hablo sobre la cicatrización antes de la sesión.' },
      { t: 'h2', c: 'Lo que le digo a cada persona' },
      { t: 'p', c: 'El tatuaje no termina cuando salís del estudio. Termina, si es que termina, unas cuatro semanas después, cuando la piel vuelve a ser suave y el color asienta. Ese proceso requiere paciencia, hidratación y la voluntad de no tocar.' },
      { t: 'p', c: 'Trabajo con una crema de caléndula que preparamos en el barrio. Sin fragancias, sin alcohol, sin nada que compita con la piel. La aplico yo al terminar, y le doy un frasco pequeño para la casa.' },
      { t: 'h2', c: 'El mito de la cocaína negra' },
      { t: 'p', c: 'Un porcentaje altísimo de las personas llega con cicatrices de tatuajes anteriores mal cuidados: líneas que migraron, negros que se volvieron grises azulados, texturas irregulares. Casi siempre fue por ungüentos pesados que no dejan respirar la piel.' },
      { t: 'p', c: 'La piel sana sola. Nuestro trabajo es no interferir.' },
      { t: 'h2', c: 'Un protocolo simple' },
      { t: 'ul', c: ['Lavado suave con jabón neutro, dos veces al día, los primeros 5 días.', 'Capa muy fina de crema hidratante (sin vaselina).', 'No cubrir con ropa ajustada si es posible.', 'No rascarse. Nunca.', 'Sol directo recién al mes, con filtro 50.'] },
      { t: 'p', c: 'Eso es todo. Sin rituales. Sin productos especiales de tattooshop a $8.000 el tubo.' },
    ],
    related: ['plantas-que-tatuo', 'cuaderno-de-bocetos'],
  },
  {
    slug: 'plantas-que-tatuo',
    title: 'Las plantas que más tatúo y por qué',
    subtitle: 'Un recorrido por el herbario del estudio y las historias detrás de cada motivo.',
    category: 'Botánica',
    date: '5 abr 2026',
    reading: '6 min',
    body: [
      { t: 'p', c: 'El jazmín del país me lo pidió alguien que estaba atravesando un duelo. La madreselva, una chica que terminó una relación larga. El helecho, alguien que acababa de mudarse sola por primera vez.' },
      { t: 'p', c: 'Las plantas que la gente elige para tatuar no son decoración. Son anclas.' },
      { t: 'h2', c: 'Helecho: constancia sin flores' },
      { t: 'p', c: 'El helecho es, por lejos, el motivo que más trabajo. No tiene flor, no tiene fruto. Solo hoja. Eso es exactamente lo que muchas personas buscan en un tatuaje: algo que no necesita llamar la atención para estar ahí.' },
      { t: 'h2', c: 'Jazmín del país: lo que vuelve siempre' },
      { t: 'p', c: 'El jazmín del país huele a Buenos Aires en diciembre. Es invasivo, trepa paredes ajenas, florece cuando no lo esperás. Mucha gente lo elige como metáfora de algo que regresa, de algo que creció aunque nadie lo cuidara.' },
      { t: 'h2', c: 'Rama de olivo: la que más transforma' },
      { t: 'p', c: 'El olivo en línea fina bien ejecutado es, para mí, el mejor tatuaje que existe. Cada hoja diferente, el tallo irregular. Se puede hacer pequeño en la clavícula o grande en la espalda y funciona igual.' },
    ],
    related: ['cicatrizar-despacio', 'ceramica-en-el-estudio'],
  },
  {
    slug: 'ceramica-en-el-estudio',
    title: 'Cerámica en el estudio: notas de proceso',
    subtitle: 'Por qué empecé a tornear y cómo cambió mi relación con el tiempo.',
    category: 'Cerámica',
    date: '20 mar 2026',
    reading: '4 min',
    body: [
      { t: 'p', c: 'Empecé a tornear en pandemia, como todo el mundo. Pero a diferencia de mucha gente, no lo dejé cuando volvió la vida. Pasó algo raro: la cerámica me enseñó a tatuar mejor.' },
      { t: 'p', c: 'Suena abstracto. Lo que quiero decir es esto: la arcilla no perdona la prisa. Si apretás de más, si querés que el cuenco suba más rápido de lo que la arcilla permite, se colapsa. Empieza de nuevo.' },
      { t: 'h2', c: 'Tiempo real vs. tiempo de pantalla' },
      { t: 'p', c: 'En la cerámica no existe el undo. No existe el zoom. Existe la mano sobre la arcilla y la arcilla empujando de vuelta.' },
      { t: 'p', c: 'En el tatuaje pasa algo parecido. La piel responde. Tiene su propio tempo. Después de dos años de tornear, mi mano sobre la piel cambió.' },
      { t: 'h2', c: 'Lo que hago ahora' },
      { t: 'p', c: 'Los lunes no tatúo. Tornear. Preparar engobes. Amasar. Ese es mi tiempo de no-producir que en realidad me hace producir mejor.' },
    ],
    related: ['plantas-que-tatuo', 'cuaderno-de-bocetos'],
  },
  {
    slug: 'cuaderno-de-bocetos',
    title: 'Qué hay en mi cuaderno de bocetos',
    subtitle: 'Una vuelta por las páginas de enero: referencias, manchas y preguntas sin respuesta.',
    category: 'Dibujo',
    date: '8 mar 2026',
    reading: '3 min',
    body: [
      { t: 'p', c: 'Tengo un cuaderno nuevo por mes, a veces menos. No soy ordenada con los cuadernos. No pego fechas, no uso tinta de colores diferentes para diferentes días. Lo que hay adentro es una mezcla: bocetos de tatuajes, apuntes de plantas, manchas de café, frases copiadas de libros, listas de compras.' },
      { t: 'h2', c: 'El boceto que se convierte en tatuaje' },
      { t: 'p', c: 'De cada cuaderno, un porcentaje pequeño de bocetos llega a ser tatuaje. La mayoría son exploraciones. Pruebo una forma de hacer una hoja, la abandono, vuelvo tres semanas después con otra idea.' },
      { t: 'p', c: 'El boceto que se convierte en tatuaje generalmente no es el más elaborado. Es el más honesto.' },
      { t: 'h2', c: 'Enero: lo que había' },
      { t: 'ul', c: ['Estudios de musgo en tinta seca.', 'Una serie de anémonas muy pequeñas, casi microscópicas.', 'Intentos fallidos de dibujar manos.', 'La misma rama de roble cinco veces, cada vez más simple.', 'Un mandala que empecé y no terminé.'] },
    ],
    related: ['plantas-que-tatuo', 'cicatrizar-despacio'],
  },
  {
    slug: 'tintes-naturales',
    title: 'Primeras pruebas con tintes naturales',
    subtitle: 'Cebolla, yerba, cúrcuma y lo que aprendí tiñendo lana en el patio.',
    category: 'Textiles',
    date: '22 feb 2026',
    reading: '7 min',
    body: [
      { t: 'p', c: 'La primera vez que teñí lana con cáscaras de cebolla me quedé mirando el resultado unos diez minutos sin decir nada. Era un amarillo que yo no hubiera podido mezclar nunca en pintura.' },
      { t: 'p', c: 'Ese color existe porque existió esa cebolla, en ese momento, con esa agua.' },
      { t: 'h2', c: 'El proceso básico' },
      { t: 'ul', c: ['Mordiente (alumbre) la noche anterior para fijar el color.', 'Baño de tinte: material vegetal en agua fría, llevar a hervor lento.', 'Colar y agregar la lana húmeda.', 'Una hora suave, sin hervir fuerte.', 'Enjuagar en agua de la misma temperatura para no enfieltar.'] },
      { t: 'h2', c: 'Los colores que encontré' },
      { t: 'p', c: 'Cebolla amarilla: ocres brillantes. Cebolla morada: tonos grisáceos curiosos. Yerba mate usada: beige cálido muy estable. Cúrcuma: amarillo intenso (pero fugaz, se va con el sol). Nogal: marrones profundos, los más estables de todos.' },
    ],
    related: ['ceramica-en-el-estudio', 'cuaderno-de-bocetos'],
  },
  {
    slug: 'sobre-los-encargos',
    title: 'Sobre los encargos y decir que no',
    subtitle: 'Por qué rechazo algunos proyectos y qué aprendí sobre mis propios límites.',
    category: 'Estudio',
    date: '10 feb 2026',
    reading: '5 min',
    body: [
      { t: 'p', c: 'Hay una pregunta que me hacen mucho en talleres: ¿cómo aprendiste a decir que no? La respuesta honesta es que no aprendí. Todavía me cuesta. Pero aprendí a reconocer las señales.' },
      { t: 'h2', c: 'Las señales de que algo no va a funcionar' },
      { t: 'ul', c: ['La persona quiere exactamente el tatuaje que vio en Pinterest, sin margen.', 'El primer mensaje empieza con el presupuesto.', 'La historia detrás de la pieza cambia en cada conversación.', 'Me piden algo que no va con mi línea y presionan cuando lo digo.'] },
      { t: 'h2', c: 'Lo que perdés y lo que ganás' },
      { t: 'p', c: 'Decir que no a un encargo siempre tiene un costo. Económico, sí, pero también emocional. Hay culpa, hay duda.' },
      { t: 'p', c: 'Lo que gané es tiempo y energía para los proyectos que sí me importan. Y, raramente, la persona agradece la honestidad y vuelve después con otra idea.' },
    ],
    related: ['cuaderno-de-bocetos', 'cicatrizar-despacio'],
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/blog-posts.ts
git commit -m "feat(blog): add typed BlogPost data with slug routing"
```

---

### Task 2: Refactor hooks

**Files:**
- Modify: `src/hooks/useBlogLogic.ts`
- Modify: `src/hooks/useBlogPostLogic.ts`

- [ ] **Step 1: Reescribir `useBlogLogic.ts`**

```typescript
// src/hooks/useBlogLogic.ts
import { useState } from 'react'
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from '@/data/blog-posts'

export { BLOG_CATEGORIES }
export type { BlogPost }

export const useBlogLogic = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')

  const filtered =
    activeCategory === 'Todos'
      ? BLOG_POSTS
      : BLOG_POSTS.filter(p => p.category === activeCategory)

  const [featured = null, ...rest] = filtered

  return { featured, rest, activeCategory, setActiveCategory }
}
```

- [ ] **Step 2: Reescribir `useBlogPostLogic.ts`**

```typescript
// src/hooks/useBlogPostLogic.ts
import { useMemo } from 'react'
import { BLOG_POSTS, type BlogPost } from '@/data/blog-posts'

export const useBlogPostLogic = (slug: string | undefined) => {
  const post = useMemo(
    () => (slug ? BLOG_POSTS.find(p => p.slug === slug) ?? null : null),
    [slug]
  )

  const related = useMemo<BlogPost[]>(
    () =>
      (post?.related ?? [])
        .map(s => BLOG_POSTS.find(p => p.slug === s))
        .filter((p): p is BlogPost => Boolean(p)),
    [post]
  )

  return { post, related }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useBlogLogic.ts src/hooks/useBlogPostLogic.ts
git commit -m "feat(blog): refactor hooks to sync slug-based lookup, no fake delay"
```

---

### Task 3: Componentes blog — `BlogPlaceholder` + `BlogCard`

**Files:**
- Create: `src/components/blog/BlogPlaceholder.tsx`
- Create: `src/components/blog/BlogCard.tsx`
- Modify: `src/components/blog/index.ts`
- Modify: `src/components/shared/index.ts` (agregar NHFlower)

- [ ] **Step 1: Crear `BlogPlaceholder.tsx`**

```tsx
// src/components/blog/BlogPlaceholder.tsx
import React from 'react'

interface BlogPlaceholderProps {
  aspect?: '4/5' | '16/9'
  label?: string
  className?: string
  style?: React.CSSProperties
}

const BlogPlaceholder: React.FC<BlogPlaceholderProps> = ({
  aspect = '4/5',
  label,
  className = '',
  style,
}) => (
  <div
    className={`relative w-full overflow-hidden bg-cream-200 ${className}`}
    style={{ aspectRatio: aspect === '4/5' ? '4/5' : '16/9', ...style }}
    aria-hidden="true"
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(74,124,89,0.07) 12px, rgba(74,124,89,0.07) 24px)',
      }}
    />
    {label && (
      <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </span>
    )}
  </div>
)

export default BlogPlaceholder
```

- [ ] **Step 2: Crear `BlogCard.tsx`**

```tsx
// src/components/blog/BlogCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '@/data/blog-posts'
import BlogPlaceholder from './BlogPlaceholder'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group block text-inherit no-underline"
    aria-label={`Leer: ${post.title}`}
  >
    <div
      className="overflow-hidden rounded-card"
      style={{ boxShadow: '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)' }}
    >
      <div className="overflow-hidden transition-transform duration-500 group-hover:scale-105">
        <BlogPlaceholder aspect="4/5" label={`${post.category} · ${post.date}`} />
      </div>
    </div>

    <div className="pt-4 pb-1 px-0.5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-700">
          {post.category}
        </span>
        <span className="font-mono text-[10px] text-ink-soft tracking-[0.1em]">
          {post.reading}
        </span>
      </div>

      <h3 className="font-display font-normal text-[22px] leading-[1.15] tracking-[-0.01em] text-ink mb-2 group-hover:text-sage-700 transition-colors duration-200">
        {post.title}
      </h3>

      <p className="text-[13px] text-ink-soft leading-[1.6]">{post.subtitle}</p>

      <div className="font-mono text-[10px] text-taupe-700 mt-2.5 tracking-[0.1em] uppercase">
        {post.date}
      </div>
    </div>
  </Link>
)

export default BlogCard
```

- [ ] **Step 3: Actualizar `src/components/blog/index.ts`**

```typescript
// src/components/blog/index.ts
export { default as BlogCard } from './BlogCard'
export { default as BlogPlaceholder } from './BlogPlaceholder'
export type { BlogPost } from '@/data/blog-posts'
```

- [ ] **Step 4: Agregar NHFlower al barrel `src/components/shared/index.ts`**

Añadir al final del archivo:

```typescript
export { default as NHFlower } from './NHFlower';
```

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/BlogPlaceholder.tsx src/components/blog/BlogCard.tsx src/components/blog/index.ts src/components/shared/index.ts
git commit -m "feat(blog): add BlogCard, BlogPlaceholder components; export NHFlower"
```

---

### Task 4: Reescribir `src/pages/Blog.tsx`

**Files:**
- Modify: `src/pages/Blog.tsx`

- [ ] **Step 1: Reescribir Blog.tsx**

```tsx
// src/pages/Blog.tsx
import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout, NHLeafMark, NHDivider, SchemaMarkup } from '@/components/shared'
import BlogCard from '@/components/blog/BlogCard'
import BlogPlaceholder from '@/components/blog/BlogPlaceholder'
import { useBlogLogic, BLOG_CATEGORIES } from '@/hooks/useBlogLogic'
import { gsap, ScrollTrigger, shouldAnimate } from '@/lib/gsap'

const Blog: React.FC = () => {
  const { featured, rest, activeCategory, setActiveCategory } = useBlogLogic()
  const headerRef = useRef<HTMLElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldAnimate() || !headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.blog-eyebrow', '.blog-h1', '.blog-subtitle'],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out', delay: 0.1 }
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!shouldAnimate() || !featuredRef.current || !featured) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: featuredRef.current, start: 'top 82%' },
        }
      )
    })
    return () => ctx.revert()
  }, [featured])

  useEffect(() => {
    if (!shouldAnimate() || !gridRef.current || rest.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-card-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 86%' },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [activeCategory, rest.length])

  const collectionSchema = {
    name: 'Diario del estudio — Natalia Heller',
    description: 'Notas sobre proceso, plantas y oficio. Escritas una vez al mes desde el taller.',
    url: 'https://tatuajesnaty.com/blog',
  }

  return (
    <Layout>
      <SchemaMarkup type="CollectionPage" data={collectionSchema} />

      {/* Header */}
      <header ref={headerRef} className="relative px-[22px] md:px-12 pt-7 md:pt-[60px] pb-8 md:pb-12">
        <div
          className="absolute top-5 md:top-11 right-[22px] md:right-12 text-sage-500 pointer-events-none"
          aria-hidden="true"
        >
          <NHLeafMark size={40} className="md:hidden" />
          <NHLeafMark size={56} className="hidden md:block" />
        </div>

        <p className="blog-eyebrow font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 mb-3.5">
          Diario del estudio
        </p>
        <h1 className="blog-h1 font-display font-normal text-[38px] md:text-[72px] leading-[1.02] tracking-[-0.02em] text-ink max-w-[800px] m-0">
          Notas sobre proceso, plantas y oficio.
        </h1>
        <p className="blog-subtitle text-[15px] md:text-[17px] text-ink-soft mt-4 max-w-[540px] leading-[1.65]">
          Una vez al mes escribo sobre lo que estoy aprendiendo. Sin agenda,
          sin newsletter de lunes. Sólo notas del taller.
        </p>
      </header>

      {/* Filter bar */}
      <div
        className="sticky z-10 bg-cream-100/95 backdrop-blur-md border-b border-cream-300 px-[22px] md:px-12 py-2.5"
        style={{ top: '57px' }}
      >
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                'flex-shrink-0 px-3 py-1.5 rounded-pill border font-mono text-[12px] tracking-[0.08em] transition-colors duration-200 cursor-pointer',
                activeCategory === cat
                  ? 'bg-sage-700 border-sage-700 text-cream-50'
                  : 'bg-transparent border-sage-400 text-sage-700 hover:border-sage-700',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="px-[22px] md:px-12">
        {/* Empty state */}
        {!featured && (
          <div className="py-20 text-center">
            <p className="font-display italic text-[22px] text-ink-soft">Nada por acá todavía</p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <div ref={featuredRef} className="mt-8 md:mt-14 mb-10 md:mb-[72px]">
            <Link to={`/blog/${featured.slug}`} className="group block no-underline text-inherit">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 items-center">
                <div className="overflow-hidden rounded-card">
                  <div className="overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    <BlogPlaceholder aspect="4/5" label={`${featured.category} · ${featured.date}`} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="px-2.5 py-1 rounded-pill border border-sage-700 text-sage-700 font-mono text-[11px] tracking-[0.08em] pointer-events-none">
                      {featured.category}
                    </span>
                    <span className="font-mono text-[10px] text-ink-soft tracking-[0.12em]">
                      {featured.date} · {featured.reading} lectura
                    </span>
                  </div>

                  <h2 className="font-display font-normal text-[28px] md:text-[48px] leading-[1.08] tracking-[-0.02em] text-ink m-0 mb-4">
                    {featured.title}
                  </h2>

                  <p className="text-[15px] md:text-[17px] text-ink-soft leading-[1.65] max-w-[480px]">
                    {featured.subtitle}
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 border-b border-sage-700 pb-0.5">
                    Leer nota →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* More posts */}
        {rest.length > 0 && (
          <>
            <NHDivider label="más notas" className="my-8 md:my-[52px]" />
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 mb-20"
            >
              {rest.map(post => (
                <div key={post.slug} className="blog-card-item">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}

export default Blog
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Blog.tsx
git commit -m "feat(blog): redesign listing — filters, featured post, GSAP scroll animations"
```

---

### Task 5: Reescribir `src/pages/BlogPost.tsx`

**Files:**
- Modify: `src/pages/BlogPost.tsx`

- [ ] **Step 1: Reescribir BlogPost.tsx**

```tsx
// src/pages/BlogPost.tsx
import React, { useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout, NHLeafMark, NHDivider, SchemaMarkup } from '@/components/shared'
import NHFlower from '@/components/shared/NHFlower'
import BlogCard from '@/components/blog/BlogCard'
import BlogPlaceholder from '@/components/blog/BlogPlaceholder'
import { useBlogPostLogic } from '@/hooks/useBlogPostLogic'
import { type BodyBlock } from '@/data/blog-posts'
import { gsap, shouldAnimate } from '@/lib/gsap'

const BodyRenderer: React.FC<{ blocks: BodyBlock[] }> = ({ blocks }) => (
  <>
    {blocks.map((block, i) => {
      if (block.t === 'p')
        return (
          <p key={i} className="body-block text-[16px] md:text-[18px] leading-[1.75] text-ink mb-[22px]">
            {block.c}
          </p>
        )
      if (block.t === 'h2')
        return (
          <h2
            key={i}
            className="body-block font-display font-normal text-[24px] md:text-[32px] leading-[1.15] tracking-[-0.01em] text-ink mt-12 mb-[18px]"
          >
            {block.c}
          </h2>
        )
      if (block.t === 'ul')
        return (
          <ul key={i} className="body-block list-none m-0 p-0 mb-6">
            {block.c.map((item, j) => (
              <li
                key={j}
                className="flex gap-3.5 py-2.5 border-b border-cream-200 text-[15px] md:text-[17px] leading-[1.6] text-ink"
              >
                <span className="text-sage-500 flex-shrink-0 mt-1" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="5" cy="5" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        )
      return null
    })}
  </>
)

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { post, related } = useBlogPostLogic(slug)
  const heroRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!shouldAnimate() || !heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.post-meta', '.post-h1', '.post-lead'],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', delay: 0.05 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [slug])

  useEffect(() => {
    if (!shouldAnimate() || !bodyRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.body-block',
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power1.out',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 80%' },
        }
      )
    }, bodyRef)
    return () => ctx.revert()
  }, [slug])

  if (!post) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-[22px] md:px-12">
          <div className="text-center max-w-md">
            <p className="font-display font-normal text-[68px] leading-[1] tracking-[-0.02em] text-sage-200 mb-4">
              404
            </p>
            <h1 className="font-display font-normal text-[28px] text-ink mb-4">
              Nota no encontrada
            </h1>
            <p className="text-[15px] text-ink-soft mb-8">
              La nota que buscás no existe o fue movida.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-700 border-b border-sage-700 pb-0.5 no-underline"
            >
              ← volver al diario
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const articleSchema = {
    headline: post.title,
    description: post.subtitle,
    datePublished: post.date,
    dateModified: post.date,
    author: [{ '@type': 'Person', name: 'Natalia Heller', url: 'https://tatuajesnaty.com/sobre-mi' }],
    publisher: {
      '@type': 'Organization',
      name: 'Natalia Heller Tattoo Studio',
      logo: { '@type': 'ImageObject', url: 'https://tatuajesnaty.com/logo.png' },
    },
  }

  return (
    <Layout>
      <SchemaMarkup type="Article" data={articleSchema} />

      {/* Breadcrumb */}
      <nav
        className="px-[22px] md:px-12 pt-[18px] font-mono text-[11px] text-ink-soft tracking-[0.08em]"
        aria-label="Migas de pan"
      >
        <Link to="/blog" className="text-inherit no-underline hover:text-sage-700 transition-colors">
          diario
        </Link>
        {' / '}
        <span className="text-sage-700">{post.slug}</span>
      </nav>

      {/* Hero */}
      <div ref={heroRef} className="px-[22px] md:px-12 pt-[22px] md:pt-9">
        <div className="max-w-[760px]">
          <div className="post-meta flex items-center gap-2.5 mb-5">
            <span className="px-2.5 py-1 rounded-pill border border-sage-700 text-sage-700 font-mono text-[11px] tracking-[0.08em] pointer-events-none">
              {post.category}
            </span>
            <time
              dateTime={post.date}
              className="font-mono text-[10px] text-ink-soft tracking-[0.12em]"
            >
              {post.date} · {post.reading} lectura
            </time>
          </div>

          <h1 className="post-h1 font-display font-normal text-[36px] md:text-[68px] leading-[1.04] tracking-[-0.02em] text-ink m-0">
            {post.title}
          </h1>

          <p className="post-lead font-display italic text-[18px] md:text-[22px] text-ink-soft mt-[18px] leading-[1.5] max-w-[600px]">
            {post.subtitle}
          </p>
        </div>
      </div>

      {/* Cover image */}
      <div className="px-[22px] md:px-12 mt-6 max-w-[860px]">
        <BlogPlaceholder
          aspect="16/9"
          label={`Imagen · ${post.title}`}
          className="rounded-card"
          style={{ boxShadow: '0 12px 40px rgba(74,124,89,0.08)' }}
        />
      </div>

      {/* Article body */}
      <article
        ref={bodyRef}
        className="px-[22px] md:px-12 pt-11 md:pt-16 pb-5 max-w-[720px]"
      >
        {/* Author strip */}
        <div className="flex items-center gap-3.5 py-[18px] border-b border-cream-300 mb-10">
          <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center flex-shrink-0">
            <NHLeafMark size={22} color="#fdfcfb" />
          </div>
          <div>
            <div className="font-display text-[15px] font-medium text-ink leading-tight">
              Natalia Heller
            </div>
            <div className="font-mono text-[10px] text-ink-soft tracking-[0.1em] uppercase mt-0.5">
              Villa Crespo · {post.date}
            </div>
          </div>
        </div>

        {/* Body blocks */}
        <BodyRenderer blocks={post.body} />

        {/* Signature */}
        <div className="mt-14 pt-8 border-t border-cream-300 flex items-center gap-3.5">
          <span className="text-sage-500" aria-hidden="true">
            <NHFlower size={32} />
          </span>
          <p className="font-display italic text-[14px] text-ink-soft m-0">
            Natalia Heller — escrito desde el estudio, Villa Crespo.
          </p>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="px-[22px] md:px-12 pt-[60px] md:pt-[100px] pb-10 md:pb-[60px]">
          <NHDivider label="seguir leyendo" className="mb-9" />
          <div
            className={`grid gap-6 md:gap-9 mt-9 ${
              related.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {related.map(p => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}

export default BlogPost
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "feat(blog): redesign single post — body renderer, GSAP, SEO semantics"
```

---

### Task 6: Agregar Google Fonts al `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Agregar stylesheet de Fraunces + Nunito + JetBrains Mono**

Insertar antes del cierre de `</head>`, después de los preconnects existentes:

```html
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Nunito:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "chore: load Fraunces, Nunito, JetBrains Mono from Google Fonts"
```

---

### Task 7: Verificación TypeScript + visual

- [ ] **Step 1: Verificar TypeScript sin errores**

```bash
npx tsc --noEmit
```

Esperado: sin errores. Si aparecen, corregir en los archivos afectados.

- [ ] **Step 2: Arrancar dev server y verificar `/blog`**

```bash
npm run dev
```

Navegar a `http://localhost:5173/blog`. Verificar:
- Header: eyebrow mono + H1 Fraunces grande + subtítulo
- Pills de filtro con estado activo (fondo sage-700)
- Featured post en 2 columnas desktop / apilado mobile
- "Leer nota →" con underline sage
- NHDivider botánico
- Grid 3-col con cards
- Animaciones GSAP al hacer scroll

- [ ] **Step 3: Verificar `/blog/cicatrizar-despacio`**

Navegar a `http://localhost:5173/blog/cicatrizar-despacio`. Verificar:
- Breadcrumb `diario / cicatrizar-despacio`
- H1 Fraunces 68px desktop
- Lead serif itálico
- Cover placeholder 16:9 con shadow
- Author strip con avatar sage + leaf blanco
- Párrafos 18px, h2 32px, listas con viñeta doble-círculo sage
- Firma con NHFlower
- Posts relacionados al final

- [ ] **Step 4: Verificar 404 — slug inválido**

Navegar a `http://localhost:5173/blog/no-existe`. Verificar que muestra la pantalla 404 con el link "← volver al diario".

---

## Self-Review

**Cobertura del spec:**
- ✅ Eyebrow + H1 72px/38px + subtítulo + NHLeafMark → Task 4
- ✅ Filter bar sticky (Todos · Estudio · Botánica · Cerámica · Dibujo · Textiles) → Task 4
- ✅ Featured post 2-col (imagen + H2 48px + meta + "Leer nota →") → Task 4
- ✅ NHDivider "más notas" → Task 4
- ✅ Grid 3-col desktop / 1-col mobile → Task 4
- ✅ Empty state → Task 4
- ✅ Breadcrumb mono `diario / slug` → Task 5
- ✅ Hero max-w-760: pill + meta + H1 68px + lead serif italic → Task 5
- ✅ Cover 16:9 con shadow → Task 5
- ✅ Body max-w-720: author strip + bloques p/h2/ul → Task 5
- ✅ Viñeta doble-círculo SVG sage-500 → Task 5
- ✅ Firma NHFlower → Task 5
- ✅ Related posts grid → Task 5
- ✅ Schema.org Article + CollectionPage → Tasks 4 & 5
- ✅ `<time dateTime>` → Task 5
- ✅ `<article>` semántico → Task 5
- ✅ GSAP con `shouldAnimate()` guard → Tasks 4 & 5
- ✅ Slug-based routing → Tasks 1, 2, 3
- ✅ Google Fonts → Task 6
- ✅ NHFlower en shared/index.ts → Task 3

**Type consistency:**
- `BlogPost` y `BodyBlock` definidos en Task 1, usados correctamente en Tasks 2, 3, 4, 5
- `useBlogLogic` devuelve `{ featured, rest, activeCategory, setActiveCategory }` — usado en Task 4
- `useBlogPostLogic` devuelve `{ post, related }` — usado en Task 5
- `BlogCard` recibe `post: BlogPost` — correcto en Tasks 3 & 5

**Placeholder scan:** Sin TBDs, TODOs ni secciones incompletas.
```

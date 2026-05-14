# Blog Empty States — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar tres estados faltantes en `/blog`: skeleton de carga, vacío global (sin posts) y vacío filtrado (sin posts en categoría).

**Architecture:** Dos componentes nuevos (`BlogSkeleton`, `BlogEmptyState`) que reutilizan primitivos del design system existente. `Blog.tsx` consume `loading` del hook y elige qué renderizar según el estado.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 3.4, Vite 7. Sin framework de tests — verificación visual en dev server.

---

## File Map

| Acción | Archivo | Responsabilidad |
|---|---|---|
| Crear | `src/components/blog/BlogSkeleton.tsx` | Skeleton pulsante que imita el layout featured + grid |
| Crear | `src/components/blog/BlogEmptyState.tsx` | Estado vacío global y filtrado |
| Modificar | `src/pages/Blog.tsx` | Consumir `loading`, elegir entre skeleton / empty / normal |

---

## Task 1: `BlogSkeleton`

**Files:**
- Create: `src/components/blog/BlogSkeleton.tsx`

- [ ] **Step 1: Crear el componente**

```tsx
import React from 'react'
import BlogPlaceholder from './BlogPlaceholder'
import { NHDivider } from '@/components/shared'

const BlogSkeleton: React.FC = () => (
  <>
    <section className="mt-8 md:mt-10 mb-10 md:mb-14 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-stretch">

        {/* Imagen featured */}
        <div className="animate-pulse rounded-card overflow-hidden bg-cream-200 h-[240px] md:h-full min-h-[320px]" />

        {/* Texto featured */}
        <div className="py-4 md:py-12 flex flex-col gap-4 animate-pulse">
          <div className="h-5 w-32 bg-cream-200 rounded" />
          <div className="space-y-3">
            <div className="h-8 w-full bg-cream-200 rounded" />
            <div className="h-8 w-4/5 bg-cream-200 rounded" />
            <div className="h-8 w-3/5 bg-cream-200 rounded" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-4 w-full bg-cream-200 rounded" />
            <div className="h-4 w-3/4 bg-cream-200 rounded" />
          </div>
          <div className="h-4 w-28 bg-cream-200 rounded mt-3" />
        </div>
      </div>
    </section>

    <NHDivider label="mas notas" className="my-8 md:my-[52px]" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 mb-20 max-w-7xl mx-auto">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse">
          <BlogPlaceholder aspect="4/5" className="rounded-card" />
          <div className="pt-4 pb-1 px-0.5 space-y-2.5">
            <div className="h-3 w-24 bg-cream-200 rounded" />
            <div className="h-5 w-full bg-cream-200 rounded" />
            <div className="h-5 w-3/4 bg-cream-200 rounded" />
            <div className="h-3 w-16 bg-cream-200 rounded mt-1" />
          </div>
        </div>
      ))}
    </div>
  </>
)

export default BlogSkeleton
```

- [ ] **Step 2: Verificar en dev server**

Arrancar dev server si no está corriendo:
```bash
npm run dev
```

Abrir `/blog` en el browser. Temporalmente forzar `loading = true` en `useBlogLogic.ts` cambiando `setLoading(false)` por no llamarlo — verificar que el layout skeleton aparece con barras pulsantes alineadas al layout real. Revertir el cambio luego.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/BlogSkeleton.tsx
git commit -m "feat: add BlogSkeleton component with pulse animation"
```

---

## Task 2: `BlogEmptyState`

**Files:**
- Create: `src/components/blog/BlogEmptyState.tsx`

- [ ] **Step 1: Crear el componente**

```tsx
import React from 'react'
import { NHLeafMark, HeroEyebrow, ButtonGhost } from '@/components/shared'

interface BlogEmptyStateProps {
  variant: 'global' | 'filtered'
  onReset?: () => void
}

const BlogEmptyState: React.FC<BlogEmptyStateProps> = ({ variant, onReset }) => {
  if (variant === 'global') {
    return (
      <section className="flex flex-col items-center text-center py-24 md:py-32 max-w-7xl mx-auto px-6">
        <NHLeafMark size={32} className="text-sage-700 mb-6" />
        <HeroEyebrow className="mb-4">Próximamente</HeroEyebrow>
        <h2 className="font-display font-normal text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Las notas están en camino
        </h2>
        <p className="text-ink-soft text-[15px] leading-relaxed max-w-sm mb-8">
          Mientras tanto, seguime en Instagram donde comparto el proceso creativo día a día.
        </p>
        <ButtonGhost href="https://www.instagram.com/nat.tatt/" target="_blank">
          @nat.tatt
        </ButtonGhost>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center text-center py-16 md:py-20 max-w-7xl mx-auto px-6">
      <h2 className="font-display font-normal text-[22px] text-ink mb-6">
        Todavía no hay notas en esta categoría
      </h2>
      <ButtonGhost onClick={onReset}>Ver todas las notas</ButtonGhost>
    </section>
  )
}

export default BlogEmptyState
```

- [ ] **Step 2: Verificar variant="global" en dev server**

En `Blog.tsx` (temporalmente), forzar el estado global comentando el render normal y añadiendo:
```tsx
{/* TEMP */}
<BlogEmptyState variant="global" />
```
Verificar que se ve: ícono hoja, eyebrow "Próximamente", título, subtítulo, botón `@nat.tatt`.
Revertir el cambio luego.

- [ ] **Step 3: Verificar variant="filtered" en dev server**

En `Blog.tsx` (temporalmente):
```tsx
{/* TEMP */}
<BlogEmptyState variant="filtered" onReset={() => console.log('reset')} />
```
Verificar que se ve: título y botón "Ver todas las notas". Revertir.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/BlogEmptyState.tsx
git commit -m "feat: add BlogEmptyState component with global and filtered variants"
```

---

## Task 3: Integración en `Blog.tsx`

**Files:**
- Modify: `src/pages/Blog.tsx`

- [ ] **Step 1: Importar los dos componentes nuevos**

En `src/pages/Blog.tsx`, añadir las dos importaciones junto a las existentes de blog:

```tsx
import BlogSkeleton from '@/components/blog/BlogSkeleton'
import BlogEmptyState from '@/components/blog/BlogEmptyState'
```

- [ ] **Step 2: Desestructurar `loading` del hook**

Localizar la línea (actualmente línea 11):
```tsx
const { featured, rest, allPosts, activeCategory, setActiveCategory } = useBlogLogic()
```

Reemplazar por:
```tsx
const { featured, rest, allPosts, activeCategory, setActiveCategory, loading } = useBlogLogic()
```

- [ ] **Step 3: Reemplazar el bloque de render de posts**

Localizar el bloque actual (líneas 106-107):
```tsx
{featured && <BlogFeaturedPost post={featured} containerRef={featuredRef} />}
<BlogPostsGrid posts={rest} containerRef={gridRef} />
```

Reemplazar por:
```tsx
{loading && <BlogSkeleton />}

{!loading && allPosts.length === 0 && (
  <BlogEmptyState variant="global" />
)}

{!loading && allPosts.length > 0 && !featured && rest.length === 0 && (
  <BlogEmptyState variant="filtered" onReset={() => setActiveCategory('Todos')} />
)}

{!loading && featured && (
  <BlogFeaturedPost post={featured} containerRef={featuredRef} />
)}
{!loading && rest.length > 0 && (
  <BlogPostsGrid posts={rest} containerRef={gridRef} />
)}
```

- [ ] **Step 4: Verificar los tres estados en dev server**

**Estado loading:** En `src/hooks/useBlogLogic.ts`, comentar temporalmente `setLoading(false)` dentro del `.then()`:
```ts
.then(({ data }) => {
  if (data) setAllPosts(data.map(rowToPost))
  // setLoading(false)  // TEMP: forzar loading
})
```
Abrir `/blog` → debe verse el skeleton. Revertir.

**Estado global vacío:** Comentar temporalmente el `setAllPosts(...)`:
```ts
.then(({ data }) => {
  // if (data) setAllPosts(data.map(rowToPost))  // TEMP
  setLoading(false)
})
```
Abrir `/blog` → debe verse el empty state global. Revertir.

**Estado filtrado vacío:** Seleccionar una categoría sin posts en el FilterBar real (si existe). Si no, verificar que el botón "Ver todas las notas" dispara el reset. Revertir cualquier cambio temporal.

- [ ] **Step 5: Commit final**

```bash
git add src/pages/Blog.tsx
git commit -m "feat: integrate blog loading, global empty, and filtered empty states"
```

---

## Verificación final

- [ ] Abrir `/blog` en dev server y confirmar que el estado normal (con posts) no regresó
- [ ] Navegar entre categorías del FilterBar — si una categoría tiene posts, se ven; si no, aparece el filtrado empty state con botón funcional
- [ ] Confirmar que las animaciones GSAP de entrada (featured + cards) siguen funcionando en el estado normal

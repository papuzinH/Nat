# Blog Empty States — Design Spec

**Fecha:** 2026-05-14  
**Proyecto:** NatArt (Natalia Heller)  
**Alcance:** `/blog` — tres estados faltantes: carga, sin posts globales, sin posts en categoría

---

## Contexto

`useBlogLogic` obtiene posts desde Supabase y ya expone `loading: boolean`, pero `Blog.tsx` no lo consume. Cuando no hay posts (cargando o vacío), la página queda en blanco entre el `FilterBar` y el footer. Este spec cubre los tres estados de UI necesarios.

---

## Componentes a crear

### 1. `BlogSkeleton`

**Archivo:** `src/components/blog/BlogSkeleton.tsx`

Imita el layout real del blog con barras pulsantes. Sin texto, sin íconos.

**Estructura:**
- **Featured skeleton** — grid 2 columnas (`md:grid-cols-2`):
  - Izquierda: `<BlogPlaceholder aspect="16/9" />` con `animate-pulse`
  - Derecha: 4 barras `bg-cream-200 rounded animate-pulse` de distintos anchos/alturas simulando categoría, título (2 líneas), subtítulo
- **Separador:** `<NHDivider label="mas notas" />` idéntico al real
- **Grid skeleton** — 3 columnas (`md:grid-cols-3`), cada card:
  - `<BlogPlaceholder aspect="4/5" />` con `animate-pulse`
  - 3 barras de texto debajo (categoría, título, fecha)

**Márgenes:** `max-w-7xl mx-auto`, mismos gaps que el layout real.

**Reúso:** `BlogPlaceholder` (existente), `NHDivider` (existente).

---

### 2. `BlogEmptyState`

**Archivo:** `src/components/blog/BlogEmptyState.tsx`

```tsx
interface BlogEmptyStateProps {
  variant: 'global' | 'filtered'
  onReset?: () => void
}
```

#### `variant="global"` — Sin posts publicados

Centrado, respiro vertical generoso (`py-24 md:py-32`).

- **Ícono decorativo:** `<NHLeafMark size={32} className="text-sage-700 mb-6" />`
- **Eyebrow:** `<HeroEyebrow>` con texto `"Próximamente"` — `font-mono uppercase tracking-widest text-sage-700`
- **Título:** `"Las notas están en camino"` — `font-display text-[28px] md:text-[40px] text-ink`
- **Subtítulo:** `"Mientras tanto, seguime en Instagram donde comparto el proceso creativo día a día."` — `text-ink-soft text-[15px] leading-relaxed max-w-sm`
- **CTA:** `<ButtonGhost href="https://instagram.com/nat.tatt" target="_blank">@nat.tatt</ButtonGhost>`

#### `variant="filtered"` — Sin posts en la categoría seleccionada

Más liviano (`py-16 md:py-20`), centrado.

- **Texto:** `"Todavía no hay notas en esta categoría"` — `font-display text-[22px] text-ink`
- **Botón:** `<ButtonGhost onClick={onReset}>Ver todas las notas</ButtonGhost>`

**Reúso:** `NHLeafMark`, `HeroEyebrow`, `ButtonGhost` (todos existentes).

---

## Integración en `Blog.tsx`

`useBlogLogic` ya retorna `loading`. Se desestructura y se usa para condicionar el render.

### Lógica de estados

```
loading === true
  → <BlogSkeleton />

!loading && allPosts.length === 0
  → <BlogEmptyState variant="global" />

!loading && allPosts.length > 0 && !featured && rest.length === 0
  → <BlogEmptyState variant="filtered" onReset={() => setActiveCategory('Todos')} />

caso normal
  → <BlogFeaturedPost /> + <BlogPostsGrid />
```

### Comportamiento del `FilterBar`

Permanece visible en todos los estados. En el estado `global` el filtro no tiene efecto práctico, pero ocultarlo generaría un salto visual innecesario.

### Animaciones GSAP

Sin cambios. Los efectos de entrada existentes (`featuredRef`, `gridRef`) solo corren cuando hay posts reales, por lo que no interfieren.

---

## Componentes reutilizados del proyecto

| Componente | Usado en |
|---|---|
| `BlogPlaceholder` | `BlogSkeleton` — imágenes skeleton |
| `NHDivider` | `BlogSkeleton` — separador "mas notas" |
| `NHLeafMark` | `BlogEmptyState` global — ícono decorativo |
| `HeroEyebrow` | `BlogEmptyState` global — eyebrow "Próximamente" |
| `ButtonGhost` | `BlogEmptyState` — CTA Instagram y "Ver todas" |

---

## Archivos modificados

| Archivo | Acción |
|---|---|
| `src/components/blog/BlogSkeleton.tsx` | Crear |
| `src/components/blog/BlogEmptyState.tsx` | Crear |
| `src/pages/Blog.tsx` | Modificar — consumir `loading`, renderizar estados |

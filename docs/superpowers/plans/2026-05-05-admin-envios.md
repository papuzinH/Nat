# Admin Envíos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separar la gestión de envíos en su propia página `/admin/envios`, corregir el bug de input numérico con cero, y fixear la política RLS de Supabase que causa el 403 en escrituras de `shipping_zones`.

**Architecture:** Se crea `AdminEnvios.tsx` con todo lo relacionado a zonas de envío (movido desde `AdminStock.tsx`). Se limpia `AdminStock.tsx` para que solo maneje inventario de productos. La política RLS de `shipping_zones` se reemplaza por una que requiere sesión `authenticated`, alineada con el login de admin que ya existe.

**Tech Stack:** React 19, TypeScript, Supabase (schema `nat_ecommerce`), React Router v7, Tailwind CSS.

---

## File Map

| Acción | Archivo |
|--------|---------|
| **Crear** | `supabase/migrations/20260505_fix_shipping_zones_rls.sql` |
| **Crear** | `src/pages/admin/AdminEnvios.tsx` |
| **Modificar** | `src/pages/admin/AdminStock.tsx` |
| **Modificar** | `src/pages/admin/AdminLayout.tsx` |
| **Modificar** | `src/App.tsx` |

---

### Task 1: Migración SQL — Fix RLS shipping_zones

**Files:**
- Create: `supabase/migrations/20260505_fix_shipping_zones_rls.sql`

La política actual `"Anon full access zones"` puede no estar resolviendo correctamente en el proyecto Supabase. La reemplazamos por una que requiere explícitamente rol `authenticated` — el admin siempre tiene sesión activa tras login.

- [ ] **Step 1: Crear el archivo de migración**

Crear `supabase/migrations/20260505_fix_shipping_zones_rls.sql` con este contenido exacto:

```sql
-- Fix: reemplaza política permisiva por una que requiere sesión autenticada.
-- El admin siempre está autenticado (login via supabase.auth), así que
-- INSERT/UPDATE/DELETE solo funcionan con sesión activa.

DROP POLICY IF EXISTS "Anon full access zones" ON nat_ecommerce.shipping_zones;

CREATE POLICY "Admin write zones"
  ON nat_ecommerce.shipping_zones
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

- [ ] **Step 2: Aplicar la migración en el dashboard de Supabase**

Ir a https://supabase.com/dashboard → proyecto `ujmbnpdsnwinjbhmfdjl` → SQL Editor → pegar y ejecutar el contenido del archivo SQL.

Resultado esperado: `Success. No rows returned`.

- [ ] **Step 3: Verificar en Table Editor**

Ir a Table Editor → `nat_ecommerce.shipping_zones` → Authentication → Policies. Debe verse:
- `"Public read active zones"` (FOR SELECT, USING true) — sin cambios
- `"Admin write zones"` (FOR ALL, TO authenticated) — nueva
- `"Anon full access zones"` — eliminada

- [ ] **Step 4: Commit**

```bash
rtk git add supabase/migrations/20260505_fix_shipping_zones_rls.sql && rtk git commit -m "fix: replace anon RLS policy with authenticated-only for shipping_zones writes"
```

---

### Task 2: Crear AdminEnvios.tsx

**Files:**
- Create: `src/pages/admin/AdminEnvios.tsx`

Mover la UI de zonas de envío desde `AdminStock.tsx`. Aplicar el fix del input numérico: los campos de precio usan `onFocus` con `e.target.select()` para seleccionar todo al hacer foco, evitando el bug de "02000".

- [ ] **Step 1: Crear AdminEnvios.tsx**

Crear `src/pages/admin/AdminEnvios.tsx` con este contenido:

```tsx
import React, { useState } from 'react'
import { useShippingZones, type ShippingZone } from '@/hooks/useShippingZones'

const AdminEnvios: React.FC = () => {
  const { zones, loading, addZone, updateZone, deleteZone } = useShippingZones()
  const [newZoneName,  setNewZoneName]  = useState('')
  const [newZonePrice, setNewZonePrice] = useState<number>(0)
  const [zoneAdding,   setZoneAdding]   = useState(false)
  const [zoneError,    setZoneError]    = useState<string | null>(null)
  const [editingZone,  setEditingZone]  = useState<Record<number, Partial<ShippingZone>>>({})

  if (loading) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        Cargando zonas…
      </p>
    )
  }

  return (
    <div>
      <h1 className="font-display text-[22px] text-ink font-normal mb-6">Envíos</h1>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mb-5">
        Zonas de envío (por barrio)
      </p>

      {zones.length > 0 && (
        <div
          className="rounded-sm overflow-hidden mb-6"
          style={{ border: '1px solid var(--line-soft)' }}
        >
          <div
            className="grid grid-cols-[1fr_120px_80px_60px] gap-3 px-4 py-2 bg-cream-100"
            style={{ borderBottom: '1px solid var(--line-soft)' }}
          >
            {['Barrio / Zona', 'Precio (ARS)', 'Activa', ''].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{h}</span>
            ))}
          </div>

          {zones.map((zone, i) => {
            const edit  = editingZone[zone.id] ?? {}
            const name  = edit.name  !== undefined ? edit.name  : zone.name
            const price = edit.price !== undefined ? edit.price : zone.price
            const isDirty = edit.name !== undefined || edit.price !== undefined || edit.active !== undefined

            return (
              <div
                key={zone.id}
                className="grid grid-cols-[1fr_120px_80px_60px] gap-3 items-center px-4 py-2.5 bg-cream-50 hover:bg-cream-100 transition-colors"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], name: e.target.value } }))
                  }
                  className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5"
                  style={{ borderColor: 'var(--line)' }}
                />
                <input
                  type="number"
                  min={0}
                  value={price}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], price: Number(e.target.value) } }))
                  }
                  className="font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5 text-center"
                  style={{ borderColor: 'var(--line)' }}
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id={`zone-active-${zone.id}`}
                    checked={edit.active !== undefined ? edit.active : zone.active}
                    onChange={(e) =>
                      setEditingZone((prev) => ({ ...prev, [zone.id]: { ...prev[zone.id], active: e.target.checked } }))
                    }
                    className="accent-sage-700 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`zone-active-${zone.id}`} className="font-mono text-[10px] text-ink-soft cursor-pointer">
                    {(edit.active !== undefined ? edit.active : zone.active) ? 'Sí' : 'No'}
                  </label>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={!isDirty}
                    onClick={async () => {
                      await updateZone(zone.id, {
                        name,
                        price,
                        active: edit.active !== undefined ? edit.active : zone.active,
                      })
                      setEditingZone((prev) => {
                        const n = { ...prev }
                        delete n[zone.id]
                        return n
                      })
                    }}
                    className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all disabled:opacity-30"
                    style={{
                      borderColor: isDirty ? 'var(--sage-700)' : 'var(--line)',
                      color:       isDirty ? 'var(--sage-700)' : 'var(--ink-soft)',
                    }}
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteZone(zone.id)}
                    className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-1 rounded-pill border transition-all hover:border-red-400 hover:text-red-400"
                    style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                    aria-label={`Eliminar zona ${zone.name}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Formulario agregar zona */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-4 items-end">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
            Barrio / Zona nueva
          </label>
          <input
            type="text"
            value={newZoneName}
            onChange={(e) => { setNewZoneName(e.target.value); setZoneError(null) }}
            placeholder="ej. Caballito, Parque Chacabuco…"
            className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
            style={{ borderColor: 'var(--line)' }}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft block mb-1">
            Precio (ARS)
          </label>
          <input
            type="number"
            min={0}
            value={newZonePrice}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setNewZonePrice(Number(e.target.value))}
            className="w-full font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-1"
            style={{ borderColor: 'var(--line)' }}
          />
        </div>
        <button
          type="button"
          disabled={zoneAdding || !newZoneName.trim()}
          onClick={async () => {
            if (!newZoneName.trim()) { setZoneError('Ingresá el nombre del barrio'); return }
            setZoneAdding(true)
            const ok = await addZone(newZoneName, newZonePrice)
            setZoneAdding(false)
            if (ok) { setNewZoneName(''); setNewZonePrice(0) }
            else setZoneError('No se pudo agregar la zona. Verificá que estés logueado.')
          }}
          className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-1.5 rounded-pill border transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--sage-700)', color: 'var(--sage-700)' }}
        >
          {zoneAdding ? '…' : '+ Agregar zona'}
        </button>
      </div>

      {zoneError && (
        <p className="font-body text-[12px] text-red-500 mt-2">{zoneError}</p>
      )}

      <p className="font-mono text-[10px] text-ink-soft mt-3">
        Precio 0 = envío gratis en esa zona. Las zonas inactivas no aparecen en el checkout.
      </p>
    </div>
  )
}

export default AdminEnvios
```

- [ ] **Step 2: Verificar TypeScript**

```bash
rtk tsc --noEmit
```

Resultado esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
rtk git add src/pages/admin/AdminEnvios.tsx && rtk git commit -m "feat: add AdminEnvios page with shipping zones management"
```

---

### Task 3: Limpiar AdminStock.tsx

**Files:**
- Modify: `src/pages/admin/AdminStock.tsx`

Eliminar todo el código de envíos: imports de `useShippingZones`, estados de zonas y shipping_config, funciones `saveShipping`, y las dos secciones de UI (líneas 190–395).

- [ ] **Step 1: Reemplazar AdminStock.tsx completo**

Reemplazar el archivo con el contenido limpio (solo inventario):

```tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useProducts } from '@/hooks/useProducts'

interface StockRow {
  slug: string
  title: string
  catLabel: string
  stock: number | null
  status: string
  dirty: boolean
  saving: boolean
}

const STATUS_OPTIONS = [
  { value: 'active',       label: 'Activo' },
  { value: 'coming-soon',  label: 'Próximamente' },
  { value: 'out-of-stock', label: 'Sin stock' },
]

const AdminStock: React.FC = () => {
  const { products, loading: productsLoading } = useProducts()
  const [rows, setRows] = useState<StockRow[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (productsLoading || initialized) return
    setRows(
      products.map((p) => ({
        slug:     p.slug,
        title:    p.title,
        catLabel: p.catLabel,
        stock:    p.stock ?? null,
        status:   p.status,
        dirty:    false,
        saving:   false,
      }))
    )
    setInitialized(true)
  }, [products, productsLoading, initialized])

  const updateRow = (slug: string, patch: Partial<StockRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, ...patch, dirty: true } : r))
    )
  }

  const saveRow = async (slug: string) => {
    const row = rows.find((r) => r.slug === slug)
    if (!row) return
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, saving: true } : r)))
    await supabase
      .from('product_stock')
      .upsert({ slug: row.slug, stock: row.stock, status: row.status })
    setRows((prev) =>
      prev.map((r) => (r.slug === slug ? { ...r, dirty: false, saving: false } : r))
    )
  }

  if (productsLoading || !initialized) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        Cargando stock…
      </p>
    )
  }

  return (
    <div>
      <h1 className="font-display text-[22px] text-ink font-normal mb-6">Inventario</h1>

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: '1px solid var(--line-soft)' }}
      >
        {/* Header tabla */}
        <div
          className="grid grid-cols-[1fr_100px_140px_80px] gap-4 px-5 py-3 bg-cream-100"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          {['Producto', 'Stock', 'Estado', ''].map((h) => (
            <span key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              {h}
            </span>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={row.slug}
            className="grid grid-cols-[1fr_100px_140px_80px] gap-4 items-center px-5 py-3 bg-cream-50 hover:bg-cream-100 transition-colors"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}
          >
            {/* Nombre */}
            <div>
              <p className="font-body text-[13px] text-ink leading-snug">{row.title}</p>
              <p className="font-mono text-[10px] text-ink-soft uppercase tracking-[0.08em]">
                {row.catLabel}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={row.stock ?? ''}
                placeholder="∞"
                onChange={(e) =>
                  updateRow(row.slug, {
                    stock: e.target.value === '' ? null : parseInt(e.target.value, 10),
                  })
                }
                className="w-16 font-body text-[13px] text-ink bg-transparent border-b outline-none focus:border-sage-700 transition-colors py-0.5 text-center"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>

            {/* Status */}
            <select
              value={row.status}
              onChange={(e) => updateRow(row.slug, { status: e.target.value })}
              className="font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700 transition-colors"
              style={{ borderColor: 'var(--line)' }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Guardar */}
            <button
              type="button"
              disabled={!row.dirty || row.saving}
              onClick={() => saveRow(row.slug)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-pill border transition-all disabled:opacity-30"
              style={{
                borderColor: row.dirty ? 'var(--sage-700)' : 'var(--line)',
                color:       row.dirty ? 'var(--sage-700)' : 'var(--ink-soft)',
              }}
            >
              {row.saving ? '…' : 'Guardar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminStock
```

- [ ] **Step 2: Verificar TypeScript**

```bash
rtk tsc --noEmit
```

Resultado esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
rtk git add src/pages/admin/AdminStock.tsx && rtk git commit -m "refactor: remove shipping sections from AdminStock, keep only inventory"
```

---

### Task 4: Agregar "Envíos" al nav y la ruta

**Files:**
- Modify: `src/pages/admin/AdminLayout.tsx` (líneas 37–47)
- Modify: `src/App.tsx` (líneas 20–21 y 76–78)

- [ ] **Step 1: Agregar NavLink "Envíos" en AdminLayout.tsx**

En [AdminLayout.tsx](src/pages/admin/AdminLayout.tsx), dentro de `<nav className="flex items-center gap-6">`, agregar el nuevo link después de "Stock":

Reemplazar:
```tsx
          <nav className="flex items-center gap-6">
            <NavLink to="/admin" end className={navLinkClass}>
              Órdenes
            </NavLink>
            <NavLink to="/admin/stock" className={navLinkClass}>
              Stock
            </NavLink>
            <NavLink to="/admin/productos" className={navLinkClass}>
              Productos
            </NavLink>
          </nav>
```

Por:
```tsx
          <nav className="flex items-center gap-6">
            <NavLink to="/admin" end className={navLinkClass}>
              Órdenes
            </NavLink>
            <NavLink to="/admin/stock" className={navLinkClass}>
              Stock
            </NavLink>
            <NavLink to="/admin/envios" className={navLinkClass}>
              Envíos
            </NavLink>
            <NavLink to="/admin/productos" className={navLinkClass}>
              Productos
            </NavLink>
          </nav>
```

- [ ] **Step 2: Agregar import lazy y ruta en App.tsx**

En [App.tsx](src/App.tsx), agregar el import lazy después de la línea `AdminProducts`:

Reemplazar:
```tsx
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
```

Por:
```tsx
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminEnvios   = lazy(() => import('./pages/admin/AdminEnvios'));
```

Luego agregar la ruta dentro del bloque admin (después de `path="productos"`):

Reemplazar:
```tsx
            <Route index             element={<AdminOrders />} />
            <Route path="stock"      element={<AdminStock />} />
            <Route path="productos"  element={<AdminProducts />} />
```

Por:
```tsx
            <Route index             element={<AdminOrders />} />
            <Route path="stock"      element={<AdminStock />} />
            <Route path="envios"     element={<AdminEnvios />} />
            <Route path="productos"  element={<AdminProducts />} />
```

- [ ] **Step 3: Verificar TypeScript**

```bash
rtk tsc --noEmit
```

Resultado esperado: sin errores.

- [ ] **Step 4: Verificar en dev server**

```bash
rtk npm run dev
```

Ir a `http://localhost:5173/admin`. Verificar:
- El nav muestra: Órdenes · Stock · **Envíos** · Productos
- `/admin/stock` solo muestra la tabla de inventario (sin secciones de envío)
- `/admin/envios` muestra la tabla de zonas y el formulario para agregar
- Al hacer foco en un campo de precio, todo el número queda seleccionado
- Guardar una zona no da 403 (requiere haber aplicado la migración SQL del Task 1)

- [ ] **Step 5: Commit**

```bash
rtk git add src/pages/admin/AdminLayout.tsx src/App.tsx && rtk git commit -m "feat: add Envios to admin nav and routing"
```

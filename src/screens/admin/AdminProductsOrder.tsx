'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { pb } from '@/lib/pocketbase'
import { triggerRevalidate } from '@/lib/revalidate-client'
import { computeSortUpdates, reorderWithinSubset } from '@/lib/product-order'
import Tabs from '@/components/admin/shared/Tabs'
import { useToast } from '@/context/ToastContext'
import { useCategories } from '@/hooks/useCategories'

// Pantalla para acomodar el orden de la tienda arrastrando las fotos. Muestra lo
// mismo que /tienda (productos activos, en su orden) y guarda recién cuando se
// aprieta "Guardar orden".

interface OrderItem {
  id: string
  title: string
  category: string
  image: string | null
  tall: number
  sortOrder: number
  /** Lo muestra la tienda (status active). */
  shown: boolean
}

const ALL = 'todos'

async function fetchItems(): Promise<OrderItem[]> {
  const [products, stock] = await Promise.all([
    // Mismo sort que getProducts, así la grilla arranca igual que la tienda.
    pb.collection('products').getFullList({
      sort: 'sort_order',
      fields: 'id,slug,title,category,images,tall,sort_order',
      requestKey: null,
    }),
    pb.collection('product_stock').getFullList({ fields: 'slug,status', requestKey: null }),
  ])
  const status = new Map(stock.map((s) => [s.slug as string, s.status as string]))
  return products.map((p) => ({
    id: p.id,
    title: p.title as string,
    category: p.category as string,
    image: ((p.images as string[] | null) ?? [])[0] ?? null,
    tall: (p.tall as number) || 1.3,
    sortOrder: (p.sort_order as number) ?? 0,
    // Igual que mapProduct: sin fila de stock, el producto cuenta como activo.
    shown: (status.get(p.slug as string) ?? 'active') === 'active',
  }))
}

const shownIds = (items: OrderItem[]) => items.filter((i) => i.shown).map((i) => i.id)

// ─── Tarjeta arrastrable ──────────────────────────────────────────────────────

const SortableCard: React.FC<{ item: OrderItem; position: number }> = ({ item, position }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`${item.title}, posición ${position}`}
      className="relative rounded-card overflow-hidden bg-cream-50 select-none outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2"
      style={{
        // Translate y no Transform: la tarjeta se desplaza sin deformarse.
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging
          ? '0 14px 36px rgba(44,44,44,0.2)'
          : '0 1px 2px rgba(44,44,44,0.04), 0 8px 24px rgba(74,124,89,0.06)',
        // Mantener apretado en iOS abre el menú de la imagen en vez de arrastrar.
        WebkitTouchCallout: 'none',
      }}
    >
      <div className="relative w-full bg-cream-200" style={{ aspectRatio: `1 / ${item.tall}` }}>
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="object-cover pointer-events-none"
            draggable={false}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
            Sin imagen
          </span>
        )}
        <span className="absolute top-2 left-2 font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-cream-50/90 text-ink">
          {position}
        </span>
      </div>
      <p className="font-body text-[12px] text-ink px-2.5 py-2 truncate">{item.title}</p>
    </div>
  )
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

const AdminProductsOrder: React.FC = () => {
  const toast = useToast()
  const { categories } = useCategories()
  const [items, setItems] = useState<OrderItem[]>([])
  const [order, setOrder] = useState<string[]>([])
  const [savedOrder, setSavedOrder] = useState<string[]>([])
  const [category, setCategory] = useState(ALL)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
      .then((data) => {
        setItems(data)
        setOrder(shownIds(data))
        setSavedOrder(shownIds(data))
      })
      .catch((e) => {
        toast.error('No se pudieron cargar los productos', { detail: e instanceof Error ? e.message : undefined })
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])
  const visibleIds = useMemo(
    () => (category === ALL ? order : order.filter((id) => byId.get(id)?.category === category)),
    [order, category, byId]
  )
  const dirty = order.join() !== savedOrder.join()

  const tabs = useMemo(() => {
    const counts = new Map<string, number>()
    for (const id of order) {
      const c = byId.get(id)?.category
      if (c) counts.set(c, (counts.get(c) ?? 0) + 1)
    }
    return [
      { id: ALL, label: `Todos · ${order.length}` },
      ...categories
        .filter((c) => counts.has(c.slug))
        .map((c) => ({ id: c.slug, label: `${c.label} · ${counts.get(c.slug)}` })),
    ]
  }, [categories, order, byId])

  // Aviso al salir con cambios sin guardar. Los links de Next no disparan
  // beforeunload, así que también se interceptan los clics en links.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest('a[href]')
      if (!link || link.getAttribute('target') === '_blank') return
      if (!window.confirm('Tenés cambios de orden sin guardar. ¿Salir igual?')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [dirty])

  const sensors = useSensors(
    // Con una distancia mínima, un clic no arranca un arrastre.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // En el celular hay que mantener apretado: así el scroll de la página sigue andando.
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const titleOf = (id: UniqueIdentifier) => byId.get(String(id))?.title ?? 'el producto'
  const positionOf = (id: UniqueIdentifier) => visibleIds.indexOf(String(id)) + 1
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Agarraste ${titleOf(active.id)}, en la posición ${positionOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `${titleOf(active.id)} está sobre la posición ${positionOf(over.id)}.` : `${titleOf(active.id)} está fuera de la grilla.`,
    onDragEnd: ({ active, over }) =>
      over ? `${titleOf(active.id)} quedó en la posición ${positionOf(over.id)}.` : `Soltaste ${titleOf(active.id)} sin moverlo.`,
    onDragCancel: ({ active }) => `Se canceló el movimiento de ${titleOf(active.id)}.`,
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    setOrder((prev) => reorderWithinSubset(prev, visibleIds, String(active.id), String(over.id)))
  }

  async function save() {
    const updates = computeSortUpdates(
      items.map(({ id, sortOrder }) => ({ id, sortOrder })),
      order
    )
    if (updates.length === 0) {
      setSavedOrder(order)
      return
    }
    setSaving(true)
    const results = await Promise.allSettled(
      updates.map((u) =>
        pb.collection('products').update(u.id, { sort_order: u.sortOrder }, { requestKey: null })
      )
    )
    const failed = results.filter((r) => r.status === 'rejected').length

    if (failed > 0) {
      // Se relee el estado real para que el próximo intento mande solo lo que falta.
      // El orden armado queda en pantalla, pendiente de guardar.
      const fresh = await fetchItems().catch(() => null)
      if (fresh) {
        setItems(fresh)
        setSavedOrder(shownIds(fresh))
      }
      setSaving(false)
      if (failed < updates.length) triggerRevalidate('products')
      toast.error('No se guardó todo el orden', {
        detail: `Fallaron ${failed} de ${updates.length} productos. Tu orden sigue en pantalla: probá guardar de nuevo.`,
      })
      return
    }

    const saved = new Map(updates.map((u) => [u.id, u.sortOrder]))
    setItems((prev) => prev.map((i) => ({ ...i, sortOrder: saved.get(i.id) ?? i.sortOrder })))
    setSavedOrder(order)
    setSaving(false)
    triggerRevalidate('products')
    toast.success('Orden guardado', { detail: 'La tienda se actualiza en unos segundos.' })
  }

  if (loading) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Cargando productos…</p>
  }

  return (
    <div>
      <div className="mb-5">
        <Link
          href="/admin/productos"
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft hover:text-ink transition-colors"
        >
          ← Productos
        </Link>
        <h1 className="font-display text-[22px] text-ink font-normal mt-2">Ordenar tienda</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft mt-1">
          {order.length} productos visibles en la tienda{dirty && ' · cambios sin guardar'}
        </p>
        <p className="font-body text-[13px] text-ink-soft mt-3 max-w-2xl leading-[1.6]">
          Arrastrá las fotos para acomodarlas: el orden es el mismo que ve la tienda. En el celular,
          mantené apretada una foto un instante y después movela. Con una categoría elegida, solo se
          reacomodan esas piezas entre los lugares que ya ocupan.
        </p>
      </div>

      {tabs.length > 2 && (
        <div className="mb-5">
          <Tabs tabs={tabs} active={category} onChange={setCategory} />
        </div>
      )}

      {visibleIds.length === 0 ? (
        <p
          className="font-mono text-[11px] text-ink-soft py-8 text-center rounded-sm"
          style={{ border: '1px solid var(--line-soft)' }}
        >
          No hay productos visibles en la tienda.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          accessibility={{
            announcements,
            screenReaderInstructions: {
              draggable:
                'Para mover un producto, apretá espacio o enter, movelo con las flechas y volvé a apretar espacio o enter para soltarlo. Escape cancela.',
            },
          }}
        >
          <SortableContext items={visibleIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-start">
              {visibleIds.map((id, i) => {
                const item = byId.get(id)
                return item ? <SortableCard key={id} item={item} position={i + 1} /> : null
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Acciones: siempre a mano mientras se recorre la grilla */}
      <div
        className="sticky bottom-0 z-30 mt-6 -mx-4 md:mx-0 flex items-center justify-end sm:justify-between gap-3 px-4 md:px-5 py-3 md:rounded-sm"
        style={{ background: 'var(--cream-100, #f5f0eb)', borderTop: '1px solid var(--line-soft)' }}
      >
        {/* En el celular el estado ya se lee en el encabezado */}
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
          {saving ? 'Guardando…' : dirty ? 'Cambios sin guardar' : 'Sin cambios'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => setOrder(savedOrder)}
            className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-pill border transition-all hover:bg-cream-50 disabled:opacity-40"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            Descartar
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={save}
            className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] px-5 py-2 rounded-pill transition-all disabled:opacity-40"
            style={{
              background: dirty ? 'var(--sage-700)' : 'transparent',
              color: dirty ? 'var(--cream-50)' : 'var(--ink-soft)',
              border: '1px solid var(--sage-700)',
            }}
          >
            {saving ? 'Guardando…' : 'Guardar orden'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminProductsOrder

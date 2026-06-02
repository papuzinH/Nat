import React, { useState, useEffect, useRef } from 'react'
import { pb } from '@/lib/pocketbase'
import { useToast } from '@/context/ToastContext'
import type { Category } from '@/hooks/useCategories'
import Modal from './Modal'
import ConfirmDeleteInline from './ConfirmDeleteInline'

interface AdminCategoriesModalProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  onCreateCategory: (slug: string, label: string, sort_order: number) => Promise<Category>
  onUpdateCategory: (id: string, data: Partial<Pick<Category, 'label' | 'sort_order'>>) => Promise<Category>
  onDeleteCategory: (id: string) => Promise<void>
}

interface EditDraft {
  label: string
}

interface NewDraft {
  slug: string
  label: string
}

const inputCls =
  'font-body text-[13px] text-ink bg-cream-50 border rounded-sm px-2 py-1 outline-none focus:border-sage-700 transition-colors'
const inputStyle = { borderColor: 'var(--line)' }

const DragHandle = () => (
  <svg
    width="10" height="14" viewBox="0 0 10 14"
    fill="currentColor" aria-hidden="true"
    className="text-ink-soft flex-shrink-0"
    style={{ cursor: 'grab' }}
  >
    <circle cx="3" cy="2.5" r="1.5" />
    <circle cx="7" cy="2.5" r="1.5" />
    <circle cx="3" cy="7" r="1.5" />
    <circle cx="7" cy="7" r="1.5" />
    <circle cx="3" cy="11.5" r="1.5" />
    <circle cx="7" cy="11.5" r="1.5" />
  </svg>
)

const AdminCategoriesModal: React.FC<AdminCategoriesModalProps> = ({
  open,
  onClose,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const toast = useToast()

  // Lista local ordenada (drag-and-drop actúa sobre esta)
  const [localOrder, setLocalOrder] = useState<Category[]>([])
  const reorderingRef = useRef(false)

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Conteos de productos por slug de categoría
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [countsLoading, setCountsLoading] = useState(false)

  // Estado de edición
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<EditDraft>({ label: '' })
  const [editWarning, setEditWarning] = useState<{ id: string; count: number } | null>(null)

  // Nueva categoría
  const [creating, setCreating] = useState(false)
  const [newDraft, setNewDraft] = useState<NewDraft>({ slug: '', label: '' })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sincronizar localOrder desde categories (salvo durante reordenado)
  useEffect(() => {
    if (!reorderingRef.current) setLocalOrder(categories)
  }, [categories])

  // Cargar conteos cuando abre el modal
  useEffect(() => {
    if (!open || categories.length === 0) return
    setCountsLoading(true)
    Promise.all(
      categories.map(async (cat) => {
        const res = await pb.collection('products').getList(1, 1, {
          filter: `category="${cat.slug}"`,
          requestKey: null,
        })
        return [cat.slug, res.totalItems] as [string, number]
      })
    )
      .then((entries) => setCounts(Object.fromEntries(entries)))
      .catch(() => {})
      .finally(() => setCountsLoading(false))
  }, [open, categories])

  // Resetear estado al cerrar
  useEffect(() => {
    if (!open) {
      setEditingId(null)
      setEditWarning(null)
      setCreating(false)
      setNewDraft({ slug: '', label: '' })
      setError(null)
      setDragIndex(null)
      setHoverIndex(null)
    }
  }, [open])

  // ─── Drag and drop ───────────────────────────────────────────────────────────

  const handleDragStart = (i: number) => {
    setDragIndex(i)
    setEditingId(null) // cerrar edición si está abierta
  }

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (i !== dragIndex) setHoverIndex(i)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setHoverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null); setHoverIndex(null); return
    }

    const next = [...localOrder]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(targetIndex, 0, moved)

    reorderingRef.current = true
    setLocalOrder(next)
    setDragIndex(null)
    setHoverIndex(null)

    // Asignar sort_order secuencial basado en la nueva posición
    const updates = next.map((cat, i) => ({ id: cat.id, sort_order: i + 1 }))
    // Solo guardar los que cambiaron
    const changed = updates.filter((u) => {
      const orig = localOrder.find((c) => c.id === u.id)
      return orig?.sort_order !== u.sort_order
    })

    try {
      await Promise.all(changed.map((u) => onUpdateCategory(u.id, { sort_order: u.sort_order })))
    } catch {
      setLocalOrder(categories) // revertir
      toast.error('No se pudo guardar el nuevo orden')
    } finally {
      reorderingRef.current = false
    }
  }

  // ─── Edición ─────────────────────────────────────────────────────────────────

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditDraft({ label: cat.label })
    setEditWarning(null)
    setError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditWarning(null)
    setError(null)
  }

  const handleSaveEdit = async (confirmed = false) => {
    if (!editingId) return
    const cat = localOrder.find((c) => c.id === editingId)
    if (!cat) return

    const label = editDraft.label.trim()
    if (!label) { setError('El nombre no puede estar vacío'); return }

    const count = counts[cat.slug] ?? 0

    if (count > 0 && !confirmed) {
      setEditWarning({ id: editingId, count })
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onUpdateCategory(editingId, { label })
      setEditingId(null)
      setEditWarning(null)
      toast.success('Categoría actualizada')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  // ─── Eliminar ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    try {
      await onDeleteCategory(id)
      const cat = localOrder.find((c) => c.id === id)
      if (cat) setCounts((prev) => { const n = { ...prev }; delete n[cat.slug]; return n })
      toast.success('Categoría eliminada')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo eliminar')
      throw e
    }
  }

  // ─── Crear ───────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    const slug = newDraft.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    const label = newDraft.label.trim()
    if (!slug || !label) { setError('Slug y nombre son obligatorios'); return }

    const maxOrder = localOrder.length > 0
      ? Math.max(...localOrder.map((c) => c.sort_order))
      : 0

    setSaving(true)
    setError(null)
    try {
      const cat = await onCreateCategory(slug, label, maxOrder + 1)
      setCounts((prev) => ({ ...prev, [cat.slug]: 0 }))
      setCreating(false)
      setNewDraft({ slug: '', label: '' })
      toast.success('Categoría creada', { detail: cat.label })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear')
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Modal open={open} onClose={onClose} title="Categorías" maxWidth={580}>
      {localOrder.length > 0 && (
        <p className="font-mono text-[10px] text-ink-soft mb-3 flex items-center gap-1.5">
          <DragHandle />
          Arrastrá para reordenar
        </p>
      )}

      {/* Lista de categorías */}
      <div className="flex flex-col gap-1 mb-4">
        {localOrder.length === 0 && (
          <p className="font-mono text-[11px] text-ink-soft py-4 text-center">
            No hay categorías. Creá una abajo.
          </p>
        )}

        {localOrder.map((cat, i) => {
          const count = counts[cat.slug] ?? 0
          const isEditing = editingId === cat.id
          const isDragging = dragIndex === i
          const isHover = hoverIndex === i && dragIndex !== null && dragIndex !== i

          if (isEditing) {
            return (
              <div
                key={cat.id}
                className="rounded-sm px-3 py-3 flex flex-col gap-3"
                style={{ background: 'var(--cream-100, #f5f0eb)', border: '1px solid var(--line-soft)' }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={editDraft.label}
                    onChange={(e) => setEditDraft({ label: e.target.value })}
                    placeholder="Nombre visible"
                    className={`${inputCls} flex-1 min-w-[140px]`}
                    style={inputStyle}
                    disabled={saving}
                    autoFocus
                    aria-label="Nombre de la categoría"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(false); if (e.key === 'Escape') cancelEdit() }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(false)}
                    disabled={saving}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-sm transition-colors disabled:opacity-40"
                    style={{ background: 'var(--sage-700)', color: '#fdfcfb' }}
                  >
                    {saving ? '…' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors disabled:opacity-40"
                  >
                    Cancelar
                  </button>
                </div>

                {editWarning && editWarning.id === cat.id && (
                  <div
                    className="rounded-sm px-3 py-2.5 flex flex-col gap-2"
                    style={{ background: '#fef9ec', border: '1px solid #e8c96a' }}
                  >
                    <p className="font-body text-[12px]" style={{ color: '#7a5c00' }}>
                      ⚠ {editWarning.count} producto{editWarning.count > 1 ? 's' : ''}{' '}
                      {editWarning.count > 1 ? 'tienen' : 'tiene'} esta categoría y{' '}
                      {editWarning.count > 1 ? 'verán' : 'verá'} su nombre actualizado.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(true)}
                        disabled={saving}
                        className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-sm transition-colors disabled:opacity-40"
                        style={{ background: '#7a5c00', color: '#fef9ec' }}
                      >
                        {saving ? '…' : 'Confirmar cambio'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditWarning(null)}
                        disabled={saving}
                        className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          }

          return (
            <div
              key={cat.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              className="flex items-center gap-3 px-3 py-2 rounded-sm transition-colors"
              style={{
                border: `1px solid ${isHover ? 'var(--sage-700)' : 'var(--line-soft)'}`,
                background: isHover ? 'var(--cream-100, #f5f0eb)' : undefined,
                opacity: isDragging ? 0.4 : 1,
                cursor: 'default',
              }}
            >
              {/* Handle drag */}
              <span className="flex-shrink-0" style={{ cursor: 'grab' }}>
                <DragHandle />
              </span>

              {/* Label */}
              <span className="font-body text-[13px] text-ink flex-1 min-w-0 truncate">
                {cat.label}
              </span>

              {/* Slug */}
              <span className="font-mono text-[10px] text-ink-soft hidden sm:block flex-shrink-0">
                {cat.slug}
              </span>

              {/* Badge de productos */}
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'var(--line-soft)', color: 'var(--ink-soft)' }}
                title="Productos con esta categoría"
              >
                {countsLoading ? '…' : count}
              </span>

              {/* Editar */}
              <button
                type="button"
                onClick={() => startEdit(cat)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors flex-shrink-0"
              >
                Editar
              </button>

              {/* Eliminar */}
              <div className="flex-shrink-0">
                {count > 0 ? (
                  <button
                    type="button"
                    disabled
                    title={`Hay ${count} producto${count > 1 ? 's' : ''} con esta categoría. Primero reasignálos o eliminá los productos.`}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] opacity-30 cursor-not-allowed"
                    style={{ color: '#a8503f' }}
                  >
                    Eliminar
                  </button>
                ) : (
                  <ConfirmDeleteInline
                    onConfirm={() => handleDelete(cat.id)}
                    question="¿Eliminar?"
                    confirmLabel="Sí"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Error global */}
      {error && (
        <p
          className="font-mono text-[11px] mb-3 px-3 py-2 rounded-sm"
          style={{ color: '#a8503f', background: '#fdf0ed', border: '1px solid #e8c6be' }}
        >
          {error}
        </p>
      )}

      {/* Formulario de nueva categoría */}
      {creating ? (
        <div
          className="rounded-sm px-3 py-3 flex flex-col gap-3"
          style={{ background: 'var(--cream-100, #f5f0eb)', border: '1px dashed var(--line)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
            Nueva categoría
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={newDraft.slug}
              onChange={(e) =>
                setNewDraft((d) => ({
                  ...d,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
                }))
              }
              placeholder="slug (ej: flores-secas)"
              className={`${inputCls} flex-1 min-w-[120px]`}
              style={inputStyle}
              disabled={saving}
              aria-label="Slug de la nueva categoría"
            />
            <input
              type="text"
              value={newDraft.label}
              onChange={(e) => setNewDraft((d) => ({ ...d, label: e.target.value }))}
              placeholder="Nombre visible"
              className={`${inputCls} flex-1 min-w-[120px]`}
              style={inputStyle}
              disabled={saving}
              aria-label="Nombre de la nueva categoría"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-sm transition-colors disabled:opacity-40"
              style={{ background: 'var(--sage-700)', color: '#fdfcfb' }}
            >
              {saving ? '…' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => { setCreating(false); setNewDraft({ slug: '', label: '' }); setError(null) }}
              disabled={saving}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setCreating(true); setError(null) }}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink transition-colors mt-1"
        >
          + Nueva categoría
        </button>
      )}
    </Modal>
  )
}

export default AdminCategoriesModal

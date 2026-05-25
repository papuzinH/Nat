import { useMemo, useState } from 'react'

type SortDir = 'asc' | 'desc'

interface UseTableFilterOptions<T> {
  searchFields?: (keyof T)[]
  /** Función custom para filtros derivados. Recibe row + filters. */
  customFilter?: (row: T, filters: Record<string, string>) => boolean
  defaultSort?: { field: keyof T; dir: SortDir }
  defaultFilters?: Record<string, string>
}

export interface UseTableFilterResult<T> {
  filtered: T[]
  query: string
  setQuery: (q: string) => void
  filters: Record<string, string>
  setFilter: (key: string, value: string) => void
  resetFilters: () => void
  sort: { field: keyof T; dir: SortDir } | null
  setSort: (s: { field: keyof T; dir: SortDir } | null) => void
}

function normalize(s: unknown): string {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function useTableFilter<T extends Record<string, unknown>>(
  rows: T[],
  opts: UseTableFilterOptions<T> = {},
): UseTableFilterResult<T> {
  const { searchFields = [], customFilter, defaultSort = null, defaultFilters = {} } = opts

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>(defaultFilters)
  const [sort, setSort] = useState<{ field: keyof T; dir: SortDir } | null>(defaultSort)

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      if (!value || value === 'all') delete next[key]
      else next[key] = value
      return next
    })
  }

  const resetFilters = () => {
    setQuery('')
    setFilters({})
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    const filteredRows = rows.filter((row) => {
      // Búsqueda libre
      if (q && searchFields.length > 0) {
        const match = searchFields.some((f) => normalize(row[f]).includes(q))
        if (!match) return false
      }
      // Filtros derivados
      if (customFilter && !customFilter(row, filters)) return false
      return true
    })

    if (!sort) return filteredRows

    const sorted = [...filteredRows].sort((a, b) => {
      const av = a[sort.field]
      const bv = b[sort.field]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return av - bv
      return String(av).localeCompare(String(bv), 'es', { numeric: true })
    })

    return sort.dir === 'desc' ? sorted.reverse() : sorted
  }, [rows, query, filters, sort, searchFields, customFilter])

  return { filtered, query, setQuery, filters, setFilter, resetFilters, sort, setSort }
}

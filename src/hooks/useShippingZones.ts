import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { normalizeCP } from '@/lib/shipping'

export interface ShippingZone {
  id: string   // PocketBase usa strings (era number en Supabase)
  name: string
  price: number
  active: boolean
  postal_codes: string[]
}

function rowToZone(z: Record<string, unknown>): ShippingZone {
  return {
    id:           z.id as string,
    name:         z.name as string,
    price:        z.price as number,
    active:       z.active as boolean,
    postal_codes: (z.postal_codes as string[]) ?? [],
  }
}

export function useShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  const fetchZones = async () => {
    const data = await pb.collection('shipping_zones').getFullList({ sort: 'name', requestKey: null })
    setZones(data.map(rowToZone))
    setLoading(false)
  }

  useEffect(() => { fetchZones() }, [])   

  const addZone = async (name: string, price: number): Promise<boolean> => {
    try {
      await pb.collection('shipping_zones').create({ name: name.trim(), price, active: true, postal_codes: [] })
      await fetchZones()
      return true
    } catch { return false }
  }

  const updateZone = async (
    id: string,
    patch: Partial<Pick<ShippingZone, 'name' | 'price' | 'active'>>,
  ): Promise<boolean> => {
    try {
      await pb.collection('shipping_zones').update(id, patch)
      await fetchZones()
      return true
    } catch { return false }
  }

  const deleteZone = async (id: string): Promise<boolean> => {
    try {
      await pb.collection('shipping_zones').delete(id)
      await fetchZones()
      return true
    } catch { return false }
  }

  /**
   * Agrega varios CPs (ya normalizados a 4 dígitos por `expandCPInput`) a una
   * zona, deduplicando contra los existentes (también normalizados). Devuelve
   * cuántos se agregaron y cuántos se omitieron por duplicado, o null si falló.
   */
  const addPostalCodes = async (
    zoneId: string,
    codes: string[],
  ): Promise<{ added: number; dup: number } | null> => {
    const incoming = codes.map(normalizeCP).filter(Boolean)
    if (incoming.length === 0) return { added: 0, dup: 0 }
    try {
      const zone = await pb.collection('shipping_zones').getOne(zoneId)
      const existing = ((zone.postal_codes as string[]) ?? []).map(normalizeCP)
      const set = new Set(existing)
      let added = 0
      let dup = 0
      for (const cp of incoming) {
        if (set.has(cp)) dup++
        else { set.add(cp); added++ }
      }
      if (added > 0) {
        await pb.collection('shipping_zones').update(zoneId, { postal_codes: [...set] })
        await fetchZones()
      }
      return { added, dup }
    } catch { return null }
  }

  const removePostalCode = async (zoneId: string, code: string): Promise<boolean> => {
    const normalized = normalizeCP(code)
    try {
      const zone = await pb.collection('shipping_zones').getOne(zoneId)
      const codes = ((zone.postal_codes as string[]) ?? []).map(normalizeCP).filter((pc) => pc !== normalized)
      await pb.collection('shipping_zones').update(zoneId, { postal_codes: codes })
      await fetchZones()
      return true
    } catch { return false }
  }

  return { zones, loading, addZone, updateZone, deleteZone, addPostalCodes, removePostalCode }
}

export function usePublicShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection('shipping_zones')
      .getFullList({ filter: 'active = true', sort: 'name' })
      .then((data) => {
        setZones(data.map(rowToZone))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { zones, loading }
}

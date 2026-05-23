import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'

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
    const data = await pb.collection('shipping_zones').getFullList({ sort: 'name' })
    setZones(data.map(rowToZone))
    setLoading(false)
  }

  useEffect(() => { fetchZones() }, [])  // eslint-disable-line react-hooks/exhaustive-deps

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

  const addPostalCode = async (zoneId: string, code: string): Promise<boolean> => {
    const normalized = code.trim().toUpperCase()
    if (!normalized) return false
    try {
      const zone = await pb.collection('shipping_zones').getOne(zoneId)
      const codes = [...((zone.postal_codes as string[]) ?? []), normalized]
      await pb.collection('shipping_zones').update(zoneId, { postal_codes: codes })
      await fetchZones()
      return true
    } catch { return false }
  }

  const removePostalCode = async (zoneId: string, code: string): Promise<boolean> => {
    const normalized = code.trim().toUpperCase()
    try {
      const zone = await pb.collection('shipping_zones').getOne(zoneId)
      const codes = ((zone.postal_codes as string[]) ?? []).filter((pc) => pc !== normalized)
      await pb.collection('shipping_zones').update(zoneId, { postal_codes: codes })
      await fetchZones()
      return true
    } catch { return false }
  }

  return { zones, loading, addZone, updateZone, deleteZone, addPostalCode, removePostalCode }
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

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { rowToShippingZone, type ShippingZone } from '@/lib/shipping'

export function useShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  const fetchZones = async () => {
    const data = await pb.collection('shipping_zones').getFullList({ sort: 'name', requestKey: null })
    setZones(data.map(rowToShippingZone))
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

  return { zones, loading, addZone, updateZone, deleteZone }
}

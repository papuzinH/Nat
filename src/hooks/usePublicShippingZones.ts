import { useState, useEffect } from 'react'
import { rowToShippingZone, type ShippingZone } from '@/lib/shipping'

// fetch directo y no el SDK: el carrito está en todas las páginas y el SDK pesa ~80 KB.
export function usePublicShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = new URLSearchParams({ filter: 'active = true', sort: 'name', perPage: '200' })
    fetch(`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/shipping_zones/records?${query}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { items: Record<string, unknown>[] }) => setZones(data.items.map(rowToShippingZone)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { zones, loading }
}

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface ShippingZone {
  id: number
  name: string
  price: number
  active: boolean
  postal_codes: string[]
}

export function useShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  const fetchZones = async () => {
    const { data } = await supabase
      .from('shipping_zones')
      .select('id, name, price, active, shipping_zone_postal_codes(postal_code)')
      .order('name')
    if (data) {
      setZones(
        data.map((z: any) => ({
          id: z.id,
          name: z.name,
          price: z.price,
          active: z.active,
          postal_codes: (z.shipping_zone_postal_codes ?? []).map(
            (pc: { postal_code: string }) => pc.postal_code
          ),
        }))
      )
    }
    setLoading(false)
  }

  useEffect(() => { fetchZones() }, [])

  const addZone = async (name: string, price: number): Promise<boolean> => {
    const { error } = await supabase
      .from('shipping_zones')
      .insert({ name: name.trim(), price, active: true })
    if (error) return false
    await fetchZones()
    return true
  }

  const updateZone = async (id: number, patch: Partial<Pick<ShippingZone, 'name' | 'price' | 'active'>>): Promise<boolean> => {
    const { error } = await supabase
      .from('shipping_zones')
      .update(patch)
      .eq('id', id)
    if (error) return false
    await fetchZones()
    return true
  }

  const deleteZone = async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('shipping_zones')
      .delete()
      .eq('id', id)
    if (error) return false
    await fetchZones()
    return true
  }

  const addPostalCode = async (zoneId: number, code: string): Promise<boolean> => {
    const normalized = code.trim().toUpperCase()
    if (!normalized) return false
    const { error } = await supabase
      .from('shipping_zone_postal_codes')
      .insert({ zone_id: zoneId, postal_code: normalized })
    if (error) return false
    await fetchZones()
    return true
  }

  const removePostalCode = async (zoneId: number, code: string): Promise<boolean> => {
    const { error } = await supabase
      .from('shipping_zone_postal_codes')
      .delete()
      .eq('zone_id', zoneId)
      .eq('postal_code', code.trim().toUpperCase())
    if (error) return false
    await fetchZones()
    return true
  }

  return { zones, loading, addZone, updateZone, deleteZone, addPostalCode, removePostalCode }
}

export function usePublicShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('shipping_zones')
      .select('id, name, price, active, shipping_zone_postal_codes(postal_code)')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data) {
          setZones(
            data.map((z: any) => ({
              id: z.id,
              name: z.name,
              price: z.price,
              active: z.active,
              postal_codes: (z.shipping_zone_postal_codes ?? []).map(
                (pc: { postal_code: string }) => pc.postal_code
              ),
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  return { zones, loading }
}

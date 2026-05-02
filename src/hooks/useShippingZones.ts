import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface ShippingZone {
  id: number
  name: string
  price: number
  active: boolean
}

export function useShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  const fetchZones = async () => {
    const { data } = await supabase
      .from('shipping_zones')
      .select('id, name, price, active')
      .order('name')
    if (data) setZones(data as ShippingZone[])
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

  return { zones, loading, addZone, updateZone, deleteZone }
}

export function usePublicShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('shipping_zones')
      .select('id, name, price, active')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setZones(data as ShippingZone[])
        setLoading(false)
      })
  }, [])

  return { zones, loading }
}

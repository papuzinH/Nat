import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ShippingConfig {
  price:       number
  label:       string
  description: string | null
}

const FALLBACK: ShippingConfig = { price: 0, label: 'Envío a domicilio', description: null }

export function useShippingConfig() {
  const [config, setConfig]   = useState<ShippingConfig>(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('shipping_config')
      .select('price, label, description')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setConfig(data as ShippingConfig)
        setLoading(false)
      })
  }, [])

  return { config, loading }
}

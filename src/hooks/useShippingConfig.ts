import { useEffect, useState } from 'react'
import { pb } from '@/lib/pocketbase'

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
    pb.collection('shipping_config')
      .getFirstListItem('')
      .then((data) => {
        if (data) setConfig({ price: data.price, label: data.label, description: data.description ?? null })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { config, loading }
}

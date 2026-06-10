import { NextResponse } from 'next/server'

interface OrderItem {
  product_slug: string
  product_title: string
  selected_size: string | null
  has_frame: boolean
  unit_price: number
  quantity: number
}

interface Payload {
  orderId: string
  customer: { name: string; email: string; phone: string }
  delivery: { mode: string; zoneName: string }
  items: OrderItem[]
  shippingCost: number
}

export async function POST(req: Request) {
  const payload = (await req.json()) as Payload
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'mp_not_configured' }, { status: 500 })
  }

  const mpItems = payload.items.map((item) => ({
    id: item.product_slug,
    title: [item.product_title, item.selected_size, item.has_frame ? 'con marco' : null]
      .filter(Boolean)
      .join(' – '),
    quantity: item.quantity,
    unit_price: item.unit_price,
    currency_id: 'ARS',
  }))

  if (payload.shippingCost > 0) {
    mpItems.push({
      id: 'envio',
      title: `Costo de envío${payload.delivery.zoneName ? ` – ${payload.delivery.zoneName}` : ''}`,
      quantity: 1,
      unit_price: payload.shippingCost,
      currency_id: 'ARS',
    })
  }

  const siteUrl = process.env.SITE_URL ?? 'https://tatuajesnaty.com'
  const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString()

  const preference = {
    items: mpItems,
    payer: {
      name: payload.customer.name,
      email: payload.customer.email,
      phone: { number: payload.customer.phone },
    },
    back_urls: {
      success: `${siteUrl}/checkout/confirmacion?order=${payload.orderId}`,
      failure: `${siteUrl}/checkout/error?order=${payload.orderId}`,
      pending: `${siteUrl}/checkout/confirmacion?order=${payload.orderId}&pending=true`,
    },
    auto_return: 'approved',
    notification_url: `${siteUrl}/api/mp-webhook`,
    external_reference: payload.orderId,
    expires: true,
    expiration_date_to: expiry,
    statement_descriptor: 'NATALIA HELLER ARTE',
  }

  try {
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(preference),
    })

    if (!mpRes.ok) {
      const err = await mpRes.text()
      console.error('[create-mp-preference] MP error:', err)
      return NextResponse.json({ error: 'mp_error' }, { status: 502 })
    }

    const mpData = (await mpRes.json()) as { init_point: string; id: string }
    return NextResponse.json({ initPoint: mpData.init_point, preferenceId: mpData.id })
  } catch (err) {
    console.error('[create-mp-preference] fetch error:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

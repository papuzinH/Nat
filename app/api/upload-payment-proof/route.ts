import { NextResponse } from 'next/server'
import { PB_URL, pbAdminToken, fetchOrder, verifyUploadToken } from '@/lib/pb-admin'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const UPLOADABLE_STATES = ['pendiente_de_pago', 'comprobante_recibido']

/** Verifica el tipo real del archivo por su firma de bytes (no por el MIME del cliente). */
async function hasValidMagicBytes(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  const startsWith = (sig: number[]) => sig.every((b, i) => head[i] === b)
  return (
    startsWith([0xff, 0xd8, 0xff]) ||             // JPEG
    startsWith([0x89, 0x50, 0x4e, 0x47]) ||       // PNG
    startsWith([0x25, 0x50, 0x44, 0x46])          // PDF (%PDF)
  )
}

/**
 * Recibe el comprobante de transferencia (FormData: orderId + file), lo valida,
 * y lo asocia a la orden en PocketBase con credenciales admin. Marca la orden
 * como `comprobante_recibido`. No expone la colección `orders` a writes públicos.
 */
export async function POST(req: Request) {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Formato inválido.' }, { status: 400 })
  }

  const orderId = String(form.get('orderId') ?? '')
  const uploadToken = String(form.get('token') ?? '')
  const file = form.get('file')

  if (!orderId || !(file instanceof File)) {
    return NextResponse.json({ error: 'Faltan datos del comprobante.' }, { status: 400 })
  }
  // Autorización: sólo quien tiene el token de la orden (link del email / vuelta
  // del checkout) puede subir el comprobante.
  if (!verifyUploadToken(orderId, uploadToken)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }
  if (!ALLOWED_TYPES.includes(file.type) || !(await hasValidMagicBytes(file))) {
    return NextResponse.json(
      { error: 'Formato no permitido. Subí una imagen (JPG/PNG) o PDF.' },
      { status: 400 },
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'El archivo supera los 5 MB.' }, { status: 400 })
  }

  const token = await pbAdminToken()
  if (!token) {
    return NextResponse.json({ error: 'Servicio no disponible. Probá de nuevo.' }, { status: 503 })
  }

  const order = await fetchOrder(orderId, token)
  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 })
  }
  if (!UPLOADABLE_STATES.includes(String(order.status))) {
    return NextResponse.json(
      { error: 'Este pedido ya no admite cargar comprobante.' },
      { status: 409 },
    )
  }

  const patch = new FormData()
  patch.append('payment_proof', file, file.name)
  patch.append('status', 'comprobante_recibido')

  const res = await fetch(`${PB_URL}/api/collections/orders/records/${orderId}`, {
    method: 'PATCH',
    headers: { Authorization: token },
    body: patch,
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'No se pudo guardar el comprobante.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, status: 'comprobante_recibido' })
}

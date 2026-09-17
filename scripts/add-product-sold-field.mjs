/**
 * Agrega (idempotente) el campo booleano `sold` a la colección `products`.
 * `sold` = la pieza se muestra en la tienda pero ya tiene dueño: no se puede comprar.
 *
 * Mismo formato que create-site-images.mjs (SDK 0.26 / PocketBase 0.23+).
 *
 * Uso:
 *   node --env-file=.env.local scripts/add-product-sold-field.mjs
 */
import PocketBase from 'pocketbase'

const PB_URL =
  process.env.POCKETBASE_URL ||
  process.env.NEXT_PUBLIC_POCKETBASE_URL ||
  'https://nat.lhstudio.com.ar'
const EMAIL = process.env.PB_ADMIN_EMAIL
const PASSWORD = process.env.PB_ADMIN_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('✗ Faltan PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD (corré con --env-file=.env.local)')
  process.exit(1)
}

const pb = new PocketBase(PB_URL)

async function main() {
  await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD)
  console.log(`✓ Superuser autenticado en ${PB_URL}\n`)

  const products = await pb.collections.getOne('products')
  const fields = products.fields ?? []

  const existing = fields.find((f) => f.name === 'sold')
  if (existing) {
    console.log(`⚠ products.sold ya existe (${existing.type}). No se cambió nada.`)
    return
  }

  const updated = await pb.collections.update('products', {
    fields: [...fields, { name: 'sold', type: 'bool', required: false }],
  })

  const added = (updated.fields ?? []).find((f) => f.name === 'sold')
  if (!added) throw new Error('PocketBase no devolvió el campo sold después del update')
  console.log(`✓ Campo agregado: products.sold (${added.type})`)
  console.log(`  Campos: ${fields.length} → ${updated.fields.length}`)
}

main().catch((e) => {
  console.error('✗', e?.response ?? e)
  process.exit(1)
})

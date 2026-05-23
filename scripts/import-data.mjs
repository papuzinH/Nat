/**
 * Importa los datos exportados de Supabase a PocketBase.
 * Uso: node scripts/import-data.mjs
 */
import PocketBase from 'pocketbase'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir   = dirname(fileURLToPath(import.meta.url))
const PB_URL  = 'https://nat.lhstudio.com.ar'
const EMAIL   = process.env.PB_EMAIL    ?? ''
const PASSWORD = process.env.PB_PASSWORD ?? ''

const pb = new PocketBase(PB_URL)

function load(filename) {
  return JSON.parse(readFileSync(join(__dir, 'data', filename), 'utf-8'))
}

async function importAll(collection, rows) {
  let ok = 0, fail = 0
  for (const row of rows) {
    try {
      await pb.collection(collection).create(row)
      ok++
    } catch (e) {
      console.error(`  ✗ fila:`, JSON.stringify(row).slice(0, 100), '\n   ', e.message)
      fail++
    }
  }
  console.log(`✓ ${collection}: ${ok} registros${fail ? `, ${fail} errores` : ''}`)
}

async function main() {
  await pb.admins.authWithPassword(EMAIL, PASSWORD)
  console.log('✓ Admin autenticado\n')

  // ── products ───────────────────────────────────────────────────────────────
  const products = load('products.json')
  await importAll('products', products.map(p => ({
    slug:        p.slug,
    title:       p.title,
    category:    p.category,
    cat_label:   p.cat_label   ?? '',
    base_price:  Number(p.base_price),
    size:        p.size        ?? '',
    tone:        p.tone        ?? '',
    tall:        p.tall != null ? parseFloat(p.tall) : null,
    medium:      p.medium      ?? '',
    edition:     p.edition     ?? '',
    description: p.description ?? '',
    images:      p.images      ?? [],
    tags:        p.tags        ?? [],
    variants:    p.variants    ?? null,
    has_frame:   p.has_frame   ?? false,
    frame_price: Number(p.frame_price ?? 0),
    on_demand:   p.on_demand   ?? false,
    sort_order:  Number(p.sort_order  ?? 0),
  })))

  // ── product_stock ──────────────────────────────────────────────────────────
  const stock = load('product_stock.json')
  await importAll('product_stock', stock.map(s => ({
    slug:   s.slug,
    stock:  s.stock ?? null,
    status: s.status,
  })))

  // ── shipping_zones ─────────────────────────────────────────────────────────
  const zones = load('shipping_zones.json')
  await importAll('shipping_zones', zones.map(z => ({
    name:         z.name,
    price:        Number(z.price),
    active:       z.active ?? true,
    postal_codes: z.postal_codes ?? [],
  })))

  // ── shipping_config ────────────────────────────────────────────────────────
  const config = load('shipping_config.json')
  await importAll('shipping_config', config.map(c => ({
    price:       Number(c.price),
    label:       c.label,
    description: c.description ?? null,
  })))

  // ── orders ─────────────────────────────────────────────────────────────────
  const orders = load('orders.json')
  await importAll('orders', orders.map(o => ({
    status:         o.status,
    customer_name:  o.customer_name,
    customer_email: o.customer_email,
    customer_phone: o.customer_phone  ?? '',
    delivery_mode:  o.delivery_mode   ?? '',
    street:         o.street          ?? '',
    city:           o.city            ?? '',
    postal_code:    o.postal_code     ?? '',
    payment_method: o.payment_method  ?? '',
    shipping_cost:  Number(o.shipping_cost ?? 0),
    tracking_number: o.tracking_number ?? '',
    mp_payment_id:  o.mp_payment_id   ?? '',
    total:          Number(o.total),
    items:          o.items           ?? [],
  })))

  console.log('\n✓ Importación completada.')
}

main().catch(console.error)

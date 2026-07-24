/**
 * Sincroniza las reglas de acceso (API rules) de las colecciones de PocketBase
 * con el estado deseado declarado acá. Idempotente: muestra el diff y solo
 * escribe con --apply.
 *
 * Uso:
 *   node scripts/sync-collection-rules.mjs          # dry-run (diff)
 *   node scripts/sync-collection-rules.mjs --apply  # aplica los cambios
 *
 * Credenciales: PB_EMAIL/PB_PASSWORD por env, o PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD
 * de .env.local (mismas que usan los route handlers).
 *
 * Convención de reglas: null = solo superusers · '' = público · string = filtro PB.
 * Los superusers bypassean todas las reglas, así que el panel admin y los route
 * handlers server (create-order, mp-webhook, upload-payment-proof) funcionan
 * igual con todo cerrado.
 */

import { readFileSync, existsSync } from 'fs'

const PB_URL = 'https://nat.lhstudio.com.ar'
const APPLY = process.argv.includes('--apply')

// ── Estado deseado ───────────────────────────────────────────────────────────
// Público solo lo que el sitio anónimo realmente lee (fetchers server de
// src/lib/data/* + hooks browser: useProducts, usePublicShippingZones,
// useCategories en /tienda y /blog). Todo lo demás, solo superusers.
const PUBLIC_READ = { listRule: '', viewRule: '', createRule: null, updateRule: null, deleteRule: null }
const ADMIN_ONLY  = { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null }

const DESIRED = {
  products:           PUBLIC_READ,
  product_stock:      PUBLIC_READ,
  blog_posts:         PUBLIC_READ,
  site_images:        PUBLIC_READ,
  shipping_zones:     PUBLIC_READ,
  product_categories: PUBLIC_READ, // filtros de /tienda (anónimo)
  blog_categories:    PUBLIC_READ, // filtros de /blog (anónimo)
  media:              ADMIN_ONLY,  // nadie lista records; las imágenes se sirven por /api/files
  shipping_config:    ADMIN_ONLY,  // sin consumidores (useShippingConfig es código muerto)
  orders:             ADMIN_ONLY,  // creación/lectura vía route handlers con token superuser
  users:              { createRule: null }, // sin signup en la app; el resto queda como está
}

const RULE_KEYS = ['listRule', 'viewRule', 'createRule', 'updateRule', 'deleteRule']

// ── Credenciales ─────────────────────────────────────────────────────────────
function loadEnvLocal() {
  const path = new URL('../.env.local', import.meta.url)
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

const envLocal = loadEnvLocal()
const EMAIL    = process.env.PB_EMAIL    ?? envLocal.PB_ADMIN_EMAIL    ?? ''
const PASSWORD = process.env.PB_PASSWORD ?? envLocal.PB_ADMIN_PASSWORD ?? ''
if (!EMAIL || !PASSWORD) {
  console.error('❌ Faltan credenciales: PB_EMAIL/PB_PASSWORD o PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD en .env.local')
  process.exit(1)
}

// ── Sync ─────────────────────────────────────────────────────────────────────
const fmt = (r) => (r === null || r === undefined ? 'solo-admin' : r === '' ? 'PÚBLICO' : `"${r}"`)

async function main() {
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
  })
  if (!authRes.ok) {
    console.error('❌ Auth de superuser falló:', authRes.status)
    process.exit(1)
  }
  const { token } = await authRes.json()
  console.log(`✓ Autenticado contra ${PB_URL}${APPLY ? '' : '  (dry-run: usá --apply para escribir)'}\n`)

  const colsRes = await fetch(`${PB_URL}/api/collections?perPage=100`, { headers: { Authorization: token } })
  const { items } = await colsRes.json()
  const byName = new Map(items.map((c) => [c.name, c]))

  let changes = 0
  for (const [name, desired] of Object.entries(DESIRED)) {
    const col = byName.get(name)
    if (!col) {
      console.log(`⚠️  ${name}: no existe en PocketBase — salteada`)
      continue
    }
    const diff = RULE_KEYS.filter((k) => k in desired && (col[k] ?? null) !== desired[k])
    if (diff.length === 0) {
      console.log(`✓ ${name}: ok`)
      continue
    }
    changes += diff.length
    for (const k of diff) {
      console.log(`→ ${name}.${k.replace('Rule', '')}: ${fmt(col[k])}  ⇒  ${fmt(desired[k])}`)
    }
    if (APPLY) {
      const patch = Object.fromEntries(diff.map((k) => [k, desired[k]]))
      const res = await fetch(`${PB_URL}/api/collections/${col.id}`, {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) {
        console.error(`  ❌ PATCH de ${name} falló:`, res.status, await res.text().catch(() => ''))
        process.exit(1)
      }
      console.log(`  ✅ aplicado`)
    }
  }

  if (changes === 0) {
    console.log('\n✅ Todo sincronizado, nada que hacer.')
    return
  }
  if (!APPLY) {
    console.log(`\n${changes} regla(s) por cambiar. Ejecutá con --apply para escribir.`)
    return
  }

  // ── Verificación anónima post-apply ────────────────────────────────────────
  console.log('\n── Verificación anónima ──')
  const probes = [
    ['POST orders (debe fallar)', () => fetch(`${PB_URL}/api/collections/orders/records`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'probe', total: 1 }),
    }), (s) => s >= 400],
    ['GET media records (debe fallar)', () => fetch(`${PB_URL}/api/collections/media/records?perPage=1`), (s) => s >= 400],
    ['GET product_categories (debe andar)', () => fetch(`${PB_URL}/api/collections/product_categories/records?perPage=1`), (s) => s === 200],
    ['GET blog_categories (debe andar)', () => fetch(`${PB_URL}/api/collections/blog_categories/records?perPage=1`), (s) => s === 200],
    ['GET products (debe andar)', () => fetch(`${PB_URL}/api/collections/products/records?perPage=1`), (s) => s === 200],
  ]
  let failed = 0
  for (const [label, run, ok] of probes) {
    const res = await run()
    const pass = ok(res.status)
    if (!pass) failed++
    console.log(`  ${pass ? '✓' : '❌'} ${label} → HTTP ${res.status}`)
  }
  console.log(failed === 0 ? '\n✅ Reglas aplicadas y verificadas.' : `\n❌ ${failed} verificación(es) fallaron — revisar.`)
  if (failed > 0) process.exit(1)
}

main().catch((e) => {
  console.error('❌ Error:', e.message ?? e)
  process.exit(1)
})

/**
 * Recomprime las imágenes de la colección `media` de PocketBase.
 *
 * Por qué: el optimizador de Vercel nunca sirve más de ~1200px, pero para generar
 * cada variante tiene que bajarse el original entero del VPS. Con originales de
 * 2,4 MB cada MISS de caché cuesta ~2s. Bajando el peso en origen, ese viaje
 * cuesta una fracción.
 *
 * Uso:
 *   node scripts/recompress-media.mjs                  # dry-run: qué haría y cuánto ahorra
 *   node scripts/recompress-media.mjs --apply          # sube las versiones nuevas y reapunta
 *   node scripts/recompress-media.mjs --apply --prune  # además borra los records originales
 *
 * Opciones:
 *   --max-dim=1800   lado mayor permitido (default 1800)
 *   --quality=82     calidad de salida (default 82)
 *   --min-gain=15    % mínimo de ahorro para molestarse en reemplazar (default 15)
 *
 * NO es destructivo por defecto: sube cada versión recomprimida como un record
 * NUEVO de `media` y reapunta las referencias. Los originales quedan intactos y
 * accesibles por su URL vieja, así que se puede revertir con el mapeo que deja en
 * scripts/data/recompress-<timestamp>.json. Solo --prune los borra.
 *
 * Credenciales: PB_EMAIL/PB_PASSWORD por env, o PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD
 * de .env.local (mismas que usa sync-collection-rules.mjs).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import sharp from 'sharp'

const PB_URL = 'https://nat.lhstudio.com.ar'
const APPLY = process.argv.includes('--apply')
const PRUNE = process.argv.includes('--prune')

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? Number(hit.split('=')[1]) : fallback
}
const MAX_DIM = arg('max-dim', 1800)
const QUALITY = arg('quality', 82)
const MIN_GAIN = arg('min-gain', 15)

// ── Credenciales ─────────────────────────────────────────────────────────────

function loadEnv() {
  if (!existsSync('.env.local')) return {}
  return Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')]
      })
  )
}

const env = loadEnv()
const EMAIL = process.env.PB_EMAIL || env.PB_ADMIN_EMAIL
const PASSWORD = process.env.PB_PASSWORD || env.PB_ADMIN_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('Faltan credenciales: PB_EMAIL/PB_PASSWORD o PB_ADMIN_EMAIL/PB_ADMIN_PASSWORD en .env.local')
  process.exit(1)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
const mb = (n) => `${(n / 1048576).toFixed(2)} MB`
const pct = (from, to) => `${(((from - to) / from) * 100).toFixed(0)}%`

let token = ''
const api = async (path, init = {}) => {
  const res = await fetch(`${PB_URL}${path}`, {
    ...init,
    headers: { Authorization: token, ...(init.headers || {}) },
  })
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${path} → ${res.status} ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

/** Todas las URLs de /api/files que el sitio referencia, con dónde vive cada una. */
async function collectReferences() {
  const refs = new Map() // url → [{collection, recordId, field, path}]
  const add = (url, ref) => {
    if (!url || typeof url !== 'string' || !url.includes('/api/files/')) return
    if (!refs.has(url)) refs.set(url, [])
    refs.get(url).push(ref)
  }

  const products = await api('/api/collections/products/records?perPage=500')
  for (const p of products.items) {
    ;(p.images || []).forEach((url, i) =>
      add(url, { collection: 'products', recordId: p.id, field: 'images', index: i, label: p.slug })
    )
    for (const field of ['frame_variants', 'frame_options']) {
      const arr = Array.isArray(p[field]) ? p[field] : []
      arr.forEach((v, i) =>
        add(v?.image, { collection: 'products', recordId: p.id, field, index: i, label: p.slug })
      )
    }
  }

  const posts = await api('/api/collections/blog_posts/records?perPage=500')
  for (const b of posts.items) {
    add(b.cover_image, { collection: 'blog_posts', recordId: b.id, field: 'cover_image', label: b.slug })
  }

  const site = await api('/api/collections/site_images/records?perPage=500')
  for (const s of site.items) {
    for (const [k, v] of Object.entries(s)) {
      if (typeof v === 'string') add(v, { collection: 'site_images', recordId: s.id, field: k, label: s.key ?? s.id })
    }
  }

  return refs
}

/** Recomprime un buffer. Mantiene PNG→WebP para conservar alpha. */
async function recompress(buf) {
  const img = sharp(buf, { failOn: 'none' })
  const meta = await img.metadata()
  const longest = Math.max(meta.width || 0, meta.height || 0)
  const pipeline = longest > MAX_DIM ? img.resize({ width: meta.width >= meta.height ? MAX_DIM : null, height: meta.height > meta.width ? MAX_DIM : null, fit: 'inside', withoutEnlargement: true }) : img

  // El alpha no sobrevive a JPEG. WebP lo conserva y comprime mucho mejor que PNG.
  const keepAlpha = meta.hasAlpha
  const out = keepAlpha
    ? await pipeline.webp({ quality: QUALITY }).toBuffer()
    : await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer()

  return { buf: out, ext: keepAlpha ? 'webp' : 'jpg', mime: keepAlpha ? 'image/webp' : 'image/jpeg', meta, longest }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
})
if (!authRes.ok) {
  console.error('Auth falló:', authRes.status, await authRes.text())
  process.exit(1)
}
token = (await authRes.json()).token

console.log(`\n${APPLY ? 'APLICANDO' : 'DRY-RUN'} · max-dim=${MAX_DIM} quality=${QUALITY} min-gain=${MIN_GAIN}%${PRUNE ? ' · --prune' : ''}\n`)

const refs = await collectReferences()
console.log(`${refs.size} imágenes referenciadas por el sitio\n`)

const plan = []
let totalBefore = 0
let totalAfter = 0

for (const [url, where] of refs) {
  const name = url.split('/').pop().split('?')[0]
  let res
  try {
    res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (err) {
    console.log(`  ⚠ ${name} — no se pudo bajar (${err.message})`)
    continue
  }
  const original = Buffer.from(await res.arrayBuffer())

  let out
  try {
    out = await recompress(original)
  } catch (err) {
    console.log(`  ⚠ ${name} — no se pudo procesar (${err.message})`)
    continue
  }

  const gain = ((original.length - out.buf.length) / original.length) * 100
  totalBefore += original.length

  if (gain < MIN_GAIN) {
    totalAfter += original.length
    console.log(`  ·  ${name.slice(0, 42).padEnd(42)} ${kb(original.length).padStart(8)} → sin cambios (ahorro ${gain.toFixed(0)}%)`)
    continue
  }

  totalAfter += out.buf.length
  plan.push({ url, name, where, original, out })
  console.log(
    `  ✓  ${name.slice(0, 42).padEnd(42)} ${kb(original.length).padStart(8)} → ${kb(out.buf.length).padStart(8)}  (-${pct(original.length, out.buf.length)})  ${out.meta.width}x${out.meta.height}${out.longest > MAX_DIM ? ` → ${MAX_DIM}px` : ''}  [${where.length} ref]`
  )
}

console.log(`\n  total: ${mb(totalBefore)} → ${mb(totalAfter)}  (-${pct(totalBefore, totalAfter)})`)
console.log(`  a reemplazar: ${plan.length} de ${refs.size}\n`)

if (!APPLY) {
  console.log('Dry-run. Volvé a correr con --apply para subir las versiones nuevas y reapuntar las referencias.\n')
  process.exit(0)
}

if (plan.length === 0) {
  console.log('Nada para hacer.\n')
  process.exit(0)
}

// ── Subida + reapuntado ──────────────────────────────────────────────────────

const mapping = []

for (const item of plan) {
  const form = new FormData()
  const base = item.name.replace(/\.[^.]+$/, '')
  form.append('file', new Blob([item.out.buf], { type: item.out.mime }), `${base}.${item.out.ext}`)

  const created = await api('/api/collections/media/records', { method: 'POST', body: form })
  const newUrl = `${PB_URL}/api/files/${created.collectionId}/${created.id}/${created.file}`

  mapping.push({ from: item.url, to: newUrl, oldRecord: item.url.split('/')[6], newRecord: created.id, bytes: [item.original.length, item.out.buf.length] })
  console.log(`  subida ${item.name} → ${created.file}`)
}

const byUrl = new Map(mapping.map((m) => [m.from, m.to]))

// Agrupamos por record para hacer un solo PATCH por cada uno, aunque tenga
// varias imágenes cambiadas.
const patches = new Map() // `${collection}/${recordId}` → { collection, recordId, fields:{} }

for (const item of plan) {
  for (const ref of item.where) {
    const key = `${ref.collection}/${ref.recordId}`
    if (!patches.has(key)) patches.set(key, { collection: ref.collection, recordId: ref.recordId, label: ref.label, fields: {} })
    patches.get(key).fields[ref.field] = true
  }
}

for (const patch of patches.values()) {
  const record = await api(`/api/collections/${patch.collection}/records/${patch.recordId}`)
  const body = {}

  for (const field of Object.keys(patch.fields)) {
    const value = record[field]
    if (Array.isArray(value)) {
      body[field] = value.map((entry) => {
        if (typeof entry === 'string') return byUrl.get(entry) ?? entry
        if (entry && typeof entry === 'object' && typeof entry.image === 'string') {
          return { ...entry, image: byUrl.get(entry.image) ?? entry.image }
        }
        return entry
      })
    } else if (typeof value === 'string') {
      body[field] = byUrl.get(value) ?? value
    }
  }

  await api(`/api/collections/${patch.collection}/records/${patch.recordId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  console.log(`  reapuntado ${patch.collection}/${patch.label} (${Object.keys(body).join(', ')})`)
}

if (!existsSync('scripts/data')) mkdirSync('scripts/data', { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const mapFile = `scripts/data/recompress-${stamp}.json`
writeFileSync(mapFile, JSON.stringify({ maxDim: MAX_DIM, quality: QUALITY, mapping }, null, 2))
console.log(`\n  mapeo guardado en ${mapFile}`)

if (PRUNE) {
  for (const m of mapping) {
    try {
      await api(`/api/collections/media/records/${m.oldRecord}`, { method: 'DELETE' })
      console.log(`  borrado record original ${m.oldRecord}`)
    } catch (err) {
      console.log(`  ⚠ no se pudo borrar ${m.oldRecord}: ${err.message}`)
    }
  }
} else {
  console.log('  los originales quedan intactos (usá --prune para borrarlos)')
}

console.log(`\nListo. Revalidá el cache de Next para que las URLs nuevas salgan al aire:`)
console.log(`  curl -X POST "${env.SITE_URL || 'https://tu-sitio'}/api/revalidate?tag=products&secret=..."\n`)

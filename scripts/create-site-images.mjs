/**
 * Crea (idempotente) la colección `site_images` en PocketBase para SPEC 2.
 *
 * Corregido para SDK 0.26 / PocketBase 0.23+:
 *  - auth vía `_superusers` (pb.admins fue removido)
 *  - campos con formato APLANADO (values/maxSelect/mimeTypes al nivel del campo,
 *    no anidados bajo `options`)
 *
 * Uso:
 *   node --env-file=.env.local scripts/create-site-images.mjs
 * (toma PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD y POCKETBASE_URL del .env.local)
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

  // Idempotencia: si ya existe, mostramos su schema y salimos.
  try {
    const existing = await pb.collections.getOne('site_images')
    console.log('⚠ site_images ya existe. Campos:')
    for (const f of existing.fields ?? existing.schema ?? []) {
      console.log(`   - ${f.name} (${f.type})`)
    }
    console.log('\nReglas:', {
      list: existing.listRule,
      view: existing.viewRule,
      create: existing.createRule,
      update: existing.updateRule,
      delete: existing.deleteRule,
    })
    return
  } catch (e) {
    if (e.status !== 404) throw e
    // 404 = no existe → la creamos abajo.
  }

  const created = await pb.collections.create({
    name: 'site_images',
    type: 'base',
    // Formato PB 0.23+: opciones aplanadas al nivel del campo.
    fields: [
      { name: 'section', type: 'select', required: true, maxSelect: 1, values: ['home_hero', 'home_teaser', 'estudio_tattoos', 'estudio_espacio'] },
      { name: 'image', type: 'file', required: true, maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] },
      { name: 'alt', type: 'text' },
      { name: 'caption', type: 'text' },
      { name: 'sort_order', type: 'number' },
      { name: 'focal_x', type: 'number' },
      { name: 'focal_y', type: 'number' },
      { name: 'active', type: 'bool' },
    ],
    // Lectura PÚBLICA (el front anónimo la lee para SSG/ISR). Escritura: solo superuser.
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  })

  console.log('✓ site_images creada. Campos:')
  for (const f of created.fields ?? created.schema ?? []) {
    console.log(`   - ${f.name} (${f.type})`)
  }
  console.log('\nReglas: list/view públicas (""), create/update/delete = solo superuser (null).')
  console.log('Listo. Probá subir una imagen en /admin/galerias.')
}

main().catch((e) => {
  console.error('✗ Error:', e?.message || e)
  if (e?.response?.data) console.error(JSON.stringify(e.response.data, null, 2))
  process.exit(1)
})

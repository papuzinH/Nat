/**
 * Diagnóstico y corrección de la colección `orders` en PocketBase.
 * Uso:
 *   PB_EMAIL=admin@email.com PB_PASSWORD=password node scripts/fix-orders-collection.mjs
 *
 * Sin flags: solo muestra el schema actual (diagnóstico).
 * Con --fix:  elimina y recrea la colección con el schema correcto.
 */

import PocketBase from 'pocketbase'

const PB_URL   = 'https://nat.lhstudio.com.ar'
const EMAIL    = process.env.PB_EMAIL    ?? ''
const PASSWORD = process.env.PB_PASSWORD ?? ''
const FIX_MODE = process.argv.includes('--fix')

if (!EMAIL || !PASSWORD) {
  console.error('❌  Usá: PB_EMAIL=... PB_PASSWORD=... node scripts/fix-orders-collection.mjs [--fix]')
  process.exit(1)
}

const pb = new PocketBase(PB_URL)

// ── Schema correcto para `orders`
// PocketBase v0.23+ requiere `fields` (no `schema`).
// Se usan solo tipos text/number/json para máxima compatibilidad.
const CORRECT_SCHEMA = {
  name: 'orders',
  type: 'base',
  fields: [
    { name: 'status',            type: 'text'   },
    { name: 'customer_name',     type: 'text'   },
    { name: 'customer_email',    type: 'text'   },
    { name: 'customer_phone',    type: 'text'   },
    { name: 'delivery_mode',     type: 'text'   },
    { name: 'street',            type: 'text'   },
    { name: 'city',              type: 'text'   },
    { name: 'postal_code',       type: 'text'   },
    { name: 'payment_method',    type: 'text'   },
    { name: 'shipping_cost',     type: 'number' },
    { name: 'total',             type: 'number' },
    { name: 'items',             type: 'json'   },
    { name: 'tracking_number',   type: 'text'   },
    { name: 'mp_preference_id',  type: 'text'   },
    { name: 'mp_payment_id',     type: 'text'   },
    { name: 'mp_payment_status', type: 'text'   },
  ],
}

async function main() {
  // Autenticar como superusuario
  await pb.collection('_superusers').authWithPassword(EMAIL, PASSWORD)
  console.log('✓ Autenticado como superusuario\n')

  // ── Obtener colección actual ───────────────────────────────────────────────
  let existing = null
  try {
    existing = await pb.collections.getOne('orders')
    console.log('✓ Colección `orders` encontrada')
    // PB v0.23+ usa `fields`, versiones anteriores usaban `schema`
    const fieldList = existing.fields ?? existing.schema ?? []
    console.log(`\n── Schema actual (${fieldList.length} campos) ────────────────────────────────────`)
    if (fieldList.length === 0) {
      console.log('  ⚠️  Sin campos definidos (colección rota o vacía)')
    }
    for (const field of fieldList) {
      const flag = field.type === 'json' ? '' : (field.type === 'relation' ? ' ← ⚠️  ES RELATION!' : '')
      console.log(`  ${field.name.padEnd(22)} type: ${field.type}${flag}`)
    }
    // Debug: mostrar el tipo de colección
    console.log(`\n  Tipo de colección: ${existing.type ?? '(desconocido)'}`)
    if (existing.viewQuery) console.log(`  viewQuery: ${existing.viewQuery}`)
  } catch (e) {
    if (e.status === 404) {
      console.log('⚠️  La colección `orders` NO EXISTE en PocketBase.')
      if (!FIX_MODE) {
        console.log('\nEjecutá con --fix para crearla:\n  PB_EMAIL=... PB_PASSWORD=... node scripts/fix-orders-collection.mjs --fix')
        return
      }
    } else {
      console.error('❌ Error al obtener la colección:', e.message)
      process.exit(1)
    }
  }

  if (!FIX_MODE) {
    console.log('\n── Diagnóstico ─────────────────────────────────────────────────')
    console.log('  Para corregir el schema, ejecutá:')
    console.log('  PB_EMAIL=... PB_PASSWORD=... node scripts/fix-orders-collection.mjs --fix\n')
    return
  }

  // ── MODO FIX ──────────────────────────────────────────────────────────────
  if (existing) {
    // Verificar si tiene registros antes de eliminar
    try {
      const check = await pb.collection('orders').getList(1, 1)
      if (check.totalItems > 0) {
        console.error(`\n❌ La colección tiene ${check.totalItems} registros. No se eliminará para evitar pérdida de datos.`)
        console.error('   Corregí el campo "items" manualmente en el panel de PocketBase.')
        process.exit(1)
      }
    } catch {
      // Si falla el getList (400), asumimos que está vacía o rota, procedemos igual
      console.log('  (No se pudo verificar registros — colección posiblemente rota, procediendo con fix)')
    }

    console.log('\n→ Eliminando colección `orders` rota...')
    await pb.collections.delete(existing.id)
    console.log('  ✓ Eliminada')
  }

  console.log('→ Creando colección `orders` con schema correcto...')
  try {
    await pb.collections.create(CORRECT_SCHEMA)
    console.log('  ✓ Colección `orders` creada correctamente\n')
    console.log('✅ Fix completado. Recargá el panel de admin.')
  } catch (e) {
    console.error('❌ Error al crear la colección:')
    console.error('   message:', e.message)
    console.error('   status: ', e.status)
    console.error('   data:   ', JSON.stringify(e.data ?? {}, null, 4))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('❌ Error:', e.message ?? e)
  process.exit(1)
})

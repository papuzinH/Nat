import PocketBase from 'pocketbase'

const pb = new PocketBase('https://nat.lhstudio.com.ar')

async function main() {
  await pb.collection('_superusers').authWithPassword(
    process.env.PB_EMAIL    ?? '',
    process.env.PB_PASSWORD ?? '',
  )

  await pb.collections.create({
    name: 'media',
    type: 'base',
    fields: [
      { name: 'file', type: 'file', required: true, options: { maxSelect: 1, mimeTypes: ['image/jpeg','image/png','image/webp','image/gif'] } },
    ],
    listRule:   '',   // pública (lectura sin auth)
    viewRule:   '',
    createRule: '@request.auth.id != ""',  // solo admin
    updateRule: null,
    deleteRule: null,
  })
  console.log('✓ Colección media creada')
}

main().catch(console.error)

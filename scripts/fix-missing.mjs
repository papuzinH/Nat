import PocketBase from 'pocketbase'

const pb = new PocketBase('https://nat.lhstudio.com.ar')

async function main() {
  await pb.admins.authWithPassword(
    process.env.PB_EMAIL    ?? '',
    process.env.PB_PASSWORD ?? '',
  )

  await pb.collection('shipping_zones').create({
    name: 'Desde el estudio', price: 0, active: true, postal_codes: [],
  })
  console.log('✓ shipping_zones: Desde el estudio')

  await pb.collection('shipping_config').create({
    price: 0,
    label: 'Envío a domicilio',
    description: 'Coordinado con Ian. Envíos a todo el país.',
  })
  console.log('✓ shipping_config')
}

main().catch(console.error)

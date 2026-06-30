import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

// Revalidación on-demand del ISR. El admin lo invoca tras publicar/editar para
// que las páginas públicas (tienda, blog) reflejen el cambio sin esperar al TTL.
//
// Autorización (cualquiera de las dos):
//   - Header `x-revalidate-secret: <REVALIDATE_SECRET>` (server-to-server)
//   - Header `Authorization: <token>` de un superuser de PocketBase (admin browser)
//
// Body: { "tag": "products" | "blog_posts" }  (o ?tag= / ?secret= en la query)

const ALLOWED_TAGS = new Set(['products', 'blog_posts', 'site_images'])

async function isAuthorized(req: Request): Promise<boolean> {
  const secret =
    req.headers.get('x-revalidate-secret') ??
    new URL(req.url).searchParams.get('secret')
  if (process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET) {
    return true
  }

  // Token de admin PocketBase: lo validamos contra el servidor.
  const auth = req.headers.get('authorization')
  if (auth) {
    try {
      const pb = new PocketBase(process.env.POCKETBASE_URL)
      pb.authStore.save(auth.replace(/^Bearer\s+/i, ''), null)
      await pb.collection('_superusers').authRefresh()
      return pb.authStore.isValid
    } catch {
      return false
    }
  }

  return false
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let tag: string | undefined
  try {
    const body = (await req.json()) as { tag?: string }
    tag = body.tag
  } catch {
    tag = new URL(req.url).searchParams.get('tag') ?? undefined
  }

  if (!tag || !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json(
      { error: `Tag inválido. Permitidos: ${[...ALLOWED_TAGS].join(', ')}` },
      { status: 400 },
    )
  }

  // Next 16: segundo argumento obligatorio. 'max' = marca el tag como stale y
  // sirve stale-while-revalidate (recomendado para catálogo/blog).
  revalidateTag(tag, 'max')
  return NextResponse.json({ revalidated: true, tag, now: Date.now() })
}

# Checklist 01 — Next.js App Router (13+, 14, 15)

## Server Actions

- [ ] Toda Server Action valida input con Zod/Valibot ANTES de cualquier mutación
- [ ] Re-verifica auth dentro del handler (no confía en el componente padre)
- [ ] Re-verifica permisos/rol del usuario para la acción específica
- [ ] No retorna objetos del DB sin filtrar campos sensibles
- [ ] Usa `revalidatePath`/`revalidateTag` con paths fijos (no input del cliente)

```ts
// ✗ MAL
'use server'
export async function updateUser(data: any) {
  await db.user.update({ where: { id: data.id }, data })
}

// ✓ BIEN
'use server'
import { z } from 'zod'
const Schema = z.object({ id: z.string().uuid(), name: z.string().min(1).max(100) })
export async function updateUser(input: unknown) {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHORIZED')
  const { id, name } = Schema.parse(input)
  if (session.userId !== id && session.role !== 'admin') throw new Error('FORBIDDEN')
  await db.user.update({ where: { id }, data: { name } })
}
```

## Route Handlers (`app/api/**/route.ts`)

- [ ] Method handlers (GET/POST/...) validan input
- [ ] Verifican origin/CSRF para mutaciones cuando se usan cookies de sesión
- [ ] Manejan errores sin filtrar info interna
- [ ] Aplican rate limiting (Upstash, Vercel KV, etc.)
- [ ] No hacen `return NextResponse.json(error)` con el error completo
- [ ] CORS explícito si el endpoint es público (no `*` si maneja cookies)

## Middleware (`middleware.ts`)

- [ ] Aplica auth gate a rutas privadas con `matcher` correcto
- [ ] No depende solo de un cookie sin verificar la firma del JWT
- [ ] Usa `NextResponse.redirect` con URLs validadas (no input del usuario)
- [ ] Headers de seguridad seteados acá si no usás `next.config` headers

## Server Components

- [ ] No pasan datos sensibles al cliente sin necesidad (la prop "atraviesa" el bundle)
- [ ] No hacen `console.log(secret)` — aparece en server logs del provider
- [ ] Operaciones de DB con permisos del usuario actual, no del owner del proyecto

## Imágenes (`next/image`)

- [ ] `images.remotePatterns` (Next 13+) restrictivo, no `*`
- [ ] No permite `unoptimized` global a menos que sea necesario

```js
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' }
  ]
}
```

## Headers en `next.config`

Ver `references/secure-headers-nextjs.md` con snippet completo.

## SSRF y fetch server-side

- [ ] `fetch(url)` server-side donde `url` viene del cliente → validar contra allowlist de hosts
- [ ] Rechazar IPs privadas (10.x, 172.16-31.x, 192.168.x, 169.254.x, ::1, fc00::/7)
- [ ] Time out en fetch externo (`AbortSignal.timeout(5000)`)

## Streaming / Suspense

- [ ] No hacer streaming de datos sensibles a una boundary que el cliente puede inspeccionar

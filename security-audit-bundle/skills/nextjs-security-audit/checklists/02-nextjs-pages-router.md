# Checklist 02 — Next.js Pages Router (legacy)

## API Routes (`pages/api/**`)

- [ ] Cada handler hace `if (req.method !== 'POST') return res.status(405)`
- [ ] Validación de input con Zod/Valibot/Yup
- [ ] Auth verificada via `getServerSession()` o equivalente
- [ ] CSRF token cuando se usan cookies (Pages Router NO trae CSRF built-in)
- [ ] Body size limit explícito en `config.api.bodyParser.sizeLimit`
- [ ] Rate limiting (Upstash, Vercel Firewall, IP-based)

```ts
export const config = { api: { bodyParser: { sizeLimit: '1mb' } } }
```

## getServerSideProps / getStaticProps

- [ ] No retorna datos sensibles en `props` (todo lo que retornes va al HTML serializado)
- [ ] `getStaticProps` no debe accederse vía endpoint público con datos privados
- [ ] Revalidate window razonable (no 1s en endpoints costosos)

## Custom Server (`server.js`)

- [ ] Express/Koa con helmet aplicado
- [ ] Trust proxy seteado correctamente si está detrás de Vercel/CF (`app.set('trust proxy', 1)`)

## NextAuth en Pages Router

Ver `06-auth.md`.

## Headers en `next.config.js`

```js
async headers() {
  return [{ source: '/:path*', headers: securityHeaders }]
}
```

## Migración pendiente

Si el proyecto está siendo migrado a App Router, marcalo como deuda técnica. Pages Router tiene menos guardrails (CSRF, Server Actions con auth integrada, etc.).

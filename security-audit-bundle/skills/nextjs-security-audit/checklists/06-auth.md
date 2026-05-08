# Checklist 06 — Autenticación / Autorización

## NextAuth / Auth.js

- [ ] `NEXTAUTH_SECRET` (o `AUTH_SECRET`) configurado y rotado periódicamente (≥32 bytes random)
- [ ] `NEXTAUTH_URL` correcto en prod (sin trailing slash)
- [ ] Providers OAuth con redirect URIs explícitos en el dashboard del provider
- [ ] Session strategy: `jwt` para stateless, `database` si querés revocar sesiones
- [ ] `session.maxAge` razonable (≤30 días, mejor ≤7 días para apps sensibles)
- [ ] Callbacks `signIn`, `jwt`, `session` validan claims antes de retornar
- [ ] `pages.error` custom para no exponer detalles de errores de auth

```ts
// auth.config.ts
export const authConfig = {
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true }
    }
  },
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
}
```

## Clerk / Supabase Auth / Lucia

- [ ] Webhooks verificados con secret del provider
- [ ] User metadata (privada vs pública) usada correctamente
- [ ] No exponer `userId` interno donde uses email u otro identificador

## Sesiones

- [ ] Cookies con `httpOnly`, `Secure` (en prod), `SameSite=Lax` (o `Strict` si no hay flujos cross-site)
- [ ] Logout invalida la sesión server-side (no solo borra cookie cliente)
- [ ] Idle timeout (e.g. 30min sin actividad → re-login) en panels admin
- [ ] Re-auth para acciones críticas (cambiar password, eliminar cuenta, exportar datos)

## Passwords (si los manejas tú)

- [ ] **No los manejes tú** si podés evitarlo. Usá un provider (Supabase Auth, Clerk, NextAuth Credentials con argon2)
- [ ] Si los manejas: hash con `argon2id` (preferido) o `bcrypt` (cost ≥12), nunca MD5/SHA1/SHA256 plano
- [ ] Política mínima: 8 chars, sin contraseñas comunes (validar contra haveibeenpwned API)
- [ ] Rate limit en login (5 intentos / 15min, lockout exponencial)
- [ ] Email de notificación cuando hay login desde nuevo device/IP

## MFA

- [ ] Disponible para usuarios (TOTP via authenticator app)
- [ ] Obligatorio para admin/staff si la app maneja datos sensibles
- [ ] Recovery codes one-time-use, hasheados en DB

## OAuth

- [ ] State parameter validado (CSRF en OAuth)
- [ ] PKCE en flujos public (mobile/SPA)
- [ ] Scopes mínimos necesarios

## Authorization (RBAC/ABAC)

- [ ] Roles guardados en DB, no en JWT mutable por cliente
- [ ] Cada Route Handler / Server Action verifica el rol específico antes de ejecutar
- [ ] No "security through obscurity" (esconder botones admin no es seguridad)
- [ ] IDOR: cada GET/PATCH/DELETE de recurso `:id` verifica ownership o rol

```ts
// Anti-IDOR pattern
async function getAppointment(id: string, session: Session) {
  const apt = await db.appointment.findUnique({ where: { id } })
  if (!apt) throw new Error('NOT_FOUND')
  if (apt.userId !== session.userId && session.role !== 'admin') {
    throw new Error('FORBIDDEN')  // 403, no 404 (no leak existence)
  }
  return apt
}
```

## CSRF

- [ ] Si usás cookies de sesión + endpoints state-changing → CSRF tokens (NextAuth lo trae built-in)
- [ ] `SameSite=Lax` ayuda pero no reemplaza CSRF tokens en navegadores viejos
- [ ] APIs Bearer-token-only no necesitan CSRF (Authorization header no se envía cross-origin por default)

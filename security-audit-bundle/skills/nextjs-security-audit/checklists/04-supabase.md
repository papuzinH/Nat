# Checklist 04 — Supabase

Supabase es seguro **si y solo si** RLS está bien configurada en cada tabla. Sin RLS, la anon key permite leer todo.

## Row Level Security (RLS)

- [ ] **TODA** tabla en `public` tiene `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`
- [ ] **TODA** tabla en `public` tiene al menos una policy explícita (sin policies con RLS habilitada = nada se puede leer/escribir, lo cual también es problema)
- [ ] Las policies usan `auth.uid()` o `auth.jwt()` para identificar al usuario
- [ ] Tablas con `is_public = true` tienen policy `SELECT USING (is_public = true)` y otra para owners
- [ ] Storage buckets tienen policies (la UI de Supabase lo muestra como sección aparte)

```sql
-- Ejemplo correcto:
alter table appointments enable row level security;

create policy "users see own appointments"
on appointments for select
using (auth.uid() = user_id);

create policy "users insert own appointments"
on appointments for insert
with check (auth.uid() = user_id);

create policy "admins see all"
on appointments for select
using (exists (
  select 1 from user_roles
  where user_id = auth.uid() and role = 'admin'
));
```

## Service role key

- [ ] `SUPABASE_SERVICE_ROLE_KEY` SOLO en server (Route Handlers, Server Actions, Edge Functions)
- [ ] NUNCA en `NEXT_PUBLIC_*` ni `VITE_*`
- [ ] Cliente con service_role bypassea RLS — usalo solo para tareas admin server-side

```ts
// ✓ Solo en server
import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // server-only
)
```

## Auth

- [ ] Cookies de sesión usan `@supabase/ssr` (en Next.js) con `httpOnly`, `Secure`, `SameSite=Lax`
- [ ] Email confirmations activadas (settings)
- [ ] Password requirements: min 8 chars (Supabase tiene config)
- [ ] Rate limiting de Supabase activo (auth → rate limits)
- [ ] OAuth providers usan Allowed Redirect URLs explícitas (no `*`)

## Storage

- [ ] Buckets privados por defecto, públicos solo si justificado
- [ ] Policies en `storage.objects` por bucket
- [ ] Signed URLs con expiración corta para contenido sensible
- [ ] `file_size_limit` y `allowed_mime_types` por bucket

## Edge Functions

- [ ] Validan `Authorization` header (JWT) en cada función pública
- [ ] No exponen variables internas en respuestas de error
- [ ] CORS configurado restrictivo (no `*` para mutations)
- [ ] Secrets en Supabase Vault o env vars de la función (no en el código)

## Database

- [ ] Backups automáticos activados (plan paid)
- [ ] Point-in-Time Recovery si el plan lo permite
- [ ] No se conectan herramientas externas con la connection string en repo

## Realtime

- [ ] Channels privados verificados con RLS también (Realtime respeta RLS desde v2.x si está bien configurado)

## Heurística rápida

```bash
# En el proyecto:
grep -rE "supabase\.from\(" --include="*.ts" --include="*.tsx" | wc -l
# Cada uso es un punto donde RLS DEBE proteger. Si hay 50 usages y solo 10 tablas con policy, hay problema.
```

## Caso "gestión de turnos" (Steffen)

Tablas críticas y sus policies mínimas:

| Tabla | Policies necesarias |
|---|---|
| `appointments` | SELECT/INSERT/UPDATE solo por owner; SELECT all para admin |
| `clients` | SELECT/UPDATE solo por staff con rol; INSERT por staff |
| `medical_notes` (si aplica) | SELECT/UPDATE solo por profesional asignado + admin |
| `audit_logs` | INSERT por sistema; SELECT solo admin; nunca UPDATE/DELETE |
| `user_roles` | SELECT por owner; UPDATE solo por super-admin |

Verificá que `audit_logs` no permita modificación retroactiva (RLS sin UPDATE/DELETE policy).

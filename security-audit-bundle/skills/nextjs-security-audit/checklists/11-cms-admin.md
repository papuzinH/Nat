# Checklist 11 — CMS / Panel Admin / Gestión de datos sensibles

Aplica a: paneles internos, gestión de turnos, dashboards de pacientes/clientes, herramientas de staff con datos personales/médicos/financieros.

## Modelo de amenazas

Atacantes prioritarios:
1. Empleado interno deshonesto (insider).
2. Cuenta de staff comprometida (phishing → reuso de password).
3. IDOR via URLs `/admin/clients/123` cambiando el ID.
4. Bot scraping si la URL `/admin` es indexable.

## Acceso al panel

- [ ] URL del admin no listada en sitemap, `noindex`, `Disallow: /admin` en robots.txt
- [ ] Login admin separado del login público si es viable (subdomain `admin.example.com`)
- [ ] Allowlist por IP si el equipo es pequeño y trabaja desde oficinas fijas (Cloudflare Access / Vercel firewall)
- [ ] MFA OBLIGATORIO para roles admin/staff (TOTP mínimo)
- [ ] Recovery codes en alta de cuenta, hasheados y one-time-use

## Sesiones de staff

- [ ] Cookie `__Secure-...session` con `httpOnly`, `Secure`, `SameSite=Lax` (o `Strict`)
- [ ] Idle timeout 30min, max session 8h
- [ ] Re-auth para acciones críticas (eliminar cliente, exportar CSV, modificar facturación)
- [ ] Logout server-side invalida la sesión (no solo borra cookie)
- [ ] "Cerrar todas las sesiones" disponible en perfil

## RBAC / ABAC

- [ ] Roles guardados en DB con audit trail de cambios (`user_roles_history`)
- [ ] Cada Server Action / Route Handler verifica el rol Y el ownership/scope:
  ```ts
  if (!['admin','staff'].includes(session.role)) throw new Error('FORBIDDEN')
  if (session.role === 'staff' && resource.assignedTo !== session.userId) {
    throw new Error('FORBIDDEN')
  }
  ```
- [ ] No hay rol "superadmin" implícito en código (ej: `if (user.email === 'me@x.com')`)
- [ ] Permisos granulares (read/write/delete por entidad), no monolíticos

## Audit log obligatorio

Tabla con todas las mutaciones de datos sensibles:

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id),
  action text not null,            -- 'appointment.create', 'client.delete', ...
  target_type text not null,       -- 'appointment', 'client', ...
  target_id uuid,
  diff jsonb,                      -- before/after (sanitizado, sin PII innecesaria)
  ip inet,
  user_agent text,
  created_at timestamptz default now()
);

alter table audit_logs enable row level security;
create policy "insert any" on audit_logs for insert with check (true);
create policy "admins read" on audit_logs for select using (
  exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
);
-- NO update/delete policies → append-only
```

- [ ] Toda creación/modificación/eliminación de turno, cliente, historia clínica → log
- [ ] Logs son **append-only** (sin UPDATE/DELETE policies)
- [ ] Retención mínima 1 año (regulatorio en muchos casos)
- [ ] Diff guarda before/after sin loggear campos ultra-sensibles plaintext

## Datos sensibles en DB

- [ ] PII identificada y mapeada (DNI, teléfono, dirección, email, datos médicos)
- [ ] Cifrado at-rest (Supabase/RDS lo hacen por default; verificar)
- [ ] Cifrado de columnas particularmente sensibles si aplica (pgcrypto / app-level)
- [ ] Soft delete con `deleted_at` para datos requeridos legalmente; hard delete sólo después de retención
- [ ] DSAR: endpoint para que el cliente solicite export/eliminación de sus datos (GDPR / Ley 25.326 AR)

## Export / impresión

- [ ] Exports CSV/PDF requieren permiso explícito del rol
- [ ] Cada export queda loggeado (`audit_logs` con `action='export.clients'`)
- [ ] Watermark con `username + timestamp` en PDFs sensibles
- [ ] Rate limit en exports (e.g. max 5/día por usuario)

## IDOR / Authorization

- [ ] Cada endpoint que recibe `:id` valida que el usuario tenga permiso sobre ese recurso
- [ ] Respuestas 404 (no 403) cuando no se tiene permiso, para no leak existence (a menos que política diga lo contrario)
- [ ] UUIDs aleatorios (no autoincrement) en URLs públicas

## CSRF (admin con cookies)

- [ ] Tokens CSRF en todos los POST/PATCH/DELETE
- [ ] `SameSite=Lax` no es suficiente — agregá double-submit cookie o token-per-form
- [ ] Endpoints state-changing rechazan si `Origin` header no coincide

## Inputs en CMS

- [ ] Editor rich text (Tiptap, Lexical) con sanitización al guardar Y al renderizar
- [ ] Markdown del CMS pasa por DOMPurify antes de mostrar al público
- [ ] No permitir HTML embebido sin allowlist de tags

## Logs y privacidad

- [ ] No loggear cuerpos completos de requests (PII)
- [ ] No loggear el resultado completo de queries con datos médicos
- [ ] Si usás Sentry → scrubbing de keys: `email`, `phone`, `dni`, `address`, `medicalHistory`

## Backups

- [ ] Encriptados en reposo
- [ ] Acceso restringido (IAM con MFA)
- [ ] Restore probado al menos cada 6 meses
- [ ] Retención según política

## Compliance localizado

| Región / Caso | Aplica |
|---|---|
| Argentina | Ley 25.326 (datos personales), Ley 26.529 (datos de salud), Resolución AAIP 14/2018 |
| EU/UK | GDPR |
| EEUU healthcare | HIPAA |
| EEUU pagos | PCI-DSS si manejas tarjetas |

- [ ] Privacy policy refleja datos recolectados, base legal, retención, derechos del titular
- [ ] DPA firmado con providers (Supabase, Vercel, Stripe)
- [ ] Contacto del DPO publicado si aplica

## Caso "gestión de turnos" (Steffen)

Lista mínima específica:
- [ ] Solo el profesional asignado + admin ven los detalles del turno
- [ ] Cliente ve solo sus propios turnos (RLS por `client_id = auth.uid()` o equivalente)
- [ ] No-show / cancelación logueada con timestamp + actor
- [ ] Notas internas del profesional separadas de notas que ve el cliente
- [ ] Recordatorios por SMS/WhatsApp no exponen detalles sensibles en preview
- [ ] Si hay historia clínica → cifrado de columna y acceso solo del profesional + paciente
- [ ] Lista de turnos del día NO se imprime con datos completos (initials + horario es suficiente para el tablero)

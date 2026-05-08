---
name: nextjs-security-audit
description: Auditoría de seguridad exhaustiva para proyectos Next.js, Vite/React SPA, Remix y stacks asociados (Supabase, Stripe, Auth.js, Prisma, Drizzle). Úsalo cuando el usuario mencione auditoría de seguridad, vulnerabilidades, security review, OWASP, RLS, secrets, XSS, CSRF, SQL injection, dependencias inseguras, headers HTTP, CSP, rate limiting, autenticación, autorización, hardening, pentesting, o quiera revisar la seguridad de un proyecto web. Adapta la profundidad y el checklist al tipo de aplicación detectado (e-commerce, blog, SaaS, portfolio, dashboard interno) y genera un plan de acción priorizado por severidad con código de remediación listo para aplicar.
license: MIT
---

# Next.js Security Audit Skill

Auditoría de seguridad exhaustiva, adaptativa y accionable para proyectos web modernos. Detecta el stack, ejecuta scanners reales, mapea hallazgos a OWASP Top 10 + CWE, y entrega un plan priorizado.

---

## Quickstart — flujo de ejecución

Cuando el usuario pida una auditoría de seguridad, sigue ESTE orden estricto. No saltes pasos.

### Fase 0 — Reconocimiento del proyecto (siempre)

Antes de cualquier checklist, descubre el stack y el perfil de la app:

1. Lee `package.json` (raíz del proyecto). Identifica:
   - **Framework**: Next.js (App vs Pages Router), Vite + React, Remix, Astro, SvelteKit
   - **DB / BaaS**: Supabase, Prisma, Drizzle, Mongoose, PlanetScale, Neon
   - **Auth**: Auth.js/NextAuth, Clerk, Supabase Auth, Lucia, custom JWT
   - **Pagos**: Stripe, Mercado Pago, PayPal, LemonSqueezy
   - **Hosting**: Vercel, Netlify, Cloudflare, Railway, self-hosted
   - **Form/CMS**: Sanity, Contentful, Strapi, Payload
2. Lee `next.config.{js,ts,mjs}` o `vite.config.ts` o `remix.config.js`.
3. Lee la estructura de `app/`, `pages/`, `src/app/`, `src/pages/api/`, `app/api/`, `middleware.ts`, `src/middleware.ts`.
4. Si existe `CLAUDE.md` o `README.md`, léelo para entender contexto de negocio.
5. **Pregúntale al usuario** (con AskUserQuestion) el perfil de la aplicación si no es obvio:
   - ¿E-commerce con pagos reales? ¿Blog público? ¿Dashboard interno? ¿SaaS multi-tenant? ¿Portfolio estático?
   - ¿Maneja datos personales (PII)? ¿Datos médicos / financieros?
   - ¿Hay autenticación de usuarios? ¿Roles?
   - ¿Está en producción ya o pre-launch?

Esta info determina QUÉ checklists cargar.

### Fase 1 — Escaneos automáticos (scripts/)

Ejecuta los scripts del directorio `scripts/` en este orden. Cada uno emite findings JSON que después consolidas:

```bash
# Desde la raíz del proyecto a auditar:
bash <SKILL_DIR>/scripts/scan-dependencies.sh    # npm audit + outdated críticos
bash <SKILL_DIR>/scripts/scan-secrets.sh         # gitleaks + regex de secrets
bash <SKILL_DIR>/scripts/scan-headers.sh         # detecta CSP, HSTS, X-Frame en config
bash <SKILL_DIR>/scripts/scan-env.sh             # variables NEXT_PUBLIC_ con secrets
bash <SKILL_DIR>/scripts/scan-supabase-rls.sh    # solo si Supabase está presente
bash <SKILL_DIR>/scripts/scan-dangerous-apis.sh  # dangerouslySetInnerHTML, eval, etc
```

Si `gitleaks` no está instalado, el script avisa y cae al fallback regex. Documéntalo.

### Fase 2 — Revisión manual por checklist (checklists/)

Carga SOLO los checklists relevantes al stack detectado. **No leas todos siempre** — gasta contexto.

| Detectaste... | Carga |
|---|---|
| Cualquier proyecto web | `checklists/00-baseline.md` (siempre) |
| Next.js App Router | `checklists/01-nextjs-app-router.md` |
| Next.js Pages Router | `checklists/02-nextjs-pages-router.md` |
| Vite SPA / React Router | `checklists/03-spa-vite.md` |
| Supabase | `checklists/04-supabase.md` |
| Stripe / Mercado Pago | `checklists/05-payments.md` |
| Auth.js / NextAuth / Clerk | `checklists/06-auth.md` |
| E-commerce (carrito, checkout) | `checklists/07-ecommerce.md` |
| Blog / contenido user-generated | `checklists/08-content-blog.md` |
| Formulario de contacto / leads | `checklists/09-forms.md` |
| Subida de archivos | `checklists/10-file-upload.md` |
| CMS / panel admin / gestión de turnos / datos sensibles | `checklists/11-cms-admin.md` |

### Fase 3 — Análisis profundo (opcional pero recomendado)

Si el proyecto es de producción o de alto riesgo (e-commerce con pagos, datos sensibles), invoca el subagente `security-auditor` (definido en `agents/security-auditor.md` del plugin) con la lista de archivos sospechosos. Este agente lee a fondo y reporta sin contaminar el contexto principal.

### Fase 4 — Reporte final

Genera UN solo archivo `SECURITY_AUDIT.md` en la raíz del proyecto auditado con esta estructura exacta (ver `references/report-template.md`):

1. **Resumen ejecutivo** (3-5 líneas, severidad global)
2. **Stack detectado** y perfil de la app
3. **Findings** ordenados por severidad: Critical / High / Medium / Low / Info
   - Cada finding: ID, título, descripción, archivo:línea, OWASP/CWE, código vulnerable, remediación con código aplicable
4. **Plan de acción priorizado** con esfuerzo estimado (S/M/L) y orden de aplicación
5. **Checklist de mejoras continuas** (post-launch monitoring, dependabot, etc.)

---

## Modelo de severidad

Usa esta escala. NO inventes otra:

| Nivel | Criterio |
|---|---|
| **Critical** | Explotable remotamente sin auth → acceso/RCE/leak masivo. Aplicar HOY. |
| **High** | Explotable con auth o requiere setup, impacto alto (XSS persistente, IDOR, RLS rota). Aplicar esta semana. |
| **Medium** | Requiere condiciones específicas o impacto limitado (CSRF en endpoint poco usado, headers faltantes). Aplicar este sprint. |
| **Low** | Defensa en profundidad, hardening (TLS config, cookie flags menores). Backlog. |
| **Info** | Buenas prácticas, no es vulnerabilidad. |

Cada finding mapea a OWASP Top 10 (2021) y a CWE. Ver `references/owasp-cwe-mapping.md`.

---

## Reglas de comportamiento

1. **No declares "seguro" sin evidencia.** Si no escaneaste algo, dilo explícitamente en el reporte.
2. **No inventes vulnerabilidades.** Cada finding debe citar archivo:línea o salida del scanner.
3. **Código de remediación = aplicable directo.** No pseudo-código. Respeta el stack del proyecto.
4. **Adapta al perfil.** Un blog estático no necesita rate limiting agresivo; un e-commerce con pagos sí.
5. **Falsos positivos.** Si un finding del scanner es FP (ej: una regex de secrets matcheó una constante pública), márcalo como FP en el reporte y explica por qué.
6. **No ejecutes exploits.** Esto es auditoría defensiva, no pentesting activo. Nunca pruebes payloads contra prod.
7. **Secrets reales encontrados.** Si encuentras un secret real en el repo, marca Critical y recomienda rotación inmediata + `git filter-repo`. NO lo cites textual en el reporte (truncá: `sk_live_***...***abc`).

---

## Estructura de este skill

```
nextjs-security-audit/
├── SKILL.md                          (este archivo)
├── scripts/
│   ├── scan-dependencies.sh
│   ├── scan-secrets.sh
│   ├── scan-headers.sh
│   ├── scan-env.sh
│   ├── scan-supabase-rls.sh
│   └── scan-dangerous-apis.sh
├── checklists/
│   ├── 00-baseline.md
│   ├── 01-nextjs-app-router.md
│   ├── 02-nextjs-pages-router.md
│   ├── 03-spa-vite.md
│   ├── 04-supabase.md
│   ├── 05-payments.md
│   ├── 06-auth.md
│   ├── 07-ecommerce.md
│   ├── 08-content-blog.md
│   ├── 09-forms.md
│   ├── 10-file-upload.md
│   └── 11-cms-admin.md
└── references/
    ├── owasp-cwe-mapping.md
    ├── report-template.md
    ├── secure-headers-nextjs.md
    └── csp-builder.md
```

---

## Adaptación por tipo de proyecto

### E-commerce + Blog (caso NatArt)

**Carga obligatoria**: `00-baseline`, `03-spa-vite` (si es Vite) o `01-nextjs-app-router`, `07-ecommerce`, `08-content-blog`, `09-forms`.

Foco específico:
- Validación de precios server-side (nunca confiar en el cliente).
- Webhook signature verification (Stripe / Mercado Pago).
- Sanitización de markdown del blog si renderizás HTML.
- Rate limiting en `/api/contact` y `/api/checkout`.
- CSP estricta con `script-src 'self'` + nonces — no `unsafe-inline` excepto donde GTM lo exija con dominio específico.
- Datos de cliente cifrados en reposo (Supabase ya lo hace; verificar).

### CMS / Panel admin con datos sensibles (caso Steffen — gestión de turnos)

**Carga obligatoria**: `00-baseline`, framework router correspondiente, `04-supabase` (si aplica), `06-auth`, `09-forms`, `11-cms-admin`.

Foco específico:
- **RBAC/ABAC server-side**: cada acción del admin debe re-verificar el rol en el server (no confiar en JWT cliente ni en hidden UI).
- **IDOR en recursos**: cada endpoint `/api/turnos/:id`, `/api/clientes/:id`, etc. valida ownership antes de leer/mutar.
- **Audit log**: toda mutación de datos sensibles (crear/modificar/eliminar turno, cliente, historia clínica) queda en una tabla `audit_logs` con `actor_id`, `action`, `target`, `timestamp`, `ip`, `user_agent`.
- **Session hardening del admin**: cookies `httpOnly`, `Secure`, `SameSite=Lax`/`Strict`, expiración corta (≤8h activa, idle timeout 30min), refresh seguro.
- **MFA para admins** (al menos TOTP). Plan obligatorio si hay PII médica/financiera.
- **Soft delete** + retención: nunca borrar fila duro de turnos/clientes históricos sin política explícita.
- **Export de datos**: si el panel exporta CSV/PDF con PII, validar permisos por export y loggear el evento.
- **CSRF en mutaciones**: si el admin usa cookies de sesión (no Bearer token), todo POST/PATCH/DELETE necesita protección CSRF (double-submit cookie o tokens por request).
- **Rate limiting + lockout** en login admin (ej: 5 intentos / 15min, lockout exponencial).
- **Datos en logs**: nunca loggear cuerpos completos de requests con PII. Truncar emails, hashear teléfonos, redactar campos sensibles.
- **Backups cifrados** y restore probado.
- **Variables de entorno**: `SUPABASE_SERVICE_ROLE_KEY` SOLO server-side, jamás `NEXT_PUBLIC_`.

### SaaS multi-tenant

Carga adicional: foco en `04-supabase` (RLS por tenant_id), `06-auth` (sesión + roles), `11-cms-admin`, IDOR en cada endpoint que reciba `:id`.

### Portfolio / sitio estático

Carga mínima: `00-baseline` + headers + dependencias. Salta checklists de auth/payments.

---

## Cuando termines

Reporta al usuario:
1. Path del archivo `SECURITY_AUDIT.md` generado.
2. Conteo de findings por severidad.
3. Top 3 acciones críticas a aplicar primero.
4. Si hay secrets expuestos → mensaje destacado con pasos de rotación.

# SECURITY_AUDIT.md — Template

Usá este template literal cuando emitas el reporte final. Reemplazá `{{...}}` con valores reales.

---

```markdown
# Security Audit — {{project_name}}

> Auditoría: {{date}} · Auditor: Claude (skill: nextjs-security-audit) · Scope: {{commit_sha o "working tree"}}

## 1. Resumen ejecutivo

**Severidad global**: {{Critical|High|Medium|Low|Info}}

{{2-4 frases describiendo el estado general. Mencionar si hay críticos sin remediar, si la postura general es razonable, etc.}}

| Severidad | Findings |
|---|---|
| Critical | {{N}} |
| High | {{N}} |
| Medium | {{N}} |
| Low | {{N}} |
| Info | {{N}} |

## 2. Stack y perfil

- **Framework**: {{Next.js 15 App Router | Vite + React | ...}}
- **Database / BaaS**: {{Supabase | Postgres + Drizzle | ...}}
- **Auth**: {{NextAuth | Clerk | Supabase Auth | ninguno}}
- **Pagos**: {{Stripe | Mercado Pago | ninguno}}
- **Hosting**: {{Vercel | Netlify | ...}}
- **Perfil**: {{e-commerce + blog | SaaS | CMS interno | portfolio}}
- **Datos sensibles**: {{PII clientes | datos médicos | datos financieros | ninguno especial}}

## 3. Findings

### CRITICAL

#### C1 — {{título corto}}
- **Archivo**: `path/to/file.ts:42`
- **OWASP**: A01 Broken Access Control · **CWE**: CWE-862
- **Descripción**: {{qué pasa, qué riesgo concreto introduce}}
- **Código vulnerable**:
  ```ts
  {{snippet original truncado, sin secrets}}
  ```
- **Remediación**:
  ```ts
  {{snippet corregido aplicable directo}}
  ```
- **Esfuerzo**: S (≤1h)

### HIGH

#### H1 — ...

### MEDIUM

#### M1 — ...

### LOW

#### L1 — ...

### INFO

#### I1 — ...

## 4. Plan de acción priorizado

| # | Finding | Severidad | Esfuerzo | Owner sugerido |
|---|---|---|---|---|
| 1 | C1 | Critical | S | Backend |
| 2 | C2 | Critical | M | Backend |
| 3 | H1 | High | S | Frontend |
| ... | ... | ... | ... | ... |

**Aplicar HOY**: {{lista de IDs Critical}}
**Esta semana**: {{lista de IDs High}}
**Este sprint**: {{lista de IDs Medium}}
**Backlog**: {{Low + Info}}

## 5. Mejoras continuas

- [ ] Activar Dependabot/Renovate (ver `.github/dependabot.yml.example`)
- [ ] Integrar `gitleaks` en pre-commit hook y CI
- [ ] Configurar Sentry/Logtail con scrubbing PII
- [ ] Pen-test externo cuando: {{evento que lo amerite}}
- [ ] Re-correr este skill cada {{4 semanas}} o antes de cada release mayor

## 6. Lo que NO se auditó (transparencia)

- {{ej: backend de Stripe Radar (caja negra)}}
- {{ej: infra del provider (Vercel) — confiamos en su SOC 2}}
- {{ej: análisis dinámico / pen-test activo}}

## 7. Referencias

- OWASP Top 10 2021: https://owasp.org/Top10/
- Next.js Security: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
```

# Checklist 00 — Baseline (todos los proyectos)

Cosas que verificar SIEMPRE, sin importar el stack.

## Repositorio

- [ ] `.gitignore` cubre `.env*`, `node_modules/`, `dist/`, `.next/`, `*.pem`, `*.key`
- [ ] No hay `.env` ni `.env.local` versionados (`git ls-files | grep .env`)
- [ ] No hay secrets hardcodeados (corrió `scan-secrets.sh`)
- [ ] `package.json` no expone `private: false` accidental si es repo privado
- [ ] No hay archivos `*.sql.bak`, `dump.sql`, `backup.zip` en el repo
- [ ] `.npmrc` o `.yarnrc` sin tokens (`//registry.npmjs.org/:_authToken=...`)
- [ ] Branches protegidos en GitHub/GitLab para `main`/`production`

## Dependencias

- [ ] `npm audit` o `pnpm audit` sin vulnerabilidades High/Critical
- [ ] Lockfile presente y commiteado (`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`)
- [ ] Dependabot o Renovate configurado (`.github/dependabot.yml`)
- [ ] No usa paquetes deprecated críticos (`request`, `node-uuid`, etc.)
- [ ] Versiones pinneadas o con caret razonable, evita `*` y `latest`
- [ ] Auditá `npm ls` para detectar deps duplicadas con versiones vulnerables

## Variables de entorno

- [ ] Distinción clara entre vars públicas (`NEXT_PUBLIC_*`, `VITE_*`) y privadas
- [ ] Ninguna var pública contiene `SECRET`, `PRIVATE`, `SERVICE_ROLE`, `PASSWORD`
- [ ] `.env.example` documenta todas las variables necesarias (sin valores reales)
- [ ] Variables de prod cargadas desde el dashboard del provider (Vercel/Netlify), no desde repo
- [ ] Rotación de secrets documentada (cuándo y cómo)

## HTTPS / TLS

- [ ] Sitio sirve solo HTTPS (redirect 301 desde HTTP)
- [ ] HSTS configurado: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [ ] Certificado válido y con auto-renovación (Let's Encrypt vía Vercel/Cloudflare)
- [ ] Cookies con flag `Secure` en prod

## Headers de seguridad mínimos

Ver `references/secure-headers-nextjs.md` para snippets aplicables.

- [ ] `Content-Security-Policy` definida (no solo `default-src *`)
- [ ] `X-Frame-Options: DENY` o `SAMEORIGIN` (clickjacking)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` restringe APIs (camera, microphone, geolocation, payment) a `()` si no se usan
- [ ] Sin `Server: ...` revelando versión

## Logging y errores

- [ ] Errores en prod no exponen stack traces al usuario
- [ ] No se loggean tokens, passwords, ni cuerpos de request con PII
- [ ] Sentry/Datadog/Logtail con scrubbing de datos sensibles
- [ ] Los logs no van a un destino público (S3 público, etc.)

## DNS y dominio

- [ ] DNSSEC activo si el registrar lo soporta
- [ ] CAA record limita qué CAs pueden emitir certs
- [ ] Subdominios obsoletos eliminados (subdomain takeover)
- [ ] SPF, DKIM, DMARC configurados si el dominio envía email

## CI/CD

- [ ] Secrets de CI guardados como secrets del proveedor, no en YAML
- [ ] Acción de GitHub `pull_request_target` evitada en repos públicos (RCE clásico)
- [ ] Permisos de `GITHUB_TOKEN` mínimos (`permissions: contents: read`)
- [ ] No hay `npm publish` automático sin tag verificado

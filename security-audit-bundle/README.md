# nextjs-security-audit — Skill + Subagente + Comando

Auditoría de seguridad exhaustiva, adaptativa y accionable para proyectos web modernos (Next.js, Vite/React SPA, Remix) con stacks asociados (Supabase, Stripe, Mercado Pago, Auth.js, Clerk, Prisma, Drizzle).

## Qué incluye

```
security-audit-bundle/
├── skills/nextjs-security-audit/      ← El skill (cargable por Claude Code)
│   ├── SKILL.md                       ← Punto de entrada con flujo de 4 fases
│   ├── scripts/                       ← Escaneos shell (deps, secrets, headers, env, RLS, APIs)
│   ├── checklists/                    ← 12 checklists modulares por stack/perfil
│   └── references/                    ← Templates, OWASP/CWE map, snippets headers + CSP
├── agents/security-auditor.md         ← Subagente para reviews profundos en background
├── commands/security-audit.md         ← Slash command `/security-audit`
└── README.md                          ← Este archivo
```

## Qué hace

1. **Detecta tu stack** (Next.js App vs Pages, Vite, Supabase, Stripe, Auth.js…) leyendo `package.json` + configs.
2. **Pregunta el perfil** (e-commerce, blog, CMS con datos sensibles, SaaS, portfolio) para cargar los checklists correctos.
3. **Corre scanners reales**:
   - `scan-dependencies.sh` → `npm audit` + chequeo de versiones críticas
   - `scan-secrets.sh` → `gitleaks` (si está instalado) o regex fallback
   - `scan-headers.sh` → headers de seguridad faltantes en config
   - `scan-env.sh` → variables `NEXT_PUBLIC_*` / `VITE_*` con secrets
   - `scan-supabase-rls.sh` → tablas sin RLS, service_role en cliente
   - `scan-dangerous-apis.sh` → `eval`, `dangerouslySetInnerHTML`, CORS abierto, SSRF, etc.
4. **Carga checklists relevantes** (no todos, ahorra contexto):
   - 00 baseline · 01 Next App Router · 02 Next Pages Router · 03 Vite SPA
   - 04 Supabase · 05 Pagos · 06 Auth · 07 E-commerce · 08 Blog/UGC
   - 09 Forms · 10 File upload · 11 **CMS / Admin / datos sensibles**
5. **Invoca subagente** `security-auditor` para review profundo de archivos sospechosos sin contaminar tu chat.
6. **Genera `SECURITY_AUDIT.md`** en la raíz del proyecto: findings ordenados por severidad (Critical → Info), cada uno con archivo:línea, OWASP/CWE, código vulnerable y remediación lista para aplicar.
7. **Plan de acción priorizado** con esfuerzo (S/M/L) y orden cronológico (hoy / esta semana / este sprint / backlog).

## Instalación

### Opción A — Como skill personal (recomendado, 1 minuto)

Esto lo deja disponible en TODOS tus proyectos.

**Windows (PowerShell):**

```powershell
# 1. Crear carpeta de skills personal si no existe
mkdir $env:USERPROFILE\.claude\skills -Force

# 2. Copiar el skill (ajustá la ruta de origen al lugar donde guardes este bundle)
Copy-Item -Recurse `
  "C:\ruta\donde\descargaste\security-audit-bundle\skills\nextjs-security-audit" `
  "$env:USERPROFILE\.claude\skills\"

# 3. Subagente y comando (también globales)
mkdir $env:USERPROFILE\.claude\agents -Force
mkdir $env:USERPROFILE\.claude\commands -Force
Copy-Item "C:\ruta\donde\descargaste\security-audit-bundle\agents\security-auditor.md" "$env:USERPROFILE\.claude\agents\"
Copy-Item "C:\ruta\donde\descargaste\security-audit-bundle\commands\security-audit.md" "$env:USERPROFILE\.claude\commands\"
```

**macOS/Linux:**

```bash
mkdir -p ~/.claude/{skills,agents,commands}
cp -r security-audit-bundle/skills/nextjs-security-audit ~/.claude/skills/
cp security-audit-bundle/agents/security-auditor.md ~/.claude/agents/
cp security-audit-bundle/commands/security-audit.md ~/.claude/commands/
chmod +x ~/.claude/skills/nextjs-security-audit/scripts/*.sh
```

Reiniciá Claude Code (`/exit` y volvé a abrir) para que detecte los archivos nuevos.

### Opción B — Como skill de proyecto

Si querés que esté solo en este repo (y se commitee):

```bash
# Desde la raíz del proyecto
mkdir -p .claude/{skills,agents,commands}
cp -r /ruta/security-audit-bundle/skills/nextjs-security-audit .claude/skills/
cp /ruta/security-audit-bundle/agents/security-auditor.md .claude/agents/
cp /ruta/security-audit-bundle/commands/security-audit.md .claude/commands/
chmod +x .claude/skills/nextjs-security-audit/scripts/*.sh
```

Y agregá a `.gitignore` si no querés commitear el reporte:
```
SECURITY_AUDIT.md
```

### Dependencias opcionales (mejoran cobertura)

```bash
# gitleaks — scanner de secrets más completo que el fallback regex
# Windows:
choco install gitleaks
# o con scoop:
scoop install gitleaks
# macOS:
brew install gitleaks
# Linux:
# https://github.com/gitleaks/gitleaks/releases
```

Sin gitleaks el skill sigue funcionando con regex fallback, pero gitleaks atrapa más casos.

## Cómo usarlo

Tres formas, según preferencia:

### 1. Slash command (más directo)

En cualquier proyecto, dentro de Claude Code:

```
/security-audit
```

O con perfil explícito:
```
/security-audit ecommerce
/security-audit cms
/security-audit blog
```

### 2. Lenguaje natural (auto-trigger del skill)

Cualquiera de estas frases activa el skill:

- "Hacé una auditoría de seguridad de este proyecto"
- "Revisá la seguridad del CMS"
- "Buscá vulnerabilidades en el e-commerce"
- "Quiero un security review antes del launch"

### 3. Invocación explícita

```
Usá el skill nextjs-security-audit con foco en el panel admin
```

## Output esperado

Al terminar tendrás:

1. **`SECURITY_AUDIT.md`** en la raíz del proyecto con:
   - Resumen ejecutivo (severidad global, conteo por nivel)
   - Stack y perfil detectados
   - Findings ordenados Critical → Info, cada uno con archivo:línea, OWASP/CWE, código vulnerable, código de remediación
   - Plan de acción priorizado (hoy / semana / sprint / backlog)
   - Mejoras continuas (Dependabot, monitoring, etc.)

2. **Resumen en chat** con top 3 acciones críticas y conteos.

3. **Si hay secrets reales expuestos**: mensaje destacado con pasos de rotación inmediata (no se citan los secrets textual).

## Adaptación por perfil

El skill ajusta automáticamente la profundidad:

| Perfil | Checklists cargados |
|---|---|
| **Portfolio / blog estático** | Solo baseline + headers + deps. Sin auth, sin payments. |
| **Blog con CMS (NatArt-style)** | Baseline + framework + 08-content-blog + 09-forms |
| **E-commerce (NatArt futuro)** | Baseline + framework + 04-supabase + 05-payments + 07-ecommerce + 09-forms |
| **CMS con datos sensibles (Steffen)** | Baseline + framework + 04-supabase + 06-auth + **11-cms-admin** + 09-forms |
| **SaaS multi-tenant** | Baseline + framework + 04-supabase + 06-auth + 11-cms-admin + IDOR foco |

## Cómo lo extiendo

### Agregar un checklist propio

Creá `skills/nextjs-security-audit/checklists/12-mi-stack.md` con el mismo formato que los existentes y referencialo en la tabla de `SKILL.md`.

### Agregar un scanner

Poné `scripts/scan-foo.sh` siguiendo el patrón de los demás (output JSON en stdout, log a stderr, exit 0 incluso si encuentra issues — devuelve los issues como data). Agregalo al orden en la sección "Fase 1" de `SKILL.md`.

### Cambiar reglas de severidad

Editá la sección "Modelo de severidad" en `SKILL.md`.

## Limitaciones (transparencia)

- **Análisis estático.** No corre exploits ni testea producción.
- **Heurísticas.** Algunos scanners reportan falsos positivos; el skill los marca como "necesita revisión manual".
- **No reemplaza un pen-test profesional** para apps de alto riesgo (banking, salud crítica). Sirve como primera línea de defensa y due diligence continua.
- **No audita infra del provider** (asumimos Vercel/Supabase/Stripe cumplen sus claims SOC 2).

## Roadmap sugerido

- [ ] Integrar `semgrep` para reglas más sofisticadas (cuando esté disponible)
- [ ] Output JSON adicional para integrar con CI
- [ ] GitHub Action que corre el skill en cada PR
- [ ] Plantilla de Threat Model en `references/`

---
description: Lanza una auditoría de seguridad exhaustiva del proyecto actual usando el skill nextjs-security-audit. Adapta la profundidad al stack y al perfil de la app (e-commerce, blog, CMS con datos sensibles, SaaS, etc.).
argument-hint: [perfil opcional: ecommerce | cms | saas | blog | portfolio]
---

Ejecutá el skill `nextjs-security-audit` siguiendo su flujo definido (`SKILL.md`):

1. **Reconocimiento del proyecto**: leé `package.json`, configs, `CLAUDE.md`, estructura de carpetas. Identificá framework, DB/BaaS, auth, pagos, hosting.
2. **Confirmá el perfil** con el usuario si no es claro: $ARGUMENTS o pregunta vía AskUserQuestion.
3. **Escaneos automáticos**: ejecutá los scripts de `scripts/` con bash desde la raíz del proyecto. Capturá la salida de cada uno.
4. **Checklists**: cargá SOLO los checklists relevantes al stack y perfil detectados (ver tabla en SKILL.md).
5. **Análisis profundo (opcional)**: si el proyecto es de producción o alto riesgo (e-commerce, CMS con PII), invocá al subagente `security-auditor` con la lista de archivos sospechosos.
6. **Generá el reporte** `SECURITY_AUDIT.md` en la raíz del proyecto siguiendo `references/report-template.md`.
7. **Resumí al usuario**: path del reporte, conteo por severidad, top 3 acciones críticas.

Reglas:
- No declarés "seguro" sin evidencia.
- Cada finding cita archivo:línea + OWASP/CWE + remediación con código aplicable al stack.
- Si encontrás un secret real → mensaje destacado con pasos de rotación, sin citar el secret en el reporte.
- Si gitleaks no está instalado, decílo explícitamente y usá el fallback regex.

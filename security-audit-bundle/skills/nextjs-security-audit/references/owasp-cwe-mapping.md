# OWASP Top 10 (2021) ↔ CWE quick mapping

Usá esto para etiquetar findings.

| OWASP | Nombre | CWEs comunes | Ejemplo |
|---|---|---|---|
| A01 | Broken Access Control | CWE-22, 284, 285, 639, 862, 863 | IDOR, RLS faltante, role check ausente |
| A02 | Cryptographic Failures | CWE-261, 296, 310, 319, 327, 759 | MD5 password, HTTP en prod, JWT sin firma |
| A03 | Injection | CWE-20, 79, 89, 94, 116, 943 | SQL injection, XSS, command injection |
| A04 | Insecure Design | CWE-209, 256, 657 | Falta de threat model, business logic flaws |
| A05 | Security Misconfiguration | CWE-2, 16, 388, 1004 | Headers faltantes, env vars expuestas, debug en prod |
| A06 | Vulnerable Components | CWE-1104 | Deps con CVEs, paquetes deprecated |
| A07 | Identification & Auth Failures | CWE-259, 287, 384, 521, 798 | Password débil, sesión sin expiración, default creds |
| A08 | Software & Data Integrity | CWE-345, 353, 426 | Webhook sin firma, deps sin lockfile, supply chain |
| A09 | Logging & Monitoring | CWE-117, 223, 532, 778 | Falta audit log, PII en logs |
| A10 | SSRF | CWE-918 | fetch a URL controlada por el cliente |

## CWE útiles fuera del Top 10

- **CWE-352** CSRF
- **CWE-601** Open Redirect
- **CWE-829** Inclusion of Functionality from Untrusted Control Sphere
- **CWE-1021** Clickjacking (X-Frame-Options)
- **CWE-1275** Sensitive Cookie sin SameSite
- **CWE-79** XSS (subtipos: 79.1 reflected, 79.2 stored, 79.3 DOM)

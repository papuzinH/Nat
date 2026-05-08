# Checklist 03 — Vite + React SPA / React Router

## Modelo de amenaza específico

Una SPA pura **NO tiene server propio**. Si tu app habla con APIs externas (Supabase directo, REST custom), TODA la lógica de seguridad vive en:
1. La API que consume (RLS, auth, validación server-side allá).
2. Los headers servidos por el host estático (Vercel/Netlify/CF Pages).

No hay forma de "esconder" lógica en una SPA. Cualquier cosa en `import.meta.env.VITE_*` es PÚBLICA.

## Variables de entorno

- [ ] `import.meta.env.VITE_*` solo contiene lo que es seguro exponer al mundo
- [ ] Anon key de Supabase ✓ (es pública por diseño, pero RLS debe estar bien)
- [ ] **Service role key NUNCA en VITE_*** — eso sería catastrófico
- [ ] No hay `VITE_STRIPE_SECRET_KEY`, `VITE_DB_URL`, `VITE_ADMIN_TOKEN`, etc.

## XSS en React

- [ ] No usar `dangerouslySetInnerHTML` con input del usuario sin DOMPurify
- [ ] Si renderizás markdown del blog/CMS → `marked` + `DOMPurify` o `react-markdown` con plugins seguros
- [ ] URLs en `<a href={...}>` de input de usuario → validar protocolo (`https?:`), nunca `javascript:` o `data:`
- [ ] `target="_blank"` siempre con `rel="noopener noreferrer"`

## Headers servidos por el host

Como NO hay server Node, los headers vienen del provider:

### Vercel (`vercel.json`)
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
      { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://*.supabase.co; frame-ancestors 'none'" }
    ]
  }]
}
```

### Netlify (`_headers` o `netlify.toml`)
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; ...
```

## Routing

- [ ] React Router rutas privadas usan un `<ProtectedRoute>` que verifica auth state
- [ ] Pero NO confíes en eso para seguridad → la API debe rechazar requests no autenticadas
- [ ] No expongas IDs internos (UUIDs aleatorios > IDs autoincrementales)

## Build artifacts

- [ ] `dist/` no contiene comentarios con secrets (Vite los strippea, pero verifica)
- [ ] Source maps en prod: solo si necesarios y restringidos (si subís a Sentry, NO público)
- [ ] No commiteás `dist/` al repo

## Caso NatArt (Vite SPA actual)

Específico para este proyecto:
- `index.html` con `lang="en"` → cambiar a `"es"` (no es vuln pero es consistencia)
- Form de contacto sin endpoint real → cuando lo conectes, aplicar checklist 09-forms
- GTM ya está → en CSP permitir `https://www.googletagmanager.com` explícitamente
- HeroSection con `<video>` → si el src es de un host externo, asegúrate de servirlo por HTTPS

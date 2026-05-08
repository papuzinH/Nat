# CSP builder — guía rápida

## Directivas base

| Directiva | Función |
|---|---|
| `default-src` | Fallback para todas las demás |
| `script-src` | Quién puede ejecutar JS |
| `style-src` | Hojas de estilo |
| `img-src` | Imágenes |
| `font-src` | Fuentes |
| `connect-src` | XHR/fetch/WebSocket |
| `frame-src` | iframes embebidos |
| `frame-ancestors` | Quién puede embeber TU sitio (clickjacking) |
| `form-action` | Endpoints permitidos en `<form action>` |
| `base-uri` | `<base>` permitido |
| `object-src` | `<object>`, `<embed>`, `<applet>` (siempre `'none'`) |
| `upgrade-insecure-requests` | Reescribe http→https |

## Recetas comunes

### Solo Tailwind + Next + GTM + Stripe + Supabase

```
default-src 'self';
script-src 'self' 'nonce-{NONCE}' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob: https://www.googletagmanager.com https://*.supabase.co;
connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://api.stripe.com;
frame-src https://js.stripe.com https://hooks.stripe.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests
```

### Mercado Pago

Agregá:
```
script-src ... https://sdk.mercadopago.com https://http2.mlstatic.com;
connect-src ... https://api.mercadopago.com https://api.mercadolibre.com;
frame-src ... https://www.mercadopago.com.ar;
```

### YouTube embed
```
frame-src ... https://www.youtube.com https://www.youtube-nocookie.com;
```

## Cómo testear

1. Abrir DevTools → Console — los violations salen como `Refused to load ...`.
2. Empezar en `report-only` para no romper:
   ```
   Content-Security-Policy-Report-Only: ...
   ```
3. Cuando esté limpio, cambiá a `Content-Security-Policy:` enforcing.
4. Setear `report-uri` o `report-to` a un endpoint propio para capturar violaciones en prod.

## Errores frecuentes

- `'unsafe-inline'` en `script-src` cancela CSP. Usar nonces o hashes.
- `style-src 'unsafe-inline'` es comúnmente inevitable con Tailwind/CSS-in-JS — aceptable.
- `*` en `connect-src` revierte la protección — ser explícito.
- Olvidar `frame-ancestors 'none'` deja vulnerable a clickjacking aunque tengas X-Frame-Options.

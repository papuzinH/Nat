# Checklist 08 — Blog / contenido

## Renderizado de markdown / HTML del CMS

- [ ] Si renderizás markdown user-generated, sanitizar con DOMPurify después de parsear
- [ ] `react-markdown` con `rehype-sanitize` configurado (no allow `script`, `iframe` salvo allowlist)
- [ ] Si el contenido es estrictamente del owner (no UGC), riesgo bajo pero igual sanitizar

```tsx
import DOMPurify from 'isomorphic-dompurify'

const safeHtml = DOMPurify.sanitize(rawHtml, {
  ALLOWED_TAGS: ['p','a','strong','em','ul','ol','li','h1','h2','h3','blockquote','code','pre','img','br'],
  ALLOWED_ATTR: ['href','alt','src','title']
})
```

## Comentarios (si los hay)

- [ ] Sanitizar antes de guardar Y antes de renderizar (defensa en profundidad)
- [ ] Anti-spam: hCaptcha/Turnstile en el form
- [ ] Rate limiting por IP/usuario
- [ ] Moderación: no publicar instantáneamente, o hidden hasta review
- [ ] No permitir HTML, solo markdown limitado

## Search

- [ ] Si tu search hace queries directas con input → parametrizar (Prisma/Drizzle ya lo hacen, raw SQL no)
- [ ] Limit en cantidad de resultados (DoS via wildcard)

## SEO + seguridad

- [ ] `noindex` en páginas internas/admin/preview
- [ ] `robots.txt` no expone rutas sensibles (no listes `/admin` ahí)
- [ ] Sitemap.xml no incluye drafts ni rutas privadas

## Imágenes

- [ ] No embed `<iframe>` de proveedores externos sin sandboxing
- [ ] Hotlinking a imágenes externas → riesgo de tracking + downtime → preferir self-host con Next Image

## Caso NatArt (blog actual)

- Posts mock data hardcodeada → riesgo bajo
- Cuando conectes a CMS real (Sanity/Strapi/Payload) → aplicá sanitización al `content` antes de renderizar
- Si vas a permitir comentarios → checklist 09-forms aplicado a comments también

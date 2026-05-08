# Checklist 10 — Subida de archivos

## Validaciones server-side OBLIGATORIAS

- [ ] Tipo MIME verificado leyendo magic bytes (no solo el header `Content-Type` ni la extensión)
- [ ] Extensión validada contra allowlist (no blocklist: `!== '.exe'` no alcanza)
- [ ] Tamaño máximo enforced (rechazar antes de leer todo el body)
- [ ] Filename sanitizado: nunca usar el filename del cliente como nombre real → generar UUID + extensión validada
- [ ] Path traversal: rechazar `../`, `..\\`, null bytes (`\x00`)

```ts
import { fileTypeFromBuffer } from 'file-type'

const buf = await file.arrayBuffer()
const detected = await fileTypeFromBuffer(Buffer.from(buf))
const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
if (!detected || !allowed.includes(detected.mime)) {
  throw new Error('Invalid file type')
}
const safeName = `${crypto.randomUUID()}.${detected.ext}`
```

## Storage

- [ ] No subir a directorio servido directamente por el web server (riesgo de RCE si el servidor ejecuta scripts)
- [ ] Bucket S3/Supabase Storage privado por default; URLs firmadas para acceso
- [ ] Imágenes: pasar por procesamiento (sharp/squoosh) que re-encodea y limpia metadata EXIF
- [ ] Antivirus scan si aceptás archivos arbitrarios (ClamAV o servicio cloud)

## Imágenes específicamente

- [ ] EXIF GPS strippeado (sharp por default lo hace)
- [ ] Resize a max dimensions razonables
- [ ] Re-encode SIEMPRE (defeats embedded payloads)
- [ ] No servir SVG user-uploaded sin sanitizar (puede contener `<script>`)

## CSP en páginas que muestran uploads

- [ ] `img-src` con dominio del CDN explícito
- [ ] No permitir hotlink desde otros sitios

## Quotas

- [ ] Límite por usuario (e.g. 100MB / día)
- [ ] Cleanup de archivos huérfanos (subidos pero no asociados a entidad después de 24h)

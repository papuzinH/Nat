# Checklist 07 — E-commerce

## Carrito

- [ ] Cantidad y precio recalculados en server al momento del checkout (cliente no decide el precio)
- [ ] Stock verificado server-side antes de crear el order (race condition: usar transactions)
- [ ] Cupones validados server-side, con expiry y usage count atómico

## Checkout

- [ ] Sesión de checkout con expiración (5-30 min)
- [ ] No permitir editar el order una vez pago iniciado
- [ ] CSRF en POST `/checkout/confirm`
- [ ] Address validation (formato + país aceptado)

## Inventory race conditions

```ts
// ✗ MAL
const product = await db.product.findUnique({ where: { id } })
if (product.stock > 0) {
  await db.product.update({ where: { id }, data: { stock: product.stock - 1 } })
}

// ✓ BIEN — atómico
const result = await db.product.updateMany({
  where: { id, stock: { gt: 0 } },
  data: { stock: { decrement: 1 } }
})
if (result.count === 0) throw new Error('OUT_OF_STOCK')
```

## Datos de cliente

- [ ] Email, nombre, dirección guardados con cuidado (NO el método de pago)
- [ ] Compliance con regulaciones locales (Ley 25.326 en Argentina, GDPR si UE)
- [ ] Privacy policy y términos versionados, aceptación con timestamp

## Anti-fraude básico

- [ ] Rate limit de orders por IP (e.g. 5/hora sin auth)
- [ ] Reglas Stripe Radar activas (si aplica)
- [ ] Logs de orders fallidos para análisis
- [ ] Velocity checks: muchas órdenes a misma dirección con tarjetas distintas

## Caso NatArt

- [ ] Stock real-time (acuarelas únicas → unidad única)
- [ ] Reservation lock cuando alguien está en checkout (e.g. 10min) → libera si no paga
- [ ] Imágenes del catálogo servidas desde CDN propio (no hotlink a Instagram)
- [ ] Tax/IVA calculado server-side según país de envío

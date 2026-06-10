// Componente server que inyecta JSON-LD en el HTML (no useEffect). Reemplaza a
// SchemaMarkup.tsx, que lo agregaba en cliente y por eso era invisible para los
// crawlers en el HTML inicial. Aquí el <script> se renderiza en el servidor.

interface JsonLdProps {
  /** Objeto schema.org. `@context` se agrega automáticamente. */
  data: Record<string, unknown>
}

export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify({ '@context': 'https://schema.org', ...data })
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

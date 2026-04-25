# JSON-LD Schema Patterns por Tipo de Proyecto

Referencia rápida de schemas recomendados según el tipo de sitio.
Validar siempre en: https://search.google.com/test/rich-results

---

## 1. Portfolio Personal / Freelancer

**Schemas:** `Person` (obligatorio) + `ProfilePage` + `WebSite`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Nombre Completo]",
  "jobTitle": "[Rol / Especialidad]",
  "url": "https://[dominio].com",
  "image": "https://[dominio].com/foto-profesional.jpg",
  "email": "mailto:[email]",
  "sameAs": [
    "https://github.com/[usuario]",
    "https://linkedin.com/in/[usuario]",
    "https://twitter.com/[usuario]"
  ],
  "knowsAbout": ["[tecnología 1]", "[tecnología 2]", "[especialidad]"],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "[código país, ej: AR]",
    "addressLocality": "[ciudad]"
  }
}
```

**Implementación en Next.js App Router:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    // ... datos
  }

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 2. E-commerce / Tienda Online

**Schemas:** `Store` (o `OnlineStore`) + `Product` por producto + `BreadcrumbList`

**Store:**
```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "[Nombre de la tienda]",
  "description": "[Descripción]",
  "url": "https://[dominio].com",
  "image": "https://[dominio].com/og-store.jpg",
  "currenciesAccepted": "ARS",
  "paymentAccepted": "Credit Card, Cash, Transfer",
  "areaServed": {
    "@type": "Country",
    "name": "Argentina"
  },
  "priceRange": "$$"
}
```

**Product (por página de producto):**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Nombre del producto]",
  "description": "[Descripción]",
  "image": ["https://[dominio].com/productos/[slug]-1.jpg"],
  "brand": {
    "@type": "Brand",
    "name": "[Marca]"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://[dominio].com/productos/[slug]",
    "priceCurrency": "ARS",
    "price": "[precio numérico]",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "[Nombre tienda]"
    }
  }
}
```

**Para arte/prints (agregar a Product):**
```json
{
  "@type": ["Product", "VisualArtwork"],
  "artMedium": "Digital Print",
  "artworkSurface": "Paper",
  "artist": {
    "@type": "Person",
    "name": "[Nombre del artista]"
  }
}
```

---

## 3. Blog / Publicaciones

**Schemas:** `Blog` en el index + `BlogPosting` o `Article` por post

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Título del artículo]",
  "description": "[Resumen]",
  "image": "https://[dominio].com/blog/[slug]/og.jpg",
  "author": {
    "@type": "Person",
    "name": "[Autor]",
    "url": "https://[dominio].com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Nombre del sitio]",
    "logo": {
      "@type": "ImageObject",
      "url": "https://[dominio].com/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "url": "https://[dominio].com/blog/[slug]",
  "mainEntityOfPage": "https://[dominio].com/blog/[slug]"
}
```

---

## 4. SaaS / Aplicación Web

**Schemas:** `SoftwareApplication` + `Organization`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Nombre del producto]",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "description": "[Descripción del producto]",
  "url": "https://[dominio].com",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "128"
  }
}
```

---

## 5. Landing Page / Negocio Local

**Schemas:** `LocalBusiness` (o subtipo específico) + `WebSite`

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "[Nombre del estudio/empresa]",
  "description": "[Descripción de los servicios]",
  "url": "https://[dominio].com",
  "telephone": "+54-11-[número]",
  "email": "[email]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[dirección]",
    "addressLocality": "[ciudad]",
    "addressRegion": "[provincia]",
    "postalCode": "[CP]",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -34.603722,
    "longitude": -58.381592
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/[empresa]"
  ]
}
```

**Tipos de LocalBusiness más comunes:**
- Médico/Salud: `MedicalBusiness`, `Physician`, `Dentist`
- Legal: `LegalService`, `Attorney`
- Gastronomía: `Restaurant`, `FoodEstablishment`
- Educación: `EducationalOrganization`, `School`
- Retail: `Store`, `ShoppingCenter`

---

## 6. WebSite con SearchAction (Sitelinks search box)

Agregar en el layout raíz para habilitar el cuadro de búsqueda en Google:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://[dominio].com",
  "name": "[Nombre del sitio]",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://[dominio].com/buscar?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## 7. BreadcrumbList (navegación)

Agregar en páginas con jerarquía (categoría → producto, sección → artículo):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://[dominio].com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Categoría]",
      "item": "https://[dominio].com/[categoria]"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Producto/Página]",
      "item": "https://[dominio].com/[categoria]/[slug]"
    }
  ]
}
```

---

## Implementación dinámica en Next.js App Router

Para páginas de producto con datos de DB:

```tsx
// app/productos/[slug]/page.tsx
import { Metadata } from 'next'

async function getProduct(slug: string) {
  // fetch a tu DB/API
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return {
    title: `${product.name} | Mi Tienda`,
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl, width: 1200, height: 630 }]
    }
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "ARS",
      "availability": product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* resto del componente */}
    </>
  )
}
```

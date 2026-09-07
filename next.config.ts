import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Imágenes servidas por PocketBase (productos, blog, media)
      { protocol: 'https', hostname: 'nat.lhstudio.com.ar' },
    ],
    // Sin esto Next sirve solo WebP. Cada variante nueva le cuesta al optimizador
    // ~2s (baja el original del VPS y lo procesa), así que conviene que lo que
    // viaje pese lo menos posible. El optimizador negocia por Accept y cae a WebP
    // donde AVIF no esté soportado.
    formats: ['image/avif', 'image/webp'],
  },

  // El `www` quedaba sirviendo el sitio en paralelo al apex en vez de redirigir:
  // las dos URLs devolvian 200 con el mismo contenido. El canonical ya apunta
  // al apex (SITE_URL en src/lib/seo.ts), pero el redirect evita de entrada que
  // se sirva duplicado. Va aca y no en la config de dominios de Vercel para que
  // quede versionado y no dependa de como este el panel.
  //
  // El capture group evita repetir el dominio: cualquier `www.X` cae en `X`.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.(?<host>.*)' }],
        destination: 'https://:host/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

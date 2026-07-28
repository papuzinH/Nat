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
}

export default nextConfig

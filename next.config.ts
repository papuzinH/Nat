import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Imágenes servidas por PocketBase (productos, blog, media)
      { protocol: 'https', hostname: 'nat.lhstudio.com.ar' },
    ],
  },
  // TEMPORAL (migración a Next por waves): el código legacy en src/ (App.tsx,
  // src/screens, src/hooks…) todavía usa react-router / import.meta.env y no
  // typechequea bajo Next. Se tolera durante la migración y se REVIERTE en el
  // cutover (Wave 10), cuando se elimine todo el legacy de Vite.
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig

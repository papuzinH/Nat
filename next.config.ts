import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Imágenes servidas por PocketBase (productos, blog, media)
      { protocol: 'https', hostname: 'nat.lhstudio.com.ar' },
    ],
  },
}

export default nextConfig

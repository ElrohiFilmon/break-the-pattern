/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Use on-demand ISR for dynamic routes
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // Enable Turbopack for faster builds
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
}

export default nextConfig

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
  swcMinify: true,
  // Enable Turbopack for faster builds
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
}

export default nextConfig

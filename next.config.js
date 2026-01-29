/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mejorar el manejo del caché para prevenir errores de módulos faltantes
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Usar caché en memoria en lugar de filesystem para evitar corrupción
      config.cache = {
        type: 'memory',
        maxGenerations: 1,
      };
      // Mejorar la resolución de módulos
      config.resolve.symlinks = false;
      // Forzar invalidación de módulos
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [],
        immutablePaths: [],
      };
      // Deshabilitar optimizaciones que pueden causar problemas de caché
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
      };
    }
    return config;
  },
  // Configuración para mejorar la estabilidad
  reactStrictMode: true,
  // Optimizar el manejo de archivos estáticos
  swcMinify: true,
  // Optimización de imágenes (LCP, mobile)
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 86400, // 24h for optimized images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/videos-hero/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/videos-hero/:path*',
        destination: '/images/gallery/videos-hero/:path*',
      },
    ];
  },
  // Configuración experimental para mejorar la estabilidad
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
  // Deshabilitar caché de turbopack si se usa
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig


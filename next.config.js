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
  // Deshabilitar caché de imágenes en desarrollo
  images: {
    unoptimized: false,
  },
  // Configuración experimental para mejorar la estabilidad
  experimental: {
    // Mejorar el manejo de módulos
    optimizePackageImports: [],
  },
  // Deshabilitar caché de turbopack si se usa
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig


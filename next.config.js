/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mejorar el manejo del caché para prevenir errores de módulos faltantes
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // En desarrollo, deshabilitar el caché de webpack si hay problemas
      // config.cache = false; // Descomentar solo si el problema persiste
    }
    return config;
  },
  // Configuración para mejorar la estabilidad
  reactStrictMode: true,
  // Optimizar el manejo de archivos estáticos
  swcMinify: true,
}

module.exports = nextConfig


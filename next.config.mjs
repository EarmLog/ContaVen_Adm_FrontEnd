/*
 * (next.config.mjs)
 * Configuración de Next.js para el panel de ADMINISTRACIÓN de ContaVen.
 *
 * Igual que la app de usuarios, se exporta como sitio estático (output: "export")
 * porque solo habla con Supabase y con el backend Flask de admin.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sitio 100% estático: no hay funciones del servidor de Next.js
  output: 'export',

  // Cada ruta se guarda como /ruta/index.html
  trailingSlash: true,

  // Sin optimización de imágenes, que necesita servidor
  images: { unoptimized: true },

  // React en modo estricto para detectar errores de desarrollo
  reactStrictMode: true,
}

export default nextConfig

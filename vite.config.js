import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuración de Vite para la app de ADMINISTRACIÓN de ContaVen
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // El frontend de admin corre en el puerto 5174
    port: 5174,
    // Si Vite pide reiniciarse no bloquea la terminal
    strictPort: false,
  },
})

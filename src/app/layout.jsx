/*
 * (layout.jsx)
 * Layout raíz del panel de administración de ContaVen (Next.js).
 */

import Proveedores from './proveedores'
import '@/styles/globals.css'

export const metadata = {
  title: 'ContaVen Admin',
  description: 'Panel de administración de usuarios y licencias de ContaVen.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

// Datos que el navegador y el teléfono usan para instalar la app
export const viewport = {
  themeColor: '#1c62e9',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  )
}

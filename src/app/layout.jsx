/*
 * (layout.jsx)
 * Layout raíz del panel de administración de ContaVen (Next.js).
 */

import Proveedores from './proveedores'
import '@/styles/globals.css'

export const metadata = {
  title: 'ContaVen Admin',
  description: 'Panel de administración de usuarios y licencias de ContaVen.',
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

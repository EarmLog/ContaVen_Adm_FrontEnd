'use client'

/*
 * (panel/layout.jsx)
 * Layout del panel protegido (Next.js).
 */

import { useAdmin } from '@/context/AdminContext'
import RutaAdmin from '@/components/RutaAdmin'

export default function PanelLayout({ children }) {
  const { salir, admin } = useAdmin()

  return (
    <RutaAdmin>
      <div className="min-h-screen">
        <header className="tarjeta sticky top-0 z-40 mb-6 rounded-none border-x-0 border-t-0">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 font-bold text-white">
                CV
              </span>
              <div>
                <p className="font-semibold leading-tight">ContaVen Admin</p>
                <p className="text-xs texto-suave">Panel de control</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-sm texto-suave sm:inline">{admin?.correo}</span>
              <button
                onClick={salir}
                className="rounded-lg border border-[var(--borde)] px-3 py-1.5 text-sm font-medium transition hover:bg-red-50 hover:text-red-600"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </RutaAdmin>
  )
}

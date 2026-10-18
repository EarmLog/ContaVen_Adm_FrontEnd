'use client'

/*
 * (not-found.jsx)
 * Página 404 del panel de administración (Next.js).
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="tarjeta w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold">Página no encontrada</h1>
        <p className="mt-2 text-sm texto-suave">
          La dirección que buscas no existe en el panel de administración.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-slate-800 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

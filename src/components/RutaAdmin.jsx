'use client'

/*
 * (RutaAdmin.jsx)
 * Protege el panel de administración (Next.js).
 */

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAdmin } from '@/context/AdminContext'
import Cargando from '@/components/ui/Cargando'

export default function RutaAdmin({ children }) {
  const router = useRouter()
  const { cargando, estaLogueado, autorizado, admin, salir, errorConexion } = useAdmin()

  useEffect(() => {
    if (!cargando && !estaLogueado) {
      router.replace('/login')
    }
  }, [cargando, estaLogueado, router])

  if (cargando) {
    return <Cargando />
  }

  if (!estaLogueado) {
    return <Cargando />
  }

  if (errorConexion) {
    return <SinConexion mensaje={errorConexion} />
  }

  if (!autorizado) {
    return <SinPermisos correo={admin?.correo} alSalir={salir} />
  }

  return children
}

function SinConexion({ mensaje }) {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="tarjeta w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-3xl">
          🔌
        </div>

        <h1 className="text-xl font-semibold">Sin conexión con el servidor</h1>

        <p className="mt-3 text-sm texto-suave">{mensaje}</p>

        <p className="mt-4 text-sm texto-suave">
          Tu sesión sigue activa. Es un problema para poder contactar al servidor de
          administración, no con tus permisos.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full rounded-lg bg-marca-600 py-2.5 text-sm font-medium text-white transition hover:bg-marca-700"
        >
          Volver a intentar
        </button>
      </div>
    </div>
  )
}

function SinPermisos({ correo, alSalir }) {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="tarjeta w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-3xl">
          ⚠
        </div>

        <h1 className="text-xl font-semibold">Sin permisos de administrador</h1>

        <p className="mt-3 text-sm texto-suave">
          El correo <strong>{correo || '—'}</strong> no está autorizado en la tabla
          de administradores de ContaVen.
        </p>

        <p className="mt-4 text-sm texto-suave">
          Para darle acceso, alguien con permisos debe registrarlo en Supabase.
        </p>

        <button
          onClick={alSalir}
          className="mt-6 w-full rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

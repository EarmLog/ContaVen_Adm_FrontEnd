/*
 * (RutaAdmin.jsx)
 * Envuelve el panel de administración y revisa que quien entra
 * sea un administrador autorizado en Supabase.
 *
 * Si no hay sesión, lo manda al login.
 * Si hay sesión pero su correo no está en la tabla de administradores,
 * le muestra que no tiene permisos.
 */

import { Navigate } from 'react-router-dom'

import { useAdmin } from '../SesionAdmin'

/**
 * Revisa si el usuario puede ver el panel de administración.
 * @param {object} props - { children }
 * @returns {JSX.Element}
 */
export default function RutaAdmin({ children }) {
  // Se traen los datos de la sesión del administrador
  const { cargando, estaLogueado, autorizado, admin, salir } = useAdmin()

  // Mientras se revisa la sesión se muestra el spinner
  if (cargando) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-marca-200 border-t-marca-600" />
      </div>
    )
  }

  // Si no hay sesión se lo manda al login de admin
  if (!estaLogueado) {
    return <Navigate to="/login" replace />
  }

  // Si tiene sesión pero no está autorizado en la lista de administradores
  if (!autorizado) {
    return <SinPermisos correo={admin?.correo} alSalir={salir} />
  }

  return children
}

/**
 * Pantalla que se muestra cuando el correo no está autorizado
 * como administrador en la tabla de Supabase.
 * @param {object} props - { correo, alSalir }
 * @returns {JSX.Element}
 */
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

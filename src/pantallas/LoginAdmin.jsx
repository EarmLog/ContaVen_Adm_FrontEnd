/*
 * (LoginAdmin.jsx)
 * Pantalla de inicio de sesión de la app de ADMINISTRACIÓN.
 *
 * Solo tiene dos campos: correo y contraseña.
 * Después de entrar, el backend revisa si ese correo está en la tabla
 * de administradores de Supabase. Si no está, no puede entrar al panel.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as api from '../api'
import Aviso from '../componentes/Aviso'
import { useAdmin } from '../SesionAdmin'

/**
 * Componente con el formulario de login del administrador.
 * @returns {JSX.Element}
 */
export default function LoginAdmin() {
  // --- Estado del formulario ---
  const [datos, setDatos] = useState({ correo: '', contrasena: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [verContrasena, setVerContrasena] = useState(false)

  // Para pasar al panel cuando el login sale bien
  const navegar = useNavigate()

  // Se trae la función de entrar del contexto
  const { entrar } = useAdmin()

  /**
   * Escribe un valor en un campo del formulario.
   * @param {object} evento - El evento del input
   */
  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
  }

  /**
   * Revisa los campos y luego intenta iniciar sesión.
   * @param {object} evento - El evento del formulario
   */
  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    // Se revisa que los dos campos estén llenos
    if (!datos.correo || !datos.contrasena) {
      setError('Completa el correo y la contraseña.')
      return
    }

    setEnviando(true)

    try {
      // Se inicia sesión en Supabase
      const datosSesion = await api.iniciarSesion(datos.correo.trim(), datos.contrasena)

      // Se guarda la sesión y se revisa si es administrador
      await entrar(datosSesion)

      // Si llegó hasta aquí, el correo sí está autorizado
      navegar('/', { replace: true })
    } catch (errorLogin) {
      setError(errorLogin.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">

        {/* --- Encabezado con el logo --- */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl bg-slate-800 text-xl font-bold text-white">
            CV
          </div>
          <h1 className="text-2xl font-semibold">ContaVen Admin</h1>
          <p className="mt-1 text-sm texto-suave">Panel de control de usuarios y licencias</p>
        </div>

        {/* --- Formulario de login --- */}
        <form onSubmit={manejarEnvio} className="tarjeta space-y-4 p-6">

          {/* Mensaje de error si algo salió mal */}
          <Aviso tipo="error" mensaje={error} alCerrar={() => setError('')} />

          {/* Campo del correo */}
          <div>
            <label htmlFor="correo" className="mb-1 block text-sm font-medium">
              Correo de administrador
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              value={datos.correo}
              onChange={manejarCambio}
              placeholder="admin@contaven.com"
              className="campo"
            />
          </div>

          {/* Campo de la contraseña */}
          <div>
            <label htmlFor="contrasena" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="contrasena"
                name="contrasena"
                type={verContrasena ? 'text' : 'password'}
                autoComplete="current-password"
                value={datos.contrasena}
                onChange={manejarCambio}
                placeholder="Tu contraseña"
                className="campo pr-12"
              />
              <button
                type="button"
                onClick={() => setVerContrasena(!verContrasena)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs texto-suave hover:text-[var(--texto)]"
              >
                {verContrasena ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {/* Botón de entrar */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:opacity-60"
          >
            {enviando ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}

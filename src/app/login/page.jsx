'use client'

/*
 * (login/page.jsx)
 * Pantalla de inicio de sesión del panel de administración (Next.js).
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import * as api from '@/lib/api'
import Aviso from '@/components/ui/Aviso'
import { useAdmin } from '@/context/AdminContext'

export default function LoginPage() {
  const [datos, setDatos] = useState({ correo: '', contrasena: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [verContrasena, setVerContrasena] = useState(false)

  const router = useRouter()
  const { estaLogueado, autorizado, cargando, entrar } = useAdmin()

  useEffect(() => {
    if (!cargando && estaLogueado && autorizado) {
      router.replace('/')
    }
  }, [cargando, estaLogueado, autorizado, router])

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    if (!datos.correo || !datos.contrasena) {
      setError('Completa el correo y la contraseña.')
      return
    }

    setEnviando(true)

    try {
      const datosSesion = await api.iniciarSesion(datos.correo.trim(), datos.contrasena)
      await entrar(datosSesion)
      router.replace('/')
    } catch (errorLogin) {
      setError(errorLogin.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl bg-slate-800 text-xl font-bold text-white">
            CV
          </div>
          <h1 className="text-2xl font-semibold">ContaVen Admin</h1>
          <p className="mt-1 text-sm texto-suave">Panel de control de usuarios y licencias</p>
        </div>

        <form onSubmit={manejarEnvio} className="tarjeta space-y-4 p-6">
          <Aviso tipo="error" mensaje={error} alCerrar={() => setError('')} />

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

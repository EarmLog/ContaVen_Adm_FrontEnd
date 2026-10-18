'use client'

/*
 * (ModalLicencia.jsx)
 * Ventana para cambiar la licencia de un usuario.
 */

import { useState } from 'react'

export default function ModalLicencia({ usuario, alCerrar, alGuardar }) {
  const [dias, setDias] = useState(30)
  const [motivo, setMotivo] = useState('')
  const [accion, setAccion] = useState(usuario.bloqueado ? 'desbloquear' : 'bloquear')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const PAQUETES = [7, 15, 30, 60, 90]

  function manejarEscape(evento) {
    if (evento.key === 'Escape') alCerrar()
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setGuardando(true)

    try {
      const cambios = {}

      if (accion === 'bloquear') {
        cambios.bloqueado = true
        cambios.motivo_bloqueo = motivo.trim() || 'Paga la licencia para poder entrar.'
      }

      if (accion === 'desbloquear') {
        cambios.bloqueado = false
        cambios.motivo_bloqueo = null
      }

      if (accion === 'agregar_dias') {
        cambios.dias_a_agregar = Number(dias)

        if (!dias || Number(dias) <= 0) {
          throw new Error('La cantidad de días debe ser mayor a cero.')
        }
      }

      await alGuardar(cambios)
      alCerrar()
    } catch (errorGuardar) {
      setError(errorGuardar.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onKeyDown={manejarEscape}
    >
      <div className="tarjeta w-full max-w-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Licencia de {usuario.nombre}</h2>
            <p className="text-sm texto-suave">{usuario.correo}</p>
          </div>
          <button
            onClick={alCerrar}
            className="text-xl texto-suave hover:text-[var(--texto)]"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-[var(--borde)] p-3">
            <p className="texto-suave">Días restantes</p>
            <p className="text-lg font-bold">{usuario.dias_restantes}</p>
          </div>
          <div className="rounded-lg border border-[var(--borde)] p-3">
            <p className="texto-suave">Carpeta de Drive</p>
            <p className="text-lg font-bold">
              {String(usuario.numero_carpeta_drive).padStart(4, '0')}
            </p>
          </div>
        </div>

        <form onSubmit={manejarEnvio} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">¿Qué quieres hacer?</label>
            <div className="space-y-2">
              <OpcionAccion
                valor="bloquear"
                actual={accion}
                onChange={setAccion}
                titulo="Bloquear el acceso"
                descripcion="El usuario no podrá entrar a la app hasta que pague."
              />
              <OpcionAccion
                valor="desbloquear"
                actual={accion}
                onChange={setAccion}
                titulo="Desbloquear el acceso"
                descripcion="El usuario vuelve a poder entrar a la app."
              />
              <OpcionAccion
                valor="agregar_dias"
                actual={accion}
                onChange={setAccion}
                titulo="Agregar días de licencia"
                descripcion="Alarga la licencia del usuario."
              />
            </div>
          </div>

          {accion === 'bloquear' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Motivo del bloqueo</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Paga la licencia para poder entrar."
                className="campo"
              />
              <p className="mt-1 text-xs texto-suave">
                Este mensaje se le muestra al usuario en su pantalla de acceso bloqueado.
              </p>
            </div>
          )}

          {accion === 'agregar_dias' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Cantidad de días</label>
              <input
                type="number"
                min="1"
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                className="campo max-w-[10rem]"
              />

              <div className="mt-2 flex flex-wrap gap-2">
                {PAQUETES.map((paquete) => (
                  <button
                    key={paquete}
                    type="button"
                    onClick={() => setDias(paquete)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                      Number(dias) === paquete
                        ? 'border-marca-600 bg-marca-600 text-white'
                        : 'border-[var(--borde)] hover:bg-[var(--fondo)]'
                    }`}
                  >
                    +{paquete} días
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={guardando}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition disabled:opacity-60 ${
                accion === 'bloquear' ? 'bg-red-600 hover:bg-red-700' : 'bg-marca-600 hover:bg-marca-700'
              }`}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>

            <button
              type="button"
              onClick={alCerrar}
              className="rounded-lg border border-[var(--borde)] px-6 py-2.5 text-sm font-medium transition hover:bg-[var(--fondo)]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OpcionAccion({ valor, actual, onChange, titulo, descripcion }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
        actual === valor ? 'border-marca-600 bg-marca-50' : 'border-[var(--borde)]'
      }`}
    >
      <input
        type="radio"
        name="accion"
        value={valor}
        checked={actual === valor}
        onChange={() => onChange(valor)}
        className="mt-0.5"
      />
      <span>
        <span className="block text-sm font-medium">{titulo}</span>
        <span className="block text-xs texto-suave">{descripcion}</span>
      </span>
    </label>
  )
}

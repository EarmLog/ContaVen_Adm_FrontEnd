'use client'

/*
 * (panel/page.jsx)
 * Dashboard del panel de administración (Next.js).
 * Raíz protegida: "/"
 */

import { useEffect, useState } from 'react'

import * as api from '@/lib/api'
import Aviso from '@/components/ui/Aviso'
import ModalLicencia from '@/components/ModalLicencia'
import { useAdmin } from '@/context/AdminContext'
import { fechaLegible, formatearNumero, horaLegible } from '@/lib/formato'

export default function DashboardPage() {
  const {
    usuarios,
    resumen,
    cargandoUsuarios,
    setBusqueda,
    setEstadoFiltro,
    cargarUsuarios,
    refrescar,
  } = useAdmin()

  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [busquedaLocal, setBusquedaLocal] = useState('')
  const [estadoLocal, setEstadoLocal] = useState('')

  useEffect(() => {
    cargarUsuarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function aplicarFiltros() {
    setBusqueda(busquedaLocal)
    setEstadoFiltro(estadoLocal)
    cargarUsuarios({ buscar: busquedaLocal, estado: estadoLocal })
  }

  async function guardarLicencia(cambios) {
    const objetivo = usuarioEditando
    const respuesta = await api.actualizarUsuario(objetivo.id, cambios)
    setExito(respuesta.mensaje)
    await refrescar()
  }

  async function eliminarCuenta(usuario) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar la cuenta de ${usuario.nombre}?\n\n` +
        'Se borrará su perfil y no podrá volver a entrar.',
    )

    if (!confirmado) return

    try {
      const respuesta = await api.eliminarUsuario(usuario.id)
      setExito(respuesta.mensaje)
      await refrescar()
    } catch (errorEliminar) {
      setError(errorEliminar.message)
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 pb-10">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios y licencias</h1>
        <p className="mt-1 text-sm texto-suave">
          Gestiona el acceso de todos los usuarios de ContaVen.
        </p>
      </div>

      <Aviso tipo="error" mensaje={error} alCerrar={() => setError('')} />
      <Aviso tipo="exito" mensaje={exito} alCerrar={() => setExito('')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Cifra
          titulo="Usuarios registrados"
          valor={resumen?.total_usuarios || 0}
          detalle="Total de cuentas creadas"
          color="marca"
        />
        <Cifra
          titulo="Licencias activas"
          valor={resumen?.licencias_activas || 0}
          detalle="Pueden usar la app con normalidad"
          color="exito"
        />
        <Cifra
          titulo="Licencias vencidas"
          valor={resumen?.licencias_vencidas || 0}
          detalle="Ya pasaron los 30 días, aún pueden trabajar"
          color="ambar"
        />
        <Cifra
          titulo="Usuarios bloqueados"
          valor={resumen?.usuarios_bloqueados || 0}
          detalle="No pueden entrar a la app"
          color="error"
        />
      </div>

      <section className="tarjeta p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium">Buscar</label>
            <input
              type="search"
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
              placeholder="Nombre o correo del usuario..."
              className="campo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Estado</label>
            <select
              value={estadoLocal}
              onChange={(e) => setEstadoLocal(e.target.value)}
              className="campo"
            >
              <option value="">Todos</option>
              <option value="activa">Licencia activa</option>
              <option value="vencida">Licencia vencida</option>
              <option value="bloqueada">Bloqueado</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={aplicarFiltros}
              disabled={cargandoUsuarios}
              className="w-full rounded-lg bg-marca-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-marca-700 disabled:opacity-60"
            >
              {cargandoUsuarios ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </section>

      <section className="tarjeta overflow-hidden">
        <div className="border-b border-[var(--borde)] px-5 py-4">
          <h2 className="font-semibold">
            Lista de usuarios ({formatearNumero(usuarios.length)})
          </h2>
        </div>

        {cargandoUsuarios && usuarios.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm texto-suave">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm texto-suave">
            No hay usuarios que coincidan con la búsqueda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--fondo)] text-left text-xs texto-suave uppercase">
                <tr>
                  <th className="px-5 py-2 font-medium">Usuario</th>
                  <th className="px-5 py-2 font-medium">Teléfono</th>
                  <th className="px-5 py-2 font-medium">Registro</th>
                  <th className="px-5 py-2 text-center font-medium">Días</th>
                  <th className="px-5 py-2 font-medium">Vence</th>
                  <th className="px-5 py-2 font-medium">Drive</th>
                  <th className="px-5 py-2 text-center font-medium">Estado</th>
                  <th className="px-5 py-2 text-right font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--borde)]">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-[var(--fondo)]">
                    <td className="px-5 py-3">
                      <p className="font-medium">{usuario.nombre}</p>
                      <p className="text-xs texto-suave">{usuario.correo}</p>
                    </td>

                    <td className="px-5 py-3 texto-suave">{usuario.telefono || '—'}</td>

                    <td className="px-5 py-3 texto-suave">
                      {fechaLegible(usuario.creado_en)}
                      <p className="text-xs">{horaLegible(usuario.creado_en)}</p>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-1 font-semibold ${
                          usuario.bloqueado
                            ? 'bg-slate-100 text-slate-600'
                            : usuario.dias_restantes <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {usuario.bloqueado ? '—' : usuario.dias_restantes}
                      </span>
                    </td>

                    <td className="px-5 py-3 texto-suave">
                      {fechaLegible(usuario.fecha_fin_licencia)}
                    </td>

                    <td className="px-5 py-3">
                      <span className="rounded bg-marca-50 px-2 py-1 font-mono text-xs text-marca-700">
                        {String(usuario.numero_carpeta_drive).padStart(4, '0')}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <EtiquetaEstado usuario={usuario} />
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setUsuarioEditando(usuario)}
                          className="rounded-md border border-[var(--borde)] px-3 py-1 text-xs font-medium transition hover:bg-marca-50 hover:text-marca-700"
                        >
                          Licencia
                        </button>

                        <button
                          onClick={() => eliminarCuenta(usuario)}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {usuarioEditando && (
        <ModalLicencia
          usuario={usuarioEditando}
          alCerrar={() => setUsuarioEditando(null)}
          alGuardar={guardarLicencia}
        />
      )}
    </main>
  )
}

function Cifra({ titulo, valor, detalle, color }) {
  const estilos = {
    marca: 'bg-marca-50 text-marca-700',
    exito: 'bg-green-50 text-green-700',
    ambar: 'bg-amber-50 text-amber-800',
    error: 'bg-red-50 text-red-700',
  }[color]

  return (
    <div className="tarjeta p-5">
      <p className="text-xs font-medium texto-suave uppercase">{titulo}</p>
      <p className={`mt-2 inline-block rounded-lg px-3 py-1 text-2xl font-bold ${estilos}`}>
        {formatearNumero(valor)}
      </p>
      {detalle && <p className="mt-2 text-xs texto-suave">{detalle}</p>}
    </div>
  )
}

function EtiquetaEstado({ usuario }) {
  if (usuario.bloqueado) {
    return (
      <span className="inline-block rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        Bloqueado
      </span>
    )
  }

  if (usuario.licencia_vencida) {
    return (
      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
        Vencida
      </span>
    )
  }

  return (
    <span className="inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      Activa
    </span>
  )
}

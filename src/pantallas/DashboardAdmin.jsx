/*
 * (DashboardAdmin.jsx)
 * Dashboard del panel de administración de ContaVen.
 *
 * Muestra:
 *  - Tarjetas con las cifras globales (usuarios, licencias activas,
 *    vencidas y bloqueados)
 *  - Una tabla con TODOS los usuarios registrados, sus datos y los días
 *    de licencia que les quedan
 *  - Botones para cambiar la licencia de cada usuario (bloquear,
 *    desbloquear o agregar días)
 *  - Un buscador y filtros por estado de la licencia
 */

import { useEffect, useState } from 'react'

import * as api from '../api'
import Aviso from '../componentes/Aviso'
import ModalLicencia from '../componentes/ModalLicencia'
import { useAdmin } from '../SesionAdmin'
import { fechaLegible, formatearNumero, horaLegible } from '../formato'

/**
 * Componente principal del panel de administración.
 * @returns {JSX.Element}
 */
export default function DashboardAdmin() {
  // Se traen los datos del contexto de administrador
  const {
    admin,
    usuarios,
    resumen,
    cargandoUsuarios,
    setBusqueda,
    setEstadoFiltro,
    cargarUsuarios,
    refrescar,
    salir,
  } = useAdmin()

  // --- Estado de la pantalla ---
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  // El usuario que se está editando en el modal (null si el modal está cerrado)
  const [usuarioEditando, setUsuarioEditando] = useState(null)

  // --- Estado de los filtros rápidos ---
  const [busquedaLocal, setBusquedaLocal] = useState('')
  const [estadoLocal, setEstadoLocal] = useState('')

  /**
   * Carga la lista de usuarios al abrir el panel.
   */
  useEffect(() => {
    cargarUsuarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Aplica el buscador y el filtro de estado.
   * Se ejecuta al presionar el botón o al tocar Enter.
   */
  function aplicarFiltros() {
    setBusqueda(busquedaLocal)
    setEstadoFiltro(estadoLocal)
    cargarUsuarios({ buscar: busquedaLocal, estado: estadoLocal })
  }

  /**
   * Guarda el cambio de licencia de un usuario.
   * @param {object} cambios - { bloqueado, motivo_bloqueo, dias_a_agregar }
   */
  async function guardarLicencia(cambios) {
    // El usuario que se está editando
    const objetivo = usuarioEditando

    const respuesta = await api.actualizarUsuario(objetivo.id, cambios)

    setExito(respuesta.mensaje)
    await refrescar()
  }

  /**
   * Elimina la cuenta de un usuario, pidiendo confirmación antes.
   * @param {object} usuario - El usuario a eliminar
   */
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
    <div className="min-h-screen">

      {/* ============ BARRA SUPERIOR ============ */}
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

      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-10">

        {/* --- Encabezado --- */}
        <div>
          <h1 className="text-2xl font-semibold">Usuarios y licencias</h1>
          <p className="mt-1 text-sm texto-suave">
            Gestiona el acceso de todos los usuarios de ContaVen.
          </p>
        </div>

        <Aviso tipo="error" mensaje={error} alCerrar={() => setError('')} />
        <Aviso tipo="exito" mensaje={exito} alCerrar={() => setExito('')} />

        {/* ============ TARJETAS CON LAS CIFRAS GLOBALES ============ */}
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

        {/* ============ BUSCADOR Y FILTROS ============ */}
        <section className="tarjeta p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Buscador por nombre o correo */}
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

            {/* Filtro por estado de la licencia */}
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

            {/* Botón de buscar */}
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

        {/* ============ TABLA DE USUARIOS ============ */}
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
                      {/* Nombre y correo */}
                      <td className="px-5 py-3">
                        <p className="font-medium">{usuario.nombre}</p>
                        <p className="text-xs texto-suave">{usuario.correo}</p>
                      </td>

                      {/* Teléfono (opcional en el registro) */}
                      <td className="px-5 py-3 texto-suave">{usuario.telefono || '—'}</td>

                      {/* Fecha de registro */}
                      <td className="px-5 py-3 texto-suave">
                        {fechaLegible(usuario.creado_en)}
                        <p className="text-xs">{horaLegible(usuario.creado_en)}</p>
                      </td>

                      {/* Días de licencia que le quedan */}
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

                      {/* Fecha en que vence su licencia */}
                      <td className="px-5 py-3 texto-suave">
                        {fechaLegible(usuario.fecha_fin_licencia)}
                      </td>

                      {/* Número de carpeta de Google Drive */}
                      <td className="px-5 py-3">
                        <span className="rounded bg-marca-50 px-2 py-1 font-mono text-xs text-marca-700">
                          {String(usuario.numero_carpeta_drive).padStart(4, '0')}
                        </span>
                      </td>

                      {/* Estado: activa, vencida o bloqueada */}
                      <td className="px-5 py-3 text-center">
                        <EtiquetaEstado usuario={usuario} />
                      </td>

                      {/* Botones de acción */}
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
      </main>

      {/* El modal que aparece al cambiar la licencia de un usuario */}
      {usuarioEditando && (
        <ModalLicencia
          usuario={usuarioEditando}
          alCerrar={() => setUsuarioEditando(null)}
          alGuardar={guardarLicencia}
        />
      )}
    </div>
  )
}

/**
 * Tarjeta con una cifra global del panel.
 * @param {object} props - { titulo, valor, detalle, color }
 * @returns {JSX.Element}
 */
function Cifra({ titulo, valor, detalle, color }) {
  // Se eligen los colores de la tarjeta
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

/**
 * Etiqueta con el estado de la licencia del usuario.
 * @param {object} props - { usuario }
 * @returns {JSX.Element}
 */
function EtiquetaEstado({ usuario }) {
  // Si está bloqueado se muestra primero
  if (usuario.bloqueado) {
    return (
      <span className="inline-block rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        Bloqueado
      </span>
    )
  }

  // Si la licencia ya venció
  if (usuario.licencia_vencida) {
    return (
      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
        Vencida
      </span>
    )
  }

  // Si todo está bien
  return (
    <span className="inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      Activa
    </span>
  )
}

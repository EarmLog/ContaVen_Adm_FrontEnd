/*
 * (SesionAdmin.jsx)
 * Contexto de React que guarda la sesión del administrador.
 *
 * Maneja:
 *  - Si el administrador tiene una sesión activa
 *  - Si su correo está autorizado en la tabla de administradores
 *  - La lista de usuarios y las cifras del panel
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import * as api from './api'
import supabase from './supabase'

// Contexto que se comparte en toda la app de admin
const ContextoAdmin = createContext(null)

/**
 * Componente que envuelve la app de administración.
 * @param {object} props - { children }
 * @returns {JSX.Element}
 */
export function ProveedorAdmin({ children }) {
  // --- Estado de la app ---
  const [cargando, setCargando] = useState(true)  // true mientras se revisa la sesión
  const [sesion, setSesion] = useState(null)     // sesión de Supabase
  const [autorizado, setAutorizado] = useState(false)  // ¿es administrador?
  const [admin, setAdmin] = useState(null)       // datos del administrador

  // --- Estado de la lista de usuarios ---
  const [usuarios, setUsuarios] = useState([])
  const [resumen, setResumen] = useState(null)
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false)

  // --- Estado de los filtros de la tabla ---
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')

  /**
   * Revisa la sesión de Supabase y si el correo es administrador.
   */
  useEffect(() => {
    let montado = true

    async function revisar() {
      const { data } = await supabase.auth.getSession()

      if (!montado) return

      if (!data.session) {
        setSesion(null)
        setCargando(false)
        return
      }

      setSesion(data.session)

      // Se pregunta al backend si este correo puede entrar al panel
      try {
        const datos = await api.comprobarPermisos()
        if (montado) {
          setAutorizado(datos.autorizado)
          setAdmin(datos)
        }
      } catch {
        // Si el backend responde que no está autorizado, no se deja entrar
        if (montado) setAutorizado(false)
      } finally {
        if (montado) setCargando(false)
      }
    }

    revisar()

    // Se escucha el cierre de sesión
    const { data: canal } = supabase.auth.onAuthStateChange((evento, nuevaSesion) => {
      if (!montado) return

      if (evento === 'SIGNED_OUT' || !nuevaSesion) {
        setSesion(null)
        setAutorizado(false)
        setUsuarios([])
      }
    })

    return () => {
      montado = false
      canal?.subscription?.unsubscribe()
    }
  }, [])

  /**
   * Carga la lista de usuarios y el resumen del panel.
   * Acepta los filtros de búsqueda y de estado.
   * @param {object} filtrosAAplicar - { buscar, estado }
   */
  const cargarUsuarios = useCallback(async (filtrosAAplicar = {}) => {
    setCargandoUsuarios(true)

    try {
      // Se piden los usuarios y el resumen al mismo tiempo
      const [lista, cifras] = await Promise.all([
        api.listarUsuarios(filtrosAAplicar),
        api.obtenerResumen(),
      ])

      setUsuarios(lista.usuarios)
      setResumen(cifras)
    } finally {
      setCargandoUsuarios(false)
    }
  }, [])

  /**
   * Guarda la sesión del administrador en el estado.
   * @param {object} nuevaSesion
   */
  async function entrar(nuevaSesion) {
    setSesion(nuevaSesion)

    // Se revisa si ese correo está autorizado
    const datos = await api.comprobarPermisos()
    setAutorizado(datos.autorizado)
    setAdmin(datos)
  }

  /**
   * Cierra la sesión y limpia la pantalla.
   */
  async function salir() {
    await supabase.auth.signOut()
    setSesion(null)
    setAutorizado(false)
    setUsuarios([])
    setAdmin(null)
  }

  /**
   * Vuelve a cargar la lista de usuarios con los filtros actuales.
   */
  async function refrescar() {
    await cargarUsuarios({ buscar: busqueda, estado: estadoFiltro })
  }

  return (
    <ContextoAdmin.Provider
      value={{
        cargando,             // true mientras se revisa la sesión
        sesion,               // sesión activa o null
        admin,                // datos del administrador
        autorizado,           // true si su correo está en la lista
        usuarios,             // lista de usuarios
        resumen,              // cifras del panel
        cargandoUsuarios,     // true mientras carga la tabla
        busqueda,             // texto del buscador
        setBusqueda,          // cambia el texto del buscador
        estadoFiltro,         // filtro por estado de licencia
        setEstadoFiltro,      // cambia el filtro por estado
        cargarUsuarios,       // carga la lista con filtros
        refrescar,            // recarga la lista
        entrar,               // se llama tras un login exitoso
        salir,                // cierra la sesión
        estaLogueado: Boolean(sesion),
      }}
    >
      {children}
    </ContextoAdmin.Provider>
  )
}

/**
 * Permite usar el contexto del administrador desde cualquier pantalla.
 * @returns {object}
 */
export function useAdmin() {
  const valor = useContext(ContextoAdmin)

  if (!valor) {
    throw new Error('useAdmin debe usarse dentro de ProveedorAdmin')
  }

  return valor
}

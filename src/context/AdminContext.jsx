'use client'

/*
 * (AdminContext.jsx)
 * Contexto de React para el panel de administración (Next.js).
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import * as api from '../lib/api'
import supabase from '../lib/supabaseClient'

const ContextoAdmin = createContext(null)

export function ProveedorAdmin({ children }) {
  const [cargando, setCargando] = useState(true)
  const [sesion, setSesion] = useState(null)
  const [autorizado, setAutorizado] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [errorConexion, setErrorConexion] = useState('')

  const [usuarios, setUsuarios] = useState([])
  const [resumen, setResumen] = useState(null)
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false)

  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')

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

      try {
        const datos = await api.comprobarPermisos()
        if (montado) {
          setAutorizado(datos.autorizado)
          setAdmin(datos)
          setErrorConexion('')
        }
      } catch (error) {
        if (!montado) return

        if (error.sinConexion) {
          setErrorConexion(error.message)
          setAutorizado(false)
        } else {
          setAutorizado(false)
        }
      } finally {
        if (montado) setCargando(false)
      }
    }

    revisar()

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

  const cargarUsuarios = useCallback(async (filtrosAAplicar = {}) => {
    setCargandoUsuarios(true)

    try {
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

  async function entrar(nuevaSesion) {
    setSesion(nuevaSesion)

    const datos = await api.comprobarPermisos()
    setAutorizado(datos.autorizado)
    setAdmin(datos)
  }

  async function salir() {
    await supabase.auth.signOut()
    setSesion(null)
    setAutorizado(false)
    setUsuarios([])
    setAdmin(null)
  }

  async function refrescar() {
    await cargarUsuarios({ buscar: busqueda, estado: estadoFiltro })
  }

  return (
    <ContextoAdmin.Provider
      value={{
        cargando,
        sesion,
        admin,
        autorizado,
        errorConexion,
        usuarios,
        resumen,
        cargandoUsuarios,
        busqueda,
        setBusqueda,
        estadoFiltro,
        setEstadoFiltro,
        cargarUsuarios,
        refrescar,
        entrar,
        salir,
        estaLogueado: Boolean(sesion),
      }}
    >
      {children}
    </ContextoAdmin.Provider>
  )
}

export function useAdmin() {
  const valor = useContext(ContextoAdmin)

  if (!valor) {
    throw new Error('useAdmin debe usarse dentro de ProveedorAdmin')
  }

  return valor
}

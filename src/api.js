/*
 * (api.js)
 * Cliente de la API del backend Flask de ADMINISTRACIÓN.
 *
 * Todas las llamadas llevan el token de sesión del administrador.
 * El backend revisa que el correo esté en la tabla de administradores
 * de Supabase antes de dejarle ver o modificar cualquier cosa.
 */

import supabase from './supabase'

// Dirección del backend Flask de admin, tomada del archivo .env
const URL_API = import.meta.env.VITE_URL_API || 'http://localhost:5002'

/**
 * Devuelve el token de sesión del administrador que está logueado.
 * @returns {Promise<string|null>}
 */
export async function obtenerToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || null
}

/**
 * Hace una llamada a la API del backend de administración.
 * @param {string} ruta - Ejemplo: "/admin/usuarios"
 * @param {object} opciones - { metodo, cuerpo }
 * @returns {object} - La respuesta en JSON
 */
async function llamarApi(ruta, opciones = {}) {
  // Se consigue el token del administrador
  const token = await obtenerToken()

  // Si no hay token se corta aquí
  if (!token) {
    throw new Error('No has iniciado sesión como administrador.')
  }

  // Se hace la petición
  const respuesta = await fetch(`${URL_API}/api${ruta}`, {
    method: opciones.metodo || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(opciones.cuerpo ? { body: JSON.stringify(opciones.cuerpo) } : {}),
  })

  // Se lee la respuesta
  const datos = await respuesta.json().catch(() => ({}))

  // Si el backend devuelve un error se lanza con su mensaje
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Ocurrió un error. Intenta de nuevo.')
  }

  return datos
}

// ============================================================
// AUTENTICACIÓN DEL ADMINISTRADOR
// ============================================================

/**
 * Inicia sesión con Supabase usando correo y contraseña.
 * @param {string} correo
 * @param {string} contrasena
 * @returns {object} - La sesión de Supabase
 */
export async function iniciarSesion(correo, contrasena) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  })

  if (error) {
    if (error.message.toLowerCase().includes('invalid login')) {
      throw new Error('Correo o contraseña incorrectos.')
    }
    throw new Error(error.message)
  }

  return data
}

/** Cierra la sesión del administrador. */
export function cerrarSesion() {
  return supabase.auth.signOut()
}

/**
 * Revisa si el correo que entró está autorizado como administrador.
 * @returns {object} - { autorizado, correo, id }
 */
export function comprobarPermisos() {
  return llamarApi('/admin/yo')
}

// ============================================================
// GESTIÓN DE USUARIOS
// ============================================================

/**
 * Trae la lista de todos los usuarios con sus días de licencia.
 * @param {object} filtros - { buscar, estado }
 * @returns {object} - { usuarios, total }
 */
export function listarUsuarios(filtros = {}) {
  const parametros = new URLSearchParams()

  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor) parametros.append(clave, valor)
  }

  const consulta = parametros.toString()
  return llamarApi(`/admin/usuarios${consulta ? `?${consulta}` : ''}`)
}

/**
 * Cambia el estado de la licencia de un usuario.
 * @param {string} usuarioId - El id del usuario en Supabase
 * @param {object} cambios - { bloqueado, motivo_bloqueo, dias_a_agregar }
 * @returns {object} - { mensaje, usuario }
 */
export function actualizarUsuario(usuarioId, cambios) {
  return llamarApi(`/admin/usuarios/${usuarioId}`, {
    metodo: 'PATCH',
    cuerpo: cambios,
  })
}

/**
 * Elimina completamente la cuenta de un usuario.
 * @param {string} usuarioId
 * @returns {object} - { mensaje }
 */
export function eliminarUsuario(usuarioId) {
  return llamarApi(`/admin/usuarios/${usuarioId}`, { metodo: 'DELETE' })
}

/**
 * Trae las cifras globales del panel.
 * @returns {object} - { total_usuarios, licencias_activas, ... }
 */
export function obtenerResumen() {
  return llamarApi('/admin/resumen')
}

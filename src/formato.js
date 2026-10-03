/*
 * (formato.js)
 * Funciones pequeñas para dar formato a las fechas y los números
 * que se muestran en el panel de administración.
 */

/**
 * Muestra un número con separadores de miles.
 * @param {number} numero
 * @returns {string}
 */
export function formatearNumero(numero) {
  return new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 }).format(Number(numero) || 0)
}

/**
 * Convierte una fecha ISO de Supabase a formato AAAA-MM-DD.
 * @param {string} fechaIso
 * @returns {string}
 */
export function aFechaIso(fechaIso) {
  if (!fechaIso) return ''

  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaIso)) return fechaIso

  return new Date(fechaIso).toISOString().slice(0, 10)
}

/**
 * Muestra una fecha de forma legible: "1 de octubre de 2026".
 * @param {string} fechaIso
 * @returns {string}
 */
export function fechaLegible(fechaIso) {
  if (!fechaIso) return '—'

  return new Date(fechaIso).toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Muestra la hora de una fecha: "3:45 p. m."
 * @param {string} fechaIso
 * @returns {string}
 */
export function horaLegible(fechaIso) {
  if (!fechaIso) return '—'

  return new Date(fechaIso).toLocaleTimeString('es-VE', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

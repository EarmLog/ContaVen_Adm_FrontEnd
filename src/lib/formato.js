/*
 * (formato.js)
 * Funciones pequeñas para dar formato a las fechas y los números.
 */

export function formatearNumero(numero) {
  return new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 }).format(Number(numero) || 0)
}

export function aFechaIso(fechaIso) {
  if (!fechaIso) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaIso)) return fechaIso
  return new Date(fechaIso).toISOString().slice(0, 10)
}

export function fechaLegible(fechaIso) {
  if (!fechaIso) return '—'
  return new Date(fechaIso).toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function horaLegible(fechaIso) {
  if (!fechaIso) return '—'
  return new Date(fechaIso).toLocaleTimeString('es-VE', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

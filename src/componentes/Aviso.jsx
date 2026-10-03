/*
 * (Aviso.jsx)
 * Mensajes de error, de éxito o de información del panel de administración.
 */

/**
 * Muestra un mensaje con su color según el tipo.
 * @param {object} props - { tipo: 'error' | 'exito' | 'info', mensaje, alCerrar }
 * @returns {JSX.Element} - El mensaje, o null si no hay nada que mostrar
 */
export default function Aviso({ tipo = 'info', mensaje, alCerrar }) {
  // Si no hay mensaje no se muestra nada
  if (!mensaje) return null

  // Se eligen los colores según el tipo de aviso
  const estilos = {
    error: 'bg-red-50 text-red-700 border-red-200',
    exito: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-marca-50 text-marca-700 border-marca-200',
  }[tipo]

  return (
    <div className={`mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${estilos}`}>
      <span className="flex-1">{mensaje}</span>

      {alCerrar && (
        <button onClick={alCerrar} className="font-bold opacity-60 hover:opacity-100" title="Cerrar">
          ×
        </button>
      )}
    </div>
  )
}

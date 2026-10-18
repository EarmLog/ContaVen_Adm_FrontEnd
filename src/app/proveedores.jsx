'use client'

/*
 * (proveedores.jsx)
 * Junta todos los contextos de la app en un solo lugar.
 */

import { ProveedorAdmin } from '@/context/AdminContext'

/**
 * Envuelve los hijos con los proveedores necesarios.
 * @param {object} props - { children }
 * @returns {JSX.Element}
 */
export default function Proveedores({ children }) {
  return <ProveedorAdmin>{children}</ProveedorAdmin>
}

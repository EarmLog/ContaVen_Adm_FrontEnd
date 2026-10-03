/*
 * (App.jsx)
 * Rutas de la app de ADMINISTRACIÓN de ContaVen.
 *
 * - "/login" -> pantalla de inicio de sesión del administrador
 * - "/"      -> dashboard con la lista de usuarios (protegido)
 */

import { Navigate, Route, Routes } from 'react-router-dom'

import RutaAdmin from './componentes/RutaAdmin'
import DashboardAdmin from './pantallas/DashboardAdmin'
import LoginAdmin from './pantallas/LoginAdmin'

/**
 * Componente con todas las rutas de la app de administración.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <Routes>
      {/* Pantalla de login del administrador */}
      <Route path="/login" element={<LoginAdmin />} />

      {/* Dashboard de usuarios, protegido */}
      <Route
        path="/"
        element={
          <RutaAdmin>
            <DashboardAdmin />
          </RutaAdmin>
        }
      />

      {/* Cualquier otra ruta vuelve al dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

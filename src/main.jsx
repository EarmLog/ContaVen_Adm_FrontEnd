/*
 * (main.jsx)
 * Punto de entrada de la app de ADMINISTRACIÓN de ContaVen.
 *
 * Monta React y envuelve la app con el ProveedorAdmin (que guarda
 * la sesión del administrador) y con el BrowserRouter.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ProveedorAdmin } from './SesionAdmin'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorAdmin>
        <App />
      </ProveedorAdmin>
    </BrowserRouter>
  </StrictMode>,
)

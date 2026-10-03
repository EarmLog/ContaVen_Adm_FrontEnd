/*
 * (supabase.js)
 * Cliente de Supabase para la app de administración.
 *
 * Solo se usa para el login del administrador. Los datos de los
 * usuarios y sus licencias se le piden al backend Flask de admin.
 */

import { createClient } from '@supabase/supabase-js'

// Se leen la URL y la llave pública del archivo .env
const URL_SUPABASE = import.meta.env.VITE_SUPABASE_URL
const LLAVE_PUBLICA = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Se revisa que las dos variables existan
if (!URL_SUPABASE || !LLAVE_PUBLICA) {
  console.error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env',
  )
}

// Se crea el cliente de Supabase
const supabase = createClient(URL_SUPABASE, LLAVE_PUBLICA, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})

export default supabase

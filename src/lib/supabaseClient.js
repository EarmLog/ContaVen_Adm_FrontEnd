/*
 * (supabaseClient.js)
 * Cliente de Supabase para el panel de administración (Next.js).
 *
 * Solo se usa para el login del administrador. Los datos se piden al
 * backend Flask de administración.
 */

import { createClient } from '@supabase/supabase-js'

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL
const LLAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!URL_SUPABASE || !LLAVE_PUBLICA) {
  console.error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en el archivo .env',
  )
}

const supabase = createClient(URL_SUPABASE, LLAVE_PUBLICA, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})

export default supabase

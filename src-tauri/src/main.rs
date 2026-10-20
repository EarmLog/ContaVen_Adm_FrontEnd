// Punto de entrada de la app nativa del panel de administración.
//
// Solo se encarga de arrancar Tauri; el panel habla directo con Supabase y
// con el backend Flask de admin, así que no necesita plugins extra.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running ContaVen Admin");
}

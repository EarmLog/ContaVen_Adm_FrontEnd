# ContaVen — Frontend de administración

Panel web en React para que el administrador de ContaVen vea y controle las cuentas de los usuarios.

## Qué hace

- Muestra un resumen arriba: usuarios registrados, licencias activas, vencidas y bloqueados.
- Lista a todos los usuarios con su nombre, correo, teléfono, fecha de registro, días de licencia, vencimiento y número de carpeta de Drive.
- Permite buscar por nombre o correo y filtrar por estado.
- Con el botón **Licencia** se abre un modal para bloquear, desbloquear o sumar días.
- Con **Eliminar** se borra la cuenta, con confirmación antes.
- Si el correo que entró no está autorizado como administrador, lo deja fuera con un aviso.

## Tecnologías

- React 19 con Vite 8
- Tailwind CSS v4
- React Router 7
- Supabase JS para la sesión
- oxlint como linter

## Requisitos

Node 20 o superior.

## Instalación y arranque

```bash
cd ContaVen_Adm_FrontEnd
npm install
cp .env.ejemplo .env
npm run dev
```

Queda en `http://localhost:5174`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción en `dist/` |
| `npm run preview` | Sirve lo compilado |
| `npm run lint` | Revisa el código con oxlint |

## Variables de entorno

| Variable | Para qué |
| --- | --- |
| `VITE_SUPABASE_URL` | Dirección del proyecto de Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Llave pública de Supabase |
| `VITE_URL_API` | Dirección del backend de administración (`http://localhost:5002`) |

## Estructura

```
src/
├── componentes/    Aviso, ModalLicencia y RutaAdmin
├── pantallas/      LoginAdmin y DashboardAdmin
├── assets/
├── api.js          llamadas al backend de administración
├── formato.js      fechas y números
├── supabase.js     cliente de Supabase
├── SesionAdmin.jsx contexto de la sesión y de la lista de usuarios
├── App.jsx
└── main.jsx
```

## Cómo entra el administrador

1. Inicia sesión con Supabase (correo y contraseña).
2. El frontend le pregunta al backend si ese correo está autorizado (`/api/admin/yo`).
3. Si lo está, muestra el panel; si no, una pantalla de "sin permisos".

La sesión y la lista de usuarios se manejan en `SesionAdmin.jsx`, y `RutaAdmin` protege la entrada al panel.

## Notas

- Para que un correo pueda entrar, primero hay que registrarlo con `registrar_admin.py` en el backend de administración.
- El panel necesita el backend en el puerto 5002 para funcionar.

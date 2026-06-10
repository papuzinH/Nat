import PocketBase from 'pocketbase'

// Cliente PocketBase para el navegador (Client Components, admin, carrito…).
// Lee la URL pública expuesta por Next (NEXT_PUBLIC_*).
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL as string)

// El SDK guarda el token en localStorage. Para que el middleware (server) pueda
// detectar la sesión admin, replicamos el authStore en una cookie `pb_auth`.
// Se sincroniza en cada cambio (login/logout) y se dispara una vez al cargar
// para reflejar una sesión preexistente en localStorage.
if (typeof document !== 'undefined') {
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      secure: window.location.protocol === 'https:',
      sameSite: 'Lax',
      path: '/',
    })
  }, true)
}

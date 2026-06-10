import { NextResponse, type NextRequest } from 'next/server'

// Protege /admin/* exigiendo la cookie de sesión de PocketBase (`pb_auth`,
// escrita por el cliente en src/lib/pocketbase.ts). La validación fina del token
// (expiración, validez) sigue en cliente dentro del shell del panel.
// (Next 16 renombró la convención `middleware` → `proxy`.)
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // El login es público.
  if (pathname === '/admin/login') return NextResponse.next()

  const authCookie = req.cookies.get('pb_auth')?.value
  // La cookie guarda el authStore serializado ({"token":"…","record":…}).
  // Tras logout el token queda vacío, así que validamos su presencia real.
  let hasToken = false
  if (authCookie) {
    try {
      hasToken = !!(JSON.parse(authCookie) as { token?: string })?.token
    } catch {
      hasToken = false
    }
  }

  if (!hasToken) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

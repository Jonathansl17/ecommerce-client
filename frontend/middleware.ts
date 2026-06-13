import { NextRequest, NextResponse } from 'next/server';

// /dashboard (home), /catalogo y /productos son públicos: la tienda se puede navegar sin sesión.
const PROTECTED_PREFIXES = ['/orders', '/cart', '/checkout', '/profile', '/reviews'];
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

// Cookie name debe coincidir con auth.constants.js COOKIE_NAMES.ACCESS = 'ec_access'
const SESSION_COOKIE = 'ec_access';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSession) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/orders/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/reviews/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};

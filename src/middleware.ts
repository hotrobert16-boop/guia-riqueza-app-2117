import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Verificar se é uma rota protegida
  const protectedRoutes = ['/dashboard', '/premium', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Verificar autenticação via cookie ou header
    const authToken = request.cookies.get('auth-token')?.value ||
                     request.headers.get('authorization')?.replace('Bearer ', '')

    if (!authToken) {
      // Redirecionar para login se não autenticado
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar se é rota premium
    const premiumRoutes = ['/premium', '/dashboard/premium']
    const isPremiumRoute = premiumRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    if (isPremiumRoute) {
      // Aqui você pode verificar se o usuário tem assinatura premium
      // Por enquanto, vamos permitir acesso
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
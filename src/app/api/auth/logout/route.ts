import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Remover cookie de autenticação
    const response = NextResponse.json({ success: true })
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expira imediatamente
    })

    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
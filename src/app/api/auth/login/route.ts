import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, is_premium, premium_expires_at, password_hash')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // Verificar senha
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // Verificar se premium ainda está ativo
    let isPremium = user.is_premium
    if (user.premium_expires_at) {
      const expiresAt = new Date(user.premium_expires_at)
      const now = new Date()
      
      if (now > expiresAt) {
        // Premium expirou, atualizar no banco
        isPremium = false
        await supabase
          .from('users')
          .update({ is_premium: false })
          .eq('id', user.id)
      }
    }

    // Gerar JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Configurar cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium,
        premiumExpiresAt: user.premium_expires_at
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 dias
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
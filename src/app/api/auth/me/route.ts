import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Verificar token de autenticação
    const token = request.cookies.get('auth-token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    // Verificar e decodificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    // Buscar dados atualizados do usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, is_premium, premium_expires_at')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
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

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium,
        premiumExpiresAt: user.premium_expires_at
      }
    })
  } catch (error) {
    console.error('Erro ao verificar usuário:', error)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
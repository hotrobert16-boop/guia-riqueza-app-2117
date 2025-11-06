import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, paymentId } = await request.json()

    if (!email || !paymentId) {
      return NextResponse.json({ error: 'Email e ID do pagamento são obrigatórios' }, { status: 400 })
    }

    // Verificar se o pagamento existe e foi processado
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, users!inner(*)')
      .eq('kirvano_payment_id', paymentId)
      .eq('users.email', email)
      .eq('status', 'completed')
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado ou não processado' }, { status: 404 })
    }

    // Gerar token de acesso temporário (válido por 24 horas)
    const accessToken = jwt.sign(
      { 
        userId: payment.user_id, 
        email: payment.users.email,
        type: 'access_link',
        paymentId 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // Gerar link de acesso
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const accessLink = `${baseUrl}/access?token=${accessToken}`

    // Opcional: Salvar o link no banco para auditoria
    await supabase
      .from('access_links')
      .insert({
        user_id: payment.user_id,
        payment_id: payment.id,
        token: accessToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        used: false
      })
      .select()

    return NextResponse.json({
      success: true,
      accessLink,
      expiresIn: '24 horas',
      user: {
        name: payment.users.name,
        email: payment.users.email,
        isPremium: payment.users.is_premium
      }
    })
  } catch (error) {
    console.error('Erro ao gerar link de acesso:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Endpoint para validar e usar link de acesso
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 400 })
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any

    if (decoded.type !== 'access_link') {
      return NextResponse.json({ error: 'Tipo de token inválido' }, { status: 400 })
    }

    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, is_premium, premium_expires_at')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Marcar link como usado (opcional)
    await supabase
      .from('access_links')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', token)

    // Gerar token de sessão regular
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Configurar cookie de sessão
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.is_premium,
        premiumExpiresAt: user.premium_expires_at
      }
    })

    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 dias
    })

    return response
  } catch (error) {
    console.error('Erro ao validar link de acesso:', error)
    return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 401 })
  }
}
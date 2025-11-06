import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

// Webhook da Kirvano para processar pagamentos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar assinatura do webhook (se a Kirvano fornecer)
    const signature = request.headers.get('x-kirvano-signature')
    if (signature) {
      const webhookSecret = process.env.KIRVANO_WEBHOOK_SECRET
      if (webhookSecret) {
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(JSON.stringify(body))
          .digest('hex')
        
        if (signature !== expectedSignature) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }
      }
    }

    const { event, data } = body

    switch (event) {
      case 'payment.completed':
        await handlePaymentCompleted(data)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(data)
        break
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data)
        break
      
      case 'subscription.renewed':
        await handleSubscriptionRenewed(data)
        break
      
      default:
        console.log(`Evento não tratado: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handlePaymentCompleted(data: any) {
  const {
    payment_id,
    customer_email,
    customer_name,
    amount,
    currency,
    plan_type,
    payment_method
  } = data

  try {
    // Buscar ou criar usuário
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', customer_email)
      .single()

    if (userError && userError.code === 'PGRST116') {
      // Usuário não existe, criar novo
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: customer_email,
          name: customer_name,
          is_premium: true,
          kirvano_customer_id: payment_id
        })
        .select()
        .single()

      if (createError) throw createError
      user = newUser
    } else if (userError) {
      throw userError
    }

    // Calcular data de expiração baseada no plano
    const now = new Date()
    let expiresAt = new Date(now)
    
    switch (plan_type) {
      case 'monthly':
        expiresAt.setMonth(expiresAt.getMonth() + 1)
        break
      case 'quarterly':
        expiresAt.setMonth(expiresAt.getMonth() + 3)
        break
      case 'semiannual':
        expiresAt.setMonth(expiresAt.getMonth() + 6)
        break
      case 'annual':
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        break
      default:
        expiresAt.setMonth(expiresAt.getMonth() + 1) // Default para mensal
    }

    // Atualizar status premium do usuário
    await supabase
      .from('users')
      .update({
        is_premium: true,
        premium_expires_at: expiresAt.toISOString()
      })
      .eq('id', user.id)

    // Criar registro de assinatura
    await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        kirvano_payment_id: payment_id,
        plan_type,
        amount: parseFloat(amount),
        currency: currency || 'BRL',
        expires_at: expiresAt.toISOString()
      })

    // Criar registro de pagamento
    await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        kirvano_payment_id: payment_id,
        amount: parseFloat(amount),
        currency: currency || 'BRL',
        status: 'completed',
        payment_method
      })

    console.log(`Pagamento processado com sucesso para ${customer_email}`)
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    throw error
  }
}

async function handlePaymentFailed(data: any) {
  const { payment_id } = data

  try {
    // Atualizar status do pagamento
    await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('kirvano_payment_id', payment_id)

    console.log(`Pagamento falhou: ${payment_id}`)
  } catch (error) {
    console.error('Erro ao processar falha de pagamento:', error)
  }
}

async function handleSubscriptionCancelled(data: any) {
  const { payment_id, customer_email } = data

  try {
    // Buscar usuário
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer_email)
      .single()

    if (user) {
      // Cancelar assinatura
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('kirvano_payment_id', payment_id)

      // Manter premium até a data de expiração
      console.log(`Assinatura cancelada para ${customer_email}`)
    }
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error)
  }
}

async function handleSubscriptionRenewed(data: any) {
  const { payment_id, customer_email, amount, plan_type } = data

  try {
    // Buscar usuário
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', customer_email)
      .single()

    if (user) {
      // Calcular nova data de expiração
      const now = new Date()
      let expiresAt = new Date(now)
      
      switch (plan_type) {
        case 'monthly':
          expiresAt.setMonth(expiresAt.getMonth() + 1)
          break
        case 'quarterly':
          expiresAt.setMonth(expiresAt.getMonth() + 3)
          break
        case 'semiannual':
          expiresAt.setMonth(expiresAt.getMonth() + 6)
          break
        case 'annual':
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)
          break
      }

      // Atualizar usuário
      await supabase
        .from('users')
        .update({
          is_premium: true,
          premium_expires_at: expiresAt.toISOString()
        })
        .eq('id', user.id)

      // Criar novo registro de pagamento
      await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          kirvano_payment_id: payment_id,
          amount: parseFloat(amount),
          status: 'completed'
        })

      console.log(`Assinatura renovada para ${customer_email}`)
    }
  } catch (error) {
    console.error('Erro ao renovar assinatura:', error)
  }
}
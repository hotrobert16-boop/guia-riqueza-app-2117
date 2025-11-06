import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Lock, LogIn } from 'lucide-react'

interface PremiumGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireLogin?: boolean
}

export function PremiumGuard({ 
  children, 
  fallback, 
  requireLogin = true 
}: PremiumGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // Função para redirecionar para o checkout da Kirvano
  const handlePremiumSubscription = () => {
    if (!user) {
      // Se não estiver logado, redirecionar para login primeiro
      window.location.href = '/login'
      return
    }

    // URL do checkout da Kirvano - substitua pela URL real do seu produto
    const kirvanoCheckoutUrl = process.env.NEXT_PUBLIC_KIRVANO_CHECKOUT_URL || 'https://checkout.kirvano.com/seu-produto-id'
    
    // Adicionar parâmetros do usuário para personalizar o checkout
    const checkoutUrl = new URL(kirvanoCheckoutUrl)
    checkoutUrl.searchParams.set('customer_email', user.email)
    checkoutUrl.searchParams.set('customer_name', user.name || '')
    checkoutUrl.searchParams.set('user_id', user.id)
    
    // Redirecionar para o checkout
    window.open(checkoutUrl.toString(), '_blank')
  }

  // Se requer login e usuário não está logado
  if (requireLogin && !user) {
    return fallback || (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-8 text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Login Necessário</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Faça login para acessar este recurso
          </p>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => window.location.href = '/login'}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Fazer Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Se usuário está logado mas não é premium
  if (user && !user.isPremium) {
    return fallback || (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardContent className="p-8 text-center">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Recurso Premium</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Este recurso é exclusivo para assinantes Premium. 
            Desbloqueie acesso completo ao Guia da Riqueza!
          </p>
          <div className="space-y-3">
            <Button 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200"
              onClick={handlePremiumSubscription}
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar Premium
            </Button>
            <div className="text-sm text-gray-500">
              A partir de R$ 23,92/mês
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Se usuário é premium, mostrar conteúdo
  return <>{children}</>
}

// Hook para verificar status premium
export function usePremium() {
  const { user } = useAuth()
  
  return {
    isPremium: user?.isPremium || false,
    isLoggedIn: !!user,
    user
  }
}
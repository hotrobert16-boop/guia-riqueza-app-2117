'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  isPremium: boolean
  premiumExpiresAt?: string
}

export default function AccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Link de acesso inválido')
      setLoading(false)
      return
    }

    validateAccessLink()
  }, [token])

  const validateAccessLink = async () => {
    try {
      const response = await fetch(`/api/access-link?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Redirecionar para o app principal após 3 segundos
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setError(data.error || 'Erro ao validar link de acesso')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 flex items-center justify-center p-4\">
        <Card className=\"bg-black/90 border-yellow-500 text-white max-w-md w-full\">
          <CardContent className=\"p-8 text-center\">
            <Loader2 className=\"w-16 h-16 animate-spin text-yellow-400 mx-auto mb-4\" />
            <h2 className=\"text-xl font-bold mb-2\">Validando acesso...</h2>
            <p className=\"text-gray-300\">Aguarde enquanto verificamos seu link de acesso</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-red-400 via-red-600 to-red-800 flex items-center justify-center p-4\">
        <Card className=\"bg-black/90 border-red-500 text-white max-w-md w-full\">
          <CardContent className=\"p-8 text-center\">
            <AlertCircle className=\"w-16 h-16 text-red-400 mx-auto mb-4\" />
            <h2 className=\"text-xl font-bold mb-2\">Erro de Acesso</h2>
            <p className=\"text-gray-300 mb-6\">{error}</p>
            <Button 
              onClick={() => router.push('/')}
              className=\"bg-red-500 hover:bg-red-600\"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 flex items-center justify-center p-4\">
      <Card className=\"bg-black/90 border-yellow-500 text-white max-w-md w-full\">
        <CardHeader className=\"text-center\">
          <div className=\"flex items-center justify-center gap-3 mb-4\">
            <div className=\"p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full\">
              <Crown className=\"w-12 h-12 text-black\" />
            </div>
          </div>
          <CardTitle className=\"text-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent\">
            Acesso Liberado!
          </CardTitle>
        </CardHeader>
        <CardContent className=\"p-8 text-center space-y-6\">
          <div className=\"space-y-4\">
            <div className=\"flex items-center justify-center\">
              <CheckCircle className=\"w-16 h-16 text-green-400\" />
            </div>
            
            <div>
              <h3 className=\"text-xl font-bold mb-2\">Bem-vindo, {user?.name}!</h3>
              <p className=\"text-gray-300 mb-4\">
                Seu pagamento foi processado com sucesso e você agora tem acesso completo ao Guia da Riqueza.
              </p>
            </div>

            {user?.isPremium && (
              <div className=\"bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-4\">
                <div className=\"flex items-center justify-center gap-2 mb-2\">
                  <Crown className=\"w-5 h-5 text-yellow-400\" />
                  <span className=\"font-semibold text-yellow-400\">Status Premium Ativo</span>
                </div>
                <p className=\"text-sm text-gray-300\">
                  Você tem acesso a todos os recursos premium, incluindo:
                </p>
                <ul className=\"text-sm text-gray-300 mt-2 space-y-1\">
                  <li>• Chat IA Financeira Ilimitado</li>
                  <li>• Calculadoras Avançadas</li>
                  <li>• Áudios e E-books Exclusivos</li>
                  <li>• Consultoria Financeira</li>
                </ul>
              </div>
            )}

            <div className=\"text-sm text-gray-400\">
              Redirecionando automaticamente em alguns segundos...
            </div>

            <Button 
              onClick={() => router.push('/')}
              className=\"w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 text-lg hover:from-yellow-500 hover:to-yellow-700\"
            >
              Acessar Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
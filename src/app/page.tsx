"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Timer, 
  CheckCircle, 
  Star, 
  Zap,
  Trophy,
  DollarSign,
  Clock,
  Focus,
  Bell,
  Lightbulb,
  Sun,
  Moon,
  MessageCircle,
  Send,
  Crown,
  CreditCard,
  Headphones,
  Play,
  Pause,
  Volume2,
  Award,
  Gift,
  Briefcase,
  ExternalLink,
  User,
  Mail,
  Phone,
  Video,
  Upload,
  BarChart3,
  PieChart,
  TrendingDown,
  Coins,
  Wallet,
  ArrowUp,
  ArrowDown,
  Users,
  Settings,
  LogIn,
  UserPlus,
  Sparkles,
  Flame,
  Heart,
  Share2,
  Eye,
  EyeOff,
  Lock,
  Calculator,
  FileText,
  BookOpen,
  Mic,
  Download,
  Shield,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon,
  PlusCircle,
  MinusCircle,
  Percent,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  strategy: string
  targetDate: string
  targetAmount: number
  currentAmount: number
  createdAt: string
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

interface PomodoroSession {
  isActive: boolean
  timeLeft: number
  isBreak: boolean
  sessionsCompleted: number
}

interface ChatMessage {
  id: string
  message: string
  response: string
  timestamp: string
}

interface User {
  id: string
  name: string
  email: string
  points: number
  isPremium: boolean
  streak: number
  level: number
  isLoggedIn: boolean
}

interface Challenge {
  day: number
  title: string
  description: string
  completed: boolean
  reward: number
}

interface Opportunity {
  id: string
  title: string
  description: string
  link: string
  category: string
  commission: string
}

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
}

interface Audio {
  id: string
  title: string
  description: string
  duration: string
  category: string
}

interface PremiumContent {
  id: string
  title: string
  description: string
  type: 'ebook' | 'video' | 'audio' | 'tool' | 'consultation'
  category: string
  isPremium: boolean
}

interface FinancialTool {
  id: string
  name: string
  description: string
  type: 'calculator' | 'simulator' | 'planner'
  isPremium: boolean
}

interface SubscriptionPlan {
  id: string
  name: string
  duration: string
  price: number
  originalPrice?: number
  discount?: string
  paymentLink: string
  features: string[]
  isPopular?: boolean
}

const motivationalMessages = [
  "🚀 Hoje é o dia de agir pela sua riqueza!",
  "💎 Cada pequeno passo te aproxima da sua riqueza!",
  "⚡ Consistência é a chave do sucesso financeiro!",
  "🏆 Você está construindo seu futuro próspero!",
  "🎯 Foco no objetivo! Sua riqueza está chegando!",
  "💪 Disciplina hoje, liberdade financeira amanhã!",
  "✨ Seus sonhos financeiros são possíveis!",
  "👁️ Mantenha o foco, o sucesso está próximo!",
  "📈 Cada ação conta para sua prosperidade!",
  "⚡ Você tem o poder de mudar sua vida financeira!",
  "🛤️ Persistência é o caminho para a riqueza!"
]

const adhdTips = [
  "Divida grandes objetivos em tarefas menores de 15-30 minutos",
  "Use o timer Pomodoro para manter o foco",
  "Celebre cada pequena conquista",
  "Mantenha lembretes visuais sempre à vista",
  "Estabeleça rotinas diárias consistentes",
  "Use cores e símbolos para organizar informações",
  "Faça pausas regulares para manter a energia",
  "Elimine distrações do ambiente de trabalho"
]

const challenges21Days: Challenge[] = Array.from({ length: 21 }, (_, i) => ({
  day: i + 1,
  title: `Desafio Dia ${i + 1}`,
  description: [
    "Defina sua meta financeira principal",
    "Calcule quanto precisa economizar por mês",
    "Identifique 3 gastos desnecessários",
    "Crie um orçamento mensal detalhado",
    "Pesquise uma nova fonte de renda",
    "Leia sobre investimentos por 30 minutos",
    "Organize suas finanças digitalmente",
    "Defina metas de curto prazo",
    "Estude sobre educação financeira",
    "Revise seus gastos da semana",
    "Pesquise sobre renda passiva",
    "Crie um plano de emergência",
    "Analise suas despesas fixas",
    "Estude sobre investimentos seguros",
    "Defina recompensas para suas metas",
    "Revise seu progresso até aqui",
    "Pesquise sobre empreendedorismo",
    "Crie um plano de investimentos",
    "Analise oportunidades de crescimento",
    "Defina metas para o próximo mês",
    "Celebre suas conquistas e planeje o futuro!"
  ][i],
  completed: false,
  reward: (i + 1) * 10
}))

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Mensal',
    duration: 'por mês',
    price: 29.90,
    paymentLink: 'https://pay.kirvano.com/37bf7c6e-84e3-47ad-b46c-83d6bfe3d87e',
    features: [
      'Chat IA Financeira Ilimitado',
      'Calculadoras Avançadas',
      'Áudios e Afirmações Premium',
      'E-books Exclusivos',
      'Suporte Prioritário'
    ]
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    duration: 'por mês',
    price: 28.41,
    originalPrice: 29.90,
    discount: '5% OFF',
    paymentLink: '#', // Placeholder - usuário forneceu apenas o link mensal
    features: [
      'Todos os benefícios do plano mensal',
      'Economia de 5%',
      'Cobrança a cada 3 meses',
      'Acesso antecipado a novidades'
    ],
    isPopular: true
  },
  {
    id: 'semiannual',
    name: 'Semestral',
    duration: 'por mês',
    price: 26.91,
    originalPrice: 29.90,
    discount: '10% OFF',
    paymentLink: '#', // Placeholder - usuário forneceu apenas o link mensal
    features: [
      'Todos os benefícios do plano mensal',
      'Economia de 10%',
      'Cobrança a cada 6 meses',
      'Consultoria mensal gratuita'
    ]
  },
  {
    id: 'annual',
    name: 'Anual',
    duration: 'por mês',
    price: 23.92,
    originalPrice: 29.90,
    discount: '20% OFF',
    paymentLink: '#', // Placeholder - usuário forneceu apenas o link mensal
    features: [
      'Todos os benefícios do plano mensal',
      'Economia de 20%',
      'Cobrança anual',
      'Consultoria semanal gratuita',
      'Acesso VIP à comunidade'
    ]
  }
]

const sampleOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Hotmart - Cursos Digitais',
    description: 'Plataforma de cursos online com alta conversão',
    link: 'https://hotmart.com',
    category: 'Educação',
    commission: 'Até 80%'
  },
  {
    id: '2',
    title: 'Amazon Associados',
    description: 'Programa de afiliados da Amazon',
    link: 'https://associados.amazon.com.br',
    category: 'E-commerce',
    commission: 'Até 12%'
  },
  {
    id: '3',
    title: 'Monetizze',
    description: 'Marketplace de produtos digitais',
    link: 'https://monetizze.com.br',
    category: 'Digital',
    commission: 'Até 70%'
  }
]

const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Mentalidade de Riqueza em 60 Segundos',
    description: 'Transforme sua mente para atrair prosperidade',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    duration: '1:00',
    views: 15420
  },
  {
    id: '2',
    title: 'Como Começar a Investir Hoje',
    description: 'Primeiros passos para multiplicar seu dinheiro',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    duration: '0:45',
    views: 8930
  },
  {
    id: '3',
    title: 'Afirmações Poderosas de Prosperidade',
    description: 'Reprograme sua mente para o sucesso',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    duration: '1:30',
    views: 22100
  }
]

const sampleAudios: Audio[] = [
  {
    id: '1',
    title: 'Afirmações Matinais de Riqueza',
    description: 'Comece o dia com mentalidade próspera',
    duration: '10:00',
    category: 'Afirmações'
  },
  {
    id: '2',
    title: 'Meditação para Abundância',
    description: 'Atraia prosperidade através da meditação',
    duration: '15:00',
    category: 'Meditação'
  },
  {
    id: '3',
    title: 'Hipnose para Sucesso Financeiro',
    description: 'Reprograme seu subconsciente para a riqueza',
    duration: '25:00',
    category: 'Hipnose'
  }
]

const premiumContent: PremiumContent[] = [
  {
    id: '1',
    title: 'E-book: Estratégias Avançadas de Investimento',
    description: 'Guia completo com estratégias de investidores profissionais',
    type: 'ebook',
    category: 'Investimentos',
    isPremium: true
  },
  {
    id: '2',
    title: 'Vídeo: Mentalidade Milionária com Robert Kiyosaki',
    description: 'Masterclass exclusiva sobre mindset de riqueza',
    type: 'video',
    category: 'Mentalidade',
    isPremium: true
  },
  {
    id: '3',
    title: 'Áudio: Hipnose para Abundância Financeira',
    description: 'Sessão de hipnose para reprogramar crenças limitantes',
    type: 'audio',
    category: 'Mindset',
    isPremium: true
  },
  {
    id: '4',
    title: 'Consultoria Financeira Personalizada',
    description: 'Sessão 1:1 com especialista em finanças pessoais',
    type: 'consultation',
    category: 'Consultoria',
    isPremium: true
  },
  {
    id: '5',
    title: 'Planilha Avançada de Controle Financeiro',
    description: 'Planilha completa para gestão de patrimônio',
    type: 'tool',
    category: 'Ferramentas',
    isPremium: true
  }
]

const financialTools: FinancialTool[] = [
  {
    id: '1',
    name: 'Calculadora de Juros Compostos',
    description: 'Calcule o crescimento dos seus investimentos ao longo do tempo',
    type: 'calculator',
    isPremium: true
  },
  {
    id: '2',
    name: 'Simulador de Aposentadoria',
    description: 'Descubra quanto precisa investir para se aposentar',
    type: 'simulator',
    isPremium: true
  },
  {
    id: '3',
    name: 'Planejador de Orçamento Inteligente',
    description: 'Organize suas finanças com IA e automação',
    type: 'planner',
    isPremium: true
  },
  {
    id: '4',
    name: 'Calculadora de Renda Passiva',
    description: 'Calcule quanto precisa investir para viver de renda',
    type: 'calculator',
    isPremium: true
  }
]

export default function WealthGuideApp() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    strategy: '',
    targetDate: '',
    targetAmount: 0
  })
  const [newTask, setNewTask] = useState('')
  const [pomodoro, setPomodoro] = useState<PomodoroSession>({
    isActive: false,
    timeLeft: 25 * 60,
    isBreak: false,
    sessionsCompleted: 0
  })
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentTip, setCurrentTip] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  // Estados para novas funcionalidades
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentChatMessage, setCurrentChatMessage] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Usuário',
    email: '',
    points: 0,
    isPremium: false,
    streak: 0,
    level: 1,
    isLoggedIn: false
  })
  const [challenges, setChallenges] = useState<Challenge[]>(challenges21Days)
  const [currentAudio, setCurrentAudio] = useState<Audio | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(sampleOpportunities)
  const [videos, setVideos] = useState<Video[]>(sampleVideos)
  const [audios, setAudios] = useState<Audio[]>(sampleAudios)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadWhatsapp, setLeadWhatsapp] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estados para calculadoras financeiras
  const [compoundInterest, setCompoundInterest] = useState({
    principal: 1000,
    monthlyContribution: 500,
    annualRate: 10,
    years: 10,
    result: 0
  })

  const [retirementSimulator, setRetirementSimulator] = useState({
    currentAge: 30,
    retirementAge: 60,
    monthlyExpenses: 5000,
    currentSavings: 10000,
    monthlyContribution: 1000,
    result: 0
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('wealthGuideGoals')
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals)
      setGoals(parsedGoals)
      if (parsedGoals.length > 0) {
        setCurrentGoal(parsedGoals[0])
      }
    }
    
    const savedTheme = localStorage.getItem('wealthGuideTheme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
    
    const savedUser = localStorage.getItem('wealthGuideUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    const savedChallenges = localStorage.getItem('wealthGuideChallenges')
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges))
    }
    
    setCurrentMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
    setCurrentTip(adhdTips[Math.floor(Math.random() * adhdTips.length)])
    
    // Configurar notificações
    if ('Notification' in window) {
      Notification.requestPermission()
    }
    
    // Notificação diária
    const notificationInterval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('Guia da Riqueza', {
          body: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
          icon: '/icon.svg'
        })
      }
    }, 24 * 60 * 60 * 1000) // 24 horas
    
    return () => clearInterval(notificationInterval)
  }, [])

  // Salvar dados
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('wealthGuideGoals', JSON.stringify(goals))
    }
  }, [goals])

  useEffect(() => {
    localStorage.setItem('wealthGuideTheme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('wealthGuideUser', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('wealthGuideChallenges', JSON.stringify(challenges))
  }, [challenges])

  // Timer Pomodoro
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (pomodoro.isActive && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }))
      }, 1000)
    } else if (pomodoro.isActive && pomodoro.timeLeft === 0) {
      if (!pomodoro.isBreak) {
        setPomodoro(prev => ({
          ...prev,
          isBreak: true,
          timeLeft: 5 * 60,
          sessionsCompleted: prev.sessionsCompleted + 1
        }))
        addPoints(25)
      } else {
        setPomodoro(prev => ({
          ...prev,
          isBreak: false,
          timeLeft: 25 * 60,
          isActive: false
        }))
      }
    }
    return () => clearInterval(interval)
  }, [pomodoro.isActive, pomodoro.timeLeft, pomodoro.isBreak])

  const addPoints = (points: number) => {
    setUser(prev => {
      const newPoints = prev.points + points
      const newLevel = Math.floor(newPoints / 1000) + 1
      return {
        ...prev,
        points: newPoints,
        level: newLevel
      }
    })
  }

  const handleLogin = () => {
    if (loginData.email && loginData.password) {
      setUser(prev => ({
        ...prev,
        email: loginData.email,
        isLoggedIn: true
      }))
      setShowLogin(false)
      setShowWelcome(false)
      setLoginData({ email: '', password: '' })
      addPoints(100)
    }
  }

  const handleRegister = () => {
    if (registerData.name && registerData.email && registerData.password && 
        registerData.password === registerData.confirmPassword) {
      setUser(prev => ({
        ...prev,
        name: registerData.name,
        email: registerData.email,
        isLoggedIn: true
      }))
      setShowLogin(false)
      setShowWelcome(false)
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
      setIsRegistering(false)
      addPoints(200)
    }
  }

  const handleContinueWithoutLogin = () => {
    setShowWelcome(false)
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }))
  }

  const handleLogout = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }))
  }

  const handleSubscriptionClick = (plan: SubscriptionPlan) => {
    // Redirecionar para o link de pagamento da Kirvano
    window.open(plan.paymentLink, '_blank')
  }

  const sendChatMessage = async () => {
    if (!currentChatMessage.trim()) return
    
    // Verificar se usuário não logado pode usar chat IA (recurso premium)
    if (!user.isLoggedIn) {
      alert('🔒 Chat IA é um recurso premium! Faça login para acessar.')
      return
    }
    
    setIsLoadingChat(true)
    const userMessage = currentChatMessage
    setCurrentChatMessage('')
    
    // Simular resposta da IA
    const responses = [
      "Para começar a investir com pouco dinheiro, recomendo: 1) Crie uma reserva de emergência primeiro, 2) Estude sobre Tesouro Direto (investimento seguro a partir de R$ 30), 3) Considere fundos de investimento com aplicação mínima baixa, 4) Use aplicativos como Nubank, Inter ou XP para começar. Lembre-se: consistência é mais importante que valor inicial!",
      "Excelente pergunta! A mentalidade de riqueza começa com: 1) Acreditar que você merece prosperidade, 2) Focar em oportunidades, não em problemas, 3) Investir em conhecimento constantemente, 4) Cercar-se de pessoas prósperas, 5) Ter disciplina financeira. Comece mudando seus pensamentos sobre dinheiro - ele é uma ferramenta para realizar seus sonhos!",
      "Para desenvolver disciplina financeira: 1) Defina metas claras e específicas, 2) Crie um orçamento e acompanhe gastos, 3) Automatize investimentos, 4) Celebre pequenas conquistas, 5) Tenha um 'porquê' forte para suas metas. A disciplina é como um músculo - quanto mais você exercita, mais forte fica!",
      "Sobre renda passiva: 1) Dividendos de ações, 2) Fundos imobiliários (FIIs), 3) Tesouro IPCA+, 4) Produtos digitais, 5) Aluguel de imóveis. Comece pequeno e reinvista os ganhos. Lembre-se: renda passiva exige investimento inicial de tempo ou dinheiro, mas depois trabalha para você!"
    ]
    
    setTimeout(() => {
      const response = responses[Math.floor(Math.random() * responses.length)]
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: userMessage,
        response: response,
        timestamp: new Date().toISOString()
      }
      
      setChatMessages(prev => [newMessage, ...prev])
      setIsLoadingChat(false)
      addPoints(10)
    }, 2000)
  }

  const completeChallenge = (day: number) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.day === day 
        ? { ...challenge, completed: true }
        : challenge
    ))
    
    const challenge = challenges.find(c => c.day === day)
    if (challenge) {
      addPoints(challenge.reward)
      setUser(prev => ({ ...prev, streak: prev.streak + 1 }))
    }
  }

  const toggleAudio = (audio: Audio) => {
    // Verificar se usuário não logado pode usar áudios (recurso premium)
    if (!user.isLoggedIn) {
      alert('🔒 Áudios são recursos premium! Faça login para acessar.')
      return
    }
    
    if (currentAudio?.id === audio.id) {
      setIsPlayingAudio(!isPlayingAudio)
    } else {
      setCurrentAudio(audio)
      setIsPlayingAudio(true)
    }
    addPoints(5)
  }

  const submitLead = () => {
    if (leadEmail || leadWhatsapp) {
      console.log('Lead capturado:', { email: leadEmail, whatsapp: leadWhatsapp })
      alert('Obrigado! Em breve você receberá conteúdos exclusivos sobre riqueza!')
      setLeadEmail('')
      setLeadWhatsapp('')
      addPoints(50)
    }
  }

  const createGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      strategy: newGoal.strategy,
      targetDate: newGoal.targetDate,
      targetAmount: newGoal.targetAmount,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      tasks: []
    }

    const updatedGoals = [goal, ...goals]
    setGoals(updatedGoals)
    setCurrentGoal(goal)
    setNewGoal({
      title: '',
      description: '',
      strategy: '',
      targetDate: '',
      targetAmount: 0
    })
    addPoints(100)
  }

  const addTask = () => {
    if (!newTask || !currentGoal) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    }

    const updatedGoals = goals.map(goal => 
      goal.id === currentGoal.id 
        ? { ...goal, tasks: [...goal.tasks, task] }
        : goal
    )

    setGoals(updatedGoals)
    setCurrentGoal({ ...currentGoal, tasks: [...currentGoal.tasks, task] })
    setNewTask('')
    addPoints(20)
  }

  const toggleTask = (taskId: string) => {
    if (!currentGoal) return

    const updatedGoals = goals.map(goal => 
      goal.id === currentGoal.id 
        ? {
            ...goal,
            tasks: goal.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : goal
    )

    setGoals(updatedGoals)
    const updatedCurrentGoal = updatedGoals.find(g => g.id === currentGoal.id)
    if (updatedCurrentGoal) {
      setCurrentGoal(updatedCurrentGoal)
      const task = updatedCurrentGoal.tasks.find(t => t.id === taskId)
      if (task?.completed) {
        addPoints(30)
      }
    }
  }

  const updateProgress = (amount: number) => {
    if (!currentGoal) return

    const updatedGoals = goals.map(goal => 
      goal.id === currentGoal.id 
        ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) }
        : goal
    )

    setGoals(updatedGoals)
    const updatedCurrentGoal = updatedGoals.find(g => g.id === currentGoal.id)
    if (updatedCurrentGoal) {
      setCurrentGoal(updatedCurrentGoal)
      if (amount > 0) addPoints(Math.floor(amount / 10))
    }
  }

  const startPomodoro = () => {
    setPomodoro(prev => ({
      ...prev,
      isActive: true,
      timeLeft: prev.isBreak ? 5 * 60 : 25 * 60
    }))
  }

  const stopPomodoro = () => {
    setPomodoro(prev => ({
      ...prev,
      isActive: false
    }))
  }

  const resetPomodoro = () => {
    setPomodoro({
      isActive: false,
      timeLeft: 25 * 60,
      isBreak: false,
      sessionsCompleted: 0
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!currentGoal || currentGoal.targetAmount === 0) return 0
    return Math.min((currentGoal.currentAmount / currentGoal.targetAmount) * 100, 100)
  }

  const getDaysRemaining = () => {
    if (!currentGoal) return 0
    const target = new Date(currentGoal.targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getCompletedTasks = () => {
    if (!currentGoal) return 0
    return currentGoal.tasks.filter(task => task.completed).length
  }

  const getCompletedChallenges = () => {
    return challenges.filter(c => c.completed).length
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Calculadora de Juros Compostos
  const calculateCompoundInterest = () => {
    if (!user.isLoggedIn || !user.isPremium) {
      alert('🔒 Ferramentas avançadas são exclusivas para assinantes Premium!')
      return
    }

    const { principal, monthlyContribution, annualRate, years } = compoundInterest
    const monthlyRate = annualRate / 100 / 12
    const totalMonths = years * 12
    
    // Fórmula de juros compostos com contribuições mensais
    const futureValue = principal * Math.pow(1 + monthlyRate, totalMonths) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    
    setCompoundInterest(prev => ({ ...prev, result: futureValue }))
    addPoints(50)
  }

  // Simulador de Aposentadoria
  const calculateRetirement = () => {
    if (!user.isLoggedIn || !user.isPremium) {
      alert('🔒 Ferramentas avançadas são exclusivas para assinantes Premium!')
      return
    }

    const { currentAge, retirementAge, monthlyExpenses, currentSavings, monthlyContribution } = retirementSimulator
    const yearsToRetirement = retirementAge - currentAge
    const monthsToRetirement = yearsToRetirement * 12
    const monthlyRate = 0.008 // 10% ao ano
    
    // Valor acumulado até a aposentadoria
    const futureValue = currentSavings * Math.pow(1 + monthlyRate, monthsToRetirement) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate)
    
    // Renda mensal que pode ser gerada (considerando 4% ao ano de retirada)
    const monthlyIncome = futureValue * 0.004
    
    setRetirementSimulator(prev => ({ ...prev, result: monthlyIncome }))
    addPoints(50)
  }

  // Tela de Login/Registro
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="bg-black/90 border-yellow-500 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
                    <Crown className="w-12 h-12 text-black" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                  {isRegistering ? 'Criar Conta' : 'Entrar'}
                </h1>
                
                <p className="text-gray-300">
                  {isRegistering 
                    ? 'Crie sua conta para acessar conteúdo exclusivo' 
                    : 'Acesse sua conta para continuar sua jornada'
                  }
                </p>
              </div>

              <div className="space-y-4">
                {isRegistering && (
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={isRegistering ? registerData.email : loginData.email}
                    onChange={(e) => isRegistering 
                      ? setRegisterData({...registerData, email: e.target.value})
                      : setLoginData({...loginData, email: e.target.value})
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={isRegistering ? registerData.password : loginData.password}
                      onChange={(e) => isRegistering 
                        ? setRegisterData({...registerData, password: e.target.value})
                        : setLoginData({...loginData, password: e.target.value})
                      }
                      className="bg-gray-800 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {isRegistering && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={isRegistering ? handleRegister : handleLogin}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 text-lg hover:from-yellow-500 hover:to-yellow-700"
                >
                  {isRegistering ? (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Criar Conta
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    {isRegistering 
                      ? 'Já tem conta? Faça login' 
                      : 'Não tem conta? Registre-se'
                    }
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Tela de Boas-vindas
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="bg-black/90 border-yellow-500 text-white">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
                  <Crown className="w-12 h-12 text-black" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Guia da Riqueza
              </h1>
              
              <p className="text-gray-300 text-lg">
                Transforme sua mentalidade e conquiste a prosperidade financeira que você merece
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-yellow-400">
                  <Sparkles className="w-5 h-5" />
                  <span>Chat de IA Financeira</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 text-yellow-400">
                  <Trophy className="w-5 h-5" />
                  <span>Desafio 21 Dias de Riqueza</span>
                </div>
                <div className="flex items-center gap-3 text-yellow-400">
                  <Crown className="w-5 h-5" />
                  <span>Área Premium Exclusiva</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 text-yellow-400">
                  <Headphones className="w-5 h-5" />
                  <span>Áudios e Afirmações Diárias</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 text-yellow-400">
                  <Calculator className="w-5 h-5" />
                  <span>Calculadoras Financeiras Avançadas</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 text-yellow-400">
                  <FileText className="w-5 h-5" />
                  <span>E-books e Conteúdo Exclusivo</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 text-yellow-400">
                  <Users className="w-5 h-5" />
                  <span>Consultoria Financeira 1:1</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 text-lg hover:from-yellow-500 hover:to-yellow-700"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar / Registrar
                </Button>
                
                <Button 
                  onClick={handleContinueWithoutLogin}
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 py-3 text-lg"
                >
                  Continuar sem Login
                  <span className="text-xs ml-2">(Acesso Limitado)</span>
                </Button>
              </div>
              
              <p className="text-xs text-gray-400">
                Junte-se a milhares de pessoas que já transformaram suas vidas financeiras
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' 
        : 'bg-gradient-to-br from-yellow-50 via-white to-yellow-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Guia da Riqueza
            </h1>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
                className={`${
                  isDarkMode 
                    ? 'border-yellow-500 hover:bg-yellow-500/10 text-yellow-400' 
                    : 'border-yellow-600 hover:bg-yellow-50 text-yellow-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              {user.isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Sair
                </Button>
              ) : (
                <Button
                  onClick={() => setShowLogin(true)}
                  variant="outline"
                  size="sm"
                  className="text-green-500 border-green-500 hover:bg-green-50"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Entrar
                </Button>
              )}
            </div>
          </div>
          
          {/* User Stats */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {user.isLoggedIn && (
              <Badge className="bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-1">
                <User className="w-4 h-4 mr-1" />
                {user.name}
              </Badge>
            )}
            {!user.isLoggedIn && (
              <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-3 py-1">
                <User className="w-4 h-4 mr-1" />
                Visitante (Acesso Limitado)
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1">
              <Star className="w-4 h-4 mr-1" />
              Nível {user.level}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1">
              <Coins className="w-4 h-4 mr-1" />
              {user.points} pontos
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1">
              <Flame className="w-4 h-4 mr-1" />
              {user.streak} dias
            </Badge>
            {user.isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transforme seus sonhos financeiros em realidade com IA, estratégia e mentalidade de riqueza
          </p>
        </div>

        {/* Mensagem Motivacional */}
        <Card className={`mb-6 border-l-4 border-l-yellow-500 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-gradient-to-r from-yellow-50 to-orange-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
              }`}>{currentMessage}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-5 lg:grid-cols-10 ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
          }`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">IA Chat</span>
              {!user.isLoggedIn && <Lock className="w-3 h-3 text-gray-400" />}
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Premium</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Ferramentas</span>
              {(!user.isLoggedIn || !user.isPremium) && <Lock className="w-3 h-3 text-gray-400" />}
            </TabsTrigger>
            <TabsTrigger value="audios" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span className="hidden sm:inline">Áudios</span>
              {!user.isLoggedIn && <Lock className="w-3 h-3 text-gray-400" />}
            </TabsTrigger>
            <TabsTrigger value="challenge" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">21 Dias</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Oportunidades</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Objetivos</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Foco</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Cards de Estatísticas */}
              <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">Patrimônio Total</h3>
                      <p className="text-2xl font-bold">
                        R$ {currentGoal ? currentGoal.currentAmount.toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">Meta Atual</h3>
                      <p className="text-2xl font-bold">
                        R$ {currentGoal ? currentGoal.targetAmount.toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">Desafios</h3>
                      <p className="text-2xl font-bold">
                        {getCompletedChallenges()}/21
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">Sequência</h3>
                      <p className="text-2xl font-bold">
                        {user.streak} dias
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progresso Principal */}
            {currentGoal && (
              <Card className={`border-2 border-yellow-500 ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6 text-yellow-500" />
                      {currentGoal.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      {getDaysRemaining()} dias restantes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso Financeiro</span>
                      <span className="font-medium">
                        {getProgressPercentage().toFixed(1)}% concluído
                      </span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-4" />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => updateProgress(100)} 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      +R$ 100
                    </Button>
                    <Button 
                      onClick={() => updateProgress(500)} 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      +R$ 500
                    </Button>
                    <Button 
                      onClick={() => updateProgress(1000)} 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      +R$ 1.000
                    </Button>
                    <Button 
                      onClick={() => updateProgress(-100)} 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      -R$ 100
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chat IA */}
          <TabsContent value="chat" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                  Assistente Financeiro IA
                  {!user.isLoggedIn && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  {user.isLoggedIn 
                    ? 'Faça perguntas sobre finanças, investimentos e mentalidade de riqueza'
                    : 'Faça login para acessar o chat IA com assistente financeiro'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={user.isLoggedIn 
                      ? "Ex: Como posso começar a investir com pouco dinheiro?"
                      : "🔒 Faça login para usar o chat IA"
                    }
                    value={currentChatMessage}
                    onChange={(e) => setCurrentChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                    disabled={!user.isLoggedIn}
                  />
                  <Button 
                    onClick={sendChatMessage} 
                    disabled={isLoadingChat || !user.isLoggedIn}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoadingChat ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatMessages.map((chat) => (
                    <div key={chat.id} className="space-y-3">
                      <div className={`p-3 rounded-lg ml-12 ${
                        isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'
                      }`}>
                        <p className="font-medium">Você:</p>
                        <p>{chat.message}</p>
                      </div>
                      <div className={`p-3 rounded-lg mr-12 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <p className="font-medium text-yellow-500 mb-2">🤖 Assistente IA:</p>
                        <p className="leading-relaxed">{chat.response}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {user.isLoggedIn 
                        ? 'Faça sua primeira pergunta para começar!'
                        : '🔒 Faça login para acessar o chat IA'
                      }
                    </p>
                    {!user.isLoggedIn && (
                      <Button 
                        onClick={() => setShowLogin(true)}
                        className="mt-4 bg-blue-500 hover:bg-blue-600"
                      >
                        Fazer Login
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Premium */}
          <TabsContent value="premium" className="space-y-6">
            <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black">
              <CardContent className="p-8 text-center">
                <Crown className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Área Premium</h2>
                <p className="text-lg mb-6">
                  Desbloqueie conteúdo exclusivo para acelerar sua jornada rumo à riqueza
                </p>
                
                {!user.isPremium ? (
                  <div className="space-y-6">
                    {/* Benefícios Premium Detalhados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          Chat IA Ilimitado
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Assistente financeiro 24/7</li>
                          <li>• Conselhos personalizados</li>
                          <li>• Estratégias de investimento</li>
                          <li>• Análise de carteira</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Calculator className="w-5 h-5" />
                          Ferramentas Avançadas
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Calculadora de juros compostos</li>
                          <li>• Simulador de aposentadoria</li>
                          <li>• Planejador de orçamento IA</li>
                          <li>• Calculadora de renda passiva</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Conteúdo Exclusivo
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <li>• E-books de estratégias avançadas</li>
                          <li>• Vídeos de mentores milionários</li>
                          <li>• Planilhas de controle financeiro</li>
                          <li>• Áudios de hipnose para riqueza</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Consultoria Premium
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Sessões 1:1 com especialistas</li>
                          <li>• Análise personalizada de carteira</li>
                          <li>• Plano financeiro customizado</li>
                          <li>• Suporte prioritário</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Headphones className="w-5 h-5" />
                          Áudios Premium
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Afirmações diárias personalizadas</li>
                          <li>• Meditações para abundância</li>
                          <li>• Hipnose para sucesso financeiro</li>
                          <li>• Podcasts exclusivos</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Benefícios Extras
                        </h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Acesso antecipado a novidades</li>
                          <li>• Comunidade VIP exclusiva</li>
                          <li>• Webinars ao vivo mensais</li>
                          <li>• Garantia de 30 dias</li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Planos de Assinatura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {subscriptionPlans.map((plan) => (
                        <div 
                          key={plan.id}
                          className={`bg-black/20 rounded-lg p-4 border-2 transition-all relative ${
                            plan.isPopular 
                              ? 'border-green-400 hover:border-green-300' 
                              : 'border-transparent hover:border-white/30'
                          }`}
                        >
                          {plan.discount && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <Badge className={`text-xs ${
                                plan.id === 'quarterly' ? 'bg-green-500 text-white' :
                                plan.id === 'semiannual' ? 'bg-blue-500 text-white' :
                                plan.id === 'annual' ? 'bg-yellow-500 text-black font-bold' :
                                'bg-gray-500 text-white'
                              }`}>
                                {plan.discount}
                              </Badge>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <h4 className="font-bold text-lg mb-2">{plan.name}</h4>
                            <div className="text-2xl font-bold mb-1">
                              R$ {plan.price.toFixed(2).replace('.', ',')}
                            </div>
                            <div className="text-sm opacity-80 mb-1">{plan.duration}</div>
                            {plan.originalPrice && (
                              <div className="text-xs opacity-70 mb-4">
                                {plan.id === 'quarterly' && `R$ ${(plan.price * 3).toFixed(2).replace('.', ',')} a cada 3 meses`}
                                {plan.id === 'semiannual' && `R$ ${(plan.price * 6).toFixed(2).replace('.', ',')} a cada 6 meses`}
                                {plan.id === 'annual' && `R$ ${(plan.price * 12).toFixed(2).replace('.', ',')} por ano`}
                              </div>
                            )}
                            
                            <Button 
                              className={`w-full font-bold ${
                                plan.id === 'quarterly' ? 'bg-green-500 text-white hover:bg-green-600' :
                                plan.id === 'semiannual' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                                plan.id === 'annual' ? 'bg-yellow-500 text-black hover:bg-yellow-600' :
                                'bg-white text-black hover:bg-gray-100'
                              }`}
                              onClick={() => handleSubscriptionClick(plan)}
                            >
                              {plan.id === 'annual' ? (
                                <>
                                  <Crown className="w-4 h-4 mr-2" />
                                  Melhor Oferta
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Assinar
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm opacity-80">
                      💳 Cancele quando quiser • 🔒 Pagamento 100% seguro • ⚡ Acesso imediato
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-black/20 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">🎉 Você é Premium!</h3>
                      <p>Aproveite todo o conteúdo exclusivo disponível</p>
                    </div>
                    
                    {/* Conteúdo Premium Disponível */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {premiumContent.map((content) => (
                        <Card key={content.id} className="bg-black/30">
                          <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              {content.type === 'ebook' && <BookOpen className="w-6 h-6" />}
                              {content.type === 'video' && <Video className="w-6 h-6" />}
                              {content.type === 'audio' && <Headphones className="w-6 h-6" />}
                              {content.type === 'tool' && <Calculator className="w-6 h-6" />}
                              {content.type === 'consultation' && <Users className="w-6 h-6" />}
                            </div>
                            <h4 className="font-semibold mb-2 text-sm">{content.title}</h4>
                            <p className="text-xs opacity-80 mb-3">{content.description}</p>
                            <Button size="sm" className="bg-yellow-500 text-black w-full">
                              <Download className="w-3 h-3 mr-1" />
                              Acessar
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ferramentas Financeiras */}
          <TabsContent value="tools" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-green-500" />
                  Ferramentas Financeiras Avançadas
                  {(!user.isLoggedIn || !user.isPremium) && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  {user.isLoggedIn && user.isPremium
                    ? 'Calculadoras e simuladores para planejar seu futuro financeiro'
                    : 'Faça login e assine o Premium para acessar ferramentas avançadas'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.isLoggedIn && user.isPremium ? (
                  <>
                    {/* Calculadora de Juros Compostos */}
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <TrendingUpIcon className="w-5 h-5 text-green-500" />
                          Calculadora de Juros Compostos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="principal">Valor Inicial (R$)</Label>
                            <Input
                              id="principal"
                              type="number"
                              value={compoundInterest.principal}
                              onChange={(e) => setCompoundInterest(prev => ({
                                ...prev,
                                principal: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthlyContribution">Aporte Mensal (R$)</Label>
                            <Input
                              id="monthlyContribution"
                              type="number"
                              value={compoundInterest.monthlyContribution}
                              onChange={(e) => setCompoundInterest(prev => ({
                                ...prev,
                                monthlyContribution: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="annualRate">Taxa Anual (%)</Label>
                            <Input
                              id="annualRate"
                              type="number"
                              step="0.1"
                              value={compoundInterest.annualRate}
                              onChange={(e) => setCompoundInterest(prev => ({
                                ...prev,
                                annualRate: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="years">Período (anos)</Label>
                            <Input
                              id="years"
                              type="number"
                              value={compoundInterest.years}
                              onChange={(e) => setCompoundInterest(prev => ({
                                ...prev,
                                years: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          onClick={calculateCompoundInterest}
                          className="w-full bg-green-500 hover:bg-green-600"
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          Calcular
                        </Button>
                        
                        {compoundInterest.result > 0 && (
                          <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                            <CardContent className="p-4 text-center">
                              <h3 className="text-lg font-semibold mb-2">Resultado da Simulação</h3>
                              <div className="text-3xl font-bold mb-2">
                                R$ {compoundInterest.result.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                              </div>
                              <p className="text-sm opacity-90">
                                Valor acumulado em {compoundInterest.years} anos
                              </p>
                              <div className="mt-4 text-sm">
                                <p>💰 Valor investido: R$ {(compoundInterest.principal + (compoundInterest.monthlyContribution * compoundInterest.years * 12)).toLocaleString('pt-BR')}</p>
                                <p>📈 Rendimento: R$ {(compoundInterest.result - compoundInterest.principal - (compoundInterest.monthlyContribution * compoundInterest.years * 12)).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>

                    {/* Simulador de Aposentadoria */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <CalendarIcon className="w-5 h-5 text-blue-500" />
                          Simulador de Aposentadoria
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="currentAge">Idade Atual</Label>
                            <Input
                              id="currentAge"
                              type="number"
                              value={retirementSimulator.currentAge}
                              onChange={(e) => setRetirementSimulator(prev => ({
                                ...prev,
                                currentAge: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="retirementAge">Idade para Aposentar</Label>
                            <Input
                              id="retirementAge"
                              type="number"
                              value={retirementSimulator.retirementAge}
                              onChange={(e) => setRetirementSimulator(prev => ({
                                ...prev,
                                retirementAge: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthlyExpenses">Gastos Mensais Desejados (R$)</Label>
                            <Input
                              id="monthlyExpenses"
                              type="number"
                              value={retirementSimulator.monthlyExpenses}
                              onChange={(e) => setRetirementSimulator(prev => ({
                                ...prev,
                                monthlyExpenses: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="currentSavings">Patrimônio Atual (R$)</Label>
                            <Input
                              id="currentSavings"
                              type="number"
                              value={retirementSimulator.currentSavings}
                              onChange={(e) => setRetirementSimulator(prev => ({
                                ...prev,
                                currentSavings: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="monthlyContribution">Aporte Mensal (R$)</Label>
                            <Input
                              id="monthlyContribution"
                              type="number"
                              value={retirementSimulator.monthlyContribution}
                              onChange={(e) => setRetirementSimulator(prev => ({
                                ...prev,
                                monthlyContribution: Number(e.target.value)
                              }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          onClick={calculateRetirement}
                          className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                          <ClockIcon className="w-4 h-4 mr-2" />
                          Simular Aposentadoria
                        </Button>
                        
                        {retirementSimulator.result > 0 && (
                          <Card className="bg-gradient-to-r from-blue-500 to-purple-700 text-white">
                            <CardContent className="p-4 text-center">
                              <h3 className="text-lg font-semibold mb-2">Simulação de Aposentadoria</h3>
                              <div className="text-3xl font-bold mb-2">
                                R$ {retirementSimulator.result.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                              </div>
                              <p className="text-sm opacity-90 mb-4">
                                Renda mensal estimada na aposentadoria
                              </p>
                              <div className="text-sm space-y-1">
                                <p>🎯 Meta: R$ {retirementSimulator.monthlyExpenses.toLocaleString('pt-BR')}/mês</p>
                                <p>⏰ Anos para aposentar: {retirementSimulator.retirementAge - retirementSimulator.currentAge}</p>
                                <p className={retirementSimulator.result >= retirementSimulator.monthlyExpenses ? 'text-green-200' : 'text-yellow-200'}>
                                  {retirementSimulator.result >= retirementSimulator.monthlyExpenses 
                                    ? '✅ Meta atingida!' 
                                    : '⚠️ Considere aumentar os aportes'
                                  }
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>

                    {/* Lista de Outras Ferramentas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {financialTools.slice(2).map((tool) => (
                        <Card key={tool.id} className={`cursor-pointer transition-all hover:scale-105 ${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                        }`}>
                          <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-3">
                              {tool.type === 'calculator' && <Calculator className="w-8 h-8 text-green-500" />}
                              {tool.type === 'simulator' && <TrendingUpIcon className="w-8 h-8 text-blue-500" />}
                              {tool.type === 'planner' && <CalendarIcon className="w-8 h-8 text-purple-500" />}
                            </div>
                            <h3 className="font-semibold mb-2">{tool.name}</h3>
                            <p className={`text-sm mb-4 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {tool.description}
                            </p>
                            <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                              Em Breve
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ferramentas Premium</h3>
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {!user.isLoggedIn 
                        ? '🔒 Faça login e assine o Premium para acessar calculadoras avançadas'
                        : '🔒 Assine o Premium para acessar calculadoras financeiras avançadas'
                      }
                    </p>
                    
                    {/* Preview das Ferramentas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 opacity-60">
                      {financialTools.map((tool) => (
                        <Card key={tool.id} className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
                          <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              {tool.type === 'calculator' && <Calculator className="w-6 h-6 text-gray-400" />}
                              {tool.type === 'simulator' && <TrendingUpIcon className="w-6 h-6 text-gray-400" />}
                              {tool.type === 'planner' && <CalendarIcon className="w-6 h-6 text-gray-400" />}
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{tool.name}</h4>
                            <p className="text-xs text-gray-500">{tool.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      {!user.isLoggedIn && (
                        <Button 
                          onClick={() => setShowLogin(true)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Fazer Login
                        </Button>
                      )}
                      <Button 
                        onClick={() => {
                          const premiumTab = document.querySelector('[value="premium"]') as HTMLElement
                          premiumTab?.click()
                        }}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Ver Planos Premium
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Áudios */}
          <TabsContent value="audios" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-6 h-6 text-purple-500" />
                  Áudios e Afirmações Diárias
                  {!user.isLoggedIn && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  {user.isLoggedIn 
                    ? 'Transforme sua mentalidade com áudios poderosos'
                    : 'Faça login para acessar áudios exclusivos de mentalidade'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {audios.map((audio) => (
                    <Card key={audio.id} className={`cursor-pointer transition-all hover:scale-105 ${
                      currentAudio?.id === audio.id 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : isDarkMode ? 'bg-gray-700' : 'bg-white'
                    } ${!user.isLoggedIn ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Button
                            size="sm"
                            onClick={() => toggleAudio(audio)}
                            className={`rounded-full ${
                              currentAudio?.id === audio.id && isPlayingAudio
                                ? 'bg-purple-500 hover:bg-purple-600'
                                : 'bg-gray-500 hover:bg-gray-600'
                            }`}
                            disabled={!user.isLoggedIn}
                          >
                            {!user.isLoggedIn ? (
                              <Lock className="w-4 h-4" />
                            ) : currentAudio?.id === audio.id && isPlayingAudio ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Volume2 className="w-5 h-5 text-purple-500" />
                        </div>
                        
                        <h3 className="font-semibold mb-2">{audio.title}</h3>
                        <p className={`text-sm mb-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {audio.description}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs">
                          <Badge variant="outline">{audio.category}</Badge>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {audio.duration}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {!user.isLoggedIn && (
                  <div className="text-center py-8">
                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      🔒 Faça login para acessar áudios exclusivos
                    </p>
                    <Button 
                      onClick={() => setShowLogin(true)}
                      className="mt-4 bg-purple-500 hover:bg-purple-600"
                    >
                      Fazer Login
                    </Button>
                  </div>
                )}

                {currentAudio && user.isLoggedIn && (
                  <Card className="mt-6 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{currentAudio.title}</h4>
                          <p className="text-sm opacity-90">{currentAudio.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => toggleAudio(currentAudio)}
                            className="bg-white/20 hover:bg-white/30"
                          >
                            {isPlayingAudio ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Desafio 21 Dias */}
          <TabsContent value="challenge" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Desafio 21 Dias de Riqueza
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  Complete tarefas diárias e transforme sua mentalidade financeira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso do Desafio</span>
                    <span className="font-medium">
                      {getCompletedChallenges()}/21 dias
                    </span>
                  </div>
                  <Progress value={(getCompletedChallenges() / 21) * 100} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenges.slice(0, 9).map((challenge) => (
                    <Card key={challenge.day} className={`transition-all ${
                      challenge.completed 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={challenge.completed ? 'bg-green-500' : 'bg-gray-500'}>
                            Dia {challenge.day}
                          </Badge>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Coins className="w-4 h-4" />
                            <span className="text-sm">{challenge.reward}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold mb-2">{challenge.title}</h3>
                        <p className={`text-sm mb-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {challenge.description}
                        </p>
                        
                        <Button
                          size="sm"
                          onClick={() => completeChallenge(challenge.day)}
                          disabled={challenge.completed}
                          className={`w-full ${
                            challenge.completed 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                          }`}
                        >
                          {challenge.completed ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Concluído
                            </>
                          ) : (
                            'Completar'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getCompletedChallenges() === 21 && (
                  <Card className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                    <CardContent className="p-6 text-center">
                      <Trophy className="w-16 h-16 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Parabéns! 🎉</h2>
                      <p className="text-lg">
                        Você completou o Desafio 21 Dias de Riqueza!
                      </p>
                      <p className="mt-2">
                        Sua mentalidade financeira foi transformada!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Oportunidades */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-green-500" />
                  Oportunidades de Renda Extra
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  Plataformas e produtos recomendados para aumentar sua renda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.id} className={`transition-all hover:scale-105 ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{opportunity.category}</Badge>
                          <Badge className="bg-green-500 text-white">
                            {opportunity.commission}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold mb-2">{opportunity.title}</h3>
                        <p className={`text-sm mb-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {opportunity.description}
                        </p>
                        
                        <Button
                          size="sm"
                          className="w-full bg-green-500 hover:bg-green-600"
                          onClick={() => window.open(opportunity.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Acessar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vídeos */}
          <TabsContent value="videos" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-6 h-6 text-red-500" />
                  Vídeos Motivacionais
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  Conteúdo inspirador para manter sua mentalidade de riqueza
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className={`cursor-pointer transition-all hover:scale-105 ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                    }`}>
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-t-lg">
                          <Button size="sm" className="rounded-full bg-red-500 hover:bg-red-600">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{video.title}</h3>
                        <p className={`text-sm mb-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {video.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{video.views.toLocaleString()} visualizações</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objetivos */}
          <TabsContent value="goals" className="space-y-6">
            <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-500" />
                  Criar Novo Objetivo
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                  Defina seu objetivo financeiro com clareza e estratégia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título do Objetivo</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Comprar minha casa própria"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Valor Meta (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Ex: 300000"
                      value={newGoal.targetAmount || ''}
                      onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva seu objetivo em detalhes..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="strategy">Como você vai alcançar?</Label>
                  <Textarea
                    id="strategy"
                    placeholder="Descreva sua estratégia, passos e ações específicas..."
                    value={newGoal.strategy}
                    onChange={(e) => setNewGoal({...newGoal, strategy: e.target.value})}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data Limite</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <Button onClick={createGoal} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold">
                  Criar Objetivo
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Objetivos */}
            {goals.length > 0 && (
              <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
                <CardHeader>
                  <CardTitle>Seus Objetivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          currentGoal?.id === goal.id
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : isDarkMode
                              ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCurrentGoal(goal)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{goal.title}</h3>
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                            R$ {goal.targetAmount.toLocaleString()}
                          </Badge>
                        </div>
                        <p className={`text-sm mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>{goal.description}</p>
                        <div className={`flex justify-between text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span>Criado em {new Date(goal.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span>Meta: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Foco TDAH */}
          <TabsContent value="focus" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timer Pomodoro */}
              <Card className={`border-2 border-purple-500 ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="w-6 h-6 text-purple-500" />
                    Timer Pomodoro
                  </CardTitle>
                  <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
                    Mantenha o foco com sessões de 25 minutos
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl font-bold text-purple-500 mb-4">
                    {formatTime(pomodoro.timeLeft)}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant={pomodoro.isBreak ? "secondary" : "default"}>
                      {pomodoro.isBreak ? "Pausa" : "Foco"}
                    </Badge>
                    <Badge variant="outline">
                      {pomodoro.sessionsCompleted} sessões
                    </Badge>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={pomodoro.isActive ? stopPomodoro : startPomodoro}
                      className={pomodoro.isActive ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"}
                    >
                      {pomodoro.isActive ? "Pausar" : "Iniciar"}
                    </Button>
                    <Button onClick={resetPomodoro} variant="outline">
                      Resetar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Dicas TDAH */}
              <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-500" />
                    Dica para TDAH
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg border-l-4 border-l-blue-500 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                  }`}>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>{currentTip}</p>
                  </div>
                  <Button 
                    onClick={() => setCurrentTip(adhdTips[Math.floor(Math.random() * adhdTips.length)])}
                    variant="outline" 
                    className="mt-4 w-full"
                  >
                    Nova Dica
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tarefas do Objetivo Atual */}
            {currentGoal && (
              <Card className={isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Tarefas do Objetivo Atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova tarefa..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                    />
                    <Button onClick={addTask} size="sm" className="bg-green-500 hover:bg-green-600">
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {currentGoal.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          task.completed 
                            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300' 
                            : isDarkMode
                              ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </button>
                        <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
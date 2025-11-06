const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

// Criar aplicação Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse da URL
      const parsedUrl = parse(req.url, true)
      
      // Lidar com todas as requisições através do Next.js
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Erro ao processar requisição:', err)
      res.statusCode = 500
      res.end('Erro interno do servidor')
    }
  })
  .once('error', (err) => {
    console.error('Erro no servidor:', err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`🚀 Servidor do Guia da Riqueza rodando em http://${hostname}:${port}`)
    console.log(`📱 Aplicativo pronto para uso!`)
    console.log(`🌟 Acesse e comece sua jornada rumo à riqueza!`)
  })
})
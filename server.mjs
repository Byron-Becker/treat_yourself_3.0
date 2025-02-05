import { createServer } from 'https'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ 
  dev,
  conf: {
    experimental: {
      trace: false  // Disable trace
    }
  }
})
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./create-cert-key.pem'),
  cert: fs.readFileSync('./create-cert.pem')
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on https://localhost:3000')
  })
})
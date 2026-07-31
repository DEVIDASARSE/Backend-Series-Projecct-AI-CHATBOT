import http from 'http'

const PORT = Number(process.env.PORT || 3000)

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

const makeSimpleReply = (message) => {
  const text = String(message || '').trim()
  if (!text) return 'Please type a message so I can help you.'
  return `✅ Received: "${text}"\n\nBackend connected successfully and chat is working live.`
}

const server = http.createServer((req, res) => {
  const path = req.url?.split('?')[0] || '/'

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  if (path === '/' && req.method === 'GET') {
    return sendJson(res, 200, {
      ok: true,
      service: 'ai-chatbot-backend',
      endpoints: ['/health', '/chat'],
    })
  }

  if (path === '/health' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, service: 'backend', port: PORT })
  }

  if (path === '/chat' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}')
        const response = makeSimpleReply(parsed.message)
        return sendJson(res, 200, { response })
      } catch {
        return sendJson(res, 400, { response: 'Invalid JSON payload.' })
      }
    })
    return
  }

  return sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

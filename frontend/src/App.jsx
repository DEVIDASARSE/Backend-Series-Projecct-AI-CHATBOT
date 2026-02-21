import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const starterPrompts = [
  'Summarize today’s top priorities',
  'Write a professional email draft',
  'Help me plan a productive routine',
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const historyRef = useRef(null)

  const canSend = useMemo(() => input.trim().length > 0, [input])

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      setIsConnected(response.ok)
    } catch {
      setIsConnected(false)
    }
  }

  const askBackend = async (text) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })

    if (!response.ok) throw new Error('Backend response failed')

    return response.json()
  }

  const handleSend = async (customText) => {
    const finalText = (customText ?? input).trim()
    if (!finalText) return

    const userMessage = {
      id: Date.now() + Math.random(),
      text: finalText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsBotTyping(true)

    try {
      const data = await askBackend(finalText)
      const botMessage = {
        id: Date.now() + Math.random(),
        text: data?.response || 'I could not generate a response right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'bot',
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
      setIsConnected(true)
    } catch {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + Math.random(),
          text: 'Backend connection failed. Please check server configuration.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'bot',
        },
      ])
      setIsConnected(false)
    } finally {
      setIsBotTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 7000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isBotTyping])

  return (
    <main className="page-shell">
      <section className="chat-card">
        <header className="chat-header">
          <div className="brand">
            <div className="brand-badge">AI</div>
            <div>
              <h1>Nova Assistant</h1>
              <p>Fast, smart and professional AI conversations.</p>
            </div>
          </div>

          <span className={`status-pill ${isConnected ? 'online' : 'offline'}`}>
            <span className="status-dot" />
            {isConnected ? 'Connected' : 'Connecting'}
          </span>
        </header>

        <div className="chat-history" ref={historyRef}>
          {messages.length === 0 && (
            <div className="empty-state">
              <h2>Welcome 👋</h2>
              <p>Ask anything. I can help with writing, planning, coding and more.</p>
              <div className="prompt-grid">
                {starterPrompts.map((prompt) => (
                  <button key={prompt} className="prompt-chip" onClick={() => handleSend(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <article key={msg.id} className={`message-row ${msg.sender}`}>
              <div className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
                <time>{msg.timestamp}</time>
              </div>
            </article>
          ))}

          {isBotTyping && (
            <article className="message-row bot">
              <div className="chat-message bot typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            </article>
          )}
        </div>

        <footer className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="chat-input"
            aria-label="Type your message"
          />
          <button onClick={() => handleSend()} className="send-btn" disabled={!canSend || isBotTyping}>
            {isBotTyping ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </section>
    </main>
  )
}

export default App

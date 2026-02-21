import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const starterPrompts = [
  'Summarize today’s top priorities',
  'Write a professional email draft',
  'Help me plan a productive routine',
]

function App() {
  const [socket, setSocket] = useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const historyRef = useRef(null)

  const canSend = useMemo(() => input.trim().length > 0, [input])

  const handleSend = (customText) => {
    const finalText = (customText ?? input).trim()
    if (!finalText) return

    const userMessage = {
      id: Date.now() + Math.random(),
      text: finalText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
    }

    setMessages((prev) => [...prev, userMessage])

    if (socket) {
      socket.emit('ai-message', finalText)
      setIsBotTyping(true)
    }

    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    const socketInstance = io('http://localhost:3000')
    setSocket(socketInstance)

    socketInstance.on('connect', () => setIsConnected(true))
    socketInstance.on('disconnect', () => setIsConnected(false))

    socketInstance.on('ai-message-response', (responseObj) => {
      const botMessage = {
        id: Date.now() + Math.random(),
        text: responseObj?.response || 'I could not generate a response right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'bot',
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
      setIsBotTyping(false)
    })

    return () => {
      socketInstance.disconnect()
    }
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
          <button onClick={() => handleSend()} className="send-btn" disabled={!canSend}>
            Send
          </button>
        </footer>
      </section>
    </main>
  )
}

export default App

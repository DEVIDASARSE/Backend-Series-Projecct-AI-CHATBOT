import { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import './App.css'

function App() {
  const [socket, setSocket]= useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = () => {
    if (input.trim() === '') return
    const userMessage = {
      id: Date.now(),
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    }
    setMessages(prev => [
      ...prev,
      userMessage
    ])
    if (socket) {
      socket.emit('ai-message', input)
    }
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  useEffect(() => {
    const socketInstance = io("http://localhost:3000")
    setSocket(socketInstance)

    socketInstance.on('ai-message-response', (responseObj) => {
      // responseObj = { response: "Bot reply..." }
      const botMessage = {
        id: Date.now() + 1,
        text: responseObj.response,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      }

      setMessages(prevMessages => [
        ...prevMessages,
        botMessage

        
      ])
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={handleSend} className="send-btn">Send</button>
      </div>
    </div>
  )
}

export default App

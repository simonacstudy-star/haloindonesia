import { useState, useRef, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export default function KikiChat({ currentLevel }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'kiki', text: "Halo! I'm Kiki 🦜 Say the words out loud when you learn them — that's the secret to speaking Indonesian!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text }])
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: `You are Kiki, a friendly parrot who helps children aged 5-7 learn Bahasa Indonesia.
Use VERY simple language. Keep answers to 2-3 short sentences maximum.
Use fun emojis. Be encouraging and playful.
If asked about Indonesian words, give the word and a simple pronunciation tip.
${currentLevel ? `The child is currently learning about: ${currentLevel}` : ''}
Always celebrate effort and say encouraging things in Indonesian like "Bagus!" (Great!) or "Hebat!" (Awesome!)`,
          messages: [...history, { role: 'user', content: text }],
        }),
      })

      const data = await response.json()
      const reply = data.content?.[0]?.text || "Maaf! (Sorry!) Try again! 🦜"
      setMessages(prev => [...prev, { from: 'kiki', text: reply }])
      speakWithVoicesReady(reply.replace(/[🦜🎉⭐🌴👋]/g, ''))
    } catch {
      setMessages(prev => [...prev, { from: 'kiki', text: "Aduh! Something went wrong. Make sure the API key is set! 🦜" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,#A78BFA,#7C3AED)',
          border: 'none', fontSize: '1.8rem', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s', zIndex: 50,
          transform: open ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        🦜
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem',
          width: 300, background: 'white', borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 50,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          maxHeight: 420,
        }}>
          <div style={{
            background: 'linear-gradient(135deg,#A78BFA,#7C3AED)',
            padding: '0.9rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <span style={{ fontSize: '1.4rem' }}>🦜</span>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Kiki the Parrot</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>Your language helper!</div>
            </div>
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', padding: '0.75rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                padding: '0.6rem 0.9rem',
                borderRadius: m.from === 'kiki' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                fontSize: '0.85rem', fontWeight: 600, maxWidth: '90%', lineHeight: 1.4,
                background: m.from === 'kiki' ? '#FAF5FF' : '#FF6B6B',
                color: m.from === 'kiki' ? '#5B21B6' : 'white',
                alignSelf: m.from === 'kiki' ? 'flex-start' : 'flex-end',
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{
                padding: '0.6rem 0.9rem', borderRadius: '14px 14px 14px 4px',
                fontSize: '0.85rem', background: '#FAF5FF', color: '#5B21B6',
                alignSelf: 'flex-start', fontWeight: 600,
              }}>
                Kiki is thinking... 🦜
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid #F0F0F0' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Kiki..."
              style={{
                flex: 1, border: '1.5px solid #E2E8F0', borderRadius: 10,
                padding: '0.5rem 0.75rem', fontSize: '0.85rem', fontWeight: 600,
                color: '#2D3748', outline: 'none', fontFamily: "'Nunito', sans-serif",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#A78BFA', border: 'none', color: 'white',
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: loading ? 0.6 : 1,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

import { useState } from 'react'
import { speakWithVoicesReady } from './speech'

export default function Flashcard({ level, onComplete }) {
  const words = level.words
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(new Set())
  const [speaking, setSpeaking] = useState(false)

  const word = words[idx]
  const progress = Math.round((seen.size / words.length) * 100)

  function handleSpeak(e) {
    e.stopPropagation()
    setSpeaking(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  function next() {
    setSeen(prev => new Set([...prev, idx]))
    setFlipped(false)
    if (idx < words.length - 1) setIdx(idx + 1)
  }

  function prev() {
    setFlipped(false)
    if (idx > 0) setIdx(idx - 1)
  }

  const allSeen = seen.size >= words.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1, height: 12, background: '#EDF2F7', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: level.bg, borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {seen.size}/{words.length}
        </span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: flipped ? 'linear-gradient(135deg,#26C6A6,#0694A2)' : level.bg,
          borderRadius: 24, minHeight: 220, cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          transition: 'background 0.4s',
          userSelect: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '4rem', lineHeight: 1 }}>{word.emoji}</div>
        <div style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '2.5rem', fontWeight: 800,
          color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          textAlign: 'center', lineHeight: 1.1,
        }}>
          {flipped ? word.eng : word.indo}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
          {flipped ? '🇦🇺 English' : '🇮🇩 Indonesian'}
        </div>

        {/* Speak button overlay */}
        {!flipped && (
          <button
            onClick={handleSpeak}
            style={{
              position: 'absolute', bottom: 12, right: 12,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              border: '2px solid rgba(255,255,255,0.6)',
              fontSize: '1.4rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: speaking ? 'pulse 0.5s infinite alternate' : 'none',
            }}
            title="Hear pronunciation"
          >
            {speaking ? '🔊' : '👂'}
          </button>
        )}
      </div>

      <style>{`@keyframes pulse { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>
        👆 Tap card to flip • 👂 Tap speaker to hear it
      </p>

      {/* Pronunciation */}
      <div style={{
        background: '#F0F9FF', border: '2px solid #BAE6FD',
        borderRadius: 14, padding: '0.75rem 1rem', textAlign: 'center',
      }}>
        <span style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 700 }}>Say it: </span>
        <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.1rem', fontWeight: 700, color: '#0C4A6E' }}>
          {word.pronunciation}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            padding: '0.75rem 1.25rem', borderRadius: 14,
            border: 'none', background: idx === 0 ? '#EDF2F7' : '#E2E8F0',
            color: idx === 0 ? '#CBD5E0' : '#2D3748',
            fontWeight: 700, fontSize: '0.95rem',
            cursor: idx === 0 ? 'not-allowed' : 'pointer',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 700 }}>
          {idx + 1} / {words.length}
        </span>

        {allSeen && idx === words.length - 1 ? (
          <button
            onClick={onComplete}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: 14, border: 'none',
              background: '#26C6A6', color: 'white',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Done! ✓
          </button>
        ) : (
          <button
            onClick={next}
            disabled={idx === words.length - 1}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: 14, border: 'none',
              background: idx === words.length - 1 ? '#EDF2F7' : level.color,
              color: idx === words.length - 1 ? '#CBD5E0' : 'white',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: idx === words.length - 1 ? 'not-allowed' : 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

export default function Lesson({ level, onComplete }) {
  const words = level.words
  const [idx, setIdx] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [heard, setHeard] = useState(new Set())
  const [showPronunciation, setShowPronunciation] = useState(false)

  const word = words[idx]

  useEffect(() => {
    setShowPronunciation(false)
    setSpeaking(false)
  }, [idx])

  function handleSpeak() {
    setSpeaking(true)
    setHeard(prev => new Set([...prev, idx]))
    setShowPronunciation(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  function next() {
    if (idx < words.length - 1) {
      setIdx(idx + 1)
    } else {
      onComplete()
    }
  }

  const progress = Math.round(((idx) / words.length) * 100)
  const isLast = idx === words.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1, height: 12, background: '#EDF2F7', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: level.bg,
            borderRadius: 99, transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {idx + 1} / {words.length}
        </span>
      </div>

      {/* Fun tip at start */}
      {idx === 0 && (
        <div style={{
          background: '#FFF9ED', border: '2px solid #FEF3C7',
          borderRadius: 16, padding: '0.9rem 1rem',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.4rem' }}>💡</span>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400E', lineHeight: 1.4 }}>
            {level.tip}
          </p>
        </div>
      )}

      {/* Word card */}
      <div style={{
        background: level.bg,
        borderRadius: 24,
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.75rem', lineHeight: 1 }}>
          {word.emoji}
        </div>
        <div style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '2.8rem', fontWeight: 800,
          color: 'white',
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}>
          {word.indo}
        </div>
        <div style={{
          fontSize: '1.3rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
        }}>
          {word.eng}
        </div>
      </div>

      {/* Pronunciation hint */}
      {showPronunciation && (
        <div style={{
          background: '#F0F9FF', border: '2px solid #BAE6FD',
          borderRadius: 14, padding: '0.75rem 1rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 700, marginBottom: 2 }}>
            How to say it:
          </p>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.3rem', fontWeight: 700, color: '#0C4A6E',
          }}>
            {word.pronunciation}
          </p>
        </div>
      )}

      {/* Hear it button */}
      <button
        onClick={handleSpeak}
        style={{
          padding: '1.1rem',
          borderRadius: 18,
          border: 'none',
          background: speaking ? '#EDF2F7' : 'white',
          boxShadow: speaking ? 'none' : '0 4px 16px rgba(0,0,0,0.1)',
          border: `3px solid ${speaking ? '#CBD5E0' : level.color}`,
          cursor: speaking ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          transition: 'all 0.2s',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '1.3rem', fontWeight: 700,
          color: speaking ? '#A0AEC0' : level.color,
        }}
      >
        <span style={{ fontSize: '2rem', animation: speaking ? 'pulse 0.5s infinite alternate' : 'none' }}>
          {speaking ? '🔊' : '👂'}
        </span>
        {speaking ? 'Listen...' : 'Tap to hear it!'}
      </button>

      <style>{`@keyframes pulse { from { transform: scale(1); } to { transform: scale(1.2); } }`}</style>

      {/* Say it prompt */}
      <div style={{
        background: '#F0FDF4', border: '2px solid #BBF7D0',
        borderRadius: 14, padding: '0.9rem',
        textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
      }}>
        <span style={{ fontSize: '1.5rem' }}>🗣️</span>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#166534' }}>
          Now say it out loud!
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {idx > 0 && (
          <button
            onClick={() => setIdx(idx - 1)}
            style={{
              padding: '0.9rem 1.25rem', borderRadius: 14,
              border: '2px solid #E2E8F0', background: 'white',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif", color: '#718096',
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={next}
          style={{
            flex: 1, padding: '0.9rem',
            borderRadius: 14, border: 'none',
            background: heard.has(idx) ? level.color : '#EDF2F7',
            color: heard.has(idx) ? 'white' : '#A0AEC0',
            fontWeight: 700, fontSize: '1.05rem',
            cursor: heard.has(idx) ? 'pointer' : 'not-allowed',
            fontFamily: "'Baloo 2', cursive",
            transition: 'all 0.2s',
          }}
          disabled={!heard.has(idx)}
        >
          {isLast ? '🎉 All done!' : 'Next word →'}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#A0AEC0', fontWeight: 600 }}>
        👆 Tap the listen button first to move on!
      </p>
    </div>
  )
}

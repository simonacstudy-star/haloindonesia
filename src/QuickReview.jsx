import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuickReview({ level, isLittle, onComplete }) {
  const words = level.words
  // Pick 3 random words to review
  const [reviewWords] = useState(() => shuffle(words).slice(0, 3))
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('show') // 'show' | 'confirm'
  const [speaking, setSpeaking] = useState(false)
  const [allDone, setAllDone] = useState(false)

  const word = reviewWords[idx]

  useEffect(() => {
    // Auto-play each word when shown
    if (phase === 'show' && word) {
      const timer = setTimeout(() => {
        setSpeaking(true)
        speakWithVoicesReady(word.indo, () => {
          setSpeaking(false)
          setPhase('confirm')
        })
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [idx, phase])

  function playAgain() {
    setSpeaking(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  function handleNext() {
    if (idx < reviewWords.length - 1) {
      setIdx(i => i + 1)
      setPhase('show')
    } else {
      setAllDone(true)
    }
  }

  if (allDone) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔥</div>
        <h2 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '1.5rem', fontWeight: 800, color: '#2D3748',
          marginBottom: '0.5rem',
        }}>
          Warm-up done!
        </h2>
        <p style={{ color: '#718096', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {isLittle ? "Great! Now let's play!" : "Great recall! Now let's go!"}
        </p>
        <button
          onClick={onComplete}
          style={{
            padding: '1rem 2.5rem', borderRadius: 20, border: 'none',
            background: level.color, color: 'white',
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.3rem', fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 4px 16px ${level.color}44`,
          }}
        >
          Start the activity! →
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>

      {/* Header */}
      <div style={{
        width: '100%',
        background: '#FFF9ED', border: '2px solid #FEF3C7',
        borderRadius: 16, padding: '0.85rem 1.1rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.5rem' }}>🔁</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#92400E', margin: 0 }}>
            Quick Review — do you remember these?
          </p>
          <p style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600, margin: 0 }}>
            {idx + 1} of {reviewWords.length} words
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {reviewWords.map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: i < idx ? '#26C6A6' : i === idx ? level.color : '#E2E8F0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Word display */}
      <div style={{
        width: '100%',
        background: level.bg,
        borderRadius: 24, padding: '2rem 1.5rem',
        textAlign: 'center',
        boxShadow: `0 4px 20px ${level.color}33`,
      }}>
        <div style={{ fontSize: '4.5rem', lineHeight: 1, marginBottom: '0.75rem' }}>
          {word.emoji}
        </div>
        {!isLittle && (
          <div style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '2.5rem', fontWeight: 800,
            color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            lineHeight: 1.1, marginBottom: '0.4rem',
          }}>
            {word.indo}
          </div>
        )}
        <div style={{
          fontSize: isLittle ? '1.4rem' : '1rem',
          color: 'rgba(255,255,255,0.85)', fontWeight: 700,
        }}>
          {word.eng}
        </div>
      </div>

      {/* Audio button */}
      <button
        onClick={playAgain}
        style={{
          width: '100%',
          padding: '0.9rem',
          borderRadius: 16,
          border: `3px solid ${speaking ? '#CBD5E0' : level.color}`,
          background: speaking ? '#F7FAFC' : 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          cursor: 'pointer', transition: 'all 0.2s',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '1.1rem', fontWeight: 800,
          color: speaking ? '#A0AEC0' : level.color,
        }}
      >
        <span style={{
          fontSize: '1.8rem',
          animation: speaking ? 'speakPulse 0.4s infinite alternate' : 'none',
        }}>
          {speaking ? '🔊' : '👂'}
        </span>
        {speaking ? 'Listen...' : 'Hear it again'}
      </button>

      {/* Confirm prompt */}
      {phase === 'confirm' && (
        <div style={{
          width: '100%',
          background: '#F0FDF4', border: '3px solid #4ADE80',
          borderRadius: 20, padding: '1.1rem',
          textAlign: 'center',
          animation: 'bounceIn 0.35s ease',
        }}>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.3rem', fontWeight: 800, color: '#166534',
            marginBottom: '0.3rem',
          }}>
            🗣️ Say it out loud!
          </p>
          {!isLittle && (
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#15803D', marginBottom: '0.85rem' }}>
              "{word.pronunciation}"
            </p>
          )}
          <button
            onClick={handleNext}
            style={{
              padding: '0.85rem 2rem', borderRadius: 16, border: 'none',
              background: '#26C6A6', color: 'white',
              fontFamily: "'Baloo 2', cursive",
              fontSize: '1.2rem', fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px #26C6A644',
            }}
          >
            {idx < reviewWords.length - 1 ? '✓ I said it! Next →' : '✓ I said it! Done!'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes speakPulse { from { transform: scale(1); } to { transform: scale(1.2); } }
        @keyframes bounceIn { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  )
}

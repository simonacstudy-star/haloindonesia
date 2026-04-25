import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function AudioTap({ level, onComplete }) {
  const words = level.words
  const [queue] = useState(() => shuffle(words).slice(0, 5))
  const [idx, setIdx] = useState(0)
  const [options, setOptions] = useState([])
  const [chosen, setChosen] = useState(null)
  const [speaking, setSpeaking] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [score, setScore] = useState(0)

  const word = queue[idx]

  useEffect(() => {
    const wrong = shuffle(words.filter(w => w.indo !== word.indo)).slice(0, 1)
    setOptions(shuffle([word, ...wrong]))
    setChosen(null)
    setHasPlayed(false)
    // Auto-play audio after short delay
    const timer = setTimeout(() => handleSpeak(), 600)
    return () => clearTimeout(timer)
  }, [idx])

  function handleSpeak() {
    setSpeaking(true)
    setHasPlayed(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  function handleChoose(opt) {
    if (chosen) return
    setChosen(opt.indo)
    if (opt.indo === word.indo) {
      setScore(s => s + 1)
      speakWithVoicesReady(word.indo)
    }
  }

  function next() {
    if (idx < queue.length - 1) setIdx(idx + 1)
    else onComplete()
  }

  const isCorrect = chosen === word.indo
  const isLast = idx === queue.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {queue.map((_, i) => (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: '50%',
            background: i < idx ? '#26C6A6' : i === idx ? level.color : '#E2E8F0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Score */}
      <div style={{
        background: '#FEF3C7', color: '#92400E',
        padding: '0.4rem 1.2rem', borderRadius: 20,
        fontSize: '1rem', fontWeight: 700,
      }}>
        ⭐ {score} / {queue.length}
      </div>

      {/* Listen button — big and central */}
      <button
        onClick={handleSpeak}
        style={{
          width: 140, height: 140,
          borderRadius: '50%',
          background: speaking
            ? '#EDF2F7'
            : `linear-gradient(135deg, ${level.color}, ${level.color}BB)`,
          border: `4px solid ${speaking ? '#CBD5E0' : level.color}`,
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
          boxShadow: speaking ? 'none' : `0 8px 24px ${level.color}55`,
          transition: 'all 0.2s',
          animation: speaking ? 'none' : hasPlayed ? 'none' : 'bounceIn 0.5s ease',
        }}
      >
        <span style={{
          fontSize: '3.5rem',
          animation: speaking ? 'speakPulse 0.4s infinite alternate' : 'none',
        }}>
          {speaking ? '🔊' : '👂'}
        </span>
        <span style={{
          fontSize: '0.85rem', fontWeight: 800,
          color: speaking ? '#A0AEC0' : 'white',
          textShadow: speaking ? 'none' : '0 1px 4px rgba(0,0,0,0.2)',
        }}>
          {speaking ? 'Listen!' : 'Tap me!'}
        </span>
      </button>

      <style>{`
        @keyframes speakPulse { from { transform: scale(1); } to { transform: scale(1.2); } }
        @keyframes bounceIn { 0%{transform:scale(0.8)} 60%{transform:scale(1.05)} 100%{transform:scale(1)} }
      `}</style>

      {/* Picture choices — 2 big emoji buttons */}
      {hasPlayed && (
        <div style={{ width: '100%' }}>
          <p style={{
            textAlign: 'center', fontWeight: 800,
            fontSize: '1.1rem', color: '#2D3748', marginBottom: '1rem',
          }}>
            Which picture is it? 👇
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {options.map(opt => {
              const isChosen = chosen === opt.indo
              const isRight = opt.indo === word.indo
              let border = '#E2E8F0', bg = 'white', shadow = '0 4px 12px rgba(0,0,0,0.08)'
              if (chosen) {
                if (isRight) { border = '#26C6A6'; bg = '#E6FBF5'; shadow = '0 4px 16px #26C6A633' }
                else if (isChosen) { border = '#FC8181'; bg = '#FFF5F5'; shadow = 'none' }
              }

              return (
                <button
                  key={opt.indo}
                  onClick={() => handleChoose(opt)}
                  style={{
                    padding: '1.5rem 1rem',
                    borderRadius: 24,
                    border: `4px solid ${border}`,
                    background: bg,
                    cursor: chosen ? 'default' : 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: shadow,
                    transform: !chosen ? 'scale(1)' : 'scale(1)',
                  }}
                  onMouseEnter={e => { if (!chosen) e.currentTarget.style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <span style={{ fontSize: '4rem', lineHeight: 1 }}>{opt.emoji}</span>
                  {chosen && (
                    <span style={{ fontSize: '1.5rem' }}>
                      {isRight ? '✅' : isChosen ? '❌' : ''}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Feedback */}
      {chosen && (
        <div style={{
          width: '100%',
          background: isCorrect ? '#E6FBF5' : '#FFF5F5',
          border: `3px solid ${isCorrect ? '#26C6A6' : '#FC8181'}`,
          borderRadius: 20, padding: '1.25rem',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.5rem', fontWeight: 800,
            color: isCorrect ? '#0D9488' : '#C53030',
            marginBottom: '0.75rem',
          }}>
            {isCorrect ? '🎉 Bagus! (Great!)' : `It was ${word.emoji} ${word.eng}!`}
          </p>
          <button
            onClick={next}
            style={{
              padding: '0.85rem 2.5rem', borderRadius: 16, border: 'none',
              background: isCorrect ? '#26C6A6' : '#FC8181',
              color: 'white', fontWeight: 800, fontSize: '1.1rem',
              cursor: 'pointer', fontFamily: "'Baloo 2', cursive",
            }}
          >
            {isLast ? '🏁 Done!' : 'Next! →'}
          </button>
        </div>
      )}
    </div>
  )
}

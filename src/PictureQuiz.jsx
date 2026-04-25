import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function PictureQuiz({ level, onComplete }) {
  const words = level.words
  const [queue] = useState(() => shuffle(words).slice(0, 6))
  const [idx, setIdx] = useState(0)
  const [options, setOptions] = useState([])
  const [chosen, setChosen] = useState(null)
  const [speaking, setSpeaking] = useState(false)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])

  const word = queue[idx]

  useEffect(() => {
    const wrong = shuffle(words.filter(w => w.indo !== word.indo)).slice(0, 1)
    setOptions(shuffle([word, ...wrong]))
    setChosen(null)
    setSpeaking(false)
    // Auto-speak after short delay
    const timer = setTimeout(() => playWord(), 500)
    return () => clearTimeout(timer)
  }, [idx])

  function playWord() {
    setSpeaking(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  function handleChoose(opt) {
    if (chosen) return
    setChosen(opt.indo)
    const correct = opt.indo === word.indo
    setResults(prev => [...prev, correct])
    if (correct) {
      setScore(s => s + 1)
      speakWithVoicesReady(word.eng + '! ' + word.indo)
    } else {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {queue.map((_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%',
            background: i < results.length
              ? results[i] ? '#26C6A6' : '#FC8181'
              : i === idx ? level.color : '#E2E8F0',
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

      {/* Audio play button */}
      <button
        onClick={playWord}
        style={{
          padding: '1.25rem 2.5rem',
          borderRadius: 24,
          border: `4px solid ${speaking ? '#CBD5E0' : level.color}`,
          background: speaking ? '#F7FAFC' : level.bg,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: speaking ? 'none' : `0 4px 20px ${level.color}44`,
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          fontSize: '2.5rem',
          animation: speaking ? 'speakPulse 0.4s infinite alternate' : 'none',
        }}>
          {speaking ? '🔊' : '👂'}
        </span>
        <span style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '1.2rem', fontWeight: 800,
          color: speaking ? '#A0AEC0' : 'white',
          textShadow: speaking ? 'none' : '0 1px 4px rgba(0,0,0,0.2)',
        }}>
          {speaking ? 'Listening...' : 'Tap to hear!'}
        </span>
      </button>

      <style>{`@keyframes speakPulse { from { transform: scale(1); } to { transform: scale(1.2); } }`}</style>

      {/* Question label */}
      <p style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: '1.3rem', fontWeight: 800,
        color: '#2D3748', textAlign: 'center',
      }}>
        Which picture did you hear? 👇
      </p>

      {/* 2 big picture options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
        {options.map(opt => {
          const isChosen = chosen === opt.indo
          const isRight = opt.indo === word.indo
          let border = '#E2E8F0', bg = 'white', shadow = '0 4px 16px rgba(0,0,0,0.08)'
          if (chosen) {
            if (isRight) { border = '#26C6A6'; bg = '#E6FBF5'; shadow = `0 4px 20px #26C6A644` }
            else if (isChosen) { border = '#FC8181'; bg = '#FFF5F5'; shadow = 'none' }
          }

          return (
            <button
              key={opt.indo}
              onClick={() => handleChoose(opt)}
              style={{
                padding: '2rem 1rem',
                borderRadius: 24,
                border: `4px solid ${border}`,
                background: bg,
                cursor: chosen ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                transition: 'all 0.2s',
                boxShadow: shadow,
                minHeight: 160,
              }}
              onMouseEnter={e => { if (!chosen) { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 8px 24px ${level.color}33` } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = shadow }}
            >
              <span style={{ fontSize: '5rem', lineHeight: 1 }}>{opt.emoji}</span>
              {chosen && (
                <span style={{ fontSize: '2rem' }}>
                  {isRight ? '✅' : isChosen ? '❌' : ''}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {chosen && (
        <div style={{
          width: '100%',
          background: isCorrect ? '#E6FBF5' : '#FFF5F5',
          border: `3px solid ${isCorrect ? '#26C6A6' : '#FC8181'}`,
          borderRadius: 20, padding: '1.25rem', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.5rem', fontWeight: 800,
            color: isCorrect ? '#0D9488' : '#C53030',
            marginBottom: '0.5rem',
          }}>
            {isCorrect ? `🎉 Yes! ${word.emoji} = ${word.eng}!` : `It was ${word.emoji} ${word.eng}!`}
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

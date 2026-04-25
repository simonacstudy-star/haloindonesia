import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function SayIt({ level, onComplete }) {
  const words = level.words
  const [queue] = useState(() => shuffle(words).slice(0, 5))
  const [idx, setIdx] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [chosen, setChosen] = useState(null)
  const [options, setOptions] = useState([])
  const [score, setScore] = useState(0)
  const [hasPlayed, setHasPlayed] = useState(false)

  const word = queue[idx]

  useEffect(() => {
    const wrong = shuffle(words.filter(w => w.indo !== word.indo)).slice(0, 1)
    setOptions(shuffle([word, ...wrong]))
    setChosen(null)
    setHasPlayed(false)
    setSpeaking(false)
  }, [idx])

  function handleSpeak() {
    setSpeaking(true)
    setHasPlayed(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  function handleChoose(opt) {
    if (chosen || !hasPlayed) return
    setChosen(opt.indo)
    if (opt.indo === word.indo) setScore(s => s + 1)
  }

  function next() {
    if (idx < queue.length - 1) {
      setIdx(idx + 1)
    } else {
      onComplete()
    }
  }

  const isCorrect = chosen === word.indo
  const isLast = idx === queue.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {queue.map((_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%',
            background: i < idx ? '#26C6A6' : i === idx ? level.color : '#E2E8F0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Score */}
      <div style={{ textAlign: 'right' }}>
        <span style={{
          background: '#FEF3C7', color: '#92400E',
          padding: '0.3rem 0.9rem', borderRadius: 20,
          fontSize: '0.9rem', fontWeight: 700,
        }}>
          ⭐ {score} / {queue.length}
        </span>
      </div>

      {/* Instruction */}
      <div style={{
        background: '#F0F9FF', border: '2px solid #BAE6FD',
        borderRadius: 16, padding: '1rem',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0369A1' }}>
          👂 Listen carefully, then choose the right word!
        </p>
      </div>

      {/* Emoji display */}
      {chosen && (
        <div style={{ textAlign: 'center', fontSize: '5rem', lineHeight: 1 }}>
          {word.emoji}
        </div>
      )}

      {/* Speak button */}
      <button
        onClick={handleSpeak}
        style={{
          padding: '1.5rem',
          borderRadius: 24,
          border: `4px solid ${speaking ? '#CBD5E0' : level.color}`,
          background: speaking ? '#F7FAFC' : level.bg,
          cursor: speaking ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.5rem',
          transition: 'all 0.2s',
          boxShadow: speaking ? 'none' : '0 4px 20px rgba(0,0,0,0.12)',
        }}
      >
        <span style={{
          fontSize: '3.5rem',
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
          {speaking ? 'Listening...' : hasPlayed ? 'Hear it again!' : 'Tap to listen!'}
        </span>
      </button>

      <style>{`@keyframes speakPulse { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>

      {/* Options — only show after playing */}
      {hasPlayed && (
        <>
          <p style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: '#2D3748' }}>
            Which word did you hear?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {options.map(opt => {
              const isChosen = chosen === opt.indo
              const isRight = opt.indo === word.indo
              let bg = 'white', border = '#E2E8F0', color = '#2D3748'
              if (chosen) {
                if (isRight) { bg = '#E6FBF5'; border = '#26C6A6'; color = '#0D9488' }
                else if (isChosen) { bg = '#FFF5F5'; border = '#FC8181'; color = '#C53030' }
              }

              return (
                <button
                  key={opt.indo}
                  onClick={() => handleChoose(opt)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: 16,
                    border: `3px solid ${border}`,
                    background: bg, color,
                    fontFamily: "'Baloo 2', cursive",
                    fontSize: '1.4rem', fontWeight: 700,
                    cursor: chosen ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: chosen ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  {opt.indo}
                  {chosen && isRight && <span style={{ fontSize: '1.5rem' }}>✅</span>}
                  {chosen && isChosen && !isRight && <span style={{ fontSize: '1.5rem' }}>❌</span>}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Feedback & next */}
      {chosen && (
        <div style={{
          background: isCorrect ? '#E6FBF5' : '#FFF5F5',
          border: `2px solid ${isCorrect ? '#26C6A6' : '#FC8181'}`,
          borderRadius: 16, padding: '1rem',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.3rem', fontWeight: 800,
            color: isCorrect ? '#0D9488' : '#C53030',
            marginBottom: '0.75rem',
          }}>
            {isCorrect ? '🎉 Benar! (Correct!)' : `It was: ${word.indo} (${word.eng})`}
          </p>
          {isCorrect && (
            <p style={{ fontSize: '0.85rem', color: '#0D9488', fontWeight: 700, marginBottom: '0.75rem' }}>
              Say it out loud: {word.pronunciation}
            </p>
          )}
          <button
            onClick={next}
            style={{
              padding: '0.75rem 2rem', borderRadius: 14, border: 'none',
              background: isCorrect ? '#26C6A6' : '#FC8181',
              color: 'white', fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
            }}
          >
            {isLast ? '🏁 Finish!' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}

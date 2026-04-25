import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function PictureMatch({ level, onComplete }) {
  const wordSet = level.words.slice(0, 4)

  // Each word appears twice: as emoji card and as audio card
  const [cards] = useState(() => {
    const pairs = wordSet.flatMap(w => [
      { id: `emoji-${w.indo}`, word: w, type: 'emoji' },
      { id: `audio-${w.indo}`, word: w, type: 'audio' },
    ])
    return shuffle(pairs).map((c, i) => ({ ...c, index: i }))
  })

  const [flipped, setFlipped] = useState([])   // indices currently face-up
  const [matched, setMatched] = useState([])   // word.indo values that are matched
  const [locked, setLocked] = useState(false)
  const [speaking, setSpeaking] = useState(null)

  function flipCard(card) {
    if (locked) return
    if (matched.includes(card.word.indo)) return
    if (flipped.find(f => f.index === card.index)) return
    if (flipped.length >= 2) return

    const newFlipped = [...flipped, card]
    setFlipped(newFlipped)

    // Speak word when flipped
    speakWithVoicesReady(card.word.indo)

    if (newFlipped.length === 2) {
      setLocked(true)
      const [a, b] = newFlipped
      if (a.word.indo === b.word.indo && a.type !== b.type) {
        // Match!
        setTimeout(() => {
          setMatched(prev => [...prev, a.word.indo])
          setFlipped([])
          setLocked(false)
          setSpeaking(a.word.indo)
          speakWithVoicesReady(a.word.eng + '! ' + a.word.indo, () => setSpeaking(null))
        }, 600)
      } else {
        // No match
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  const allMatched = matched.length === wordSet.length

  function isFlipped(card) {
    return flipped.find(f => f.index === card.index) || matched.includes(card.word.indo)
  }

  function isMatched(card) {
    return matched.includes(card.word.indo)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>

      {/* Instructions */}
      <div style={{
        background: '#F0F9FF', border: '2px solid #BAE6FD',
        borderRadius: 16, padding: '0.85rem 1.25rem',
        textAlign: 'center', width: '100%',
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#0369A1' }}>
          🎴 Match the picture to its sound! Tap a card to flip it.
        </p>
      </div>

      {/* Score */}
      <div style={{
        background: '#FEF3C7', color: '#92400E',
        padding: '0.4rem 1.2rem', borderRadius: 20,
        fontSize: '1rem', fontWeight: 700,
      }}>
        ✅ {matched.length} / {wordSet.length} matched
      </div>

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.65rem',
        width: '100%',
      }}>
        {cards.map(card => {
          const faceUp = isFlipped(card)
          const done = isMatched(card)

          return (
            <button
              key={card.id}
              onClick={() => flipCard(card)}
              style={{
                aspectRatio: '1',
                borderRadius: 18,
                border: `3px solid ${done ? '#26C6A6' : faceUp ? level.color : '#E2E8F0'}`,
                background: done ? '#E6FBF5' : faceUp ? 'white' : level.bg,
                cursor: done || faceUp ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: faceUp ? '2.2rem' : '1.5rem',
                transition: 'all 0.2s',
                boxShadow: done ? `0 2px 8px #26C6A633` : faceUp ? `0 2px 12px ${level.color}33` : 'none',
                transform: faceUp && !done ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {faceUp
                ? card.type === 'emoji'
                  ? card.word.emoji
                  : '🔊'
                : '❓'
              }
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#718096' }}>
          <span style={{ fontSize: '1.2rem' }}>🖼️</span> Picture card
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#718096' }}>
          <span style={{ fontSize: '1.2rem' }}>🔊</span> Sound card
        </div>
      </div>

      {/* Matched words display */}
      {matched.length > 0 && (
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#718096', marginBottom: '0.5rem' }}>
            Words you matched:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {matched.map(indo => {
              const w = wordSet.find(w => w.indo === indo)
              return (
                <div key={indo} style={{
                  background: '#E6FBF5', border: '2px solid #26C6A6',
                  borderRadius: 12, padding: '0.4rem 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.88rem', fontWeight: 700, color: '#0D9488',
                }}>
                  {w?.emoji} {w?.eng}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completion */}
      {allMatched && (
        <div style={{
          width: '100%',
          background: '#E6FBF5', border: '3px solid #26C6A6',
          borderRadius: 20, padding: '1.25rem', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.5rem', fontWeight: 800, color: '#0D9488', marginBottom: '0.75rem',
          }}>
            🎉 Hebat! (Awesome!) All matched!
          </p>
          <button
            onClick={onComplete}
            style={{
              padding: '0.85rem 2.5rem', borderRadius: 16, border: 'none',
              background: '#26C6A6', color: 'white',
              fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            Keep going! →
          </button>
        </div>
      )}
    </div>
  )
}

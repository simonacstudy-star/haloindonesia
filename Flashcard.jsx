import { useState } from 'react'

export default function Flashcard({ level, onComplete }) {
  const words = level.words
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(new Set())

  const word = words[idx]
  const progress = Math.round(((seen.size) / words.length) * 100)

  function next() {
    setSeen(prev => new Set([...prev, idx]))
    setFlipped(false)
    if (idx < words.length - 1) {
      setIdx(idx + 1)
    }
  }

  function prev() {
    setFlipped(false)
    if (idx > 0) setIdx(idx - 1)
  }

  const allSeen = seen.size >= words.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          flex: 1, height: 10, background: '#EDF2F7',
          borderRadius: 99, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${level.color}, #FFD166)`,
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {seen.size}/{words.length}
        </span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: flipped ? 'linear-gradient(135deg,#26C6A6,#0694A2)' : level.bg,
          borderRadius: 20, height: 200, cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.4s',
          userSelect: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{word.emoji}</div>
        <div style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '2rem', fontWeight: 800,
          color: 'white',
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {flipped ? word.eng : word.indo}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginTop: 4 }}>
          {flipped ? 'English' : 'Bahasa Indonesia'}
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
        👆 Tap the card to flip it!
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            padding: '0.6rem 1.2rem', borderRadius: 12, border: 'none',
            background: idx === 0 ? '#EDF2F7' : '#E2E8F0',
            color: idx === 0 ? '#CBD5E0' : '#2D3748',
            fontWeight: 700, fontSize: '0.9rem',
            cursor: idx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 700 }}>
          {idx + 1} / {words.length}
        </span>

        {allSeen && idx === words.length - 1 ? (
          <button
            onClick={onComplete}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: 12, border: 'none',
              background: '#26C6A6', color: 'white',
              fontWeight: 700, fontSize: '0.9rem',
            }}
          >
            Done! ✓
          </button>
        ) : (
          <button
            onClick={next}
            disabled={idx === words.length - 1}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: 12, border: 'none',
              background: idx === words.length - 1 ? '#EDF2F7' : level.color,
              color: idx === words.length - 1 ? '#CBD5E0' : 'white',
              fontWeight: 700, fontSize: '0.9rem',
              cursor: idx === words.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Next →
          </button>
        )}
      </div>

      {/* Word grid preview */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
        marginTop: '0.5rem',
      }}>
        {words.slice(0, 6).map((w, i) => (
          <div key={i} style={{
            background: seen.has(i) || i === idx ? 'white' : '#F7FAFC',
            border: `2px solid ${i === idx ? level.color : seen.has(i) ? '#26C6A6' : '#E2E8F0'}`,
            borderRadius: 12, padding: '0.6rem 0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            opacity: seen.has(i) || i === idx ? 1 : 0.6,
          }}>
            <span style={{ fontSize: '1.1rem' }}>{w.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2D3748' }}>{w.indo}</div>
              <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: 600 }}>{w.eng}</div>
            </div>
            {seen.has(i) && <span style={{ marginLeft: 'auto', color: '#26C6A6', fontSize: '0.9rem' }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

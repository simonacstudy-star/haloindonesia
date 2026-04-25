import { useState, useEffect, useRef } from 'react'
import { speakWithVoicesReady } from './speech'

// Groups words into chunks of 3 for manageable repetition
function chunk(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

const PHASES = ['listen', 'repeat', 'confirm'] // per word

export default function ChoralRepeat({ level, onComplete }) {
  const words = level.words
  const groups = chunk(words, 3)

  const [groupIdx, setGroupIdx] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState('intro') // 'intro' | 'listen' | 'gap' | 'repeat' | 'confirm' | 'groupdone'
  const [confirmed, setConfirmed] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const timerRef = useRef(null)

  const group = groups[groupIdx]
  const word = group?.[wordIdx]
  const isLastWord = wordIdx === group?.length - 1
  const isLastGroup = groupIdx === groups.length - 1
  const totalWords = words.length
  const doneCount = groupIdx * 3 + wordIdx

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  // Auto-play on phase change
  useEffect(() => {
    if (phase === 'listen' && word) {
      setSpeaking(true)
      speakWithVoicesReady(word.indo, () => {
        setSpeaking(false)
        // After speaking, short gap then show repeat prompt
        timerRef.current = setTimeout(() => setPhase('gap'), 400)
      })
    }
    if (phase === 'gap') {
      timerRef.current = setTimeout(() => setPhase('repeat'), 900)
    }
  }, [phase, wordIdx, groupIdx])

  function startGroup() {
    setWordIdx(0)
    setPhase('listen')
  }

  function handleConfirm() {
    setConfirmed(prev => [...prev, word.indo])
    if (isLastWord) {
      setPhase('groupdone')
    } else {
      setWordIdx(i => i + 1)
      setPhase('listen')
    }
  }

  function handleNextGroup() {
    if (isLastGroup) {
      onComplete()
    } else {
      setGroupIdx(g => g + 1)
      setWordIdx(0)
      setPhase('intro')
    }
  }

  function playAgain() {
    setSpeaking(true)
    speakWithVoicesReady(word.indo, () => setSpeaking(false))
  }

  // Overall progress bar
  const pct = Math.round((doneCount / totalWords) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>

      {/* Progress */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1, height: 12, background: '#EDF2F7', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: level.bg, borderRadius: 99,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <span style={{ fontSize: '0.82rem', color: '#718096', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {doneCount}/{totalWords} words
        </span>
      </div>

      {/* INTRO phase — show group preview */}
      {phase === 'intro' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗣️</div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.6rem', fontWeight: 800, color: '#2D3748',
            marginBottom: '0.5rem',
          }}>
            Say It Together!
          </h2>
          <p style={{ color: '#718096', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Listen to each word, then say it out loud with me!
          </p>

          {/* Preview the 3 words */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {group.map((w, i) => (
              <div
                key={w.indo}
                onClick={() => speakWithVoicesReady(w.indo)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'white', border: `2px solid ${level.color}33`,
                  borderRadius: 16, padding: '0.85rem 1.1rem',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{w.emoji}</span>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.3rem', fontWeight: 700, color: level.color }}>
                    {w.indo}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#718096', fontWeight: 600 }}>
                    {w.eng} · {w.pronunciation}
                  </div>
                </div>
                <span style={{ fontSize: '1.2rem', color: level.color }}>👂</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#A0AEC0', fontWeight: 600, marginBottom: '1rem' }}>
            Tap any word above to hear it · Tap the button when ready!
          </p>

          <button
            onClick={startGroup}
            style={{
              padding: '1rem 2.5rem', borderRadius: 20, border: 'none',
              background: level.color, color: 'white',
              fontFamily: "'Baloo 2', cursive",
              fontSize: '1.3rem', fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${level.color}44`,
            }}
          >
            Ready! Let's go! 🎤
          </button>
        </div>
      )}

      {/* LISTEN / GAP / REPEAT / CONFIRM phases */}
      {(phase === 'listen' || phase === 'gap' || phase === 'repeat') && word && (
        <div style={{ width: '100%', textAlign: 'center' }}>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
            {group.map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: confirmed.includes(group[i]?.indo)
                  ? '#26C6A6'
                  : i === wordIdx
                    ? level.color
                    : '#E2E8F0',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          {/* Big word card */}
          <div style={{
            background: level.bg,
            borderRadius: 28,
            padding: '2.5rem 1.5rem',
            marginBottom: '1.25rem',
            boxShadow: `0 8px 32px ${level.color}33`,
          }}>
            <div style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '0.75rem' }}>
              {word.emoji}
            </div>
            <div style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: '3rem', fontWeight: 800,
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}>
              {word.indo}
            </div>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              {word.eng}
            </div>
          </div>

          {/* Phase-specific UI */}
          {phase === 'listen' && (
            <div style={{
              background: '#F0F9FF', border: '2px solid #BAE6FD',
              borderRadius: 16, padding: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            }}>
              <span style={{
                fontSize: '2.5rem',
                animation: speaking ? 'speakPulse 0.4s infinite alternate' : 'none',
              }}>
                🔊
              </span>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.2rem', fontWeight: 800, color: '#0369A1' }}>
                {speaking ? 'Listen...' : 'Getting ready...'}
              </span>
            </div>
          )}

          {phase === 'gap' && (
            <div style={{
              background: '#FFF9ED', border: '2px solid #FEF3C7',
              borderRadius: 16, padding: '1.1rem', textAlign: 'center',
            }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.2rem', fontWeight: 800, color: '#92400E' }}>
                Get ready to say it... 🎤
              </p>
            </div>
          )}

          {phase === 'repeat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                background: '#F0FDF4', border: '3px solid #4ADE80',
                borderRadius: 20, padding: '1.25rem',
                textAlign: 'center',
                animation: 'bounceIn 0.4s ease',
              }}>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.6rem', fontWeight: 800, color: '#166534', marginBottom: '0.25rem' }}>
                  🗣️ Now say it!
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#15803D' }}>
                  "{word.pronunciation}"
                </p>
              </div>

              <button
                onClick={playAgain}
                style={{
                  padding: '0.65rem 1.25rem', borderRadius: 14,
                  border: `2px solid ${level.color}`,
                  background: 'white', color: level.color,
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                👂 Hear it again
              </button>

              <button
                onClick={handleConfirm}
                style={{
                  padding: '1rem', borderRadius: 18, border: 'none',
                  background: '#26C6A6', color: 'white',
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: '1.3rem', fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px #26C6A644',
                }}
              >
                ✓ I said it!
              </button>
            </div>
          )}
        </div>
      )}

      {/* GROUP DONE */}
      {phase === 'groupdone' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>🎉</div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.7rem', fontWeight: 800, color: '#2D3748',
            marginBottom: '0.5rem',
          }}>
            {isLastGroup ? 'Luar biasa!' : 'Bagus sekali!'}
          </h2>
          <p style={{ color: '#718096', fontWeight: 700, marginBottom: '1.25rem' }}>
            {isLastGroup ? 'You said all the words!' : 'Great job — keep going!'}
          </p>

          {/* Review the group */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {group.map(w => (
              <button
                key={w.indo}
                onClick={() => speakWithVoicesReady(w.indo)}
                style={{
                  padding: '0.6rem 1rem', borderRadius: 14,
                  border: '2px solid #26C6A6', background: '#E6FBF5',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  cursor: 'pointer', fontFamily: "'Baloo 2', cursive",
                  fontSize: '1.1rem', fontWeight: 700, color: '#0D9488',
                }}
              >
                {w.emoji} {w.indo}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#A0AEC0', fontWeight: 600, marginBottom: '1rem' }}>
            Tap any word to hear it again
          </p>

          <button
            onClick={handleNextGroup}
            style={{
              padding: '1rem 2.5rem', borderRadius: 20, border: 'none',
              background: isLastGroup ? '#26C6A6' : level.color,
              color: 'white',
              fontFamily: "'Baloo 2', cursive",
              fontSize: '1.3rem', fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${isLastGroup ? '#26C6A6' : level.color}44`,
            }}
          >
            {isLastGroup ? '🏁 All done!' : 'Next group →'}
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

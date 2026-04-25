import { useState, useEffect } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function SentenceBuilder({ level, onComplete }) {
  const sentences = level.sentences || []
  const [idx, setIdx] = useState(0)
  const [shuffledWords, setShuffledWords] = useState([])
  const [chosen, setChosen] = useState([])
  const [result, setResult] = useState(null) // 'correct' | 'wrong'
  const [score, setScore] = useState(0)
  const [speaking, setSpeaking] = useState(false)

  const sentence = sentences[idx]

  useEffect(() => {
    if (sentence) {
      setShuffledWords(shuffle(sentence.words))
      setChosen([])
      setResult(null)
    }
  }, [idx])

  function tapWord(word, fromBank) {
    if (result) return
    if (fromBank) {
      setChosen(prev => [...prev, word])
      setShuffledWords(prev => {
        const i = prev.indexOf(word)
        return [...prev.slice(0, i), ...prev.slice(i + 1)]
      })
    } else {
      setShuffledWords(prev => [...prev, word])
      setChosen(prev => {
        const i = prev.indexOf(word)
        return [...prev.slice(0, i), ...prev.slice(i + 1)]
      })
    }
  }

  function checkAnswer() {
    const correct = chosen.join(' ') === sentence.words.join(' ')
    setResult(correct ? 'correct' : 'wrong')
    if (correct) {
      setScore(s => s + 1)
      setSpeaking(true)
      speakWithVoicesReady(sentence.words.join(' '), () => setSpeaking(false))
    }
  }

  function tryAgain() {
    setShuffledWords(shuffle(sentence.words))
    setChosen([])
    setResult(null)
  }

  function next() {
    if (idx < sentences.length - 1) {
      setIdx(idx + 1)
    } else {
      onComplete()
    }
  }

  if (!sentence) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontWeight: 700, color: '#718096' }}>No sentences for this level yet!</p>
        <button onClick={onComplete} style={{ marginTop: '1rem', padding: '0.75rem 2rem', borderRadius: 14, border: 'none', background: '#26C6A6', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
          Continue →
        </button>
      </div>
    )
  }

  const isComplete = chosen.length === sentence.words.length
  const isLast = idx === sentences.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {sentences.map((_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%',
            background: i < idx ? '#26C6A6' : i === idx ? level.color : '#E2E8F0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Score */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#718096' }}>
          Sentence {idx + 1} of {sentences.length}
        </p>
        <span style={{
          background: '#FEF3C7', color: '#92400E',
          padding: '0.3rem 0.9rem', borderRadius: 20,
          fontSize: '0.9rem', fontWeight: 700,
        }}>
          ⭐ {score}/{sentences.length}
        </span>
      </div>

      {/* English prompt */}
      <div style={{
        background: level.bg,
        borderRadius: 20, padding: '1.25rem',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '0.4rem' }}>
          Say this in Indonesian:
        </p>
        <p style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '1.4rem', fontWeight: 800,
          color: 'white',
          textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          lineHeight: 1.3,
        }}>
          "{sentence.english}"
        </p>
      </div>

      {/* Answer tray */}
      <div style={{
        minHeight: 72,
        background: result === 'correct' ? '#E6FBF5' : result === 'wrong' ? '#FFF5F5' : '#F8FAFC',
        border: `3px solid ${result === 'correct' ? '#26C6A6' : result === 'wrong' ? '#FC8181' : '#E2E8F0'}`,
        borderRadius: 18,
        padding: '0.75rem 1rem',
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
        alignItems: 'center',
        transition: 'all 0.3s',
        minHeight: 72,
      }}>
        {chosen.length === 0 && (
          <p style={{ color: '#CBD5E0', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
            Tap the words below to build your sentence...
          </p>
        )}
        {chosen.map((word, i) => (
          <button
            key={`chosen-${i}`}
            onClick={() => !result && tapWord(word, false)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 12,
              border: `2px solid ${result === 'correct' ? '#26C6A6' : result === 'wrong' ? '#FC8181' : level.color}`,
              background: result === 'correct' ? '#D1FAE5' : result === 'wrong' ? '#FEE2E2' : 'white',
              color: result === 'correct' ? '#065F46' : result === 'wrong' ? '#991B1B' : '#2D3748',
              fontFamily: "'Baloo 2', cursive",
              fontSize: '1.1rem', fontWeight: 700,
              cursor: result ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      {!result && (
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#718096', marginBottom: '0.5rem' }}>
            Word bank — tap to add:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {shuffledWords.map((word, i) => (
              <button
                key={`bank-${i}`}
                onClick={() => tapWord(word, true)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 12,
                  border: `2px solid ${level.color}`,
                  background: 'white',
                  color: '#2D3748',
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: '1.1rem', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: `0 2px 8px ${level.color}33`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${level.color}15`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check button */}
      {!result && isComplete && (
        <button
          onClick={checkAnswer}
          style={{
            padding: '1rem',
            borderRadius: 16, border: 'none',
            background: level.color,
            color: 'white',
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.2rem', fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 4px 16px ${level.color}44`,
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Check my answer! ✓
        </button>
      )}

      {/* Feedback */}
      {result === 'correct' && (
        <div style={{
          background: '#E6FBF5', border: '2px solid #26C6A6',
          borderRadius: 16, padding: '1rem', textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.4rem', fontWeight: 800, color: '#0D9488', marginBottom: '0.5rem' }}>
            🎉 Benar! (Correct!)
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0D9488', marginBottom: '0.75rem' }}>
            {speaking ? '🔊 Listen to the sentence...' : '🔊 Great job saying it out loud!'}
          </p>
          <div style={{
            background: 'white', borderRadius: 12,
            padding: '0.75rem 1rem', marginBottom: '1rem',
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.2rem', fontWeight: 700, color: '#065F46',
          }}>
            {sentence.words.join(' ')}
          </div>
          <button
            onClick={next}
            style={{
              padding: '0.75rem 2rem', borderRadius: 14, border: 'none',
              background: '#26C6A6', color: 'white',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {isLast ? '🏁 Finished!' : 'Next sentence →'}
          </button>
        </div>
      )}

      {result === 'wrong' && (
        <div style={{
          background: '#FFF5F5', border: '2px solid #FC8181',
          borderRadius: 16, padding: '1rem', textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.3rem', fontWeight: 800, color: '#C53030', marginBottom: '0.5rem' }}>
            Almost! Try again 💪
          </p>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C53030', marginBottom: '0.75rem' }}>
            Hint: The sentence starts with "{sentence.words[0]}"
          </p>
          <button
            onClick={tryAgain}
            style={{
              padding: '0.75rem 2rem', borderRadius: 14, border: 'none',
              background: '#FC8181', color: 'white',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Try again! 🔄
          </button>
        </div>
      )}
    </div>
  )
}

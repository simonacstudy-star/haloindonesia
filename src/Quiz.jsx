import { useState } from 'react'
import { speakWithVoicesReady } from './speech'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildQuestions(words) {
  return shuffle(words).slice(0, 5).map(word => {
    const wrong = shuffle(words.filter(w => w.indo !== word.indo)).slice(0, 3)
    const options = shuffle([word, ...wrong])
    return { question: word.indo, emoji: word.emoji, answer: word.eng, pronunciation: word.pronunciation, options }
  })
}

export default function Quiz({ level, onComplete }) {
  const [questions] = useState(() => buildQuestions(level.words))
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [results, setResults] = useState([])

  const q = questions[idx]
  const letters = ['A', 'B', 'C', 'D']

  function handleAnswer(opt) {
    if (answered) return
    const correct = opt.eng === q.answer
    setAnswered({ chosen: opt.eng, correct })
    setResults(prev => [...prev, correct])
    speakWithVoicesReady(q.question)
  }

  function next() {
    setAnswered(null)
    if (idx < questions.length - 1) setIdx(idx + 1)
    else onComplete()
  }

  const correctCount = results.filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%',
            background: i < results.length ? (results[i] ? '#26C6A6' : '#FC8181') : i === idx ? level.color : '#E2E8F0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#718096', fontWeight: 700 }}>
        ⭐ {correctCount} correct
      </div>

      {/* Question */}
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{q.emoji}</div>
        <div style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '1.8rem', fontWeight: 800,
          color: '#2D3748', lineHeight: 1.2,
        }}>
          What does <span style={{ color: level.color }}>"{q.question}"</span> mean?
        </div>
        <button
          onClick={() => speakWithVoicesReady(q.question)}
          style={{
            marginTop: '0.75rem', padding: '0.5rem 1.25rem',
            borderRadius: 20, border: `2px solid ${level.color}`,
            background: 'white', color: level.color,
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          }}
        >
          👂 Hear it
        </button>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {q.options.map((opt, i) => {
          const isChosen = answered?.chosen === opt.eng
          const isCorrect = opt.eng === q.answer
          let borderColor = '#E2E8F0', bg = 'white', color = '#2D3748'
          let letterBg = '#EDF2F7', letterColor = '#718096'

          if (answered) {
            if (isCorrect) { borderColor = '#26C6A6'; bg = '#E6FBF5'; color = '#0D9488'; letterBg = '#0D9488'; letterColor = 'white' }
            else if (isChosen) { borderColor = '#FC8181'; bg = '#FFF5F5'; color = '#C53030'; letterBg = '#C53030'; letterColor = 'white' }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={!!answered}
              style={{
                padding: '1rem 1.25rem', borderRadius: 16,
                border: `3px solid ${borderColor}`,
                background: bg, color,
                fontWeight: 700, fontSize: '1.05rem',
                cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.15s', textAlign: 'left', width: '100%',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: letterBg, color: letterColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 800, flexShrink: 0,
                transition: 'all 0.2s',
              }}>
                {letters[i]}
              </div>
              {opt.eng}
              {answered && isCorrect && <span style={{ marginLeft: 'auto' }}>✅</span>}
              {answered && isChosen && !isCorrect && <span style={{ marginLeft: 'auto' }}>❌</span>}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div style={{
          padding: '1rem', borderRadius: 16,
          background: answered.correct ? '#E6FBF5' : '#FFF5F5',
          border: `2px solid ${answered.correct ? '#26C6A6' : '#FC8181'}`,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.3rem', fontWeight: 800,
            color: answered.correct ? '#0D9488' : '#C53030',
            marginBottom: '0.25rem',
          }}>
            {answered.correct ? '🎉 Benar! (Correct!)' : `The answer was: "${q.answer}"`}
          </p>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#718096', marginBottom: '0.75rem' }}>
            Say it: {q.pronunciation}
          </p>
          <button
            onClick={next}
            style={{
              padding: '0.6rem 2rem', borderRadius: 12, border: 'none',
              background: answered.correct ? '#26C6A6' : '#FC8181',
              color: 'white', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
            }}
          >
            {idx < questions.length - 1 ? 'Next →' : '🏁 Finish!'}
          </button>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function MatchGame({ level, onComplete }) {
  const wordSet = level.words.slice(0, 6)

  const [indoList] = useState(() => shuffle(wordSet).map(w => w.indo))
  const [engList] = useState(() => shuffle(wordSet).map(w => w.eng))
  const [selectedIndo, setSelectedIndo] = useState(null)
  const [selectedEng, setSelectedEng] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (selectedIndo && selectedEng) {
      const pair = wordSet.find(w => w.indo === selectedIndo && w.eng === selectedEng)
      if (pair) {
        setMatched(prev => [...prev, selectedIndo, selectedEng])
        setScore(s => s + 1)
        setSelectedIndo(null)
        setSelectedEng(null)
      } else {
        setWrong([selectedIndo, selectedEng])
        setTimeout(() => {
          setWrong([])
          setSelectedIndo(null)
          setSelectedEng(null)
        }, 700)
      }
    }
  }, [selectedIndo, selectedEng])

  const allDone = matched.length === wordSet.length * 2

  function getIndoStyle(word) {
    const isMatched = matched.includes(word)
    const isSelected = selectedIndo === word
    const isWrong = wrong.includes(word)
    return {
      padding: '0.75rem 1rem',
      borderRadius: 14,
      border: `2.5px solid ${isMatched ? '#26C6A6' : isWrong ? '#FC8181' : isSelected ? level.color : '#E2E8F0'}`,
      background: isMatched ? '#E6FBF5' : isWrong ? '#FFF5F5' : isSelected ? '#FFF0ED' : 'white',
      color: isMatched ? '#0D9488' : isWrong ? '#C53030' : isSelected ? '#E85555' : '#2D3748',
      fontWeight: 700, fontSize: '0.9rem',
      cursor: isMatched ? 'default' : 'pointer',
      transition: 'all 0.15s',
      textAlign: 'center',
      minHeight: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: isMatched ? 0.7 : 1,
      fontFamily: "'Nunito', sans-serif",
      animation: isWrong ? 'shake 0.3s' : 'none',
    }
  }

  function getEngStyle(word) {
    const isMatched = matched.includes(word)
    const isSelected = selectedEng === word
    const isWrong = wrong.includes(word)
    return {
      padding: '0.75rem 1rem',
      borderRadius: 14,
      border: `2.5px solid ${isMatched ? '#26C6A6' : isWrong ? '#FC8181' : isSelected ? '#A78BFA' : '#E2E8F0'}`,
      background: isMatched ? '#E6FBF5' : isWrong ? '#FFF5F5' : isSelected ? '#FAF5FF' : 'white',
      color: isMatched ? '#0D9488' : isWrong ? '#C53030' : isSelected ? '#7C3AED' : '#2D3748',
      fontWeight: 700, fontSize: '0.9rem',
      cursor: isMatched ? 'default' : 'pointer',
      transition: 'all 0.15s',
      textAlign: 'center',
      minHeight: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: isMatched ? 0.7 : 1,
      fontFamily: "'Nunito', sans-serif",
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }`}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>
          Match the Indonesian word to its English meaning
        </p>
        <div style={{
          background: '#FEF3C7', color: '#92400E',
          padding: '0.3rem 0.8rem', borderRadius: 20,
          fontSize: '0.82rem', fontWeight: 700,
        }}>
          ⭐ {score}/{wordSet.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#718096', textAlign: 'center', marginBottom: 4 }}>
            🇮🇩 Indonesian
          </div>
          {indoList.map(word => (
            <button
              key={word}
              onClick={() => !matched.includes(word) && setSelectedIndo(word)}
              style={getIndoStyle(word)}
            >
              {matched.includes(word) ? '✓ ' : ''}{word}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#718096', textAlign: 'center', marginBottom: 4 }}>
            🇦🇺 English
          </div>
          {engList.map(word => (
            <button
              key={word}
              onClick={() => !matched.includes(word) && setSelectedEng(word)}
              style={getEngStyle(word)}
            >
              {matched.includes(word) ? '✓ ' : ''}{word}
            </button>
          ))}
        </div>
      </div>

      {allDone && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <p style={{ fontWeight: 700, color: '#0D9488', marginBottom: '1rem' }}>
            Bagus sekali! (Excellent!) All matched!
          </p>
          <button
            onClick={onComplete}
            style={{
              padding: '0.75rem 2rem', borderRadius: 14, border: 'none',
              background: '#26C6A6', color: 'white',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

const AVATARS = ['🐒', '🦜', '🐯', '🐘', '🐬', '🦁', '🐸', '🦊', '🐼', '🦋', '🐙', '🦄']
const COLORS = ['#FF6B6B', '#26C6A6', '#A78BFA', '#FB923C', '#60A5FA', '#F472B6']

const AGE_GROUPS = [
  {
    id: 'little',
    label: '4 – 5',
    emoji: '🐣',
    title: 'Little Explorer',
    desc: 'Pictures & sounds — no reading needed!',
    bg: 'linear-gradient(135deg,#FB923C,#F59E0B)',
    color: '#FB923C',
  },
  {
    id: 'adventurer',
    label: '6 – 9',
    emoji: '🌟',
    title: 'Island Adventurer',
    desc: 'Words, sentences & challenges!',
    bg: 'linear-gradient(135deg,#26C6A6,#0694A2)',
    color: '#26C6A6',
  },
]

export default function PlayerSelect({ players, onSelect, onAdd, onDelete }) {
  const [step, setStep] = useState('select') // 'select' | 'name' | 'avatar' | 'age'
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [color, setColor] = useState(COLORS[0])
  const [ageGroup, setAgeGroup] = useState(null)

  function startAdd() {
    setName('')
    setAvatar(AVATARS[0])
    setColor(COLORS[0])
    setAgeGroup(null)
    setStep('name')
  }

  function handleAdd() {
    if (!name.trim() || !ageGroup) return
    onAdd({ name: name.trim(), avatar, color, ageGroup: ageGroup.id, id: Date.now() })
    setStep('select')
  }

  function cancelAdd() {
    setStep('select')
    setName('')
    setAgeGroup(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#FFF8F0 0%,#FFF0F9 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌴</div>
        <h1 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '2rem', fontWeight: 800,
          color: '#FF6B6B', margin: 0,
        }}>
          Halo Indonesia!
        </h1>
        <p style={{ color: '#718096', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>
          {step === 'select' ? 'Who is playing today?' : 'Create your player!'}
        </p>
      </div>

      {/* STEP: Select player */}
      {step === 'select' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem', width: '100%', maxWidth: 480,
        }}>
          {players.map(player => (
            <div key={player.id} style={{ position: 'relative' }}>
              <button
                onClick={() => onSelect(player)}
                style={{
                  width: '100%', background: 'white',
                  border: `3px solid ${player.color}`,
                  borderRadius: 24, padding: '1.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '0.5rem',
                  boxShadow: `0 4px 16px ${player.color}33`,
                  fontFamily: "'Nunito', sans-serif",
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: `${player.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem',
                }}>
                  {player.avatar}
                </div>
                <div style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: '1.2rem', fontWeight: 700, color: '#2D3748',
                }}>
                  {player.name}
                </div>
                {/* Age badge */}
                <div style={{
                  background: player.ageGroup === 'little' ? '#FEF3C7' : '#E6FBF5',
                  color: player.ageGroup === 'little' ? '#92400E' : '#0D9488',
                  fontSize: '0.75rem', fontWeight: 700,
                  padding: '0.2rem 0.6rem', borderRadius: 20,
                }}>
                  {player.ageGroup === 'little' ? '🐣 Ages 4–5' : '🌟 Ages 6–9'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                  {player.starsTotal || 0} ⭐ earned
                </div>
              </button>
              <button
                onClick={() => { if (confirm(`Remove ${player.name}?`)) onDelete(player.id) }}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 24, height: 24, borderRadius: '50%',
                  border: 'none', background: '#EDF2F7',
                  color: '#A0AEC0', fontSize: '0.7rem',
                  cursor: 'pointer', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          ))}

          {players.length < 4 && (
            <button
              onClick={startAdd}
              style={{
                background: 'white',
                border: '3px dashed #CBD5E0',
                borderRadius: 24, padding: '1.5rem 1rem',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '0.5rem',
                color: '#A0AEC0', fontWeight: 700, fontSize: '0.95rem',
                fontFamily: "'Nunito', sans-serif",
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B6B'; e.currentTarget.style.color = '#FF6B6B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E0'; e.currentTarget.style.color = '#A0AEC0' }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#F7FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
              }}>
                ＋
              </div>
              Add Player
            </button>
          )}
        </div>
      )}

      {/* ADD PLAYER FLOW — shown in modal */}
      {step !== 'select' && (
        <div style={{
          background: 'white', borderRadius: 24,
          padding: '1.5rem', width: '100%', maxWidth: 440,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>

          {/* Step: Name + Avatar */}
          {step === 'name' && (
            <>
              <h2 style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: '1.4rem', fontWeight: 800,
                color: '#2D3748', marginBottom: '1.25rem', textAlign: 'center',
              }}>
                What's your name? 👋
              </h2>

              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep('avatar')}
                placeholder="Type your name..."
                maxLength={12}
                style={{
                  width: '100%', padding: '0.85rem 1rem',
                  border: '2.5px solid #E2E8F0', borderRadius: 14,
                  fontSize: '1.2rem', fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  color: '#2D3748', outline: 'none',
                  marginBottom: '1.5rem', textAlign: 'center',
                }}
              />

              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#718096', marginBottom: '0.6rem' }}>
                Pick your avatar:
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '0.4rem', marginBottom: '1.25rem',
              }}>
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    style={{
                      fontSize: '1.6rem', padding: '0.4rem',
                      borderRadius: 12,
                      border: `2.5px solid ${avatar === a ? '#FF6B6B' : '#E2E8F0'}`,
                      background: avatar === a ? '#FFF0ED' : 'white',
                      cursor: 'pointer',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#718096', marginBottom: '0.6rem' }}>
                Pick your colour:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: c,
                      border: `3px solid ${color === c ? '#2D3748' : 'transparent'}`,
                      cursor: 'pointer', outline: 'none',
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={cancelAdd} style={{
                  flex: 1, padding: '0.75rem', borderRadius: 14,
                  border: '2px solid #E2E8F0', background: 'white',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif", color: '#718096',
                }}>
                  Cancel
                </button>
                <button
                  onClick={() => setStep('age')}
                  disabled={!name.trim()}
                  style={{
                    flex: 2, padding: '0.75rem', borderRadius: 14, border: 'none',
                    background: name.trim() ? '#FF6B6B' : '#EDF2F7',
                    color: name.trim() ? 'white' : '#CBD5E0',
                    fontWeight: 700, fontSize: '0.95rem',
                    cursor: name.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step: Age group */}
          {step === 'age' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{avatar}</div>
                <h2 style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: '1.4rem', fontWeight: 800,
                  color: '#2D3748', margin: '0.5rem 0 0.25rem',
                }}>
                  Hi {name}! 👋
                </h2>
                <p style={{ color: '#718096', fontWeight: 700, fontSize: '0.95rem' }}>
                  How old are you?
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {AGE_GROUPS.map(ag => (
                  <button
                    key={ag.id}
                    onClick={() => setAgeGroup(ag)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 20,
                      border: `3px solid ${ageGroup?.id === ag.id ? ag.color : '#E2E8F0'}`,
                      background: ageGroup?.id === ag.id ? `${ag.color}15` : 'white',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      transition: 'all 0.15s',
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: ageGroup?.id === ag.id ? `0 4px 16px ${ag.color}33` : 'none',
                    }}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      background: ag.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', flexShrink: 0,
                    }}>
                      {ag.emoji}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{
                        fontFamily: "'Baloo 2', cursive",
                        fontSize: '1.3rem', fontWeight: 800,
                        color: ageGroup?.id === ag.id ? ag.color : '#2D3748',
                      }}>
                        {ag.label} years old
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#718096', fontWeight: 600, marginTop: 2 }}>
                        {ag.title} — {ag.desc}
                      </div>
                    </div>
                    {ageGroup?.id === ag.id && (
                      <div style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>✅</div>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep('name')} style={{
                  flex: 1, padding: '0.75rem', borderRadius: 14,
                  border: '2px solid #E2E8F0', background: 'white',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif", color: '#718096',
                }}>
                  ← Back
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!ageGroup}
                  style={{
                    flex: 2, padding: '0.75rem', borderRadius: 14, border: 'none',
                    background: ageGroup ? ageGroup.color : '#EDF2F7',
                    color: ageGroup ? 'white' : '#CBD5E0',
                    fontWeight: 700, fontSize: '0.95rem',
                    cursor: ageGroup ? 'pointer' : 'not-allowed',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Let's go! 🎉
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

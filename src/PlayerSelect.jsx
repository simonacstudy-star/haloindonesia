import { useState } from 'react'

const AVATARS = ['🐒', '🦜', '🐯', '🐘', '🐬', '🦁', '🐸', '🦊', '🐼', '🦋', '🐙', '🦄']
const COLORS = ['#FF6B6B', '#26C6A6', '#A78BFA', '#FB923C', '#60A5FA', '#F472B6']

export default function PlayerSelect({ players, onSelect, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [color, setColor] = useState(COLORS[0])

  function handleAdd() {
    if (!name.trim()) return
    onAdd({ name: name.trim(), avatar, color, id: Date.now() })
    setAdding(false)
    setName('')
    setAvatar(AVATARS[0])
    setColor(COLORS[0])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#FFF8F0 0%,#FFF0F9 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
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
          Who is playing today?
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        width: '100%',
        maxWidth: 480,
      }}>
        {players.map(player => (
          <div
            key={player.id}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => onSelect(player)}
              style={{
                width: '100%',
                background: 'white',
                border: `3px solid ${player.color}`,
                borderRadius: 24,
                padding: '1.5rem 1rem',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '0.5rem',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: `0 4px 16px ${player.color}33`,
                fontFamily: "'Nunito', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${player.color}44` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${player.color}33` }}
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
                fontSize: '1.2rem', fontWeight: 700,
                color: '#2D3748',
              }}>
                {player.name}
              </div>
              <div style={{
                fontSize: '0.8rem', color: '#718096', fontWeight: 600,
              }}>
                {player.starsTotal || 0} ⭐ earned
              </div>
            </button>
            <button
              onClick={() => { if(confirm(`Remove ${player.name}?`)) onDelete(player.id) }}
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 24, height: 24, borderRadius: '50%',
                border: 'none', background: '#EDF2F7',
                color: '#A0AEC0', fontSize: '0.7rem',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {players.length < 4 && !adding && (
          <button
            onClick={() => setAdding(true)}
            style={{
              background: 'white',
              border: '3px dashed #CBD5E0',
              borderRadius: 24,
              padding: '1.5rem 1rem',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.5rem',
              color: '#A0AEC0', fontWeight: 700,
              fontSize: '0.95rem',
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

      {/* Add player form */}
      {adding && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', zIndex: 200,
        }}>
          <div style={{
            background: 'white', borderRadius: 24,
            padding: '1.5rem', width: '100%', maxWidth: 400,
          }}>
            <h2 style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: '1.4rem', fontWeight: 800,
              color: '#2D3748', marginBottom: '1.25rem', textAlign: 'center',
            }}>
              Create your player!
            </h2>

            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Enter your name..."
              maxLength={12}
              style={{
                width: '100%', padding: '0.75rem 1rem',
                border: '2.5px solid #E2E8F0', borderRadius: 14,
                fontSize: '1.1rem', fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
                color: '#2D3748', outline: 'none',
                marginBottom: '1.25rem',
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
                    borderRadius: 12, border: `2.5px solid ${avatar === a ? '#FF6B6B' : '#E2E8F0'}`,
                    background: avatar === a ? '#FFF0ED' : 'white',
                    cursor: 'pointer', transition: 'all 0.1s',
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
                    background: c, border: `3px solid ${color === c ? '#2D3748' : 'transparent'}`,
                    cursor: 'pointer', transition: 'border 0.15s',
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setAdding(false)}
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: 14,
                  border: '2px solid #E2E8F0', background: 'white',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif", color: '#718096',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name.trim()}
                style={{
                  flex: 2, padding: '0.75rem', borderRadius: 14,
                  border: 'none',
                  background: name.trim() ? '#FF6B6B' : '#EDF2F7',
                  color: name.trim() ? 'white' : '#CBD5E0',
                  fontWeight: 700, fontSize: '0.95rem',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Let's go! 🎉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

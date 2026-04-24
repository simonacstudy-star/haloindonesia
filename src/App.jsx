import { useState, useEffect } from 'react'
import { LEVELS, TASKS } from './data'
import Flashcard from './Flashcard'
import MatchGame from './MatchGame'
import Quiz from './Quiz'
import KikiChat from './KikiChat'

const STORAGE_KEY = 'halo-indonesia-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return LEVELS.map(() => ({ tasksComplete: [] }))
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {}
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [currentLevel, setCurrentLevel] = useState(null)
  const [currentTask, setCurrentTask] = useState(null)
  const [activityDone, setActivityDone] = useState(false)

  useEffect(() => { saveProgress(progress) }, [progress])

  function getLevelStatus(i) {
    if (i === 0) return progress[0].tasksComplete.length >= 3 ? 'completed' : 'active'
    const prevDone = progress[i - 1].tasksComplete.length >= 3
    if (!prevDone) return 'locked'
    return progress[i].tasksComplete.length >= 3 ? 'completed' : 'active'
  }

  function openLevel(i) {
    if (getLevelStatus(i) === 'locked') return
    setCurrentLevel(i)
    setCurrentTask(null)
    setActivityDone(false)
  }

  function closeModal() {
    setCurrentLevel(null)
    setCurrentTask(null)
    setActivityDone(false)
  }

  function openTask(taskId) {
    setCurrentTask(taskId)
    setActivityDone(false)
  }

  function completeTask() {
    const taskId = currentTask
    const lvIdx = currentLevel
    setProgress(prev => {
      const next = prev.map((p, i) => {
        if (i !== lvIdx) return p
        if (p.tasksComplete.includes(taskId)) return p
        return { tasksComplete: [...p.tasksComplete, taskId] }
      })
      return next
    })
    setActivityDone(true)
  }

  function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
      const reset = LEVELS.map(() => ({ tasksComplete: [] }))
      setProgress(reset)
      closeModal()
    }
  }

  const totalStars = progress.reduce((s, p) => s + p.tasksComplete.length, 0)
  const completedLevels = progress.filter(p => p.tasksComplete.length >= 3).length

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '1rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#FF6B6B 0%,#FF8E53 50%,#FFD166 100%)',
        borderRadius: 24, padding: '1.5rem', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120,
          background: 'rgba(255,255,255,0.15)', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: -20,
          width: 80, height: 80,
          background: 'rgba(255,255,255,0.1)', borderRadius: '50%',
        }} />
        <h1 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '2rem', fontWeight: 800,
          color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          position: 'relative', zIndex: 1, margin: 0,
        }}>
          🌴 Halo Indonesia! 🌴
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem',
          fontWeight: 600, position: 'relative', zIndex: 1, marginTop: 4,
        }}>
          A tropical language adventure!
        </p>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '1.5rem',
          marginTop: '1rem', position: 'relative', zIndex: 1,
        }}>
          {[
            { label: `⭐ ${totalStars} Stars` },
            { label: `🏝️ ${completedLevels}/${LEVELS.length} Islands` },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: 20, padding: '0.35rem 1rem',
              color: 'white', fontWeight: 700, fontSize: '0.9rem',
            }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Level cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {LEVELS.map((lv, i) => {
          const status = getLevelStatus(i)
          const done = progress[i].tasksComplete.length
          const pct = Math.round((done / 3) * 100)
          const badgeText = status === 'locked' ? '🔒 Locked' : status === 'completed' ? '✅ Done!' : '▶ Play'
          const badgeColor = status === 'locked' ? '#CBD5E0' : status === 'completed' ? '#0D9488' : '#E85555'
          const badgeBg = status === 'locked' ? '#EDF2F7' : status === 'completed' ? '#E6FBF5' : '#FFF0ED'

          return (
            <div
              key={i}
              onClick={() => openLevel(i)}
              role={status !== 'locked' ? 'button' : undefined}
              tabIndex={status !== 'locked' ? 0 : undefined}
              onKeyDown={e => e.key === 'Enter' && openLevel(i)}
              style={{
                background: status === 'locked' ? '#F7FAFC' : 'white',
                borderRadius: 20, padding: '1.25rem',
                border: `2.5px solid ${status === 'completed' ? '#26C6A6' : status === 'active' ? lv.color : '#E2E8F0'}`,
                cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                opacity: status === 'locked' ? 0.65 : 1,
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: status === 'active' ? `0 4px 20px ${lv.color}33` : 'none',
              }}
            >
              {/* Top stripe */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 5,
                background: lv.color, borderRadius: '20px 20px 0 0',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: lv.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', flexShrink: 0,
                }}>
                  {lv.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Baloo 2', cursive",
                    fontSize: '1.1rem', fontWeight: 700, color: '#2D3748',
                  }}>
                    {i + 1}. {lv.title} — {lv.titleIndo}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#718096', fontWeight: 600, marginTop: 2 }}>
                    {lv.words.length} words to learn
                  </div>
                </div>
                <div style={{
                  padding: '0.3rem 0.75rem', borderRadius: 20,
                  fontSize: '0.78rem', fontWeight: 700,
                  background: badgeBg, color: badgeColor,
                }}>
                  {badgeText}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                marginTop: '0.9rem', height: 8,
                background: '#EDF2F7', borderRadius: 99, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: lv.color, borderRadius: 99,
                  transition: 'width 0.5s ease',
                }} />
              </div>

              {/* Task pills */}
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {TASKS.map(t => {
                  const isDone = progress[i].tasksComplete.includes(t.id)
                  return (
                    <div key={t.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.78rem', fontWeight: 700,
                      padding: '0.25rem 0.6rem', borderRadius: 10,
                      background: isDone ? '#E6FBF5' : status === 'locked' ? '#F7FAFC' : '#FFF0ED',
                      color: isDone ? '#0D9488' : status === 'locked' ? '#CBD5E0' : '#E85555',
                    }}>
                      {isDone ? '✓' : '○'} {t.name}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Reset button */}
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '6rem' }}>
        <button
          onClick={resetProgress}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: 10,
            border: '1.5px solid #E2E8F0', background: 'white',
            color: '#718096', fontSize: '0.82rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔄 Reset Progress
        </button>
      </div>

      {/* Modal */}
      {currentLevel !== null && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '1rem',
          }}
        >
          <div style={{
            background: 'white', borderRadius: 24,
            width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem 1rem',
              borderBottom: '2px solid #F0F0F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              position: 'sticky', top: 0, background: 'white', zIndex: 1,
            }}>
              <div style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: '1.3rem', fontWeight: 800,
                color: LEVELS[currentLevel].color,
              }}>
                {currentTask
                  ? TASKS.find(t => t.id === currentTask)?.name
                  : `${LEVELS[currentLevel].emoji} ${LEVELS[currentLevel].title}`}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {currentTask && !activityDone && (
                  <button
                    onClick={() => { setCurrentTask(null); setActivityDone(false) }}
                    style={{
                      padding: '0.35rem 0.9rem', borderRadius: 20,
                      border: '1.5px solid #E2E8F0', background: 'white',
                      color: '#718096', fontSize: '0.82rem', fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={closeModal}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: 'none', background: '#F7FAFC',
                    fontSize: '1.2rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#718096',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem' }}>
              {!currentTask && (
                <TaskSelector
                  level={LEVELS[currentLevel]}
                  progress={progress[currentLevel]}
                  onSelect={openTask}
                />
              )}
              {currentTask && activityDone && (
                <SuccessScreen
                  taskId={currentTask}
                  level={LEVELS[currentLevel]}
                  allTasksDone={progress[currentLevel].tasksComplete.length >= 3}
                  onBack={() => { setCurrentTask(null); setActivityDone(false) }}
                  onClose={closeModal}
                />
              )}
              {currentTask && !activityDone && currentTask === 'flashcard' && (
                <Flashcard level={LEVELS[currentLevel]} onComplete={completeTask} />
              )}
              {currentTask && !activityDone && currentTask === 'match' && (
                <MatchGame level={LEVELS[currentLevel]} onComplete={completeTask} />
              )}
              {currentTask && !activityDone && currentTask === 'quiz' && (
                <Quiz level={LEVELS[currentLevel]} onComplete={completeTask} />
              )}
            </div>
          </div>
        </div>
      )}

      <KikiChat />
    </div>
  )
}

function TaskSelector({ level, progress, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 600, marginBottom: '0.25rem' }}>
        Complete all 3 challenges to unlock the next island! 🏝️
      </p>
      {TASKS.map((task, i) => {
        const isDone = progress.tasksComplete.includes(task.id)
        const prevDone = i === 0 || progress.tasksComplete.includes(TASKS[i - 1].id)
        const isLocked = !isDone && !prevDone

        return (
          <div
            key={task.id}
            onClick={() => !isLocked && onSelect(task.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem',
              border: `2px solid ${isDone ? '#26C6A6' : isLocked ? '#E2E8F0' : level.color}`,
              borderRadius: 16,
              background: isDone ? '#F0FDF9' : isLocked ? '#F7FAFC' : '#FFF9F8',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              opacity: isLocked ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: isDone ? '#CCFBF1' : task.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0,
            }}>
              {isLocked ? '🔒' : task.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2D3748' }}>{task.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: 2, fontWeight: 600 }}>{task.desc}</div>
            </div>
            <div style={{ fontSize: '1.4rem' }}>
              {isDone ? '✅' : isLocked ? '' : '→'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SuccessScreen({ taskId, level, allTasksDone, onBack, onClose }) {
  const msgs = {
    flashcard: { title: 'Cards mastered!', sub: 'You learned all the words!', icon: '🃏' },
    match: { title: 'Perfect match!', sub: 'You matched them all!', icon: '🔗' },
    quiz: { title: 'Quiz complete!', sub: 'You answered the questions!', icon: '⭐' },
  }
  const m = msgs[taskId]

  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
      <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{m.icon}</div>
      <div style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: '1.8rem', fontWeight: 800, color: '#2D3748', marginBottom: '0.5rem',
      }}>
        {m.title}
      </div>
      <div style={{ color: '#718096', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>
        {m.sub}
      </div>
      <div style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        ⭐⭐⭐
      </div>

      {allTasksDone && (
        <div style={{
          background: 'linear-gradient(135deg,#26C6A6,#0694A2)',
          borderRadius: 16, padding: '1rem', marginBottom: '1.5rem',
          color: 'white',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏝️ Island Unlocked!</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', opacity: 0.9 }}>
            You've completed {level.title}! The next island is open!
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: 14, border: '2px solid #E2E8F0',
            background: 'white', color: '#2D3748', fontWeight: 700,
            fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
          }}
        >
          ← More challenges
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: 14, border: 'none',
            background: level.color, color: 'white', fontWeight: 700,
            fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
          }}
        >
          Back to map 🗺️
        </button>
      </div>
    </div>
  )
}

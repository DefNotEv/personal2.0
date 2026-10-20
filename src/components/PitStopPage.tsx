import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import type { Character } from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'
import { PitStopLeaderboard } from './PitStopLeaderboard.tsx'

type Phase = 'idle' | 'lights' | 'go' | 'done' | 'jump' | 'miss'

const SQUARES = ['q', 'w', 'a', 's'] as const
const LIGHT_MS = 520
const BEST_KEY = 'pitstop-best'

function readBest(): number | null {
  try {
    const value = Number(window.localStorage.getItem(BEST_KEY))
    return value > 0 ? value : null
  } catch {
    return null
  }
}

function saveBest(ms: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(ms))
  } catch {
    // Private mode etc.: the best just isn't remembered.
  }
}

function rating(ms: number): string {
  if (ms < 220) return 'F1 driver reflexes'
  if (ms < 300) return 'Pit wall approved'
  if (ms < 400) return 'Solid privateer'
  return 'Lemons pace'
}

const formatTime = (ms: number) => (ms / 1000).toFixed(3)

export function PitStopPage({ character }: { character: Character }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [lit, setLit] = useState(0)
  const [target, setTarget] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [best, setBest] = useState<number | null>(readBest)
  const lightsOutAt = useRef(0)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const start = useCallback(() => {
    clearTimers()
    setPhase('lights')
    setLit(0)
    setTarget(null)
    setWrong(null)
    setTime(null)
    for (let light = 1; light <= 5; light += 1) {
      timers.current.push(window.setTimeout(() => setLit(light), light * LIGHT_MS))
    }
    // Lights out after a random hold, like a real start.
    const out = 5 * LIGHT_MS + 400 + Math.random() * 1600
    timers.current.push(
      window.setTimeout(() => {
        setLit(0)
        setTarget(Math.floor(Math.random() * SQUARES.length))
        setPhase('go')
        lightsOutAt.current = performance.now()
      }, out),
    )
  }, [clearTimers])

  const hit = useCallback(
    (square: number) => {
      if (phase === 'lights') {
        clearTimers()
        setPhase('jump')
        track('Pit stop', { result: 'jump start' })
        return
      }
      if (phase !== 'go') return
      if (square !== target) {
        setWrong(square)
        setPhase('miss')
        track('Pit stop', { result: 'wrong square' })
        return
      }
      const reaction = performance.now() - lightsOutAt.current
      setTime(reaction)
      setPhase('done')
      track('Pit stop', { result: 'finished', ms: Math.round(reaction) })
      if (best === null || reaction < best) {
        setBest(reaction)
        saveBest(reaction)
      }
    },
    [best, clearTimers, phase, target],
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.repeat) return
      // Typing a name shouldn't press squares or restart.
      if (event.target instanceof HTMLInputElement) return
      const square = SQUARES.indexOf(event.key.toLowerCase() as (typeof SQUARES)[number])
      if (square >= 0) {
        event.preventDefault()
        hit(square)
        return
      }
      if ((event.key === 'Enter' || event.key === ' ') && phase !== 'lights' && phase !== 'go') {
        event.preventDefault()
        start()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hit, phase, start])

  const running = phase === 'lights' || phase === 'go'

  return (
    <Cabinet character={character}>
      <header className="topbar">
        <p className="eyebrow">Arcade</p>
      </header>

      <section className="pitstop">
        <div className="pitstop__intro">
          <h1 className="page__title">Pit Stop Challenge</h1>
          <p className="page__lede">
            When the lights go out, hit the square that lights up. Click, tap or use Q W A S.
          </p>
        </div>

        <div className="pitstop__lights" aria-hidden="true">
          {Array.from({ length: 5 }, (_, light) => (
            <span key={light} className={light < lit ? 'pitstop__light is-on' : 'pitstop__light'} />
          ))}
        </div>

        <div className="pitstop__grid">
          {SQUARES.map((key, index) => {
            const classes = [
              'pitstop__square',
              phase === 'go' && target === index ? 'is-target' : '',
              (phase === 'done' || phase === 'miss') && target === index ? 'is-hit' : '',
              wrong === index ? 'is-wrong' : '',
            ]
            return (
              <button
                key={key}
                type="button"
                className={classes.filter(Boolean).join(' ')}
                aria-label={`Square ${index + 1} (${key.toUpperCase()})`}
                onPointerDown={(event) => {
                  event.preventDefault()
                  hit(index)
                }}
              >
                <span>{key.toUpperCase()}</span>
              </button>
            )
          })}
        </div>

        <div className="pitstop__panel" aria-live="polite">
          <p className="pitstop__time">
            {time !== null ? formatTime(time) : '0.000'}
            <span>s</span>
          </p>
          <p className={phase === 'jump' || phase === 'miss' ? 'pitstop__status is-bad' : 'pitstop__status'}>
            {phase === 'idle' ? 'Ready when you are.' : null}
            {phase === 'lights' ? 'Wait for it…' : null}
            {phase === 'go' ? 'GO!' : null}
            {phase === 'jump' ? 'Jump start! Wait for the lights to go out.' : null}
            {phase === 'miss' ? 'Wrong square!' : null}
            {phase === 'done' && time !== null ? (
              <>
                <strong>{rating(time)}</strong>
                {best !== null && time <= best ? ' · New personal best!' : ''}
                <br />
                F1 drivers react in about 0.200s
              </>
            ) : null}
          </p>
          <p className="pitstop__best">Personal best: {best !== null ? `${formatTime(best)}s` : '—'}</p>
          {running ? null : (
            <button type="button" className="choose pitstop__start" onClick={start}>
              <span>{phase === 'idle' ? 'Start' : 'Go again'}</span>
            </button>
          )}
        </div>

        <PitStopLeaderboard result={phase === 'done' ? time : null} />
      </section>
    </Cabinet>
  )
}

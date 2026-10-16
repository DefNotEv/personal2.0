import { useCallback, useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const LOADING_LINES = [
  'loading characters...',
  'downloading images...',
  'writing bad jokes...',
] as const

const STEP_MS = 520
const FIRST_STEP_MS = 480
const HOLD_MS = 800

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [lit, setLit] = useState(() => (prefersReducedMotion() ? LOADING_LINES.length : 0))
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    onFinish()
  }, [onFinish])

  useEffect(() => {
    const timeouts: number[] = []

    if (prefersReducedMotion()) {
      timeouts.push(window.setTimeout(finish, 900))
    } else {
      LOADING_LINES.forEach((_, index) => {
        timeouts.push(
          window.setTimeout(() => setLit(index + 1), FIRST_STEP_MS + index * STEP_MS),
        )
      })
      timeouts.push(
        window.setTimeout(finish, FIRST_STEP_MS + LOADING_LINES.length * STEP_MS + HOLD_MS),
      )
    }

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout))
    }
  }, [finish])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      finish()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish])

  return (
    <div className="loader" onClick={finish} role="status" aria-live="polite">
      <div className="loader__panel">
        <h1 className="loader__kicker">Now loading</h1>
        <p className="sr-only">{LOADING_LINES[lit - 1] ?? 'Loading'}</p>
        <ul className="loader__log">
          {LOADING_LINES.map((line, index) => (
            <li key={line} className={index < lit ? 'is-lit' : undefined}>
              {line}
            </li>
          ))}
        </ul>
        <div className="loader__track" aria-hidden="true">
          <div
            className="loader__fill"
            style={{ width: `${(lit / LOADING_LINES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { preloadImage, siteImages, siteVideos, warmVideos } from './preload.ts'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const LOADING_LINES = [
  'loading characters...',
  'downloading images...',
  'writing bad jokes...',
] as const

const FONTS = [
  '560 1em Fraunces',
  '400 1em Outfit',
  '400 1em Speedway',
  '400 1em "Pinyon Script"',
  '400 1em Bulletin',
  '400 1em "Marketing Script"',
  '400 1em "Kids Alphabet"',
  '400 1em Graduate',
]

const IMAGES = siteImages()
const TOTAL = IMAGES.length + FONTS.length

// The log still plays out when everything is cached...
const MIN_MS = 1600
// ...and nobody gets stuck behind a file that never loads.
const MAX_MS = 20000
const HOLD_MS = 700
const TICK_MS = 50

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [loaded, setLoaded] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const finished = useRef(false)

  const ready = loaded >= TOTAL || elapsed >= MAX_MS
  const real = ready ? 1 : loaded / TOTAL
  const shown = prefersReducedMotion() ? real : Math.min(real, elapsed / MIN_MS)
  const lit = LOADING_LINES.filter((_, index) => shown >= (index + 1) / LOADING_LINES.length).length

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    onFinish()
  }, [onFinish])

  useEffect(() => {
    const done = () => setLoaded((count) => count + 1)
    IMAGES.forEach((src) => {
      preloadImage(src).then(done)
    })
    FONTS.forEach((font) => {
      document.fonts.load(font).catch(() => {}).then(done)
    })
  }, [])

  useEffect(() => {
    const start = performance.now()
    const tick = window.setInterval(() => setElapsed(performance.now() - start), TICK_MS)
    return () => window.clearInterval(tick)
  }, [])

  // Videos aren't worth holding the door for; the cards show their stills
  // until a video has arrived.
  useEffect(() => {
    if (ready) warmVideos(siteVideos())
  }, [ready])

  useEffect(() => {
    if (shown < 1) return
    const hold = window.setTimeout(finish, HOLD_MS)
    return () => window.clearTimeout(hold)
  }, [shown, finish])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      if (ready) finish()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish, ready])

  return (
    <div
      className="loader"
      onClick={() => {
        if (ready) finish()
      }}
      role="status"
      aria-live="polite"
    >
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
          <div className="loader__fill" style={{ width: `${shown * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

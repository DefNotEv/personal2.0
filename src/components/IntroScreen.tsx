import { useCallback, useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const HOLD_MS = 3800
const FADE_MS = 700

export function IntroScreen({
  onReveal,
  onGone,
}: {
  onReveal: () => void
  onGone: () => void
}) {
  const [leaving, setLeaving] = useState(false)
  const started = useRef(false)

  const leave = useCallback(() => {
    if (started.current) return
    started.current = true
    onReveal()
    if (prefersReducedMotion()) {
      onGone()
      return
    }
    setLeaving(true)
  }, [onGone, onReveal])

  useEffect(() => {
    const hold = window.setTimeout(leave, prefersReducedMotion() ? 2000 : HOLD_MS)
    return () => window.clearTimeout(hold)
  }, [leave])

  useEffect(() => {
    if (!leaving) return
    const gone = window.setTimeout(onGone, FADE_MS)
    return () => window.clearTimeout(gone)
  }, [leaving, onGone])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      leave()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [leave])

  return (
    <div
      className={leaving ? 'intro is-leaving' : 'intro'}
      onClick={leave}
    >
      <h1>
        <span className="intro__hello">Hi, I'm Evelyn.</span>
        <span className="intro__prompt">
          I have so many passions, it's hard to put myself in a box. Choose the
          version of me you want to meet!
        </span>
      </h1>
    </div>
  )
}

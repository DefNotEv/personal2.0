import { useCallback, useEffect, useRef, useState } from 'react'
import { CharacterProfile } from './components/CharacterProfile.tsx'
import { CharacterSelect } from './components/CharacterSelect.tsx'
import { IntroScreen } from './components/IntroScreen.tsx'
import { LoadingScreen } from './components/LoadingScreen.tsx'
import { PixelCursor } from './components/PixelCursor.tsx'
import { ThemeToggle } from './components/ThemeToggle.tsx'
import { characters } from './data/characters.ts'

type Screen = 'loading' | 'select' | 'profile'
type Curtain = 'in' | 'out'

const FADE_OUT_MS = 700
const HOLD_MS = 140
const FADE_IN_MS = 760

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [loading, setLoading] = useState(true)
  const [intro, setIntro] = useState(false)
  const [curtain, setCurtain] = useState<Curtain | null>(null)
  const handoffStarted = useRef(false)
  const [index, setIndex] = useState(() =>
    Math.max(
      characters.findIndex((character) => character.id === 'all-around'),
      0,
    ),
  )

  const showRoster = useCallback(() => setScreen('select'), [])
  const showProfile = useCallback(() => setScreen('profile'), [])
  const hideIntro = useCallback(() => setIntro(false), [])

  const beginHandoff = useCallback(() => {
    if (handoffStarted.current) return
    handoffStarted.current = true
    if (prefersReducedMotion()) {
      setIntro(true)
      setLoading(false)
      return
    }
    setCurtain('in')
  }, [])

  useEffect(() => {
    if (curtain !== 'in') return
    const reveal = window.setTimeout(() => {
      setIntro(true)
      setLoading(false)
      setCurtain('out')
    }, FADE_OUT_MS + HOLD_MS)
    return () => window.clearTimeout(reveal)
  }, [curtain])

  useEffect(() => {
    if (curtain !== 'out') return
    const clear = window.setTimeout(() => setCurtain(null), FADE_IN_MS)
    return () => window.clearTimeout(clear)
  }, [curtain])

  return (
    <>
    <main>
      {screen === 'select' ? (
        <CharacterSelect index={index} onIndex={setIndex} onConfirm={showProfile} />
      ) : null}
      {screen === 'profile' ? (
        <CharacterProfile index={index} onIndex={setIndex} onBack={showRoster} />
      ) : null}
      {intro ? <IntroScreen onReveal={showRoster} onGone={hideIntro} /> : null}
      {loading ? <LoadingScreen onFinish={beginHandoff} /> : null}
      {curtain ? (
        <div className={curtain === 'in' ? 'curtain is-in' : 'curtain is-out'} />
      ) : null}
      <ThemeToggle hidden={screen === 'loading'} />
    </main>
    <PixelCursor />
    </>
  )
}

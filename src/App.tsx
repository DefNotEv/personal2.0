import { useCallback, useEffect, useRef, useState } from 'react'
import { BlogPage } from './components/BlogPage.tsx'
import { CharacterProfile } from './components/CharacterProfile.tsx'
import { CharacterSelect } from './components/CharacterSelect.tsx'
import { ContactPage } from './components/ContactPage.tsx'
import { IntroScreen } from './components/IntroScreen.tsx'
import { LoadingScreen } from './components/LoadingScreen.tsx'
import { PixelCursor } from './components/PixelCursor.tsx'
import { Sidebar } from './components/Sidebar.tsx'
import type { Page } from './components/Sidebar.tsx'
import { characters } from './data/characters.ts'

type Screen = 'loading' | 'select' | 'profile'
type Curtain = 'in' | 'out'

const FADE_OUT_MS = 700
const HOLD_MS = 140
const FADE_IN_MS = 760

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type Route = { page: Page; post?: string }

/** #/ → character select, #/blog, #/blog/<post>, #/contact. */
function routeFromHash(): Route {
  const [section, post] = window.location.hash.replace(/^#\/?/, '').split('/')
  if (section === 'blog') return { page: 'blog', post: post || undefined }
  if (section === 'contact') return { page: 'contact' }
  return { page: 'characters' }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [route, setRoute] = useState<Route>(routeFromHash)
  const page = route.page
  const [loading, setLoading] = useState(true)
  const [intro, setIntro] = useState(false)
  const [curtain, setCurtain] = useState<Curtain | null>(null)
  const handoffStarted = useRef(false)
  const pageRef = useRef(page)
  const [index, setIndex] = useState(() =>
    Math.max(
      characters.findIndex((character) => character.id === 'all-around'),
      0,
    ),
  )
  const character = characters[index] ?? characters[0]

  const showRoster = useCallback(() => setScreen('select'), [])
  const showProfile = useCallback(() => setScreen('profile'), [])
  const hideIntro = useCallback(() => setIntro(false), [])

  // The intro only greets people arriving at character select.
  const reveal = useCallback(() => {
    if (pageRef.current === 'characters') setIntro(true)
    else setScreen('select')
    setLoading(false)
  }, [])

  const beginHandoff = useCallback(() => {
    if (handoffStarted.current) return
    handoffStarted.current = true
    if (prefersReducedMotion()) {
      reveal()
      return
    }
    setCurtain('in')
  }, [reveal])

  useEffect(() => {
    function onHashChange() {
      const next = routeFromHash()
      pageRef.current = next.page
      setRoute(next)
      // Character Select always lands on the roster, not a character file.
      setScreen((current) => (current === 'profile' ? 'select' : current))
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (curtain !== 'in') return
    const timer = window.setTimeout(() => {
      reveal()
      setCurtain('out')
    }, FADE_OUT_MS + HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [curtain, reveal])

  useEffect(() => {
    if (curtain !== 'out') return
    const clear = window.setTimeout(() => setCurtain(null), FADE_IN_MS)
    return () => window.clearTimeout(clear)
  }, [curtain])

  const ready = screen !== 'loading'

  return (
    <>
      <Sidebar page={page} accent={character.accent} hidden={!ready} />
      <main className={ready ? 'shell' : undefined}>
        {ready && page === 'characters' && screen === 'select' ? (
          <CharacterSelect index={index} onIndex={setIndex} onConfirm={showProfile} />
        ) : null}
        {ready && page === 'characters' && screen === 'profile' ? (
          <CharacterProfile index={index} onBack={showRoster} />
        ) : null}
        {ready && page === 'blog' ? <BlogPage character={character} post={route.post} /> : null}
        {ready && page === 'contact' ? <ContactPage character={character} /> : null}
        {intro ? <IntroScreen onReveal={showRoster} onGone={hideIntro} /> : null}
        {loading ? <LoadingScreen onFinish={beginHandoff} /> : null}
        {curtain ? (
          <div className={curtain === 'in' ? 'curtain is-in' : 'curtain is-out'} />
        ) : null}
      </main>
      <PixelCursor />
    </>
  )
}

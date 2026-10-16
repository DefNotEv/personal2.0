import { useCallback, useEffect, useState } from 'react'
import { CharacterProfile } from './components/CharacterProfile.tsx'
import { CharacterSelect } from './components/CharacterSelect.tsx'
import { LoadingScreen } from './components/LoadingScreen.tsx'
import { characters } from './data/characters.ts'

type Screen = 'loading' | 'select' | 'profile'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [index, setIndex] = useState(() =>
    Math.max(
      characters.findIndex((character) => character.id === 'all-around'),
      0,
    ),
  )

  const showRoster = useCallback(() => setScreen('select'), [])
  const showProfile = useCallback(() => setScreen('profile'), [])

  useEffect(() => {
    if (screen === 'loading') {
      document.title = 'Loading...'
      return
    }
    if (screen === 'select') {
      document.title = 'Choose your character — Evelyn'
      return
    }
    document.title = `${characters[index]?.name ?? 'Evelyn'} — Evelyn`
  }, [screen, index])

  return (
    <main>
      {screen === 'loading' ? <LoadingScreen onComplete={showRoster} /> : null}
      {screen === 'select' ? (
        <CharacterSelect index={index} onIndex={setIndex} onConfirm={showProfile} />
      ) : null}
      {screen === 'profile' ? (
        <CharacterProfile index={index} onIndex={setIndex} onBack={showRoster} />
      ) : null}
    </main>
  )
}

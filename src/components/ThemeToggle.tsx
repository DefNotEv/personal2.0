import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'evelyn-theme'

function readTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  const themeColor = document.querySelector('meta[name="theme-color"]')
  themeColor?.setAttribute('content', theme === 'light' ? '#d5dbe2' : '#12100e')
}

export function ThemeToggle({ hidden = false }: { hidden?: boolean }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = readTheme()
    applyTheme(initial)
    return initial
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function choose(next: Theme) {
    if (next === theme) return
    window.localStorage.setItem(STORAGE_KEY, next)

    const commit = () => {
      flushSync(() => setTheme(next))
      applyTheme(next)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = (
      document as Document & {
        startViewTransition?: (update: () => void) => void
      }
    ).startViewTransition

    if (!start || reduced) {
      commit()
      return
    }

    start.call(document, commit)
  }

  if (hidden) return null

  return (
    <div className="theme-toggle" role="group" aria-label="Color mode">
      <button
        type="button"
        aria-pressed={theme === 'light'}
        onClick={() => choose('light')}
      >
        Light
      </button>
      <button
        type="button"
        aria-pressed={theme === 'dark'}
        onClick={() => choose('dark')}
      >
        Dark
      </button>
    </div>
  )
}

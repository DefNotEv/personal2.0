import { useEffect, useState, type FormEvent } from 'react'
import { track } from '@vercel/analytics'

type Entry = { name: string; ms: number; player: string }
type Load = 'loading' | 'ready' | 'offline'

const PLAYER_KEY = 'pitstop-player'
const NAME_KEY = 'pitstop-name'
const ENDPOINT = '/api/leaderboard'

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function store(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private mode etc.: just not remembered.
  }
}

// Lets one browser hold one spot on the board, keeping its best time.
function playerId(): string {
  const existing = readStored(PLAYER_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  store(PLAYER_KEY, id)
  return id
}

const formatTime = (ms: number) => (ms / 1000).toFixed(3)

// 1ST, 2ND, 3RD, 4TH… like an old high-score screen.
function ordinal(place: number): string {
  if (place % 100 >= 11 && place % 100 <= 13) return `${place}TH`
  return `${place}${['TH', 'ST', 'ND', 'RD'][place % 10] ?? 'TH'}`
}

export function PitStopLeaderboard({ result }: { result: number | null }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [load, setLoad] = useState<Load>('loading')
  const [name, setName] = useState(() => readStored(NAME_KEY) ?? '')
  const [sending, setSending] = useState(false)
  // Tied to the run it's about, so a new run hides it.
  const [note, setNote] = useState<{ text: string; run: number } | null>(null)
  const [submitted, setSubmitted] = useState<number | null>(null)
  const [me] = useState(playerId)

  useEffect(() => {
    let cancelled = false
    fetch(ENDPOINT)
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((data: { entries: Entry[] }) => {
        if (cancelled) return
        setEntries(data.entries)
        setLoad('ready')
      })
      .catch(() => {
        if (!cancelled) setLoad('offline')
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (result === null || sending) return
    const run = result
    setSending(true)
    setNote(null)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), ms: run, player: me }),
      })
      const data: { entries?: Entry[]; rank?: number | null; error?: string } = await response.json()
      if (!response.ok || !data.entries) {
        setNote({ text: data.error ?? 'Could not submit. Try again.', run })
        return
      }
      store(NAME_KEY, name.trim())
      setEntries(data.entries)
      setLoad('ready')
      setSubmitted(run)
      setNote({ text: data.rank ? `You're #${data.rank} on the board.` : 'Submitted!', run })
      track('Pit stop', { result: 'submitted', rank: data.rank ?? 0 })
    } catch {
      setNote({ text: 'Could not submit. Try again.', run })
    } finally {
      setSending(false)
    }
  }

  const message = note !== null && note.run === result ? note.text : null
  const canSubmit = result !== null && submitted !== result && load !== 'offline'

  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      {canSubmit ? (
        <form className="leaderboard__form" onSubmit={submit}>
          <label htmlFor="leaderboard-name">Your name</label>
          <input
            id="leaderboard-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={20}
            autoComplete="nickname"
            spellCheck={false}
            placeholder="Name"
          />
          <button type="submit" className="choose" disabled={name.trim().length === 0 || sending}>
            <span>{sending ? 'Sending…' : 'Submit time'}</span>
          </button>
        </form>
      ) : null}
      {message ? (
        <p className="leaderboard__message" role="status">
          {message}
        </p>
      ) : null}

      <h2 id="leaderboard-title" className="leaderboard__title">
        <span aria-hidden="true">★</span> High scores <span aria-hidden="true">★</span>
      </h2>
      {load === 'loading' ? <p className="leaderboard__note">Loading…</p> : null}
      {load === 'offline' ? <p className="leaderboard__note">Leaderboard is offline right now.</p> : null}
      {load === 'ready' && entries.length === 0 ? (
        <p className="leaderboard__note">No times yet. Be the first!</p>
      ) : null}
      {entries.length > 0 ? (
        <ol className="leaderboard__list">
          {entries.map((entry, index) => (
            <li key={entry.player} className={entry.player === me ? 'is-me' : undefined}>
              <span className="leaderboard__rank">{ordinal(index + 1)}</span>
              <span className="leaderboard__name">{entry.name}</span>
              <span className="leaderboard__dots" aria-hidden="true" />
              <span className="leaderboard__time">{formatTime(entry.ms)}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  )
}

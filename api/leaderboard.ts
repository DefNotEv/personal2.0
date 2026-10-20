import { Redis } from '@upstash/redis'

// Keys come from the Upstash integration on Vercel (see .env.local for local dev).
const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? '',
  token: process.env.KV_REST_API_TOKEN ?? '',
})

const BOARD_KEY = 'pitstop:board'
const NAMES_KEY = 'pitstop:names'
const TOP = 10
const KEEP = 100
// Faster than this isn't a human reacting; slower isn't worth ranking.
const MIN_MS = 100
const MAX_MS = 5000
// Letters (any language), numbers, spaces and a little punctuation.
const NAME = /^[\p{L}\p{N}][\p{L}\p{N} .'_-]{0,19}$/u
const PLAYER = /^[a-z0-9-]{8,64}$/
// Caught anywhere in the name, even with spaces or punctuation in between.
const BLOCKED_PARTS = ['fuck', 'cunt', 'nigg', 'faggot', 'bitch', 'whore', 'slut', 'retard', 'penis', 'vagina', 'porn', 'hitler']
// Only caught as whole words, since they show up inside real names (Cassidy, Yamashita, Nazir).
const BLOCKED_WORDS = new Set(['ass', 'shit', 'dick', 'cock', 'fag', 'kys', 'sex', 'cum', 'tits', 'kkk', 'rape', 'nazi'])

const BLOCKED_LINE = "Alright bro, I'm going to pretend I didn't see that. Please submit a cleaner name."

function isBlocked(name: string): boolean {
  const lower = name.toLowerCase()
  const squashed = lower.replace(/[^\p{L}\p{N}]/gu, '')
  if (BLOCKED_PARTS.some((part) => squashed.includes(part))) return true
  return lower.split(/[^\p{L}\p{N}]+/u).some((word) => BLOCKED_WORDS.has(word))
}

type Entry = { name: string; ms: number; player: string }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

async function topEntries(): Promise<Entry[]> {
  const flat = await redis.zrange<(string | number)[]>(BOARD_KEY, 0, TOP - 1, { withScores: true })
  const players: string[] = []
  const scores: number[] = []
  for (let i = 0; i < flat.length; i += 2) {
    players.push(String(flat[i]))
    scores.push(Number(flat[i + 1]))
  }
  if (players.length === 0) return []
  const names = (await redis.hmget<Record<string, string>>(NAMES_KEY, ...players)) ?? {}
  return players.map((player, index) => ({
    player,
    ms: scores[index],
    name: String(names[player] ?? '???'),
  }))
}

export async function GET() {
  try {
    return json({ entries: await topEntries() })
  } catch {
    return json({ error: 'Leaderboard unavailable' }, 503)
  }
}

export async function POST(request: Request) {
  let body: { name?: unknown; ms?: unknown; player?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return json({ error: 'Bad request' }, 400)
  }

  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  const ms = typeof body.ms === 'number' ? Math.round(body.ms) : NaN
  const player = typeof body.player === 'string' ? body.player : ''

  if (!NAME.test(name)) return json({ error: 'Use up to 20 letters, numbers or spaces.' }, 400)
  if (isBlocked(name)) return json({ error: BLOCKED_LINE }, 400)
  if (!PLAYER.test(player)) return json({ error: 'Bad request' }, 400)
  if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) return json({ error: 'Time not accepted.' }, 400)

  try {
    // One submission every few seconds per visitor.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const allowed = await redis.set(`pitstop:rate:${ip}`, 1, { nx: true, ex: 5 })
    if (allowed === null) return json({ error: 'Slow down a sec, then try again.' }, 429)

    // LT keeps each player's best time; their name can still change.
    await redis.zadd(BOARD_KEY, { lt: true }, { score: ms, member: player })
    await redis.hset(NAMES_KEY, { [player]: name })
    await redis.zremrangebyrank(BOARD_KEY, KEEP, -1)

    const rank = await redis.zrank(BOARD_KEY, player)
    return json({ entries: await topEntries(), rank: rank === null ? null : rank + 1 })
  } catch {
    return json({ error: 'Leaderboard unavailable' }, 503)
  }
}

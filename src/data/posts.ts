import { marked } from 'marked'
import { characters } from './characters.ts'
import type { Character } from './characters.ts'

export type Post = {
  slug: string
  title: string
  /** YYYY-MM or YYYY-MM-DD, used for ordering. */
  date: string
  dateLabel: string
  /** The version of me the post belongs to; sets its colour and icon. */
  version: Character
  excerpt: string
  minutes: number
  html: string
}

// Each Markdown file in src/posts/ is a post; its file name is the URL slug.
const files = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function frontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { meta: {}, body: raw.trim() }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':')
    if (colon > 0) meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  return { meta, body: match[2].trim() }
}

function dateLabel(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month) return date
  const value = new Date(year, month - 1, day || 1)
  return value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    ...(day ? { day: 'numeric' } : {}),
  })
}

function toPost(path: string, raw: string): Post {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const { meta, body } = frontmatter(raw)
  const firstParagraph = body.split(/\r?\n\s*\r?\n/)[0] ?? ''
  const words = body.split(/\s+/).filter(Boolean).length
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    dateLabel: meta.date ? dateLabel(meta.date) : '',
    version: characters.find((character) => character.id === meta.version) ?? characters[0],
    excerpt: firstParagraph.replace(/[#*_`>]/g, '').trim(),
    minutes: Math.max(1, Math.round(words / 220)),
    html: marked.parse(body, { async: false }),
  }
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => toPost(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date))

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

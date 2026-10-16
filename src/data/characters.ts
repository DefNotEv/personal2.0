export type CharacterId =
  | 'motorsports'
  | 'events'
  | 'broadcast'
  | 'marketing'
  | 'childcare'
  | 'all-around'

export type Experience = {
  title: string
  org: string
  dates: string
  points: readonly string[]
}

export type Character = {
  id: CharacterId
  short: string
  name: string
  role: string
  strengths: readonly string[]
  weaknesses: readonly string[]
  years: number
  accent: string
  onAccent: string
  overlay?: string
  shades?: string
  icon: string
  label: string
  experiences: readonly Experience[]
}

// TODO: replace with real resume entries for each version.
const PLACEHOLDER_EXPERIENCES: readonly Experience[] = [
  {
    title: 'Role title',
    org: 'Organization',
    dates: 'Mon YYYY – Present',
    points: ['What you did', 'The impact it had'],
  },
  {
    title: 'Role title',
    org: 'Organization',
    dates: 'Mon YYYY – Mon YYYY',
    points: ['What you did', 'The impact it had'],
  },
]

export const characters: Character[] = [
  {
    id: 'all-around',
    short: 'All-Around',
    name: 'All-Around Evelyn',
    role: 'Just another human',
    strengths: ['Raptors ball knowledge', 'ESP32s', 'Making connections'],
    years: 19,
    weaknesses: [
      'Canto but can\'t speak Cantonese',
      'Light mode (i refuse to code this in)',
      'Spends half her money on Magic: The Gathering',
    ],
    accent: '#ff5c9a',
    onAccent: '#1a100e',
    icon: '⭐',
    label: 'me!',
    experiences: PLACEHOLDER_EXPERIENCES,
  },
  {
    id: 'motorsports',
    short: 'Motorsports',
    name: 'Motorsports Evelyn',
    role: 'Race Engineer',
    strengths: ['SOLIDWORKS', 'MATLAB', 'Quick decision-making'],
    weaknesses: [
      'Will lose temper at mansplainers',
      'Arvid Lindblad',
      "Can't name the F1 champions in chronological order",
    ],
    years: 2,
    accent: '#ff3b30',
    onAccent: '#1a100e',
    overlay: '/racing.png',
    icon: '🏎️',
    label: 'motorsports',
    experiences: PLACEHOLDER_EXPERIENCES,
  },
  {
    id: 'events',
    short: 'Events',
    name: 'Events Evelyn',
    role: 'Event Ops Intern',
    strengths: ['Crisis control', 'Spreadsheets', 'Running up 10 flights of stairs'],
    weaknesses: [
      'People who ask for more free stuff',
      '"We should add a poker event!"',
      'Wears jeans instead of dress pants',
    ],
    years: 4,
    accent: '#e0b15a',
    onAccent: '#1a100e',
    overlay: '/events.png',
    icon: '🎫',
    label: 'events',
    experiences: PLACEHOLDER_EXPERIENCES,
  },
  {
    id: 'broadcast',
    short: 'Broadcasting',
    name: 'Broadcasting Evelyn',
    role: 'Livestream Operator',
    strengths: ['Camera switching', 'Audio mixing', 'Staying calm on headset'],
    weaknesses: ["Murphy's Law", 'ProPresenter updates', "The company forgetting to turn on their mics"],
    years: 6,
    accent: '#3ad7ff',
    onAccent: '#062028',
    overlay: '/broadcasting.png',
    icon: '🎧',
    label: 'broadcasting',
    experiences: PLACEHOLDER_EXPERIENCES,
  },
  {
    id: 'marketing',
    short: 'Marketing',
    name: 'Marketing Evelyn',
    role: 'ABG CMO',
    strengths: ['Adobe Suite', 'Tapping into trends', 'SEO and optimization'],
    weaknesses: [
      '12-hour screen time on TikTok', '12-hour screen time on Instagram', '12-hour screen time on LinkedIn',
    ],
    years: 5,
    accent: '#a970ff',
    onAccent: '#140c22',
    overlay: '/marketing-outfit.png',
    shades: '/marketing-shades.png',
    icon: '📱',
    label: 'marketing',
    experiences: PLACEHOLDER_EXPERIENCES,
  },
  {
    id: 'childcare',
    short: 'Childcare',
    name: 'Childcare Evelyn',
    role: 'Guardian',
    strengths: ['First aid', 'Lullabies', 'Nerf gun sharpshooter'],
    weaknesses: ['Will talk about Minecraft for hours', 'Watches paw patrol after the kids are done', 'The purple wiggle'],
    years: 9,
    accent: '#f0b429',
    onAccent: '#1a100e',
    overlay: '/childcare.png',
    icon: '🧸',
    label: 'childcare',
    experiences: PLACEHOLDER_EXPERIENCES,
  },
]

export function padNumber(value: number): string {
  return String(value).padStart(2, '0')
}

export function wrapIndex(index: number, delta: number): number {
  return (index + delta + characters.length) % characters.length
}

export type Direction = 1 | -1

export function slideDirection(from: number, to: number, length: number): Direction {
  const delta = to - from
  if (Math.abs(delta) > length / 2) return delta > 0 ? -1 : 1
  return delta >= 0 ? 1 : -1
}

export function moveRosterIndex(index: number, key: string): number {
  if (key === 'ArrowRight') return wrapIndex(index, 1)
  if (key === 'ArrowLeft') return wrapIndex(index, -1)
  return index
}

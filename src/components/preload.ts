import { characters } from '../data/characters.ts'
import { PHOTO } from './CharacterCutout.tsx'

// Decoded images are kept referenced so the browser keeps them ready to paint.
const keptImages: HTMLImageElement[] = []
const videoBlobs = new Map<string, string>()

/** Every image a transition can show: the photo, outfit layers and card stills. */
export function siteImages(): string[] {
  const urls = new Set<string>([PHOTO])
  for (const character of characters) {
    const layers = [
      character.overlay,
      character.shades,
      ...(character.layers ?? []),
      character.cardArt?.image,
    ]
    for (const url of layers) if (url) urls.add(url)
  }
  return [...urls]
}

export function siteVideos(): string[] {
  return characters.flatMap((character) =>
    character.cardArt?.video ? [character.cardArt.video] : [],
  )
}

/**
 * Resolves once the image has downloaded (or failed). Decoding starts then
 * too, but isn't awaited: decode() stalls in background tabs.
 */
export function preloadImage(src: string): Promise<void> {
  const image = new Image()
  image.decoding = 'async'
  keptImages.push(image)
  return new Promise((resolve) => {
    image.onload = () => {
      image.decode().catch(() => {})
      resolve()
    }
    image.onerror = () => resolve()
    image.src = src
  })
}

/** Downloads videos one at a time in the background, after the images. */
export async function warmVideos(sources: readonly string[]): Promise<void> {
  for (const src of sources) {
    if (videoBlobs.has(src)) continue
    try {
      const response = await fetch(src)
      if (!response.ok) continue
      videoBlobs.set(src, URL.createObjectURL(await response.blob()))
    } catch {
      // The card falls back to streaming the original file.
    }
  }
}

/** The downloaded copy of a video if it's ready, otherwise the original URL. */
export function videoSource(src: string): string {
  return videoBlobs.get(src) ?? src
}

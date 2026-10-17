import { useEffect, useRef, useState } from 'react'
import type { CardArt } from '../data/characters.ts'
import { videoSource } from './preload.ts'

function frame(position?: string, zoom?: number) {
  return {
    objectPosition: position,
    transform: zoom ? `scale(${zoom})` : undefined,
    transformOrigin: position,
  }
}

// Still image underneath; the video sits on top only while it plays, so the
// still shows through once it ends (or if it can't play).
export function CardArtMedia({
  art,
  active,
  delay = 0,
}: {
  art: CardArt
  active: boolean
  /** Wait before playing, e.g. until a flipping card faces the viewer. */
  delay?: number
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const framing = frame(art.position, art.zoom)
  const videoFraming = frame(art.videoPosition ?? art.position, art.videoZoom ?? art.zoom)

  useEffect(() => {
    const element = video.current
    if (!element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!active || reduced) {
      element.pause()
      return
    }
    element.currentTime = 0
    const start = window.setTimeout(() => {
      element.play().catch(() => {})
    }, delay)
    return () => window.clearTimeout(start)
  }, [active, delay])

  return (
    <>
      <img
        className="mtg__media"
        src={art.image}
        alt=""
        style={framing}
      />
      {art.video ? (
        <video
          ref={video}
          className={playing ? 'mtg__media mtg__video is-playing' : 'mtg__media mtg__video'}
          src={videoSource(art.video)}
          style={videoFraming}
          muted
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}
    </>
  )
}

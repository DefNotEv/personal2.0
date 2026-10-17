import { useRef, useState } from 'react'
import type { Photo } from '../data/characters.ts'

export function PhotoCarousel({ photos, label }: { photos: readonly Photo[]; label: string }) {
  const [current, setCurrent] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = photos.length

  function go(delta: number) {
    setCurrent((index) => (index + delta + count) % count)
  }

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onTouchStart={(event) => {
        touchX.current = event.changedTouches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchX.current
        const end = event.changedTouches[0]?.clientX
        touchX.current = null
        if (start == null || end == null || Math.abs(end - start) < 40) return
        go(end < start ? 1 : -1)
      }}
    >
      <div className="carousel__frame">
        <div
          className="carousel__track"
          style={{ transform: `translateX(${current * -100}%)` }}
          aria-live="polite"
        >
          {photos.map((photo, index) => (
            <figure
              key={photo.src}
              className="carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={index !== current}
            >
              <img src={photo.src} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} />
            </figure>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              className="carousel__arrow is-prev"
              aria-label="Previous photo"
              onClick={() => go(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5 8 12l7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel__arrow is-next"
              aria-label="Next photo"
              onClick={() => go(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="carousel__dots">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className="carousel__dot"
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === current}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

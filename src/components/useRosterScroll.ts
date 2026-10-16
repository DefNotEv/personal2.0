import { useEffect, useRef } from 'react'
import { wrapIndex } from '../data/characters.ts'

export function useRosterScroll(index: number, onIndex: (index: number) => void) {
  const wheelLock = useRef(false)

  useEffect(() => {
    function onWheel(event: WheelEvent) {
      event.preventDefault()
      if (wheelLock.current) return
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX
      if (Math.abs(delta) < 4) return
      wheelLock.current = true
      onIndex(wrapIndex(index, delta > 0 ? 1 : -1))
      window.setTimeout(() => {
        wheelLock.current = false
      }, 260)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [index, onIndex])
}

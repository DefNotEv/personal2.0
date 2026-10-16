import { useEffect, useRef } from 'react'

const ARROW: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [0, 10],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [2, 11],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 12],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [4, 12],
  [5, 5],
  [5, 6],
  [5, 7],
  [5, 10],
  [5, 11],
  [5, 12],
  [6, 6],
  [6, 10],
]

const MARK: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [0, 1],
  [3, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [0, 3],
  [0, 4],
  [5, 0],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [5, 4],
  [6, 4],
  [7, 4],
]

function outline(cells: Array<[number, number]>): Array<[number, number]> {
  const filled = new Set(cells.map(([x, y]) => `${x},${y}`))
  const edge: Array<[number, number]> = []
  for (const [x, y] of cells) {
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const key = `${x + dx},${y + dy}`
      if (filled.has(key)) continue
      filled.add(key)
      edge.push([x + dx, y + dy])
    }
  }
  return edge
}

const ARROW_SCALE = 2
const MARK_SCALE = 3
const ART_HEIGHT = 16

// The arrow is bottom-aligned with the taller mark, and each drawing is inset
// by one cell. Shift the cursor so the arrow's tip pixel sits on the pointer.
const HOTSPOT_X = ARROW_SCALE
const HOTSPOT_Y = ART_HEIGHT * (MARK_SCALE - ARROW_SCALE) + ARROW_SCALE

function PixelMark({
  cells,
  scale,
}: {
  cells: Array<[number, number]>
  scale: number
}) {
  const edge = outline(cells)
  return (
    <svg
      className="p1-cursor__art"
      width={10 * scale}
      height={ART_HEIGHT * scale}
      aria-hidden="true"
    >
      {edge.map(([x, y]) => (
        <rect
          key={`e-${x}-${y}`}
          x={(x + 1) * scale}
          y={(y + 1) * scale}
          width={scale}
          height={scale}
          fill="#f6f1e8"
        />
      ))}
      {cells.map(([x, y]) => (
        <rect
          key={`f-${x}-${y}`}
          x={(x + 1) * scale}
          y={(y + 1) * scale}
          width={scale}
          height={scale}
          fill="#16130f"
        />
      ))}
    </svg>
  )
}

export function PixelCursor() {
  const cursor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const node = cursor.current
    if (!node) return

    document.documentElement.classList.add('has-p1-cursor')

    // The scrollbar gutter can push the fixed box off the viewport origin.
    let originX = 0
    let originY = 0
    let lastX = 0
    let lastY = 0

    function place() {
      if (!node) return
      node.style.transform = `translate3d(${lastX - originX - HOTSPOT_X}px, ${lastY - originY - HOTSPOT_Y}px, 0)`
    }

    function measure() {
      if (!node) return
      const transform = node.style.transform
      node.style.transform = 'none'
      const box = node.getBoundingClientRect()
      originX = box.left
      originY = box.top
      node.style.transform = transform
      place()
    }

    function move(event: MouseEvent) {
      if (!node) return
      lastX = event.clientX
      lastY = event.clientY
      place()
      node.dataset.visible = 'true'
    }

    function hide(event: MouseEvent) {
      if (!node || event.relatedTarget) return
      node.dataset.visible = 'false'
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseout', hide)
    return () => {
      document.documentElement.classList.remove('has-p1-cursor')
      window.removeEventListener('resize', measure)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseout', hide)
    }
  }, [])

  return (
    <div className="p1-cursor" ref={cursor} aria-hidden="true">
      <PixelMark cells={ARROW} scale={ARROW_SCALE} />
      <PixelMark cells={MARK} scale={MARK_SCALE} />
    </div>
  )
}

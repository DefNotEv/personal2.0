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
      height={16 * scale}
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

    function move(event: MouseEvent) {
      if (!node) return
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      node.dataset.visible = 'true'
    }

    function hide(event: MouseEvent) {
      if (event.relatedTarget) return
      node.dataset.visible = 'false'
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseout', hide)
    return () => {
      document.documentElement.classList.remove('has-p1-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseout', hide)
    }
  }, [])

  return (
    <div className="p1-cursor" ref={cursor} aria-hidden="true">
      <PixelMark cells={ARROW} scale={2} />
      <PixelMark cells={MARK} scale={3} />
    </div>
  )
}

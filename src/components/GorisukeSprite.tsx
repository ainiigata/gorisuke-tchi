import { getSpriteForStage, getViewBox } from '../logic/sprites/spriteData'

interface Props {
  stage: number
  isDead: boolean
  size?: number
}

export function GorisukeSprite({ stage, isDead, size = 128 }: Props) {
  const rects = getSpriteForStage(stage, isDead)
  const viewBox = getViewBox(stage)
  const [, , vw, vh] = viewBox.split(' ').map(Number)
  const height = Math.round((size / vw) * vh)
  const animClass = isDead ? 'sprite-dead' : stage === 0 ? 'sprite-egg' : 'sprite-idle'

  return (
    <svg
      width={size}
      height={height}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      aria-label="ゴリスケっち"
      className={animClass}
    >
      {rects.map((r) => (
        <rect
          key={`${r.x}-${r.y}-${r.fill}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill={r.fill}
          opacity={r.opacity ?? 1}
        />
      ))}
    </svg>
  )
}

import { GorisukeSprite } from './GorisukeSprite'
import { STAGE_NAMES } from '../logic/sprites/spriteData'

interface Props {
  stage: number
  onClose: () => void
}

export function LevelUpModal({ stage, onClose }: Props) {
  const name = STAGE_NAMES[Math.min(stage, STAGE_NAMES.length - 1)]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <div className="flex flex-col items-center gap-5 text-center px-8" onClick={e => e.stopPropagation()}>
        <p className="text-accent font-mono text-xs tracking-[0.3em] animate-pulse">
          ✦ LEVEL UP ✦
        </p>

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl scale-150" />
          <div className="relative animate-bounce">
            <GorisukeSprite stage={stage} isDead={false} size={160} />
          </div>
        </div>

        <div className="mt-2">
          <p className="text-white font-mono text-3xl tracking-wide">{name}</p>
          <p className="text-white/40 text-sm mt-1 font-mono">Stage {stage}</p>
        </div>

        <p className="text-white/25 text-xs mt-4 font-mono">タップして続ける</p>
      </div>
    </div>
  )
}

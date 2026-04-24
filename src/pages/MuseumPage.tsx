import { useMuseumStore } from '../stores/museumStore'
import { GorisukeSprite } from '../components/GorisukeSprite'

const EVOLUTION_LABELS: Record<string, string> = {
  muscle: '💪 筋肉派', scholar: '📚 学者派', gourmet: '🍽 グルメ派',
  zen: '🧘 仙人派', balanced: '✨ バランス型',
}

export function MuseumPage() {
  const { entries } = useMuseumStore()

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-accent font-mono pt-2">図鑑 — 歴代ゴリスケ</h2>
      {entries.length === 0 && (
        <p className="text-white/20 text-sm text-center py-12">まだ記録がありません</p>
      )}
      {[...entries].reverse().map((e, i) => {
        const g = e.gorilla
        const days = g.diedAt
          ? Math.floor((g.diedAt - g.bornAt) / 86400000)
          : 0
        return (
          <div key={i} className="bg-white/5 rounded-2xl p-4 flex gap-4">
            <GorisukeSprite stage={e.finalStage} isDead={true} size={64} />
            <div className="flex flex-col gap-1">
              <p className="text-white font-mono">{g.name} <span className="text-white/30 text-xs">第{g.generation}世代</span></p>
              <p className="text-white/60 text-xs">Stage {e.finalStage}  {e.evolutionType ? EVOLUTION_LABELS[e.evolutionType] : ''}</p>
              <p className="text-white/40 text-xs">生存 {days} 日</p>
              <p className="text-red-400/60 text-xs">
                {g.causeOfDeath === 'hunger' ? '空腹死' : g.causeOfDeath === 'neglect' ? 'サボり死' : ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useMuseumStore } from '../stores/museumStore'
import { GorisukeSprite } from '../components/GorisukeSprite'
import { STAGE_NAMES } from '../logic/sprites/spriteData'

const EVOLUTION_LABELS: Record<string, string> = {
  muscle:   '💪 筋肉派',
  scholar:  '📚 学者派',
  gourmet:  '🍽 グルメ派',
  zen:      '🧘 仙人派',
  balanced: '✨ バランス型',
}

function fmt(date: number) {
  return new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function MuseumPage() {
  const { entries } = useMuseumStore()

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <h2 className="text-accent font-mono pt-2">図鑑 — 歴代ゴリスケ</h2>
      {entries.length === 0 && (
        <p className="text-white/20 text-sm text-center py-12">まだ記録がありません</p>
      )}
      {[...entries].reverse().map((e, i) => {
        const g = e.gorilla
        const isRetired = e.retiredAt != null
        const stageName = STAGE_NAMES[Math.min(e.finalStage, STAGE_NAMES.length - 1)]

        return (
          <div key={i} className="bg-white/5 rounded-2xl p-4 flex flex-col gap-4">

            {/* ヘッダー */}
            <div className="flex items-center gap-4">
              <GorisukeSprite stage={e.finalStage} isDead={!isRetired} size={80} />
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono text-lg">{g.name}</p>
                  <span className="text-white/30 text-xs">第{g.generation}世代</span>
                </div>
                <p className="text-accent text-sm font-mono">
                  {isRetired ? '👑' : '💀'} {stageName}
                  {e.evolutionType ? `  ${EVOLUTION_LABELS[e.evolutionType]}` : ''}
                </p>
                <p className="text-white/40 text-xs">
                  {fmt(g.bornAt)} 〜 {fmt(isRetired ? e.retiredAt! : g.diedAt ?? Date.now())}
                </p>
              </div>
            </div>

            {/* 達成記録グリッド */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-xl px-3 py-2">
                <p className="text-white/40 mb-1">一緒に過ごした日々</p>
                <p className="text-white font-mono text-base">{e.daysLived ?? Math.floor((Date.now() - g.bornAt) / 86400000)}<span className="text-white/40 ml-1">日</span></p>
              </div>
              <div className="bg-white/5 rounded-xl px-3 py-2">
                <p className="text-white/40 mb-1">積んだ経験値</p>
                <p className="text-white font-mono text-base">{(e.totalExp ?? g.exp).toLocaleString()}<span className="text-white/40 ml-1">EXP</span></p>
              </div>
              <div className="bg-white/5 rounded-xl px-3 py-2">
                <p className="text-white/40 mb-1">ルーティーン達成</p>
                <p className="text-white font-mono text-base">{e.totalRoutinesCompleted}<span className="text-white/40 ml-1">回</span></p>
              </div>
              <div className="bg-white/5 rounded-xl px-3 py-2">
                <p className="text-white/40 mb-1">最長連続達成</p>
                <p className="text-white font-mono text-base">{e.longestStreak}<span className="text-white/40 ml-1">日</span></p>
              </div>
            </div>

            {/* 進化の歩み */}
            <div className="bg-white/5 rounded-xl px-3 py-2">
              <p className="text-white/40 text-xs mb-2">進化の歩み</p>
              <div className="flex items-center gap-1 flex-wrap">
                {Array.from({ length: e.finalStage + 1 }, (_, s) => (
                  <span key={s} className="flex items-center gap-1">
                    <span className={`text-xs ${s === e.finalStage ? 'text-accent font-bold' : 'text-white/50'}`}>
                      {STAGE_NAMES[s]}
                    </span>
                    {s < e.finalStage && <span className="text-white/20 text-xs">→</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* 結末 */}
            <p className={`text-xs ${isRetired ? 'text-yellow-400/70' : 'text-red-400/60'}`}>
              {isRetired
                ? '👑 大ゴリ王として旅立った'
                : g.causeOfDeath === 'hunger'
                  ? '💀 空腹で倒れた'
                  : g.causeOfDeath === 'neglect'
                    ? '💀 サボりすぎで力尽きた'
                    : ''}
            </p>
          </div>
        )
      })}
    </div>
  )
}

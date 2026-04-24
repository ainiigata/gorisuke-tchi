import { STAGE_NAMES } from '../logic/sprites/spriteData'
import { EXP_THRESHOLDS } from '../logic/evolutionEngine'

const sections = [
  {
    icon: '🦍',
    title: '基本の流れ',
    items: [
      '毎日ルーティーンをこなすと経験値（EXP）が貯まる',
      'EXPが増えるとゴリスケが進化する',
      '脳トレゲームを全問正解すると餌がもらえる',
      '餌を与えてお腹を満たしてあげよう',
    ],
  },
  {
    icon: '📋',
    title: 'ルーティーン',
    items: [
      '運動・勉強：+20 EXP',
      '食事・休息：+15 EXP',
      'カスタム：+10 EXP',
      '時間帯指定ありのルーティーンは時間内のみ達成可',
    ],
  },
  {
    icon: '🧠',
    title: '脳トレゲーム',
    items: [
      '全問正解すると餌がランダムでもらえる',
      '1問でも間違えると餌はもらえない',
      'ゲームの難易度が高いほどレアな餌が出やすい',
      'ステージが上がると新しいゲームが解放される',
    ],
  },
  {
    icon: '🍌',
    title: '餌・空腹',
    items: [
      'お腹は6時間ごとに15ずつ減る',
      'お腹が0になると1時間ごとにHP -5',
      'HPが0になるとゴリスケは倒れてしまう',
      '餌を与えてお腹を回復させよう',
    ],
  },
  {
    icon: '👑',
    title: '引退・図鑑',
    items: [
      '大ゴリ王（Stage 7）に達すると「お別れ」が可能',
      'お別れするとエンディングが流れ図鑑に記録される',
      '図鑑には歴代ゴリスケの記録が残る',
    ],
  },
]

export function HelpPage() {
  return (
    <div className="flex flex-col gap-6 p-4 pb-8">
      <h2 className="text-accent font-mono pt-2">使い方ガイド</h2>

      {/* 進化チャート */}
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-white/40 text-xs mb-3">進化チャート</p>
        <div className="flex flex-col gap-2">
          {STAGE_NAMES.map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/30 text-sm flex-shrink-0">
                ？
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-white/50 text-sm font-mono">
                  Stage {i}　<span className="text-white/20">？？？</span>
                </span>
                <span className="text-white/20 text-xs">
                  {EXP_THRESHOLDS[i].toLocaleString()} EXP〜
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* セクション */}
      {sections.map(s => (
        <div key={s.title} className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-white/70 text-sm font-mono">{s.icon} {s.title}</p>
          <ul className="flex flex-col gap-1.5">
            {s.items.map((item, i) => (
              <li key={i} className="text-white/50 text-xs flex gap-2">
                <span className="text-accent/60 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

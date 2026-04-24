import { useState } from 'react'
import { GorisukeSprite } from './GorisukeSprite'

interface Props {
  onDone: () => void
}

const SLIDES = [
  {
    stage: 0,
    title: 'ゴリスケっちへようこそ',
    body: 'ゴリラの「ゴリスケ」を育てる\n習慣管理アプリです。',
    icon: '👋',
  },
  {
    stage: 2,
    title: 'ルーティーンをこなすと成長',
    body: '毎日のルーティーンを達成すると\n経験値（EXP）が貯まり\nゴリスケが進化します。',
    icon: '📋',
  },
  {
    stage: 3,
    title: '脳トレで餌をゲット',
    body: '「脳トレ」タブのゲームを\n全問正解すると餌がもらえます。\n餌を与えてお腹を満たしてあげよう。',
    icon: '🍌',
  },
  {
    stage: 6,
    title: '放置するとお腹が減る',
    body: '6時間ごとに空腹度が下がります。\nお腹が0になるとHPが減り\nやがて倒れてしまいます。',
    icon: '⚠️',
  },
  {
    stage: 7,
    title: '大ゴリ王を目指せ！',
    body: '8段階の進化を経て\n最強の「大ゴリ王」へ。\nさあ、名前をつけてはじめよう！',
    icon: '👑',
  },
]

export function Onboarding({ onDone }: Props) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  const isLast = idx === SLIDES.length - 1

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d1a] gap-6 p-8">
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <GorisukeSprite stage={slide.stage} isDead={false} size={120} />

        <span className="text-3xl">{slide.icon}</span>

        <h2 className="text-accent text-xl font-mono text-center">{slide.title}</h2>

        <p className="text-white/60 text-sm text-center leading-relaxed whitespace-pre-line">
          {slide.body}
        </p>
      </div>

      {/* ドットインジケーター */}
      <div className="flex gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-accent w-5' : 'bg-white/20'}`}
          />
        ))}
      </div>

      <div className="flex gap-3 w-full">
        {idx > 0 && (
          <button
            className="flex-1 py-3 rounded-full bg-white/10 text-white/50 text-sm"
            onClick={() => setIdx(i => i - 1)}
          >
            戻る
          </button>
        )}
        <button
          className="flex-1 py-3 rounded-full bg-accent/30 text-accent font-mono text-sm"
          onClick={() => isLast ? onDone() : setIdx(i => i + 1)}
        >
          {isLast ? 'はじめる' : '次へ'}
        </button>
      </div>
    </div>
  )
}

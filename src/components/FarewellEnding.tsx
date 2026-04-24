import { useState, useEffect } from 'react'
import { GorisukeSprite } from './GorisukeSprite'
import { soundEngine } from '../logic/soundEngine'
import type { Gorilla } from '../types'

interface Props {
  gorilla: Gorilla
  totalRoutines: number
  longestStreak: number
  onComplete: () => void
}

const EVOLUTION_LABELS: Record<string, string> = {
  muscle:   '💪 筋肉ゴリラ',
  scholar:  '📚 学者ゴリラ',
  gourmet:  '🍖 美食ゴリラ',
  zen:      '🧘 禅ゴリラ',
  balanced: '⚖️ バランス型',
}

function formatDays(ms: number) {
  return Math.max(1, Math.floor(ms / 86_400_000))
}

export function FarewellEnding({ gorilla, totalRoutines, longestStreak, onComplete }: Props) {
  const [phase, setPhase] = useState<'title' | 'stats' | 'praise' | 'goodbye'>('title')

  useEffect(() => {
    soundEngine.playSFX('evolve')
    const t1 = setTimeout(() => setPhase('stats'),  2200)
    const t2 = setTimeout(() => setPhase('praise'), 5000)
    const t3 = setTimeout(() => setPhase('goodbye'), 9000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const days = formatDays(Date.now() - gorilla.bornAt)
  const evoLabel = gorilla.evolutionType ? EVOLUTION_LABELS[gorilla.evolutionType] : '✨ 伝説のゴリラ'

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 gap-6 p-8 text-center overflow-hidden">

      {/* 星くずエフェクト */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-yellow-300 opacity-0 animate-star"
            style={{
              left:  `${Math.random() * 90 + 5}%`,
              top:   `${Math.random() * 80 + 5}%`,
              fontSize: `${Math.random() * 12 + 8}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >★</span>
        ))}
      </div>

      {/* タイトルフェーズ */}
      {phase === 'title' && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <GorisukeSprite stage={7} isDead={false} size={168} />
          <h1 className="text-yellow-300 text-2xl font-bold font-mono mt-2">
            大ゴリ王 達成！
          </h1>
          <p className="text-white/60 text-sm">{gorilla.name}、最高の旅だった...</p>
        </div>
      )}

      {/* 統計フェーズ */}
      {(phase === 'stats' || phase === 'praise' || phase === 'goodbye') && (
        <div className="flex flex-col items-center gap-5 w-full animate-fade-in">
          <GorisukeSprite stage={7} isDead={false} size={120} />
          <h2 className="text-yellow-300 text-xl font-bold font-mono">{gorilla.name}</h2>
          <p className="text-white/50 text-xs">{evoLabel} · 第{gorilla.generation}世代</p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-sm">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-1">一緒に過ごした日々</p>
              <p className="text-white text-xl font-mono">{days}<span className="text-xs ml-1">日</span></p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-1">積んだ経験値</p>
              <p className="text-white text-xl font-mono">{gorilla.exp.toLocaleString()}<span className="text-xs ml-1">EXP</span></p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-1">こなしたルーティーン</p>
              <p className="text-white text-xl font-mono">{totalRoutines}<span className="text-xs ml-1">回</span></p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-1">最長連続達成</p>
              <p className="text-white text-xl font-mono">{longestStreak}<span className="text-xs ml-1">日</span></p>
            </div>
          </div>
        </div>
      )}

      {/* 賞賛メッセージ */}
      {(phase === 'praise' || phase === 'goodbye') && (
        <div className="flex flex-col gap-3 animate-fade-in max-w-xs">
          <p className="text-yellow-200 text-sm leading-relaxed">
            {days}日間、毎日向き合ってくれてありがとう。<br />
            {totalRoutines}回ものルーティーンを積み重ね、<br />
            {gorilla.name}は最強のゴリラになった。
          </p>
          <p className="text-white/50 text-xs leading-relaxed">
            この経験はきっと、あなた自身の力にもなっている。
          </p>
        </div>
      )}

      {/* お別れボタン */}
      {phase === 'goodbye' && (
        <button
          className="mt-2 px-10 py-4 bg-yellow-400/20 text-yellow-300 rounded-full font-mono text-sm border border-yellow-400/30 animate-fade-in"
          onClick={onComplete}
        >
          図鑑に刻んで、次の世代へ
        </button>
      )}
    </div>
  )
}

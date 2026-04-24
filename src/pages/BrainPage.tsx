import { useState } from 'react'
import { useGorillaStore } from '../stores/gorillaStore'
import { useBrainStore, type GameId } from '../stores/brainStore'
import { useFeedStore } from '../stores/feedStore'
import { rollGacha } from '../logic/gacha'
import { FeedGacha } from '../components/FeedGacha'
import { Arithmetic } from '../games/Arithmetic'
import { ColorRecognition } from '../games/ColorRecognition'
import { MemoryFlash } from '../games/MemoryFlash'
import { ReactionSpeed } from '../games/ReactionSpeed'
import { NumberSequence } from '../games/NumberSequence'
import { KanjiPuzzle } from '../games/KanjiPuzzle'
import { CalcChain } from '../games/CalcChain'
import { MemoryCard } from '../games/MemoryCard'
import type { FeedItem } from '../types'

const GAME_META: Record<GameId, { label: string; desc: string; difficulty: 1 | 2 | 3 }> = {
  arithmetic:      { label: '暗算',     desc: '計算問題 5問',      difficulty: 2 },
  colorRecognition:{ label: '色認識',   desc: 'ストループ 6問',    difficulty: 2 },
  memoryFlash:     { label: '瞬間記憶', desc: '数列を記憶 3問',    difficulty: 2 },
  reactionSpeed:   { label: '反応速度', desc: 'タイミングを計れ',  difficulty: 1 },
  numberSequence:  { label: '数列',     desc: '次の数字は？ 5問',  difficulty: 2 },
  kanjiPuzzle:     { label: '漢字',     desc: '読み方を選べ 5問',  difficulty: 2 },
  calcChain:       { label: '計算連鎖', desc: '優先順位に注意 5問', difficulty: 3 },
  memoryCard:      { label: '神経衰弱', desc: 'ペアを見つけよう',  difficulty: 3 },
}

const DIFFICULTY_STARS: Record<1 | 2 | 3, string> = { 1: '★☆☆', 2: '★★☆', 3: '★★★' }

const GAME_COMPONENTS: Record<GameId, React.ComponentType<{ onComplete: () => void }>> = {
  arithmetic: Arithmetic,
  colorRecognition: ColorRecognition,
  memoryFlash: MemoryFlash,
  reactionSpeed: ReactionSpeed,
  numberSequence: NumberSequence,
  kanjiPuzzle: KanjiPuzzle,
  calcChain: CalcChain,
  memoryCard: MemoryCard,
}

const ALL_GAMES = Object.keys(GAME_META) as GameId[]

export function BrainPage() {
  const { gorilla } = useGorillaStore()
  const { getUnlockedGames, incrementPlay } = useBrainStore()
  const { addFeed } = useFeedStore()
  const [playing, setPlaying] = useState<GameId | null>(null)
  const [reward, setReward] = useState<FeedItem | null>(null)

  const stage = gorilla?.stage ?? 0
  const unlocked = getUnlockedGames(stage)

  function handleComplete() {
    if (!playing) return
    incrementPlay(playing)
    const item = rollGacha(GAME_META[playing].difficulty)
    addFeed(item)
    setPlaying(null)
    setReward(item)
  }

  if (playing) {
    const GameComp = GAME_COMPONENTS[playing]
    return (
      <div className="p-4">
        <button className="text-white/40 text-sm mb-4" onClick={() => setPlaying(null)}>← 戻る</button>
        <h2 className="text-accent font-mono mb-4">{GAME_META[playing].label}</h2>
        <GameComp onComplete={handleComplete} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-accent font-mono pt-2">脳トレゲーム</h2>
      {ALL_GAMES.map(id => {
        const isUnlocked = unlocked.includes(id)
        const meta = GAME_META[id]
        return (
          <button
            key={id}
            disabled={!isUnlocked}
            onClick={() => isUnlocked && setPlaying(id)}
            className={`flex items-center gap-3 p-4 rounded-xl text-left ${
              isUnlocked ? 'bg-white/10 hover:bg-white/15' : 'bg-white/5 opacity-40'
            }`}
          >
            <span className="text-2xl">{isUnlocked ? '🧠' : '🔒'}</span>
            <div className="flex-1">
              <p className="text-white font-mono text-sm">{meta.label}</p>
              <p className="text-white/40 text-xs">{meta.desc}</p>
            </div>
            {isUnlocked && (
              <span className="text-xs text-yellow-400 font-mono">
                {DIFFICULTY_STARS[meta.difficulty]}
              </span>
            )}
          </button>
        )
      })}
      {reward && <FeedGacha item={reward} onClose={() => setReward(null)} />}
    </div>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GameId =
  | 'arithmetic' | 'colorRecognition'
  | 'memoryFlash' | 'reactionSpeed'
  | 'numberSequence' | 'kanjiPuzzle'
  | 'calcChain' | 'memoryCard'

const ALL_GAME_IDS: GameId[] = [
  'arithmetic', 'colorRecognition',
  'memoryFlash', 'reactionSpeed',
  'numberSequence', 'kanjiPuzzle',
  'calcChain', 'memoryCard',
]

const DEFAULT_PLAY_COUNT = Object.fromEntries(
  ALL_GAME_IDS.map(id => [id, 0])
) as Record<GameId, number>

interface BrainState {
  playCount: Record<GameId, number>
  incrementPlay: (id: GameId) => void
  getUnlockedGames: (stage: number) => GameId[]
}

const UNLOCK_TIERS: { minStage: number; games: GameId[] }[] = [
  { minStage: 0, games: ['arithmetic', 'colorRecognition'] },
  { minStage: 2, games: ['memoryFlash', 'reactionSpeed'] },
  { minStage: 4, games: ['numberSequence', 'kanjiPuzzle'] },
  { minStage: 6, games: ['calcChain', 'memoryCard'] },
]

export const useBrainStore = create<BrainState>()(
  persist(
    (set) => ({
      playCount: { ...DEFAULT_PLAY_COUNT },
      incrementPlay: (id) =>
        set(s => ({ playCount: { ...s.playCount, [id]: (s.playCount[id] ?? 0) + 1 } })),
      getUnlockedGames: (stage) =>
        UNLOCK_TIERS.filter(t => stage >= t.minStage).flatMap(t => t.games),
    }),
    { name: 'gorisuke-brain' },
  ),
)

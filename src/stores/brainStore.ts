import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GameId =
  | 'arithmetic' | 'colorRecognition'
  | 'memoryFlash' | 'reactionSpeed'
  | 'numberSequence' | 'kanjiPuzzle'
  | 'calcChain' | 'memoryCard'

interface BrainState {
  playCount: Record<GameId, number>
  incrementPlay: (id: GameId) => void
  getUnlockedGames: (stage: number) => GameId[]
}

const UNLOCK_MAP: Record<number, GameId[]> = {
  0: ['arithmetic', 'colorRecognition'],
  2: ['memoryFlash', 'reactionSpeed'],
  4: ['numberSequence', 'kanjiPuzzle'],
  6: ['calcChain', 'memoryCard'],
}

export const useBrainStore = create<BrainState>()(
  persist(
    (set, get) => ({
      playCount: {} as Record<GameId, number>,
      incrementPlay: (id) =>
        set(s => ({ playCount: { ...s.playCount, [id]: (s.playCount[id] ?? 0) + 1 } })),
      getUnlockedGames: (stage) => {
        const games: GameId[] = []
        for (const [minStage, ids] of Object.entries(UNLOCK_MAP)) {
          if (stage >= Number(minStage)) games.push(...ids)
        }
        return games
      },
    }),
    { name: 'gorisuke-brain' },
  ),
)

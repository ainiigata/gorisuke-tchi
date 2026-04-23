import { describe, it, expect } from 'vitest'
import { useBrainStore } from '../brainStore'

describe('getUnlockedGames', () => {
  it('stage 0 unlocks arithmetic and colorRecognition', () => {
    const games = useBrainStore.getState().getUnlockedGames(0)
    expect(games).toContain('arithmetic')
    expect(games).toContain('colorRecognition')
    expect(games).not.toContain('memoryFlash')
  })
  it('stage 2 additionally unlocks memoryFlash and reactionSpeed', () => {
    const games = useBrainStore.getState().getUnlockedGames(2)
    expect(games).toContain('arithmetic')
    expect(games).toContain('memoryFlash')
    expect(games).toContain('reactionSpeed')
    expect(games).not.toContain('numberSequence')
  })
  it('stage 7 unlocks all 8 games', () => {
    const games = useBrainStore.getState().getUnlockedGames(7)
    expect(games).toHaveLength(8)
  })
  it('stage 1 does not unlock stage 2 games', () => {
    const games = useBrainStore.getState().getUnlockedGames(1)
    expect(games).not.toContain('memoryFlash')
  })
})

describe('incrementPlay', () => {
  it('increments play count', () => {
    useBrainStore.setState({ playCount: { arithmetic: 0, colorRecognition: 0, memoryFlash: 0, reactionSpeed: 0, numberSequence: 0, kanjiPuzzle: 0, calcChain: 0, memoryCard: 0 } })
    useBrainStore.getState().incrementPlay('arithmetic')
    expect(useBrainStore.getState().playCount.arithmetic).toBe(1)
  })
})

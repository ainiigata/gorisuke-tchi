import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Gorilla } from '../types'
import { getStageForExp, determineEvolutionType } from '../logic/evolutionEngine'
import { calcHungerDelta, applyHealthTick } from '../logic/healthEngine'

interface GorillaState {
  gorilla: Gorilla | null
  hatchEgg: (name: string, generation: number) => void
  feedGorilla: (hungerRestore: number) => void
  tick: () => void
  killGorilla: (cause: 'neglect' | 'hunger') => void
  updateEvolutionType: (counts: { exercise: number; study: number; food: number; rest: number }) => void
  addExp: (amount: number) => void
  retireGorilla: () => void
}

function newGorilla(name: string, generation: number): Gorilla {
  return {
    id: crypto.randomUUID(),
    generation,
    name,
    stage: 0,
    evolutionType: null,
    hp: 100,
    hunger: 80,
    exp: 0,
    bornAt: Date.now(),
    diedAt: null,
    causeOfDeath: null,
    lastActiveAt: Date.now(),
  }
}

export const useGorillaStore = create<GorillaState>()(
  persist(
    (set) => ({
      gorilla: null,
      hatchEgg: (name, generation) => set({ gorilla: newGorilla(name, generation) }),
      feedGorilla: (hungerRestore) =>
        set(s => {
          if (!s.gorilla || s.gorilla.diedAt) return s
          const g = s.gorilla
          const newHunger = Math.min(100, g.hunger + hungerRestore)
          return { gorilla: { ...g, hunger: newHunger, lastActiveAt: Date.now() } }
        }),
      addExp: (amount) =>
        set(s => {
          if (!s.gorilla || s.gorilla.diedAt) return s
          const g = s.gorilla
          const newExp = g.exp + amount
          const newStage = getStageForExp(newExp)
          return { gorilla: { ...g, exp: newExp, stage: newStage, lastActiveAt: Date.now() } }
        }),
      tick: () =>
        set(s => {
          if (!s.gorilla || s.gorilla.diedAt) return s
          const g = s.gorilla
          const elapsed = Math.floor((Date.now() - g.lastActiveAt) / 1000)
          const hungerDelta = calcHungerDelta(elapsed)
          const { hp, hunger } = applyHealthTick(
            { hp: g.hp, hunger: g.hunger },
            0,
            hungerDelta,
            elapsed,
          )
          if (hp <= 0) {
            // ネグレクト死は外部から killGorilla('neglect') で実行（MainPage の日次評価ロジック）
            return { gorilla: { ...g, hp: 0, hunger, diedAt: Date.now(), causeOfDeath: 'hunger' as const, lastActiveAt: Date.now() } }
          }
          return { gorilla: { ...g, hp, hunger, lastActiveAt: Date.now() } }
        }),
      killGorilla: (cause) =>
        set(s => {
          if (!s.gorilla) return s
          return { gorilla: { ...s.gorilla, hp: 0, diedAt: Date.now(), causeOfDeath: cause } }
        }),
      retireGorilla: () => set({ gorilla: null }),
      updateEvolutionType: (counts) =>
        set(s => {
          if (!s.gorilla) return s
          const etype = determineEvolutionType(counts)
          return { gorilla: { ...s.gorilla, evolutionType: etype } }
        }),
    }),
    { name: 'gorisuke-gorilla' },
  ),
)

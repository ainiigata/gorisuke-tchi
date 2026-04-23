import type { EvolutionType } from '../types'

export const EXP_THRESHOLDS = [0, 80, 240, 480, 800, 1200, 1700, 2400]

export function getStageForExp(exp: number): number {
  for (let i = EXP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= EXP_THRESHOLDS[i]) return i
  }
  return 0
}

export function determineEvolutionType(counts: {
  exercise: number
  study: number
  food: number
  rest: number
}): EvolutionType {
  const max = Math.max(counts.exercise, counts.study, counts.food, counts.rest)
  const winners = Object.entries(counts).filter(([, v]) => v === max)
  if (winners.length > 1) return 'balanced'
  const key = winners[0][0]
  const map: Record<string, EvolutionType> = {
    exercise: 'muscle',
    study: 'scholar',
    food: 'gourmet',
    rest: 'zen',
  }
  return map[key]
}

export function calcExpReward(category: string): number {
  const base: Record<string, number> = {
    exercise: 20,
    study: 20,
    food: 15,
    rest: 15,
    custom: 10,
  }
  return base[category] ?? 10
}

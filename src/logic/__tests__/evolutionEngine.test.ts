import { describe, it, expect } from 'vitest'
import {
  EXP_THRESHOLDS,
  getStageForExp,
  determineEvolutionType,
  calcExpReward,
} from '../evolutionEngine'

describe('EXP_THRESHOLDS', () => {
  it('has 8 stages 0-7', () => {
    expect(EXP_THRESHOLDS).toHaveLength(8)
    expect(EXP_THRESHOLDS[0]).toBe(0)
    expect(EXP_THRESHOLDS[7]).toBe(2400)
  })
})

describe('getStageForExp', () => {
  it('returns 0 for exp < 80', () => {
    expect(getStageForExp(0)).toBe(0)
    expect(getStageForExp(79)).toBe(0)
  })
  it('returns 1 for exp 80-239', () => {
    expect(getStageForExp(80)).toBe(1)
    expect(getStageForExp(239)).toBe(1)
  })
  it('returns 7 for exp >= 2400', () => {
    expect(getStageForExp(2400)).toBe(7)
    expect(getStageForExp(9999)).toBe(7)
  })
})

describe('determineEvolutionType', () => {
  it('returns muscle when exercise is highest', () => {
    expect(determineEvolutionType({ exercise: 10, study: 3, food: 2, rest: 1 })).toBe('muscle')
  })
  it('returns scholar when study is highest', () => {
    expect(determineEvolutionType({ exercise: 1, study: 8, food: 2, rest: 2 })).toBe('scholar')
  })
  it('returns gourmet when food is highest', () => {
    expect(determineEvolutionType({ exercise: 0, study: 0, food: 5, rest: 1 })).toBe('gourmet')
  })
  it('returns zen when rest is highest', () => {
    expect(determineEvolutionType({ exercise: 0, study: 0, food: 0, rest: 7 })).toBe('zen')
  })
  it('returns balanced when tied', () => {
    expect(determineEvolutionType({ exercise: 5, study: 5, food: 5, rest: 5 })).toBe('balanced')
  })
})

describe('calcExpReward', () => {
  it('returns 20 for exercise', () => {
    expect(calcExpReward('exercise')).toBe(20)
  })
  it('returns 10 for custom', () => {
    expect(calcExpReward('custom')).toBe(10)
  })
  it('returns value in 10-20 range for any category', () => {
    const categories = ['exercise', 'study', 'food', 'rest', 'custom'] as const
    categories.forEach(c => {
      expect(calcExpReward(c)).toBeGreaterThanOrEqual(10)
      expect(calcExpReward(c)).toBeLessThanOrEqual(20)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { calcHungerDelta, calcHpDelta, applyHealthTick } from '../healthEngine'

describe('calcHungerDelta', () => {
  it('returns -15 every 6 hours (21600 seconds)', () => {
    expect(calcHungerDelta(21600)).toBe(-15)
    expect(calcHungerDelta(43200)).toBe(-30)
  })
  it('returns 0 for less than 6 hours', () => {
    expect(calcHungerDelta(3600)).toBe(0)
  })
  it('rounds down partial intervals', () => {
    expect(calcHungerDelta(25000)).toBe(-15)
  })
})

describe('calcHpDelta', () => {
  it('returns 0 when routineRate >= 0.5 or streak < 3', () => {
    expect(calcHpDelta(0.6, 1)).toBe(0)
  })
  it('returns -10 when rate < 0.5 and streak >= 3', () => {
    expect(calcHpDelta(0.4, 3)).toBe(-10)
  })
  it('returns -20 when rate = 0', () => {
    expect(calcHpDelta(0, 1)).toBe(-20)
  })
  it('returns -20 when rate = 0 regardless of streak', () => {
    expect(calcHpDelta(0, 5)).toBe(-20)
  })
})

describe('applyHealthTick', () => {
  it('clamps hp and hunger to 0', () => {
    const result = applyHealthTick({ hp: 5, hunger: 2 }, -15, -20)
    expect(result.hp).toBe(0)
    expect(result.hunger).toBe(0)
  })
  it('clamps hp and hunger to 100', () => {
    const result = applyHealthTick({ hp: 95, hunger: 90 }, 10, 20)
    expect(result.hp).toBe(100)
    expect(result.hunger).toBe(100)
  })
  it('applies hp damage from 0 hunger (-5/hr)', () => {
    const result = applyHealthTick({ hp: 50, hunger: 0 }, 0, 0, 3600)
    expect(result.hp).toBe(45)
  })
})

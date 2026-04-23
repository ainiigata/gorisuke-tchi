import { describe, it, expect, vi } from 'vitest'
import { rollGacha, FEED_TABLE } from '../gacha'

describe('FEED_TABLE', () => {
  it('has common/rare/legendary entries', () => {
    expect(FEED_TABLE.some(f => f.rarity === 'common')).toBe(true)
    expect(FEED_TABLE.some(f => f.rarity === 'rare')).toBe(true)
    expect(FEED_TABLE.some(f => f.rarity === 'legendary')).toBe(true)
  })
})

describe('rollGacha', () => {
  it('returns common when random < 0.70', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0)
    const item = rollGacha()
    expect(item.rarity).toBe('common')
    vi.restoreAllMocks()
  })
  it('returns rare when random 0.70-0.94', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.72).mockReturnValueOnce(0)
    const item = rollGacha()
    expect(item.rarity).toBe('rare')
    vi.restoreAllMocks()
  })
  it('returns rare at upper boundary (0.94)', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.94).mockReturnValueOnce(0)
    const item = rollGacha()
    expect(item.rarity).toBe('rare')
    vi.restoreAllMocks()
  })
  it('returns legendary when random >= 0.95', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.96).mockReturnValueOnce(0)
    const item = rollGacha()
    expect(item.rarity).toBe('legendary')
    vi.restoreAllMocks()
  })
  it('returned item has count=1', () => {
    const item = rollGacha()
    expect(item.count).toBe(1)
  })
})

import type { FeedItem } from '../types'

type FeedTemplate = Omit<FeedItem, 'count'>

export const FEED_TABLE: FeedTemplate[] = [
  { type: 'banana', rarity: 'common',    hungerRestore: 15, expBonus: 0  },
  { type: 'nut',    rarity: 'common',    hungerRestore: 10, expBonus: 5  },
  { type: 'berry',  rarity: 'common',    hungerRestore: 12, expBonus: 3  },
  { type: 'meat',   rarity: 'rare',      hungerRestore: 30, expBonus: 10 },
  { type: 'fish',   rarity: 'rare',      hungerRestore: 25, expBonus: 15 },
  { type: 'honey',  rarity: 'rare',      hungerRestore: 20, expBonus: 20 },
  { type: 'cake',   rarity: 'legendary', hungerRestore: 50, expBonus: 30 },
  { type: 'mystery',rarity: 'legendary', hungerRestore: 40, expBonus: 30 },
]

// difficulty 1: common 70% / rare 25% / legendary  5%
// difficulty 2: common 55% / rare 35% / legendary 10%
// difficulty 3: common 35% / rare 45% / legendary 20%
// difficulty 4: common 20% / rare 45% / legendary 35%
const THRESHOLDS: Record<1 | 2 | 3 | 4, { rare: number; legendary: number }> = {
  1: { rare: 0.70, legendary: 0.95 },
  2: { rare: 0.55, legendary: 0.90 },
  3: { rare: 0.35, legendary: 0.80 },
  4: { rare: 0.20, legendary: 0.65 },
}

export function rollGacha(difficulty: 1 | 2 | 3 | 4 = 1): FeedItem {
  const { rare, legendary } = THRESHOLDS[difficulty]
  const roll = Math.random()
  let pool: FeedTemplate[]
  if (roll < rare) {
    pool = FEED_TABLE.filter(f => f.rarity === 'common')
  } else if (roll < legendary) {
    pool = FEED_TABLE.filter(f => f.rarity === 'rare')
  } else {
    pool = FEED_TABLE.filter(f => f.rarity === 'legendary')
  }
  const pick = pool[Math.floor(Math.random() * pool.length)]
  return { ...pick, count: 1 }
}

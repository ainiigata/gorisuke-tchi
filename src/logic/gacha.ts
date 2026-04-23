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

export function rollGacha(): FeedItem {
  const rarityRoll = Math.random()
  let pool: FeedTemplate[]
  if (rarityRoll < 0.70) {
    pool = FEED_TABLE.filter(f => f.rarity === 'common')
  } else if (rarityRoll < 0.95) {
    pool = FEED_TABLE.filter(f => f.rarity === 'rare')
  } else {
    pool = FEED_TABLE.filter(f => f.rarity === 'legendary')
  }
  const pick = pool[Math.floor(Math.random() * pool.length)]
  return { ...pick, count: 1 }
}

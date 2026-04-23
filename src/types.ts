export interface Gorilla {
  id: string
  generation: number
  name: string
  stage: number
  evolutionType: 'muscle' | 'scholar' | 'gourmet' | 'zen' | 'balanced' | null
  hp: number
  hunger: number
  exp: number
  bornAt: number
  diedAt: number | null
  causeOfDeath: 'neglect' | 'hunger' | null
  lastActiveAt: number
}

export interface Routine {
  id: string
  title: string
  category: 'exercise' | 'study' | 'food' | 'rest' | 'custom'
  customCategoryName?: string
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  timeType: 'exact' | 'zone' | 'anytime'
  time?: string
  zone?: 'morning' | 'afternoon' | 'evening'
  expReward: number
}

export interface DailyLog {
  date: string
  completedIds: string[]
  totalExp: number
}

export interface FeedItem {
  type: 'banana' | 'meat' | 'honey' | 'nut' | 'berry' | 'fish' | 'cake' | 'mystery'
  rarity: 'common' | 'rare' | 'legendary'
  hungerRestore: number
  expBonus: number
  count: number
}

export interface MuseumEntry {
  gorilla: Gorilla
  totalRoutinesCompleted: number
  longestStreak: number
  finalStage: number
  evolutionType: string | null
}

export type EvolutionType = 'muscle' | 'scholar' | 'gourmet' | 'zen' | 'balanced'
export type FeedType = FeedItem['type']
export type FeedRarity = FeedItem['rarity']

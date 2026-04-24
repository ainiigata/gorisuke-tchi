export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type EvolutionType = 'muscle' | 'scholar' | 'gourmet' | 'zen' | 'balanced'

export interface Gorilla {
  id: string
  generation: number
  name: string
  stage: number
  evolutionType: EvolutionType | null
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
  days: DayOfWeek[]
  timeType: 'anytime' | 'zone' | 'range'
  zone?: 'morning' | 'afternoon' | 'evening'
  timeFrom?: string  // "06:00"
  timeTo?: string    // "06:10"
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
  count: number
}

export interface MuseumEntry {
  gorilla: Gorilla
  totalRoutinesCompleted: number
  longestStreak: number
  finalStage: number
  evolutionType: EvolutionType | null
  // 追加フィールド
  daysLived: number
  totalExp: number
  retiredAt: number | null  // nullなら死亡、値があれば引退
}

export type FeedType = FeedItem['type']
export type FeedRarity = FeedItem['rarity']

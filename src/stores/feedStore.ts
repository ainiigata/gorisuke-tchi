import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeedItem } from '../types'

interface FeedState {
  stock: FeedItem[]
  addFeed: (item: FeedItem) => void
  useFeed: (type: FeedItem['type']) => FeedItem | null
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      stock: [],
      addFeed: (item) =>
        set(s => {
          const existing = s.stock.find(f => f.type === item.type)
          if (existing) {
            return { stock: s.stock.map(f => f.type === item.type ? { ...f, count: f.count + 1 } : f) }
          }
          return { stock: [...s.stock, { ...item, count: 1 }] }
        }),
      useFeed: (type) => {
        const item = get().stock.find(f => f.type === type && f.count > 0)
        if (!item) return null
        set(s => ({
          stock: s.stock.map(f =>
            f.type === type ? { ...f, count: f.count - 1 } : f
          ).filter(f => f.count > 0),
        }))
        return item
      },
    }),
    { name: 'gorisuke-feed' },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MuseumEntry } from '../types'

interface MuseumState {
  entries: MuseumEntry[]
  addEntry: (entry: MuseumEntry) => void
}

export const useMuseumStore = create<MuseumState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set(s => ({ entries: [...s.entries, entry] })),
    }),
    { name: 'gorisuke-museum' },
  ),
)

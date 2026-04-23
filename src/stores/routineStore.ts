import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Routine, DailyLog } from '../types'

interface RoutineState {
  routines: Routine[]
  logs: DailyLog[]
  addRoutine: (r: Omit<Routine, 'id'>) => void
  removeRoutine: (id: string) => void
  completeRoutine: (id: string, date: string, expReward: number) => void
  getTodayLog: (date: string) => DailyLog | undefined
  getStreakDays: (date: string) => number
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: [],
      logs: [],
      addRoutine: (r) =>
        set(s => ({
          routines: [...s.routines, { ...r, id: crypto.randomUUID() }],
        })),
      removeRoutine: (id) =>
        set(s => ({ routines: s.routines.filter(r => r.id !== id) })),
      completeRoutine: (id, date, expReward) =>
        set(s => {
          const existing = s.logs.find(l => l.date === date)
          if (existing?.completedIds.includes(id)) return s
          const updated = existing
            ? { ...existing, completedIds: [...existing.completedIds, id], totalExp: existing.totalExp + expReward }
            : { date, completedIds: [id], totalExp: expReward }
          const logs = existing
            ? s.logs.map(l => l.date === date ? updated : l)
            : [...s.logs, updated]
          return { logs }
        }),
      getTodayLog: (date) => get().logs.find(l => l.date === date),
      getStreakDays: (date) => {
        const { logs } = get()
        let streak = 0
        const d = new Date(date)
        for (let i = 0; i < 30; i++) {
          const key = d.toISOString().slice(0, 10)
          const log = logs.find(l => l.date === key)
          if (log && log.completedIds.length > 0) streak++
          else if (i > 0) break
          d.setDate(d.getDate() - 1)
        }
        return streak
      },
    }),
    { name: 'gorisuke-routines' },
  ),
)

import { describe, it, expect } from 'vitest'
import { useRoutineStore } from '../routineStore'

describe('completeRoutine', () => {
  it('prevents double completion', () => {
    useRoutineStore.setState({ routines: [], logs: [] })
    useRoutineStore.getState().completeRoutine('r1', '2026-04-24', 20)
    useRoutineStore.getState().completeRoutine('r1', '2026-04-24', 20)
    const log = useRoutineStore.getState().getTodayLog('2026-04-24')
    expect(log?.totalExp).toBe(20)
    expect(log?.completedIds).toHaveLength(1)
  })
})

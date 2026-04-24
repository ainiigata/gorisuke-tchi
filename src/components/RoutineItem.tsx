import type { Routine } from '../types'

const CATEGORY_ICONS: Record<Routine['category'], string> = {
  exercise: '🏃',
  study: '📖',
  food: '🥗',
  rest: '😴',
  custom: '⭐',
}

interface Props {
  routine: Routine
  completed: boolean
  failed: boolean   // 時間帯を過ぎて未完了
  onToggle: (id: string) => void
}

export function RoutineItem({ routine, completed, failed, onToggle }: Props) {
  const canToggle = !completed && !failed

  const timeLabel =
    routine.timeType === 'range' && routine.timeFrom && routine.timeTo
      ? `${routine.timeFrom}〜${routine.timeTo}`
      : routine.timeType === 'zone'
      ? { morning: '午前', afternoon: '午後', evening: '夜' }[routine.zone!]
      : null

  return (
    <button
      onClick={() => canToggle && onToggle(routine.id)}
      disabled={!canToggle && !completed}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${
        completed
          ? 'bg-accent/20 text-white'
          : failed
          ? 'bg-red-900/20 text-white/30 line-through'
          : 'bg-white/5 text-white/60'
      }`}
    >
      <span className="text-lg">
        {completed ? '✓' : failed ? '✗' : '○'}
      </span>
      <span>{CATEGORY_ICONS[routine.category]}</span>
      <span className="flex-1 text-sm">{routine.title}</span>
      {timeLabel && (
        <span className={`text-xs ${failed ? 'text-red-400/60' : 'text-white/30'}`}>
          {timeLabel}
        </span>
      )}
      {!failed && (
        <span className="text-xs text-accent/60">+{routine.expReward}</span>
      )}
    </button>
  )
}

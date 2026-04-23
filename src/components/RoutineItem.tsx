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
  onToggle: (id: string) => void
}

export function RoutineItem({ routine, completed, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(routine.id)}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${
        completed ? 'bg-accent/20 text-white' : 'bg-white/5 text-white/60'
      }`}
    >
      <span className="text-lg">{completed ? '✓' : '○'}</span>
      <span>{CATEGORY_ICONS[routine.category]}</span>
      <span className="flex-1 text-sm">{routine.title}</span>
      <span className="text-xs text-accent/60">+{routine.expReward}</span>
    </button>
  )
}

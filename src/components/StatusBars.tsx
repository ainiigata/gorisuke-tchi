interface Props {
  hp: number
  hunger: number
  exp: number
  expToNext: number
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function StatusBars({ hp, hunger, exp, expToNext }: Props) {
  const expPct = expToNext > 0 ? Math.round((exp / expToNext) * 100) : 100
  const hpColor = hp > 50 ? 'bg-orange-400' : hp > 20 ? 'bg-yellow-400' : 'bg-red-500'
  const hungerColor = hunger > 50 ? 'bg-yellow-400' : hunger > 20 ? 'bg-orange-400' : 'bg-red-500'

  return (
    <div className="flex flex-col gap-2 text-xs font-mono w-full">
      <div className="flex items-center gap-2">
        <span className="w-8 text-right text-red-400">HP</span>
        <Bar value={hp} max={100} color={hpColor} />
        <span className="w-6 text-right">{hp}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-8 text-right text-yellow-400">腹</span>
        <Bar value={hunger} max={100} color={hungerColor} />
        <span className="w-6 text-right">{hunger}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-8 text-right text-blue-400">EXP</span>
        <Bar value={expPct} max={100} color="bg-blue-400" />
        <span className="w-6 text-right">{expPct}%</span>
      </div>
    </div>
  )
}

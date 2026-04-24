interface NumPadProps {
  value: string
  onChange: (v: string) => void
  allowNegative?: boolean
}

export function NumPad({ value, onChange, allowNegative = false }: NumPadProps) {
  function tap(d: string) { onChange(value + d) }
  function del() { onChange(value.slice(0, -1)) }
  function toggleSign() {
    if (value.startsWith('-')) onChange(value.slice(1))
    else if (value.length > 0) onChange('-' + value)
  }

  return (
    <div className="grid grid-cols-3 gap-2 w-52">
      {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(n => (
        <button
          key={n}
          onClick={() => tap(String(n))}
          className="py-4 bg-white/10 rounded-xl text-white font-mono text-2xl active:bg-white/25 transition-colors"
        >
          {n}
        </button>
      ))}
      {allowNegative ? (
        <button
          onClick={toggleSign}
          className="py-4 bg-white/10 rounded-xl text-white/60 font-mono text-xl active:bg-white/25 transition-colors"
        >
          ±
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={() => tap('0')}
        className="py-4 bg-white/10 rounded-xl text-white font-mono text-2xl active:bg-white/25 transition-colors"
      >
        0
      </button>
      <button
        onClick={del}
        className="py-4 bg-white/10 rounded-xl text-white/60 font-mono text-xl active:bg-white/25 transition-colors"
      >
        ⌫
      </button>
    </div>
  )
}

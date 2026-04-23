import { useState } from 'react'

interface Props {
  onComplete: () => void
}

const COLORS = [
  { name: 'あか', hex: '#ef4444' }, { name: 'あお', hex: '#3b82f6' },
  { name: 'きいろ', hex: '#eab308' }, { name: 'みどり', hex: '#22c55e' },
  { name: 'むらさき', hex: '#a855f7' }, { name: 'オレンジ', hex: '#f97316' },
]

function makeRound() {
  const target = COLORS[Math.floor(Math.random() * COLORS.length)]
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4)
  if (!shuffled.find(c => c.name === target.name)) shuffled[0] = target
  return { target, choices: shuffled.sort(() => Math.random() - 0.5) }
}

export function ColorRecognition({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [r, setR] = useState(makeRound)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const ROUNDS = 5

  function pick(name: string) {
    const correct = name === r.target.name
    setFeedback(correct)
    setTimeout(() => {
      setFeedback(null)
      if (round + 1 >= ROUNDS) {
        onComplete()
      } else {
        setRound(x => x + 1)
        setR(makeRound())
      }
    }, 500)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      <div className="w-24 h-24 rounded-2xl" style={{ background: r.target.hex }} />
      <p className="text-white/60 text-sm">この色の名前は？</p>
      {feedback !== null && (
        <p className={feedback ? 'text-green-400' : 'text-red-400'}>
          {feedback ? '✓ 正解!' : '✗ 不正解'}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 w-full">
        {r.choices.map(c => (
          <button
            key={c.name}
            className="bg-white/10 rounded-xl py-3 text-white font-mono"
            onClick={() => pick(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}

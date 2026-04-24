import { useState } from 'react'

interface Props {
  onComplete: () => void
}

const COLORS = [
  { name: 'あか',    hex: '#ef4444' },
  { name: 'あお',    hex: '#3b82f6' },
  { name: 'きいろ',  hex: '#eab308' },
  { name: 'みどり',  hex: '#22c55e' },
  { name: 'むらさき',hex: '#a855f7' },
  { name: 'オレンジ',hex: '#f97316' },
  { name: 'ピンク',  hex: '#ec4899' },
  { name: 'みずいろ',hex: '#38bdf8' },
]

function makeRound() {
  const ink  = COLORS[Math.floor(Math.random() * COLORS.length)]
  const others = COLORS.filter(c => c.name !== ink.name)
  const word = others[Math.floor(Math.random() * others.length)]

  const shuffled = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4)
  if (!shuffled.find(c => c.name === ink.name)) shuffled[0] = ink
  return { ink, word, choices: shuffled.sort(() => Math.random() - 0.5) }
}

export function ColorRecognition({ onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [r, setR]         = useState(makeRound)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const ROUNDS = 6

  function pick(name: string) {
    const correct = name === r.ink.name
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
      <p className="text-white/50 text-xs">文字の<span className="text-accent">色</span>を選べ（意味ではなく）</p>

      <div className="flex items-center justify-center h-20">
        <span
          className="font-mono font-bold select-none"
          style={{ color: r.ink.hex, fontSize: '3rem', letterSpacing: '0.05em' }}
        >
          {r.word.name}
        </span>
      </div>

      {feedback !== null && (
        <p className={feedback ? 'text-green-400' : 'text-red-400'}>
          {feedback ? '✓ 正解!' : `✗ ${r.ink.name} だった`}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 w-full">
        {r.choices.map(c => (
          <button
            key={c.name}
            className="bg-white/10 rounded-xl py-3 text-white font-mono flex items-center justify-center gap-2"
            onClick={() => pick(c.name)}
          >
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: c.hex }} />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}

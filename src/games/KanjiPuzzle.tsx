import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

const PAIRS = [
  { kanji: '山', reading: 'やま' }, { kanji: '川', reading: 'かわ' },
  { kanji: '木', reading: 'き' },   { kanji: '火', reading: 'ひ' },
  { kanji: '水', reading: 'みず' }, { kanji: '金', reading: 'きん' },
  { kanji: '土', reading: 'つち' }, { kanji: '月', reading: 'つき' },
  { kanji: '日', reading: 'ひ' },   { kanji: '年', reading: 'とし' },
]

function makeQ() {
  const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)]
  const wrongs = PAIRS.filter(p => p.reading !== pair.reading)
    .sort(() => Math.random() - 0.5).slice(0, 3)
  const choices = [...wrongs.map(p => p.reading), pair.reading].sort(() => Math.random() - 0.5)
  return { kanji: pair.kanji, answer: pair.reading, choices }
}

export function KanjiPuzzle({ onComplete }: Props) {
  const [q, setQ] = useState(makeQ)
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const perfectRef = useRef(true)
  const ROUNDS = 5

  function pick(r: string) {
    const correct = r === q.answer
    if (!correct) perfectRef.current = false
    soundEngine.playSFX(correct ? 'correct' : 'wrong')
    setFeedback(correct)
    setTimeout(() => {
      setFeedback(null)
      if (round + 1 >= ROUNDS) onComplete(perfectRef.current)
      else { setRound(x => x + 1); setQ(makeQ()) }
    }, 500)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      <p className="text-8xl font-mono">{q.kanji}</p>
      <p className="text-white/60 text-sm">読み方は？</p>
      {feedback !== null && <p className={feedback ? 'text-green-400' : 'text-red-400'}>{feedback ? '✓ 正解!' : `✗ 正解: ${q.answer}`}</p>}
      <div className="grid grid-cols-2 gap-3 w-full">
        {q.choices.map(c => (
          <button key={c} className="bg-white/10 rounded-xl py-3 text-white font-mono text-lg" onClick={() => pick(c)}>{c}</button>
        ))}
      </div>
    </div>
  )
}

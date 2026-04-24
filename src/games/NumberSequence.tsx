import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

function makeSeqQ() {
  const start = Math.floor(Math.random() * 10) + 1
  const step = Math.floor(Math.random() * 5) + 2
  const seq = Array.from({ length: 4 }, (_, i) => start + i * step)
  const answer = start + 4 * step
  return { seq, answer }
}

export function NumberSequence({ onComplete }: Props) {
  const [q, setQ] = useState(makeSeqQ)
  const [input, setInput] = useState('')
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const perfectRef = useRef(true)
  const ROUNDS = 5

  function submit() {
    const correct = Number(input) === q.answer
    if (!correct) perfectRef.current = false
    soundEngine.playSFX(correct ? 'correct' : 'wrong')
    setFeedback(correct)
    setTimeout(() => {
      setFeedback(null); setInput('')
      if (round + 1 >= ROUNDS) onComplete(perfectRef.current)
      else { setRound(r => r + 1); setQ(makeSeqQ()) }
    }, 600)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      <p className="text-white/60 text-sm">次の数字は？</p>
      <p className="text-3xl font-mono text-white">{q.seq.join(' → ')} → ?</p>
      {feedback !== null && <p className={feedback ? 'text-green-400' : 'text-red-400'}>{feedback ? '✓' : `✗ 正解: ${q.answer}`}</p>}
      <input
        type="number"
        className="bg-white/10 rounded-lg px-4 py-3 text-white text-2xl text-center w-32"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        autoFocus
      />
      <button className="px-8 py-3 bg-accent/30 text-accent rounded-full" onClick={submit}>答える</button>
    </div>
  )
}

import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

function makeQuestion() {
  const a = Math.floor(Math.random() * 20) + 1
  const b = Math.floor(Math.random() * 20) + 1
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let answer: number
  if (op === '+') answer = a + b
  else if (op === '-') answer = a - b
  else answer = a * b
  return { question: `${a} ${op} ${b} = ?`, answer }
}

export function Arithmetic({ onComplete }: Props) {
  const [q, setQ] = useState(makeQuestion)
  const [input, setInput] = useState('')
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const perfectRef = useRef(true)
  const ROUNDS = 5

  function submit() {
    if (Number(input) === q.answer) {
      soundEngine.playSFX('correct')
      setFeedback('correct')
      setTimeout(() => {
        setFeedback(null)
        setInput('')
        if (round + 1 >= ROUNDS) {
          onComplete(perfectRef.current)
        } else {
          setRound(r => r + 1)
          setQ(makeQuestion())
        }
      }, 500)
    } else {
      perfectRef.current = false
      soundEngine.playSFX('wrong')
      setFeedback('wrong')
      setTimeout(() => { setFeedback(null); setInput('') }, 600)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      <p className="text-3xl font-mono text-white">{q.question}</p>
      {feedback && (
        <p className={feedback === 'correct' ? 'text-green-400' : 'text-red-400'}>
          {feedback === 'correct' ? '✓ 正解!' : '✗ 不正解'}
        </p>
      )}
      <input
        type="number"
        className="bg-white/10 rounded-lg px-4 py-3 text-white text-2xl text-center w-32"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        autoFocus
      />
      <button
        className="px-8 py-3 bg-accent/30 text-accent rounded-full font-mono"
        onClick={submit}
      >
        答える
      </button>
    </div>
  )
}

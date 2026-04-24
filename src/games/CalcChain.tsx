import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'
import { NumPad } from '../components/NumPad'

interface Props {
  onComplete: (perfect: boolean) => void
}

type ChainType = 'addMul2' | 'mulAdd2' | 'mulSubMul' | 'addMulSub' | 'mulMulAdd' | 'divChain'

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeChain() {
  const types: ChainType[] = ['addMul2', 'mulAdd2', 'mulSubMul', 'addMulSub', 'mulMulAdd', 'divChain']
  const type = types[Math.floor(Math.random() * types.length)]

  let question: string
  let answer: number

  if (type === 'addMul2') {
    // a + b × c + d
    const a = rnd(5, 20), b = rnd(2, 9), c = rnd(2, 9), d = rnd(5, 20)
    answer = a + b * c + d
    question = `${a} + ${b} × ${c} + ${d}`
  } else if (type === 'mulAdd2') {
    // a × b + c × d
    const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), d = rnd(2, 9)
    answer = a * b + c * d
    question = `${a} × ${b} + ${c} × ${d}`
  } else if (type === 'mulSubMul') {
    // a × b - c × d (答えが正)
    const c = rnd(2, 6), d = rnd(2, 6)
    const a = rnd(c * d / 1 + 1, 12), b = rnd(2, 9)
    answer = a * b - c * d
    question = `${a} × ${b} - ${c} × ${d}`
  } else if (type === 'addMulSub') {
    // (a + b) × c - d
    const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 7), d = rnd(1, 20)
    answer = (a + b) * c - d
    question = `(${a} + ${b}) × ${c} - ${d}`
  } else if (type === 'mulMulAdd') {
    // a × b × c + d
    const a = rnd(2, 5), b = rnd(2, 5), c = rnd(2, 4), d = rnd(1, 20)
    answer = a * b * c + d
    question = `${a} × ${b} × ${c} + ${d}`
  } else {
    // a × b ÷ c + d （割り切れる保証）
    const c = rnd(2, 6)
    const quot = rnd(2, 9)
    const a = quot * c
    const b = rnd(2, 5)
    const d = rnd(1, 15)
    answer = (a * b) / c + d
    question = `${a} × ${b} ÷ ${c} + ${d}`
  }

  return { question: `${question} = ?`, answer }
}

export function CalcChain({ onComplete }: Props) {
  const [q, setQ] = useState(makeChain)
  const [input, setInput] = useState('')
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const perfectRef = useRef(true)
  const ROUNDS = 5

  function submit() {
    if (!input) return
    const correct = Number(input) === q.answer
    if (!correct) perfectRef.current = false
    soundEngine.playSFX(correct ? 'correct' : 'wrong')
    setFeedback(correct)
    setTimeout(() => {
      setFeedback(null); setInput('')
      if (round + 1 >= ROUNDS) onComplete(perfectRef.current)
      else { setRound(r => r + 1); setQ(makeChain()) }
    }, 600)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      <p className="text-white/50 text-xs">計算順序に注意！</p>
      <p className="text-2xl font-mono text-white leading-relaxed text-center">{q.question}</p>
      {feedback !== null && (
        <p className={feedback ? 'text-green-400' : 'text-red-400'}>
          {feedback ? '✓ 正解!' : `✗ 正解: ${q.answer}`}
        </p>
      )}
      <p className="text-3xl font-mono text-white min-h-10">{input || <span className="text-white/20">?</span>}</p>
      <NumPad value={input} onChange={setInput} />
      <button className="px-8 py-3 bg-accent/30 text-accent rounded-full" onClick={submit}>
        答える
      </button>
    </div>
  )
}

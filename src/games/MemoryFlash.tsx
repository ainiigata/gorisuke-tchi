import { useState, useEffect, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'
import { NumPad } from '../components/NumPad'

interface Props {
  onComplete: (perfect: boolean) => void
}

const SEQ_LEN = 8

function makeSeq() {
  return Array.from({ length: SEQ_LEN }, () => Math.floor(Math.random() * 9) + 1)
}

export function MemoryFlash({ onComplete }: Props) {
  const [phase, setPhase] = useState<'show' | 'input' | 'feedback'>('show')
  const [seq, setSeq] = useState<number[]>(makeSeq)
  const [input, setInput] = useState('')
  const [round, setRound] = useState(0)
  const perfectRef = useRef(true)
  const ROUNDS = 3

  useEffect(() => {
    if (phase === 'show') {
      const t = setTimeout(() => setPhase('input'), 2000)
      return () => clearTimeout(t)
    }
  }, [phase, round])

  function handleInput(v: string) {
    if (v.length > SEQ_LEN) return
    setInput(v)
    if (v.length === SEQ_LEN) {
      const correct = v === seq.join('')
      if (!correct) perfectRef.current = false
      soundEngine.playSFX(correct ? 'correct' : 'wrong')
      setPhase('feedback')
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          onComplete(perfectRef.current)
        } else {
          setSeq(makeSeq())
          setInput('')
          setRound(r => r + 1)
          setPhase('show')
        }
      }, 800)
    }
  }

  const correct = input === seq.join('')

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>

      {phase === 'show' && (
        <>
          <p className="text-white/60 text-sm">覚えてください</p>
          <p className="text-4xl font-mono text-white tracking-widest">{seq.join(' ')}</p>
        </>
      )}

      {phase === 'input' && (
        <>
          <p className="text-white/60 text-sm">数字を順番にタップ</p>
          <p className="text-3xl font-mono text-white tracking-widest min-h-10">
            {input || <span className="text-white/20">{'_ '.repeat(SEQ_LEN).trim()}</span>}
          </p>
          <NumPad value={input} onChange={handleInput} />
        </>
      )}

      {phase === 'feedback' && (
        <p className={correct ? 'text-green-400 text-2xl' : 'text-red-400 text-2xl'}>
          {correct ? '✓ 正解!' : `✗ 正解: ${seq.join(' ')}`}
        </p>
      )}
    </div>
  )
}

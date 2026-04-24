import { useState, useEffect } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: () => void
}

function makeSeq(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1)
}

export function MemoryFlash({ onComplete }: Props) {
  const [phase, setPhase] = useState<'show' | 'input' | 'feedback'>('show')
  const [seq] = useState(() => makeSeq(4))
  const [input, setInput] = useState('')
  const [round, setRound] = useState(0)
  const ROUNDS = 3

  useEffect(() => {
    if (phase === 'show') {
      const t = setTimeout(() => setPhase('input'), 2000)
      return () => clearTimeout(t)
    }
  }, [phase, round])

  function submit() {
    soundEngine.playSFX(input === seq.join('') ? 'correct' : 'wrong')
    setPhase('feedback')
    setTimeout(() => {
      setInput('')
      if (round + 1 >= ROUNDS) {
        onComplete()
      } else {
        setRound(r => r + 1)
        setPhase('show')
      }
    }, 700)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      {phase === 'show' && (
        <>
          <p className="text-white/60 text-sm">覚えてください</p>
          <p className="text-5xl font-mono text-white tracking-widest">{seq.join(' ')}</p>
        </>
      )}
      {phase === 'input' && (
        <>
          <p className="text-white/60 text-sm">数字を順番に入力</p>
          <input
            className="bg-white/10 rounded-lg px-4 py-3 text-white text-2xl text-center w-40"
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={seq.length}
            autoFocus
          />
          <button className="px-8 py-3 bg-accent/30 text-accent rounded-full" onClick={submit}>
            答える
          </button>
        </>
      )}
      {phase === 'feedback' && (
        <p className={input === seq.join('') ? 'text-green-400 text-2xl' : 'text-red-400 text-2xl'}>
          {input === seq.join('') ? '✓ 正解!' : `✗ 正解: ${seq.join('')}`}
        </p>
      )}
    </div>
  )
}

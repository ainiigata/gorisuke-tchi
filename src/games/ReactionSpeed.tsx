import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

export function ReactionSpeed({ onComplete }: Props) {
  const [phase, setPhase] = useState<'wait' | 'ready' | 'go' | 'result'>('wait')
  const [times, setTimes] = useState<number[]>([])
  const startRef = useRef<number>(0)
  const ROUNDS = 3

  function startRound() {
    setPhase('ready')
    const delay = 1000 + Math.random() * 2000
    setTimeout(() => {
      startRef.current = Date.now()
      setPhase('go')
    }, delay)
  }

  function tap() {
    if (phase === 'go') {
      soundEngine.playSFX('correct')
      const ms = Date.now() - startRef.current
      const next = [...times, ms]
      setTimes(next)
      if (next.length >= ROUNDS) {
        setPhase('result')
        setTimeout(() => onComplete(true), 1500)
      } else {
        setPhase('wait')
      }
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 p-6 min-h-64 cursor-pointer select-none"
      onClick={tap}
    >
      <p className="text-white/40 text-xs">{times.length} / {ROUNDS}</p>
      {phase === 'wait' && (
        <button className="px-8 py-3 bg-accent/30 text-accent rounded-full" onClick={e => { e.stopPropagation(); startRound() }}>
          タップして開始
        </button>
      )}
      {phase === 'ready' && <p className="text-yellow-400 text-xl">構えて...</p>}
      {phase === 'go' && <div className="w-32 h-32 rounded-full bg-green-400 animate-pulse flex items-center justify-center text-2xl">タップ!</div>}
      {phase === 'result' && (
        <p className="text-white">平均: {Math.round(times.reduce((a, b) => a + b, 0) / times.length)} ms</p>
      )}
    </div>
  )
}

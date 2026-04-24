import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

const PASS_MS = 900

function randomPos() {
  return {
    top:  20 + Math.random() * 50,
    left: 10 + Math.random() * 60,
  }
}

export function ReactionSpeed({ onComplete }: Props) {
  const [phase, setPhase] = useState<'wait' | 'ready' | 'go' | 'result'>('wait')
  const [times, setTimes] = useState<number[]>([])
  const [pos, setPos] = useState({ top: 40, left: 35 })
  const startRef = useRef<number>(0)
  const ROUNDS = 3

  function startRound() {
    setPhase('ready')
    const delay = 1000 + Math.random() * 2000
    setTimeout(() => {
      setPos(randomPos())
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
        const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length)
        setPhase('result')
        setTimeout(() => onComplete(avg < PASS_MS), 1500)
      } else {
        setPhase('wait')
      }
    }
  }

  const avg = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : null

  return (
    <div
      className="relative w-full min-h-80 select-none"
      onClick={tap}
    >
      <p className="text-white/40 text-xs text-center pt-4">{times.length} / {ROUNDS}</p>

      {phase === 'wait' && (
        <div className="flex justify-center mt-10">
          <button
            className="px-8 py-3 bg-accent/30 text-accent rounded-full"
            onClick={e => { e.stopPropagation(); startRound() }}
          >
            タップして開始
          </button>
        </div>
      )}

      {phase === 'ready' && (
        <p className="text-yellow-400 text-xl text-center mt-10">構えて...</p>
      )}

      {phase === 'go' && (
        <div
          className="absolute w-28 h-28 rounded-full bg-green-400 animate-pulse flex items-center justify-center text-2xl cursor-pointer"
          style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
        >
          タップ!
        </div>
      )}

      {phase === 'result' && avg !== null && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <p className="text-white text-lg">平均: {avg} ms</p>
          <p className={avg < PASS_MS ? 'text-green-400' : 'text-red-400'}>
            {avg < PASS_MS ? '✓ 合格!' : `✗ ${PASS_MS}ms以内が目標`}
          </p>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

const SYMBOLS = ['🍌', '🦍', '🎂', '🌟', '🔥', '💎', '🎯', '🎪', '🏆', '🍖']
const PAIRS = 8
const PREVIEW_MS = 3000
const FLIP_MS = 1000

function makeCards() {
  const pairs = SYMBOLS.slice(0, PAIRS)
  const all = [...pairs, ...pairs].sort(() => Math.random() - 0.5)
  return all.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }))
}

type Phase = 'preview' | 'play'

export function MemoryCard({ onComplete }: Props) {
  const [cards, setCards] = useState(makeCards)
  const [phase, setPhase] = useState<Phase>('preview')
  const [countdown, setCountdown] = useState(Math.ceil(PREVIEW_MS / 1000))
  const [selected, setSelected] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [misses, setMisses] = useState(0)
  const perfectRef = useRef(true)

  // プレビューフェーズ：全カード公開 → カウントダウン → 伏せる
  useEffect(() => {
    if (phase !== 'preview') return
    const tick = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(tick)
          setPhase('play')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [phase])

  useEffect(() => {
    if (phase === 'play' && cards.every(c => c.matched)) {
      setTimeout(() => onComplete(perfectRef.current), 500)
    }
  }, [cards, phase, onComplete])

  function flip(id: number) {
    if (phase !== 'play' || locked || cards[id].flipped || cards[id].matched) return
    const next = selected.length === 0 ? [id] : [...selected, id]
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c))

    if (next.length === 2) {
      setLocked(true)
      setSelected([])
      const [a, b] = next
      setTimeout(() => {
        setCards(cs => {
          if (cs[a].symbol === cs[b].symbol) {
            soundEngine.playSFX('correct')
            return cs.map(c => (c.id === a || c.id === b) ? { ...c, matched: true } : c)
          }
          perfectRef.current = false
          setMisses(m => m + 1)
          soundEngine.playSFX('wrong')
          return cs.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c)
        })
        setLocked(false)
      }, FLIP_MS)
    } else {
      setSelected(next)
    }
  }

  const matched = cards.filter(c => c.matched).length / 2

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      {phase === 'preview' ? (
        <p className="text-yellow-400 text-sm font-mono animate-pulse">
          覚えてください… {countdown}
        </p>
      ) : (
        <div className="flex justify-between w-full text-xs text-white/40">
          <span>{matched} / {PAIRS} ペア</span>
          <span>ミス {misses} 回</span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => {
          const show = phase === 'preview' || c.flipped || c.matched
          return (
            <button
              key={c.id}
              className={`w-16 h-16 rounded-xl text-2xl flex items-center justify-center transition-all duration-200
                ${show ? 'bg-accent/20' : 'bg-white/10'}
                ${c.matched ? 'opacity-40 scale-95' : ''}
                ${!show && phase === 'play' ? 'hover:bg-white/20 active:scale-95' : ''}`}
              onClick={() => flip(c.id)}
            >
              {show ? c.symbol : <span className="text-white/30 text-lg">？</span>}
            </button>
          )
        })}
      </div>

      {phase === 'preview' && (
        <p className="text-white/30 text-xs">場所を覚えておこう</p>
      )}
    </div>
  )
}

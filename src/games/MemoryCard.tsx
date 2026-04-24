import { useState, useEffect } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: () => void
}

const SYMBOLS = ['🍌', '🦍', '🎂', '🌟', '🔥', '💎', '🎯', '🎪']

function makeCards() {
  const pairs = SYMBOLS.slice(0, 6)
  const all = [...pairs, ...pairs].sort(() => Math.random() - 0.5)
  return all.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }))
}

export function MemoryCard({ onComplete }: Props) {
  const [cards, setCards] = useState(makeCards)
  const [selected, setSelected] = useState<number[]>([])
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (cards.every(c => c.matched)) setTimeout(onComplete, 500)
  }, [cards, onComplete])

  function flip(id: number) {
    if (locked || cards[id].flipped || cards[id].matched) return
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
          soundEngine.playSFX('wrong')
          return cs.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c)
        })
        setLocked(false)
      }, 800)
    } else {
      setSelected(next)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-white/40 text-xs">すべてのペアを見つけよう</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(c => (
          <button
            key={c.id}
            className={`w-16 h-16 rounded-xl text-2xl flex items-center justify-center transition-all ${
              c.flipped || c.matched ? 'bg-accent/20 text-white' : 'bg-white/10 text-transparent'
            } ${c.matched ? 'opacity-40' : ''}`}
            onClick={() => flip(c.id)}
          >
            {c.flipped || c.matched ? c.symbol : '?'}
          </button>
        ))}
      </div>
    </div>
  )
}

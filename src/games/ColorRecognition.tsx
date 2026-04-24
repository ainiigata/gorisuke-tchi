import { useState, useEffect, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

const COLORS = [
  { name: 'あか',     hex: '#ef4444' },
  { name: 'あお',     hex: '#3b82f6' },
  { name: 'きいろ',   hex: '#eab308' },
  { name: 'みどり',   hex: '#22c55e' },
  { name: 'むらさき', hex: '#a855f7' },
  { name: 'オレンジ', hex: '#f97316' },
  { name: 'ピンク',   hex: '#ec4899' },
  { name: 'みずいろ', hex: '#38bdf8' },
]

type QuestionType = 'ink' | 'word'

function makeRound() {
  const ink    = COLORS[Math.floor(Math.random() * COLORS.length)]
  const others = COLORS.filter(c => c.name !== ink.name)
  const word   = others[Math.floor(Math.random() * others.length)]
  const qtype: QuestionType = Math.random() < 0.5 ? 'ink' : 'word'
  const correct = qtype === 'ink' ? ink : word

  const pool = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4)
  if (!pool.find(c => c.name === correct.name)) pool[0] = correct
  return { ink, word, qtype, correct, choices: pool.sort(() => Math.random() - 0.5) }
}

const TIME_LIMIT_MS = 3000
const ROUNDS = 6

export function ColorRecognition({ onComplete }: Props) {
  const [round, setRound]       = useState(0)
  const [r, setR]               = useState(makeRound)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [timeUp, setTimeUp]     = useState(false)
  const answeredRef = useRef(false)
  const perfectRef  = useRef(true)

  useEffect(() => {
    answeredRef.current = false
    setTimeUp(false)

    const id = setTimeout(() => {
      if (answeredRef.current) return
      answeredRef.current = true
      setTimeUp(true)
      perfectRef.current = false
      soundEngine.playSFX('wrong')
      setFeedback(false)
      setTimeout(() => {
        setFeedback(null)
        setTimeUp(false)
        if (round + 1 >= ROUNDS) onComplete(perfectRef.current)
        else { answeredRef.current = false; setRound(x => x + 1); setR(makeRound()) }
      }, 800)
    }, TIME_LIMIT_MS)

    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  function pick(name: string) {
    if (answeredRef.current) return
    answeredRef.current = true

    const correct = name === r.correct.name
    if (!correct) perfectRef.current = false
    soundEngine.playSFX(correct ? 'correct' : 'wrong')
    setFeedback(correct)
    setTimeout(() => {
      setFeedback(null)
      if (round + 1 >= ROUNDS) onComplete(perfectRef.current)
      else { answeredRef.current = false; setRound(x => x + 1); setR(makeRound()) }
    }, 500)
  }

  const questionLabel = r.qtype === 'ink'
    ? <span>文字の<span className="text-accent font-bold">色</span>は？（意味ではなく）</span>
    : <span>文字の<span className="text-yellow-400 font-bold">意味</span>は？（色ではなく）</span>

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex items-center justify-between w-full">
        <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
        <p className="text-white/40 text-xs">{TIME_LIMIT_MS / 1000}秒</p>
      </div>

      {/* タイマーバー */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          key={round}
          className="h-full bg-accent rounded-full"
          style={{ animation: `timer-shrink ${TIME_LIMIT_MS}ms linear forwards` }}
        />
      </div>

      <p className="text-white/50 text-xs">{questionLabel}</p>

      <div className="flex items-center justify-center h-20">
        <span
          className="font-mono font-bold select-none"
          style={{ color: r.ink.hex, fontSize: '3rem', letterSpacing: '0.05em' }}
        >
          {r.word.name}
        </span>
      </div>

      {feedback !== null && (
        <p className={feedback ? 'text-green-400' : 'text-red-400'}>
          {feedback
            ? '✓ 正解!'
            : timeUp
            ? `⏰ 時間切れ… 正解は「${r.correct.name}」`
            : `✗ 正解は「${r.correct.name}」`}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 w-full">
        {r.choices.map(c => (
          <button
            key={c.name}
            disabled={answeredRef.current}
            className="bg-white/10 rounded-xl py-3 text-white font-mono flex items-center justify-center gap-2 disabled:opacity-40"
            onClick={() => pick(c.name)}
          >
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.hex }} />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}

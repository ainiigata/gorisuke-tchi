import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

const PAIRS = [
  // 小学低学年
  { kanji: '山', reading: 'やま' },   { kanji: '川', reading: 'かわ' },
  { kanji: '木', reading: 'き' },     { kanji: '火', reading: 'ひ' },
  { kanji: '水', reading: 'みず' },   { kanji: '月', reading: 'つき' },
  { kanji: '日', reading: 'ひ' },     { kanji: '年', reading: 'とし' },
  // 小学中学年
  { kanji: '金', reading: 'きん' },   { kanji: '土', reading: 'つち' },
  { kanji: '空', reading: 'そら' },   { kanji: '海', reading: 'うみ' },
  { kanji: '花', reading: 'はな' },   { kanji: '草', reading: 'くさ' },
  { kanji: '石', reading: 'いし' },   { kanji: '虫', reading: 'むし' },
  { kanji: '鳥', reading: 'とり' },   { kanji: '魚', reading: 'さかな' },
  // 小学高学年〜中学（紛らわしい音訓）
  { kanji: '明', reading: 'あかるい' }, { kanji: '安', reading: 'やすい' },
  { kanji: '強', reading: 'つよい' },  { kanji: '弱', reading: 'よわい' },
  { kanji: '重', reading: 'おもい' },  { kanji: '軽', reading: 'かるい' },
  { kanji: '深', reading: 'ふかい' },  { kanji: '浅', reading: 'あさい' },
  { kanji: '広', reading: 'ひろい' },  { kanji: '狭', reading: 'せまい' },
  { kanji: '速', reading: 'はやい' },  { kanji: '遅', reading: 'おそい' },
  { kanji: '暑', reading: 'あつい' },  { kanji: '寒', reading: 'さむい' },
  { kanji: '若', reading: 'わかい' },  { kanji: '老', reading: 'おいる' },
]

// 紛らわしい選択肢を優先的に混ぜるグループ
const CONFUSABLE: Record<string, string[]> = {
  'あつい':   ['あつい', 'あたたかい', 'つめたい', 'さむい'],
  'はやい':   ['はやい', 'おそい', 'すばやい', 'ちかい'],
  'おもい':   ['おもい', 'かるい', 'ふかい', 'あさい'],
  'あかるい': ['あかるい', 'くらい', 'あかい', 'しろい'],
}

function makeQ() {
  const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)]
  const confusable = CONFUSABLE[pair.reading]

  let choices: string[]
  if (confusable) {
    choices = [...confusable].sort(() => Math.random() - 0.5)
    if (!choices.includes(pair.reading)) choices[0] = pair.reading
  } else {
    const wrongs = PAIRS.filter(p => p.reading !== pair.reading)
      .sort(() => Math.random() - 0.5).slice(0, 3)
    choices = [...wrongs.map(p => p.reading), pair.reading].sort(() => Math.random() - 0.5)
  }

  return { kanji: pair.kanji, answer: pair.reading, choices: choices.slice(0, 4) }
}

export function KanjiPuzzle({ onComplete }: Props) {
  const [q, setQ] = useState(makeQ)
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const perfectRef = useRef(true)
  const ROUNDS = 6

  function pick(r: string) {
    const correct = r === q.answer
    if (!correct) perfectRef.current = false
    soundEngine.playSFX(correct ? 'correct' : 'wrong')
    setFeedback(correct)
    setTimeout(() => {
      setFeedback(null)
      if (round + 1 >= ROUNDS) onComplete(perfectRef.current)
      else { setRound(x => x + 1); setQ(makeQ()) }
    }, 500)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-white/40 text-xs">{round + 1} / {ROUNDS}</p>
      <p className="text-8xl font-mono">{q.kanji}</p>
      <p className="text-white/60 text-sm">訓読みは？</p>
      {feedback !== null && (
        <p className={feedback ? 'text-green-400' : 'text-red-400'}>
          {feedback ? '✓ 正解!' : `✗ 正解: ${q.answer}`}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 w-full">
        {q.choices.map(c => (
          <button key={c} className="bg-white/10 rounded-xl py-3 text-white font-mono text-lg" onClick={() => pick(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

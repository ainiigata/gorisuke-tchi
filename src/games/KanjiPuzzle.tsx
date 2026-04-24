import { useState, useRef } from 'react'
import { soundEngine } from '../logic/soundEngine'

interface Props {
  onComplete: (perfect: boolean) => void
}

const PAIRS = [
  // 高校レベル訓読み
  { kanji: '憂', reading: 'うれえる' },  { kanji: '慌', reading: 'あわてる' },
  { kanji: '惜', reading: 'おしむ' },    { kanji: '悔', reading: 'くやむ' },
  { kanji: '妬', reading: 'ねたむ' },    { kanji: '羨', reading: 'うらやむ' },
  { kanji: '慕', reading: 'したう' },    { kanji: '蔑', reading: 'さげすむ' },
  { kanji: '凌', reading: 'しのぐ' },    { kanji: '抗', reading: 'あらがう' },
  { kanji: '覆', reading: 'くつがえす' }, { kanji: '覗', reading: 'のぞく' },
  { kanji: '潜', reading: 'ひそむ' },    { kanji: '漂', reading: 'ただよう' },
  { kanji: '滲', reading: 'にじむ' },    { kanji: '霞', reading: 'かすむ' },
  { kanji: '朽', reading: 'くちる' },    { kanji: '萎', reading: 'しおれる' },
  { kanji: '綻', reading: 'ほころびる' }, { kanji: '滾', reading: 'たぎる' },
  { kanji: '蠢', reading: 'うごめく' },  { kanji: '聳', reading: 'そびえる' },
  { kanji: '閃', reading: 'ひらめく' },  { kanji: '呻', reading: 'うめく' },
  { kanji: '嗅', reading: 'かぐ' },      { kanji: '掠', reading: 'かすめる' },
  { kanji: '抉', reading: 'えぐる' },    { kanji: '貪', reading: 'むさぼる' },
  { kanji: '蔓', reading: 'はびこる' },  { kanji: '逡', reading: 'しりごみする' },
]

// 紛らわしい選択肢グループ
const CONFUSABLE: Record<string, string[]> = {
  'うれえる':   ['うれえる', 'かなしむ', 'なやむ', 'くやむ'],
  'あわてる':   ['あわてる', 'おどろく', 'まごつく', 'うろたえる'],
  'おしむ':     ['おしむ', 'くやむ', 'いたむ', 'なげく'],
  'くやむ':     ['くやむ', 'おしむ', 'いたむ', 'なげく'],
  'ねたむ':     ['ねたむ', 'うらやむ', 'にくむ', 'そねむ'],
  'うらやむ':   ['うらやむ', 'ねたむ', 'そねむ', 'したう'],
  'くつがえす': ['くつがえす', 'ひっくりかえす', 'おおう', 'かぶせる'],
  'ひそむ':     ['ひそむ', 'ただよう', 'もぐる', 'かくれる'],
  'ただよう':   ['ただよう', 'ひそむ', 'ただれる', 'さまよう'],
  'にじむ':     ['にじむ', 'かすむ', 'にじる', 'ぼやける'],
  'かすむ':     ['かすむ', 'にじむ', 'くもる', 'ぼける'],
  'しおれる':   ['しおれる', 'ほころびる', 'くちる', 'なえる'],
  'ほころびる': ['ほころびる', 'しおれる', 'くちる', 'ほどける'],
  'うごめく':   ['うごめく', 'そびえる', 'ひらめく', 'うねる'],
  'ひらめく':   ['ひらめく', 'うごめく', 'またたく', 'きらめく'],
  'むさぼる':   ['むさぼる', 'はびこる', 'えぐる', 'かすめる'],
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
      <p className="text-white/60 text-sm">読み方は？（訓読み）</p>
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

import { useState } from 'react'
import type { Routine } from '../types'
import { useRoutineStore } from '../stores/routineStore'

const DAYS: { key: Routine['days'][number]; label: string }[] = [
  { key: 'mon', label: '月' }, { key: 'tue', label: '火' },
  { key: 'wed', label: '水' }, { key: 'thu', label: '木' },
  { key: 'fri', label: '金' }, { key: 'sat', label: '土' },
  { key: 'sun', label: '日' },
]

const CATEGORIES: { key: Routine['category']; label: string }[] = [
  { key: 'exercise', label: '🏃 運動' }, { key: 'study', label: '📖 学習' },
  { key: 'food', label: '🥗 食事' }, { key: 'rest', label: '😴 休息' },
  { key: 'custom', label: '⭐ カスタム' },
]

export function RoutinesPage() {
  const { routines, addRoutine, removeRoutine } = useRoutineStore()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Routine['category']>('exercise')
  const [days, setDays] = useState<Routine['days']>(['mon', 'tue', 'wed', 'thu', 'fri'])
  const [timeType, setTimeType] = useState<Routine['timeType']>('anytime')
  const [timeFrom, setTimeFrom] = useState('07:00')
  const [timeTo, setTimeTo] = useState('07:30')

  function toggleDay(d: Routine['days'][number]) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  function handleAdd() {
    if (!title.trim()) return
    const base = { title: title.trim(), category, days, expReward: 20 }
    if (timeType === 'range') {
      addRoutine({ ...base, timeType: 'range', timeFrom, timeTo })
    } else {
      addRoutine({ ...base, timeType: 'anytime' })
    }
    setTitle('')
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-accent font-mono pt-2">ルーティーン設定</h2>

      <div className="flex flex-col gap-3 bg-white/5 rounded-xl p-4">
        <input
          className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm"
          placeholder="ルーティーン名"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1 rounded-full text-xs ${category === c.key ? 'bg-accent/40 text-accent' : 'bg-white/10 text-white/40'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {DAYS.map(d => (
            <button
              key={d.key}
              onClick={() => toggleDay(d.key)}
              className={`flex-1 py-1 rounded text-xs ${days.includes(d.key) ? 'bg-accent/40 text-accent' : 'bg-white/10 text-white/30'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* 時間設定 */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeType('anytime')}
            className={`flex-1 py-1 rounded text-xs ${timeType === 'anytime' ? 'bg-accent/40 text-accent' : 'bg-white/10 text-white/40'}`}
          >
            いつでも
          </button>
          <button
            onClick={() => setTimeType('range')}
            className={`flex-1 py-1 rounded text-xs ${timeType === 'range' ? 'bg-accent/40 text-accent' : 'bg-white/10 text-white/40'}`}
          >
            時間帯指定
          </button>
        </div>

        {timeType === 'range' && (
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <input
              type="time"
              value={timeFrom}
              onChange={e => setTimeFrom(e.target.value)}
              className="bg-transparent text-white text-sm flex-1 outline-none"
            />
            <span className="text-white/30 text-sm">〜</span>
            <input
              type="time"
              value={timeTo}
              onChange={e => setTimeTo(e.target.value)}
              className="bg-transparent text-white text-sm flex-1 outline-none"
            />
          </div>
        )}

        <button
          className="bg-accent/30 text-accent rounded-lg py-2 text-sm font-mono"
          onClick={handleAdd}
        >
          追加
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {routines.map(r => (
          <div key={r.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm text-white/80">{r.title}</span>
            {r.timeType === 'range' && r.timeFrom && r.timeTo && (
              <span className="text-xs text-white/30">{r.timeFrom}〜{r.timeTo}</span>
            )}
            <span className="text-xs text-white/30">{r.days.join(' ')}</span>
            <button
              className="text-red-400/60 text-xs px-2"
              onClick={() => removeRoutine(r.id)}
            >
              削除
            </button>
          </div>
        ))}
        {routines.length === 0 && (
          <p className="text-white/20 text-sm text-center py-8">ルーティーンを追加してください</p>
        )}
      </div>
    </div>
  )
}

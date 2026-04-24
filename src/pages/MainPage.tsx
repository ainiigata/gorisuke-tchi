import { useEffect, useRef, useState } from 'react'
import { GorisukeSprite } from '../components/GorisukeSprite'
import { LevelUpModal } from '../components/LevelUpModal'
import { FarewellEnding } from '../components/FarewellEnding'
import { StatusBars } from '../components/StatusBars'
import { RoutineItem } from '../components/RoutineItem'
import { useGorillaStore } from '../stores/gorillaStore'
import { useRoutineStore } from '../stores/routineStore'
import { useFeedStore } from '../stores/feedStore'
import { useMuseumStore } from '../stores/museumStore'
import { EXP_THRESHOLDS } from '../logic/evolutionEngine'
import { STAGE_NAMES, STAGE_SIZES } from '../logic/sprites/spriteData'
import { requestNotificationPermission, checkAndNotify } from '../logic/notifications'
import { soundEngine } from '../logic/soundEngine'
import type { Routine } from '../types'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function todayDow(): Routine['days'][number] {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  return days[new Date().getDay()]
}

function timeStrToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

type RangeStatus = 'upcoming' | 'active' | 'passed'

function getRangeStatus(timeFrom: string, timeTo: string): RangeStatus {
  const now = getNowMinutes()
  const from = timeStrToMinutes(timeFrom)
  const to = timeStrToMinutes(timeTo)
  if (now < from) return 'upcoming'
  if (now <= to) return 'active'
  return 'passed'
}

export function MainPage() {
  const { gorilla, hatchEgg, feedGorilla, tick, addExp, retireGorilla } = useGorillaStore()
  const { routines, completeRoutine, getTodayLog, logs, getStreakDays } = useRoutineStore()
  const { stock, useFeed } = useFeedStore()
  const { entries, addEntry } = useMuseumStore()
  const [nameInput, setNameInput] = useState('')
  const [levelUpStage, setLevelUpStage] = useState<number | null>(null)
  const [showFarewell, setShowFarewell] = useState(false)
  const prevStageRef = useRef<number | undefined>(undefined)
  const prevDiedAtRef = useRef<number | null>(null)

  useEffect(() => {
    requestNotificationPermission()
    tick()
    const id = setInterval(() => tick(), 60_000)
    return () => clearInterval(id)
  }, [tick])

  useEffect(() => {
    if (gorilla && !gorilla.diedAt) checkAndNotify(gorilla.hp, gorilla.hunger)
  }, [gorilla])

  // 進化・死亡のサウンド
  useEffect(() => {
    if (!gorilla) return
    if (gorilla.diedAt && prevDiedAtRef.current === null) {
      soundEngine.playSFX('die')
    } else if (!gorilla.diedAt && prevStageRef.current !== undefined && gorilla.stage > prevStageRef.current) {
      soundEngine.playSFX('evolve')
      setLevelUpStage(gorilla.stage)
    }
    prevStageRef.current = gorilla.stage
    prevDiedAtRef.current = gorilla.diedAt
  }, [gorilla?.stage, gorilla?.diedAt])

  const today = todayKey()
  const dow = todayDow()
  const todayRoutines = routines.filter(r => r.days.includes(dow))
  const log = getTodayLog(today)
  const completedIds = log?.completedIds ?? []

  if (!gorilla) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <GorisukeSprite stage={0} isDead={false} size={128} />
        <h1 className="text-accent text-xl">ゴリスケっちを育てよう</h1>
        <input
          className="bg-white/10 rounded-lg px-4 py-2 text-white w-full text-center"
          placeholder="ゴリスケの名前"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <button
          className="px-8 py-3 bg-accent/30 text-accent rounded-full font-mono"
          onClick={() => { if (nameInput) { hatchEgg(nameInput, entries.length + 1); soundEngine.playSFX('hatch') } }}
        >
          スタート
        </button>
      </div>
    )
  }

  if (gorilla.diedAt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <GorisukeSprite stage={gorilla.stage} isDead={true} size={128} />
        <h2 className="text-red-400 text-xl">{gorilla.name}は旅立ちました...</h2>
        <p className="text-white/40 text-sm">
          {gorilla.causeOfDeath === 'hunger' ? '空腹で倒れました' : 'サボりすぎで弱ってしまいました'}
        </p>
        <button
          className="px-8 py-3 bg-accent/30 text-accent rounded-full font-mono"
          onClick={() => {
            addEntry({
              gorilla,
              totalRoutinesCompleted: logs.reduce((sum, l) => sum + l.completedIds.length, 0),
              longestStreak: getStreakDays(today),
              finalStage: gorilla.stage,
              evolutionType: gorilla.evolutionType,
            })
            setNameInput('')
          }}
        >
          図鑑に登録して次の世代へ
        </button>
      </div>
    )
  }

  const expToNext = EXP_THRESHOLDS[Math.min(gorilla.stage + 1, 7)]
  const totalStock = stock.reduce((s, f) => s + f.count, 0)
  const stageName = STAGE_NAMES[Math.min(gorilla.stage, STAGE_NAMES.length - 1)]
  const spriteSize = STAGE_SIZES[Math.min(gorilla.stage, STAGE_SIZES.length - 1)]

  const totalRoutinesCompleted = logs.reduce((sum, l) => sum + l.completedIds.length, 0)

  return (
    <>
    {showFarewell && (
      <FarewellEnding
        gorilla={gorilla}
        totalRoutines={totalRoutinesCompleted}
        longestStreak={getStreakDays(today)}
        onComplete={() => {
          addEntry({
            gorilla,
            totalRoutinesCompleted,
            longestStreak: getStreakDays(today),
            finalStage: gorilla.stage,
            evolutionType: gorilla.evolutionType,
          })
          setShowFarewell(false)
          setNameInput('')
          retireGorilla()
        }}
      />
    )}
    {levelUpStage !== null && (
      <LevelUpModal stage={levelUpStage} onClose={() => setLevelUpStage(null)} />
    )}
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-accent font-mono">{gorilla.name}</h1>
        <div className="text-right">
          <p className="text-white/70 text-xs font-mono">{stageName}</p>
          <p className="text-white/30 text-xs">Stage {gorilla.stage}</p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <GorisukeSprite stage={gorilla.stage} isDead={false} size={spriteSize} />
      </div>

      <StatusBars
        hp={gorilla.hp}
        hunger={gorilla.hunger}
        exp={gorilla.exp}
        expToNext={expToNext}
      />

      {totalStock > 0 && (
        <div className="flex flex-wrap gap-2">
          {stock.map(item => (
            <button
              key={item.type}
              className="bg-white/10 rounded-lg px-3 py-1 text-sm flex items-center gap-1"
              onClick={() => {
                const used = useFeed(item.type)
                if (used) { feedGorilla(used.hungerRestore); soundEngine.playSFX('feed') }
              }}
            >
              <span>🍌</span>
              <span className="text-white/60">{item.type}</span>
              <span className="text-accent">×{item.count}</span>
            </button>
          ))}
        </div>
      )}

      {gorilla.stage >= 7 && (
        <button
          className="w-full py-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-sm font-mono"
          onClick={() => setShowFarewell(true)}
        >
          👑 大ゴリ王のお別れ
        </button>
      )}

      <div>
        <p className="text-white/40 text-xs mb-2">TODAY'S ROUTINES</p>
        <div className="flex flex-col gap-2">
          {todayRoutines.length === 0 && (
            <p className="text-white/20 text-sm text-center py-4">今日のルーティーンがありません</p>
          )}
          {todayRoutines.map(r => {
            const completed = completedIds.includes(r.id)
            const failed =
              !completed &&
              r.timeType === 'range' &&
              r.timeFrom != null &&
              r.timeTo != null &&
              getRangeStatus(r.timeFrom, r.timeTo) === 'passed'

            return (
              <RoutineItem
                key={r.id}
                routine={r}
                completed={completed}
                failed={failed}
                onToggle={(id) => {
                  if (completed || failed) return
                  if (r.timeType === 'range' && r.timeFrom && r.timeTo) {
                    if (getRangeStatus(r.timeFrom, r.timeTo) !== 'active') return
                  }
                  completeRoutine(id, today, r.expReward)
                  addExp(r.expReward)
                  soundEngine.playSFX('complete')
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
    </>
  )
}

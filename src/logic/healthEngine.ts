export function calcHungerDelta(elapsedSeconds: number): number {
  const intervals = Math.floor(elapsedSeconds / 21600)
  return intervals === 0 ? 0 : intervals * -15
}

export function calcHpDelta(routineRate: number, neglectStreak: number): number {
  if (routineRate === 0) return -20
  if (routineRate < 0.5 && neglectStreak >= 3) return -10
  return 0
}

export function applyHealthTick(
  current: { hp: number; hunger: number },
  hpDelta: number,
  hungerDelta: number,
  elapsedSecondsForHungerHpDrain = 0,
): { hp: number; hunger: number } {
  const newHunger = Math.min(100, Math.max(0, current.hunger + hungerDelta))
  let hpFromHunger = 0
  if (current.hunger === 0) {
    hpFromHunger = -Math.floor(elapsedSecondsForHungerHpDrain / 3600) * 5
  }
  const newHp = Math.min(100, Math.max(0, current.hp + hpDelta + hpFromHunger))
  return { hp: newHp, hunger: newHunger }
}

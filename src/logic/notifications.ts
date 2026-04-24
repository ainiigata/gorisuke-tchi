export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const perm = await Notification.requestPermission()
  return perm === 'granted'
}

export function sendNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return
  new Notification(title, { body, icon: '/gorisuke-tchi/icon-192.png' })
}

export function checkAndNotify(hp: number, hunger: number) {
  if (hp < 20) sendNotification('⚠️ ゴリスケが危険！', `HP が ${hp} まで下がっています！`)
  else if (hunger < 30) sendNotification('🍌 ゴリスケがお腹を空かせています', '脳トレで餌を稼ごう！')
}

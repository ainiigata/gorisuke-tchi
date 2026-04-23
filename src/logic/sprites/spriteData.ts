// src/logic/sprites/spriteData.ts
export interface SpriteRect {
  x: number; y: number; w: number; h: number; fill: string; opacity?: number
}

// たまご (stage 0)
export const EGG_SPRITE: SpriteRect[] = [
  { x: 11, y: 1,  w: 10, h: 2, fill: '#f5e6c8' },
  { x: 9,  y: 3,  w: 14, h: 2, fill: '#f5e6c8' },
  { x: 7,  y: 5,  w: 18, h: 2, fill: '#eddbb0' },
  { x: 6,  y: 7,  w: 20, h: 2, fill: '#eddbb0' },
  { x: 5,  y: 9,  w: 22, h: 2, fill: '#e8d4a0' },
  { x: 5,  y: 11, w: 22, h: 2, fill: '#e8d4a0' },
  { x: 5,  y: 13, w: 22, h: 2, fill: '#e3cc90' },
  { x: 5,  y: 15, w: 22, h: 2, fill: '#e3cc90' },
  { x: 6,  y: 17, w: 20, h: 2, fill: '#ddc480' },
  { x: 7,  y: 19, w: 18, h: 2, fill: '#ddc480' },
  { x: 9,  y: 21, w: 14, h: 2, fill: '#d4b870' },
  { x: 11, y: 23, w: 10, h: 2, fill: '#c8aa60' },
  { x: 8,  y: 5,  w: 5,  h: 4, fill: '#fff9ee', opacity: 0.6 },
  { x: 14, y: 12, w: 1,  h: 3, fill: '#c8a040', opacity: 0.7 },
  { x: 13, y: 14, w: 3,  h: 1, fill: '#c8a040', opacity: 0.7 },
]

// 若ゴリ (stage 1-5)
export const YOUNG_GORILLA_SPRITE: SpriteRect[] = [
  { x: 9,  y: 1,  w: 14, h: 2, fill: '#5c3820' },
  { x: 7,  y: 3,  w: 18, h: 2, fill: '#6b4025' },
  { x: 6,  y: 5,  w: 20, h: 6, fill: '#6b4025' },
  { x: 4,  y: 6,  w: 3,  h: 4, fill: '#5c3820' },
  { x: 5,  y: 7,  w: 2,  h: 2, fill: '#c4814a' },
  { x: 25, y: 6,  w: 3,  h: 4, fill: '#5c3820' },
  { x: 25, y: 7,  w: 2,  h: 2, fill: '#c4814a' },
  { x: 6,  y: 11, w: 20, h: 10, fill: '#6b4025' },
  { x: 9,  y: 13, w: 14, h: 7,  fill: '#e8c07a' },
  { x: 10, y: 13, w: 4,  h: 4,  fill: '#fff' },
  { x: 11, y: 14, w: 2,  h: 2,  fill: '#1a1a1a' },
  { x: 12, y: 14, w: 1,  h: 1,  fill: '#fff', opacity: 0.8 },
  { x: 18, y: 13, w: 4,  h: 4,  fill: '#fff' },
  { x: 19, y: 14, w: 2,  h: 2,  fill: '#1a1a1a' },
  { x: 20, y: 14, w: 1,  h: 1,  fill: '#fff', opacity: 0.8 },
  { x: 14, y: 17, w: 4,  h: 2,  fill: '#3a2010' },
  { x: 13, y: 19, w: 2,  h: 1,  fill: '#3a2010' },
  { x: 17, y: 19, w: 2,  h: 1,  fill: '#3a2010' },
  { x: 7,  y: 21, w: 18, h: 12, fill: '#7a4e30' },
  { x: 11, y: 22, w: 10, h: 10, fill: '#c4a060' },
  { x: 3,  y: 22, w: 5,  h: 8,  fill: '#6b4025' },
  { x: 3,  y: 29, w: 6,  h: 3,  fill: '#5c3820' },
  { x: 24, y: 22, w: 5,  h: 8,  fill: '#6b4025' },
  { x: 23, y: 29, w: 6,  h: 3,  fill: '#5c3820' },
  { x: 9,  y: 33, w: 6,  h: 5,  fill: '#6b4025' },
  { x: 8,  y: 37, w: 7,  h: 3,  fill: '#5c3820' },
  { x: 17, y: 33, w: 6,  h: 5,  fill: '#6b4025' },
  { x: 17, y: 37, w: 7,  h: 3,  fill: '#5c3820' },
]

// シルバーバック (stage 6-7)
export const SILVERBACK_SPRITE: SpriteRect[] = [
  { x: 10, y: 0,  w: 16, h: 2,  fill: '#3a2818' },
  { x: 8,  y: 0,  w: 2,  h: 3,  fill: '#2e2010' },
  { x: 26, y: 0,  w: 2,  h: 3,  fill: '#2e2010' },
  { x: 7,  y: 2,  w: 22, h: 2,  fill: '#3a2818' },
  { x: 5,  y: 4,  w: 26, h: 8,  fill: '#3a2818' },
  { x: 5,  y: 4,  w: 26, h: 3,  fill: '#2a1a08' },
  { x: 2,  y: 6,  w: 4,  h: 5,  fill: '#3a2818' },
  { x: 3,  y: 7,  w: 2,  h: 3,  fill: '#b07040' },
  { x: 30, y: 6,  w: 4,  h: 5,  fill: '#3a2818' },
  { x: 31, y: 7,  w: 2,  h: 3,  fill: '#b07040' },
  { x: 5,  y: 12, w: 26, h: 12, fill: '#3a2818' },
  { x: 8,  y: 14, w: 20, h: 9,  fill: '#c8906a' },
  { x: 9,  y: 12, w: 6,  h: 2,  fill: '#2a1a08' },
  { x: 21, y: 12, w: 6,  h: 2,  fill: '#2a1a08' },
  { x: 9,  y: 14, w: 5,  h: 4,  fill: '#fff' },
  { x: 10, y: 15, w: 3,  h: 2,  fill: '#1a0a00' },
  { x: 11, y: 15, w: 1,  h: 1,  fill: '#fff', opacity: 0.7 },
  { x: 22, y: 14, w: 5,  h: 4,  fill: '#fff' },
  { x: 23, y: 15, w: 3,  h: 2,  fill: '#1a0a00' },
  { x: 24, y: 15, w: 1,  h: 1,  fill: '#fff', opacity: 0.7 },
  { x: 15, y: 18, w: 6,  h: 3,  fill: '#2a1208' },
  { x: 12, y: 21, w: 3,  h: 1,  fill: '#2a1208' },
  { x: 21, y: 21, w: 3,  h: 1,  fill: '#2a1208' },
  { x: 14, y: 22, w: 8,  h: 2,  fill: '#1a0a00' },
  { x: 3,  y: 24, w: 30, h: 14, fill: '#2e2010' },
  { x: 4,  y: 26, w: 28, h: 10, fill: '#c0c0b8' },
  { x: 6,  y: 27, w: 24, h: 8,  fill: '#d0d0c8' },
  { x: 12, y: 26, w: 12, h: 3,  fill: '#b8a080' },
  { x: 0,  y: 24, w: 4,  h: 12, fill: '#2e2010' },
  { x: 0,  y: 35, w: 6,  h: 4,  fill: '#241808' },
  { x: 32, y: 24, w: 4,  h: 12, fill: '#2e2010' },
  { x: 30, y: 35, w: 6,  h: 4,  fill: '#241808' },
  { x: 7,  y: 38, w: 9,  h: 5,  fill: '#2e2010' },
  { x: 6,  y: 42, w: 10, h: 2,  fill: '#241808' },
  { x: 20, y: 38, w: 9,  h: 5,  fill: '#2e2010' },
  { x: 20, y: 42, w: 10, h: 2,  fill: '#241808' },
]

// 死亡バリエーション（×目）
export const DEAD_SPRITE: SpriteRect[] = [
  ...YOUNG_GORILLA_SPRITE.filter(r => !(r.y >= 13 && r.y <= 16 && r.x >= 10)),
  { x: 10, y: 13, w: 1, h: 1, fill: '#fff' },
  { x: 13, y: 16, w: 1, h: 1, fill: '#fff' },
  { x: 11, y: 14, w: 1, h: 1, fill: '#ff4444' },
  { x: 12, y: 15, w: 1, h: 1, fill: '#ff4444' },
  { x: 13, y: 14, w: 1, h: 1, fill: '#ff4444' },
  { x: 11, y: 16, w: 1, h: 1, fill: '#ff4444' },
  { x: 18, y: 13, w: 1, h: 1, fill: '#fff' },
  { x: 21, y: 16, w: 1, h: 1, fill: '#fff' },
  { x: 19, y: 14, w: 1, h: 1, fill: '#ff4444' },
  { x: 20, y: 15, w: 1, h: 1, fill: '#ff4444' },
  { x: 21, y: 14, w: 1, h: 1, fill: '#ff4444' },
  { x: 19, y: 16, w: 1, h: 1, fill: '#ff4444' },
]

export function getSpriteForStage(stage: number, isDead: boolean): SpriteRect[] {
  if (isDead) return DEAD_SPRITE
  if (stage === 0) return EGG_SPRITE
  if (stage <= 5) return YOUNG_GORILLA_SPRITE
  return SILVERBACK_SPRITE
}

export function getViewBox(stage: number): string {
  if (stage === 0) return '0 0 32 32'
  if (stage <= 5) return '0 0 32 40'
  return '0 0 36 44'
}

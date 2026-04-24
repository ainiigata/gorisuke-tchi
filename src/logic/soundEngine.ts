type SfxName = 'correct' | 'wrong' | 'complete' | 'feed' | 'hatch' | 'evolve' | 'die' | 'tap'
type BgmTrack = 'main' | 'brain' | 'museum'

interface Note { f: number; t: number; d: number; v?: number; w?: OscillatorType }
interface Track { notes: Note[]; len: number }

const hz = {
  C3: 130.81, G3: 196.00, A3: 220.00, C4: 261.63, D4: 293.66,
  E4: 329.63, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.26, G5: 783.99, A5: 880.00, C6: 1046.50,
}

const TRACKS: Record<BgmTrack, Track> = {
  // "Gorilla's Day" — C major arpeggio, gentle, 4s loop
  main: {
    len: 4,
    notes: [
      { f: hz.C3, t: 0.0, d: 1.9, v: 0.07 },   // bass
      { f: hz.G3, t: 2.0, d: 1.9, v: 0.07 },
      { f: hz.C4, t: 0.0, d: 0.4, v: 0.11 },
      { f: hz.E4, t: 0.5, d: 0.4, v: 0.11 },
      { f: hz.G4, t: 1.0, d: 0.4, v: 0.11 },
      { f: hz.C5, t: 1.5, d: 0.4, v: 0.13 },
      { f: hz.G4, t: 2.0, d: 0.4, v: 0.11 },
      { f: hz.E4, t: 2.5, d: 0.4, v: 0.11 },
      { f: hz.D4, t: 3.0, d: 0.4, v: 0.11 },
      { f: hz.C4, t: 3.5, d: 0.4, v: 0.11 },
    ],
  },
  // "Focus Mode" — G pentatonic, square wave, 2s loop
  brain: {
    len: 2,
    notes: [
      { f: hz.G4, t: 0.00, d: 0.15, v: 0.09, w: 'square' },
      { f: hz.A4, t: 0.25, d: 0.15, v: 0.09, w: 'square' },
      { f: hz.C5, t: 0.50, d: 0.15, v: 0.09, w: 'square' },
      { f: hz.D5, t: 0.75, d: 0.15, v: 0.11, w: 'square' },
      { f: hz.C5, t: 1.00, d: 0.20, v: 0.09, w: 'square' },
      { f: hz.A4, t: 1.25, d: 0.15, v: 0.09, w: 'square' },
      { f: hz.G4, t: 1.50, d: 0.15, v: 0.09, w: 'square' },
      { f: hz.A4, t: 1.75, d: 0.15, v: 0.07, w: 'square' },
    ],
  },
  // "Memory Lane" — A minor, slow, 4s loop
  museum: {
    len: 4,
    notes: [
      { f: hz.A3, t: 0.0, d: 1.9, v: 0.10 },
      { f: hz.E4, t: 0.0, d: 1.9, v: 0.06 },
      { f: hz.C4, t: 2.0, d: 1.9, v: 0.10 },
      { f: hz.A3, t: 2.0, d: 1.9, v: 0.06 },
    ],
  },
}

// [freq, timeOffset, duration, vol, waveType?]
const SFX: Record<SfxName, Array<[number, number, number, number, OscillatorType?]>> = {
  correct: [
    [hz.C5, 0.00, 0.10, 0.30],
    [hz.E5, 0.10, 0.18, 0.30],
  ],
  wrong: [
    [hz.E4, 0.00, 0.10, 0.25, 'sawtooth'],
    [hz.C4, 0.10, 0.20, 0.25, 'sawtooth'],
  ],
  complete: [
    [hz.G4, 0.00, 0.10, 0.28],
    [hz.C5, 0.10, 0.10, 0.28],
    [hz.E5, 0.20, 0.10, 0.28],
    [hz.G5, 0.30, 0.40, 0.32],
  ],
  feed: [
    [hz.C5, 0.00, 0.08, 0.20],
    [hz.G4, 0.09, 0.08, 0.20],
    [hz.E4, 0.18, 0.12, 0.20],
  ],
  hatch: [
    [hz.C5, 0.00, 0.10, 0.20],
    [hz.D5, 0.08, 0.10, 0.20],
    [hz.E5, 0.16, 0.10, 0.22],
    [hz.G5, 0.24, 0.10, 0.25],
    [hz.A5, 0.32, 0.10, 0.25],
    [hz.C6, 0.40, 0.35, 0.30],
    [hz.G5, 0.45, 0.30, 0.15],
    [hz.E5, 0.50, 0.30, 0.12],
  ],
  evolve: [
    [hz.G4, 0.00, 0.15, 0.38],
    [hz.C5, 0.15, 0.15, 0.38],
    [hz.E5, 0.30, 0.15, 0.38],
    [hz.G5, 0.45, 0.65, 0.42],
    [hz.E5, 0.45, 0.65, 0.22],
    [hz.C5, 0.45, 0.65, 0.22],
  ],
  die: [
    [hz.A4, 0.00, 0.38, 0.28],
    [hz.G4, 0.38, 0.38, 0.25],
    [hz.E4, 0.76, 0.38, 0.22],
    [hz.C4, 1.14, 0.70, 0.28],
  ],
  tap: [
    [800, 0, 0.05, 0.15, 'square'],
  ],
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private bgmTimer: ReturnType<typeof setTimeout> | null = null
  private currentBgm: BgmTrack | null = null

  private init() {
    if (this.ctx) return
    const AC = window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.4
    this.master.connect(this.ctx.destination)
  }

  private noteAt(freq: number, startTime: number, dur: number, vol: number, wave: OscillatorType = 'sine') {
    if (!this.ctx || !this.master) return
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = wave
    osc.frequency.value = freq
    osc.connect(g)
    g.connect(this.master)
    g.gain.setValueAtTime(0, startTime)
    g.gain.linearRampToValueAtTime(vol, startTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, startTime + dur)
    osc.start(startTime)
    osc.stop(startTime + dur + 0.05)
  }

  playSFX(name: SfxName) {
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') this.ctx.resume()
    const now = this.ctx.currentTime
    SFX[name].forEach(([f, t, d, v, w]) => this.noteAt(f, now + t, d, v, w))
  }

  playBGM(track: BgmTrack) {
    if (track === this.currentBgm) return
    this.stopBGM()
    this.currentBgm = track
    this.init()
    if (!this.ctx) return
    this.ctx.resume().then(() => this.loopBGM(track))
  }

  private loopBGM(track: BgmTrack) {
    if (this.currentBgm !== track || !this.ctx) return
    const cfg = TRACKS[track]
    const start = this.ctx.currentTime + 0.05
    cfg.notes.forEach(n => this.noteAt(n.f, start + n.t, n.d, n.v ?? 0.12, n.w ?? 'sine'))
    this.bgmTimer = setTimeout(() => this.loopBGM(track), (cfg.len - 0.1) * 1000)
  }

  stopBGM() {
    if (this.bgmTimer !== null) clearTimeout(this.bgmTimer)
    this.bgmTimer = null
    this.currentBgm = null
  }
}

export const soundEngine = new SoundEngine()

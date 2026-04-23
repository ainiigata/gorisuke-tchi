import type { FeedItem } from '../types'

const RARITY_COLOR: Record<FeedItem['rarity'], string> = {
  common: 'text-white/60',
  rare: 'text-blue-400',
  legendary: 'text-yellow-400',
}

const RARITY_BG: Record<FeedItem['rarity'], string> = {
  common: 'bg-white/10',
  rare: 'bg-blue-500/20 border border-blue-400/40',
  legendary: 'bg-yellow-500/20 border border-yellow-400/60',
}

const TYPE_EMOJI: Record<FeedItem['type'], string> = {
  banana: '🍌', meat: '🥩', honey: '🍯', nut: '🥜',
  berry: '🍓', fish: '🐟', cake: '🎂', mystery: '✨',
}

interface Props {
  item: FeedItem
  onClose: () => void
}

export function FeedGacha({ item, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`flex flex-col items-center gap-4 p-8 rounded-2xl ${RARITY_BG[item.rarity]}`}
        onClick={e => e.stopPropagation()}
      >
        <p className={`text-xs font-mono uppercase tracking-widest ${RARITY_COLOR[item.rarity]}`}>
          {item.rarity}
        </p>
        <span className="text-7xl">{TYPE_EMOJI[item.type]}</span>
        <p className="text-white font-mono text-lg">{item.type.toUpperCase()}</p>
        <p className="text-white/40 text-xs">空腹 +{item.hungerRestore}  EXP +{item.expBonus}</p>
        <button
          className="mt-2 px-6 py-2 bg-accent/30 text-accent rounded-full text-sm font-mono"
          onClick={onClose}
        >
          ストックに追加
        </button>
      </div>
    </div>
  )
}

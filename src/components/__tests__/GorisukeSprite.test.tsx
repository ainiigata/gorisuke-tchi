import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GorisukeSprite } from '../GorisukeSprite'

describe('GorisukeSprite', () => {
  it('renders svg', () => {
    const { container } = render(<GorisukeSprite stage={0} isDead={false} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
  it('renders egg at stage 0', () => {
    const { container } = render(<GorisukeSprite stage={0} isDead={false} />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThan(5)
  })
  it('applies size prop', () => {
    const { container } = render(<GorisukeSprite stage={1} isDead={false} size={64} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('64')
  })
  it('maintains aspect ratio for height', () => {
    // stage=0 は viewBox '0 0 32 32' なので size=64 → width=64, height=64
    const { container } = render(<GorisukeSprite stage={0} isDead={false} size={64} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('64')
    expect(svg?.getAttribute('height')).toBe('64')
  })
})

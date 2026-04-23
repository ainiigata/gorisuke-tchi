import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StatusBars } from '../StatusBars'

describe('StatusBars', () => {
  it('renders hp, hunger, exp labels', () => {
    const { getByText } = render(<StatusBars hp={80} hunger={60} exp={400} expToNext={800} />)
    expect(getByText(/HP/)).toBeTruthy()
    expect(getByText(/腹/)).toBeTruthy()
    expect(getByText(/EXP/)).toBeTruthy()
  })
  it('shows numeric hp value', () => {
    const { getByText } = render(<StatusBars hp={78} hunger={50} exp={100} expToNext={240} />)
    expect(getByText('78')).toBeTruthy()
  })
})

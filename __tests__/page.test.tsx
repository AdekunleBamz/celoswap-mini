import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByText('CeloSwap')
    expect(heading).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Home />)
    const subtitle = screen.getByText('Lightning-fast swaps on Celo')
    expect(subtitle).toBeInTheDocument()
  })
})

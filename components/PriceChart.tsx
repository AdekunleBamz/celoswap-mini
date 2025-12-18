'use client'

import { useState } from 'react'

export default function PriceChart() {
  // Mock price data
  const [timeframe, setTimeframe] = useState('1D')
  const mockData = [
    { time: '00:00', price: 0.48 },
    { time: '04:00', price: 0.49 },
    { time: '08:00', price: 0.47 },
    { time: '12:00', price: 0.50 },
    { time: '16:00', price: 0.52 },
    { time: '20:00', price: 0.51 },
  ]

  const maxPrice = Math.max(...mockData.map(d => d.price))
  const minPrice = Math.min(...mockData.map(d => d.price))

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-display font-bold mb-4 text-center">CELO Price Chart</h2>
      <div className="glass rounded-3xl p-6">
        {/* Timeframe selector */}
        <div className="flex gap-2 mb-4">
          {['1H', '1D', '1W', '1M'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg font-display text-sm transition-all ${
                timeframe === tf
                  ? 'bg-celo-green text-black'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Simple chart */}
        <div className="relative h-64 bg-black/20 rounded-xl p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <polyline
              fill="none"
              stroke="#35D07F"
              strokeWidth="2"
              points={mockData.map((d, i) => `${i * 60 + 20},${200 - ((d.price - minPrice) / (maxPrice - minPrice)) * 160}`).join(' ')}
            />
            {mockData.map((d, i) => (
              <circle
                key={i}
                cx={i * 60 + 20}
                cy={200 - ((d.price - minPrice) / (maxPrice - minPrice)) * 160}
                r="3"
                fill="#35D07F"
              />
            ))}
          </svg>

          {/* Price labels */}
          <div className="absolute left-2 top-2 text-xs text-gray-400">
            ${maxPrice.toFixed(2)}
          </div>
          <div className="absolute left-2 bottom-2 text-xs text-gray-400">
            ${minPrice.toFixed(2)}
          </div>
        </div>

        {/* Current price */}
        <div className="mt-4 text-center">
          <div className="text-2xl font-display font-bold text-celo-green">
            ${mockData[mockData.length - 1].price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            +2.1% (24h)
          </div>
        </div>
      </div>
    </div>
  )
}

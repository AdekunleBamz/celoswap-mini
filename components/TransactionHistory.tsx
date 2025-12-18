'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { celoSwapABI } from '@/lib/abis'

export default function TransactionHistory() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<any[]>([])

  // This is a simplified version - in reality, you'd need to query blockchain events
  // For demo purposes, we'll simulate some history

  useEffect(() => {
    if (address) {
      // Simulate fetching transaction history
      const mockTransactions = [
        {
          id: '1',
          type: 'Swap',
          from: 'cUSD',
          to: 'CELO',
          amountIn: '10',
          amountOut: '19.8',
          timestamp: Date.now() - 86400000,
          hash: '0x...'
        },
        {
          id: '2',
          type: 'Swap',
          from: 'CELO',
          to: 'cUSD',
          amountIn: '5',
          amountOut: '2.5',
          timestamp: Date.now() - 172800000,
          hash: '0x...'
        }
      ]
      setTransactions(mockTransactions)
    }
  }, [address])

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-display font-bold mb-4 text-center">Transaction History</h2>
      <div className="glass rounded-3xl p-6">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-black/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-display font-semibold">{tx.type}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {tx.amountIn} {tx.from} → {tx.amountOut} {tx.to}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Hash: {tx.hash}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

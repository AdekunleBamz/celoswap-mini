'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseUnits, formatUnits } from 'viem'
import { celoSwapABI, erc20ABI } from '@/lib/abis'
import { tokenList, Token } from '@/lib/tokens'
import TransactionHistory from '@/components/TransactionHistory'
import PriceChart from '@/components/PriceChart'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [tokenIn, setTokenIn] = useState<Token>(tokenList[0])
  const [tokenOut, setTokenOut] = useState<Token>(tokenList[1])
  const [amountIn, setAmountIn] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)

  const contractAddress = process.env.NEXT_PUBLIC_CELOSWAP_CONTRACT as `0x${string}`

  // Get balances
  const { data: balanceIn } = useReadContract({
    address: tokenIn.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const { data: balanceOut } = useReadContract({
    address: tokenOut.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  // Get quote
  const { data: quoteData } = useReadContract({
    address: contractAddress,
    abi: celoSwapABI,
    functionName: 'getQuote',
    args: [
      tokenIn.address as `0x${string}`,
      tokenOut.address as `0x${string}`,
      amountIn ? parseUnits(amountIn, tokenIn.decimals) : BigInt(0),
    ],
    query: {
      enabled: !!amountIn && parseFloat(amountIn) > 0,
    },
  })

  const amountOut = quoteData ? formatUnits(quoteData as bigint, tokenOut.decimals) : '0'

  // Get swap fee
  const { data: swapFee } = useReadContract({
    address: contractAddress,
    abi: celoSwapABI,
    functionName: 'swapFee',
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSwap = async () => {
    if (!amountIn || parseFloat(amountIn) <= 0) return

    const minAmountOut = (
      parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)
    ).toString()

    writeContract({
      address: contractAddress,
      abi: celoSwapABI,
      functionName: 'swap',
      args: [
        tokenIn.address as `0x${string}`,
        tokenOut.address as `0x${string}`,
        parseUnits(amountIn, tokenIn.decimals),
        parseUnits(minAmountOut, tokenOut.decimals),
      ],
    })
  }

  const handleFlip = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn('')
  }

  useEffect(() => {
    if (isSuccess) {
      setAmountIn('')
    }
  }, [isSuccess])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-celo-green/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-celo-gold/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold mb-3 bg-gradient-to-r from-celo-green to-celo-gold bg-clip-text text-transparent">
            CeloSwap
          </h1>
          <p className="text-gray-400 font-display text-sm">Lightning-fast swaps on Celo</p>
        </div>

        {/* Swap Card */}
        <div className="glass rounded-3xl p-6 mb-6 relative">
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6 p-4 bg-black/20 rounded-xl">
              <label className="block text-sm text-gray-400 mb-2 font-display">
                Slippage Tolerance
              </label>
              <div className="flex gap-2">
                {['0.1', '0.5', '1.0'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`flex-1 py-2 px-4 rounded-lg font-display transition-all ${
                      slippage === value
                        ? 'bg-celo-green text-black'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-24 bg-white/5 rounded-lg px-3 text-center font-display"
                  placeholder="Custom"
                  step="0.1"
                />
              </div>
            </div>
          )}

          {/* From Token */}
          <div className="mb-2">
            <label className="block text-sm text-gray-400 mb-2 font-display">From</label>
            <div className="flex items-center gap-3 bg-black/20 rounded-xl p-4">
              <select
                value={tokenIn.symbol}
                onChange={(e) => {
                  const token = tokenList.find((t) => t.symbol === e.target.value)
                  if (token) setTokenIn(token)
                }}
                className="bg-celo-green/20 hover:bg-celo-green/30 rounded-lg px-3 py-2 font-display font-semibold cursor-pointer border-none outline-none transition-colors"
              >
                {tokenList.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-2xl font-display font-semibold outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 font-display">
              Balance: {balanceIn ? parseFloat(formatUnits(balanceIn as bigint, tokenIn.decimals)).toFixed(4) : '0'} {tokenIn.symbol}
            </p>
          </div>

          {/* Flip Button */}
          <div className="flex justify-center my-4">
            <button
              onClick={handleFlip}
              className="p-3 bg-celo-green/20 hover:bg-celo-green/30 rounded-xl transition-all hover:rotate-180 duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-display">To</label>
            <div className="flex items-center gap-3 bg-black/20 rounded-xl p-4">
              <select
                value={tokenOut.symbol}
                onChange={(e) => {
                  const token = tokenList.find((t) => t.symbol === e.target.value)
                  if (token) setTokenOut(token)
                }}
                className="bg-celo-gold/20 hover:bg-celo-gold/30 rounded-lg px-3 py-2 font-display font-semibold cursor-pointer border-none outline-none transition-colors"
              >
                {tokenList.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="flex-1 text-2xl font-display font-semibold text-right">
                {parseFloat(amountOut).toFixed(4)}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-display">
              Balance: {balanceOut ? parseFloat(formatUnits(balanceOut as bigint, tokenOut.decimals)).toFixed(4) : '0'} {tokenOut.symbol}
            </p>
          </div>

          {/* Quote Info */}
          {amountIn && parseFloat(amountIn) > 0 && (
            <div className="mt-4 p-4 bg-black/20 rounded-xl space-y-2 text-sm font-display">
              <div className="flex justify-between text-gray-400">
                <span>Rate</span>
                <span className="text-white">
                  1 {tokenIn.symbol} = {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)} {tokenOut.symbol}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Fee ({swapFee ? Number(swapFee) / 100 : 0.25}%)</span>
                <span className="text-white">
                  {((parseFloat(amountOut) * (swapFee ? Number(swapFee) / 10000 : 0.0025))).toFixed(6)} {tokenOut.symbol}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Minimum Received</span>
                <span className="text-white">
                  {(parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {tokenOut.symbol}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>$ Equivalent</span>
                <span className="text-white">
                  ~${(parseFloat(amountIn) * (tokenIn.symbol === 'CELO' ? 0.5 : tokenIn.symbol === 'cUSD' ? 1 : tokenIn.symbol === 'cEUR' ? 1.08 : 1)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mb-6">
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="w-full py-4 bg-gradient-to-r from-celo-green to-celo-gold rounded-xl font-display font-bold text-black text-lg hover:scale-105 transition-transform glow"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          ) : (
            <button
              onClick={handleSwap}
              disabled={!amountIn || parseFloat(amountIn) <= 0 || isPending || isConfirming}
              className="w-full py-4 bg-gradient-to-r from-celo-green to-celo-gold rounded-xl font-display font-bold text-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow"
            >
              {isPending
                ? 'Confirming in Wallet...'
                : isConfirming
                ? 'Processing Swap...'
                : isSuccess
                ? 'Swap Successful! ✓'
                : 'Swap'}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex justify-center gap-6 mb-2">
            <a
              href="https://celo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-celo-green transition-colors font-display"
            >
              Celo
            </a>
            <a
              href="https://docs.celo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-celo-green transition-colors font-display"
            >
              Docs
            </a>
            <a
              href="https://github.com/AdekunleBamz/celoswap-mini"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-celo-green transition-colors font-display"
            >
              GitHub
            </a>
          </div>
          <p className="text-xs text-gray-500 font-display">
            Built for Celo • Powered by CeloSwap Protocol
          </p>
        </div>
      </div>

      {/* Price Chart */}
      <PriceChart />

      {/* Transaction History */}
      {isConnected && <TransactionHistory />}
    </main>
  )
}

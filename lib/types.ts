export interface SwapQuote {
  amountOut: bigint
  fee: bigint
  minimumReceived: bigint
}

export interface Transaction {
  id: string
  type: string
  from: string
  to: string
  amountIn: string
  amountOut: string
  timestamp: number
  hash: string
}

export interface PriceData {
  time: string
  price: number
}

export interface WalletState {
  address: `0x${string}` | undefined
  isConnected: boolean
}

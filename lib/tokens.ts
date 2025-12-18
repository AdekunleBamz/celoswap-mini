export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logo?: string
}

export const tokenList: Token[] = [
  {
    symbol: 'CELO',
    name: 'Celo',
    address: process.env.NEXT_PUBLIC_CELO_ADDRESS || '0x471EcE3750Da237f93B8E339c536989b8978a438',
    decimals: 18,
  },
  {
    symbol: 'cUSD',
    name: 'Celo Dollar',
    address: process.env.NEXT_PUBLIC_CUSD_ADDRESS || '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    decimals: 18,
  },
  {
    symbol: 'cEUR',
    name: 'Celo Euro',
    address: process.env.NEXT_PUBLIC_CEUR_ADDRESS || '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
    decimals: 18,
  },
  {
    symbol: 'cREAL',
    name: 'Celo Real',
    address: process.env.NEXT_PUBLIC_CREAL_ADDRESS || '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787',
    decimals: 18,
  },
]

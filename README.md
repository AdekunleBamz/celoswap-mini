# CeloSwap Mini

A minimal decentralized exchange (DEX) interface for the Celo blockchain, built with Next.js, Tailwind CSS, Wagmi, and RainbowKit for seamless Web3 interactions.

## Features

- Lightning-fast token swaps on Celo
- Wallet integration with MetaMask and WalletConnect
- Real-time balance display
- Approximate USD equivalent values
- Customizable slippage tolerance
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Celo-compatible wallet (MetaMask, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AdekunleBamz/celoswap-mini.git
cd celoswap-mini
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment:
   - Get a WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Update `.env` with your project ID and other settings

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

- `NEXT_PUBLIC_CELOSWAP_CONTRACT`: Deployed CeloSwap contract address
- `NEXT_PUBLIC_CELO_ADDRESS`: CELO token contract address
- `NEXT_PUBLIC_CUSD_ADDRESS`: cUSD token contract address
- `NEXT_PUBLIC_CEUR_ADDRESS`: cEUR token contract address
- `NEXT_PUBLIC_CREAL_ADDRESS`: cREAL token contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID
- `NEXT_PUBLIC_CHAIN_ID`: Chain ID (42220 for mainnet, 44787 for testnet)

## Deploying the Contract

1. Deploy `CeloSwap.sol` on Remix or Hardhat to Celo mainnet/testnet
2. Update `NEXT_PUBLIC_CELOSWAP_CONTRACT` in `.env`
3. Set exchange rates and deposit liquidity via contract functions

## Usage

1. Connect your wallet
2. Select tokens to swap
3. Enter amount and adjust slippage if needed
4. Confirm the transaction in your wallet

## Technologies Used

- Next.js 14
- Tailwind CSS
- Wagmi
- RainbowKit
- Viem
- TypeScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Built for Celo Competition

This project is built for the Celo blockchain competition.

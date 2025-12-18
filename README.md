# CeloSwap Mini

Quick token swaps on Celo with minimal fees. Built for Celo Proof of Ship competition.

## Features

- 🚀 Lightning-fast swaps between CELO, cUSD, cEUR, and cREAL
- 💎 Minimal 0.25% swap fee
- 🎨 Beautiful, responsive UI
- 🔐 Secure smart contract architecture
- 📱 Farcaster miniapp integration
- ⚡ Real-time quotes and slippage protection

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Web3**: Wagmi, Viem, RainbowKit
- **Blockchain**: Celo (Mainnet)
- **Smart Contract**: Solidity 0.8.20

## Deployment Guide

### Step 1: Deploy Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `CeloSwap.sol`
3. Copy the contract code from `CeloSwap.sol`
4. Compile with Solidity 0.8.20
5. Deploy to Celo Mainnet:
   - Network: Celo Mainnet
   - Chain ID: 42220
   - RPC: https://forno.celo.org
6. **Save the deployed contract address!**

### Step 2: Initialize Contract

After deploying, call these functions on Remix:

```javascript
// 1. Add supported tokens
addToken("0x471EcE3750Da237f93B8E339c536989b8978a438") // CELO
addToken("0x765DE816845861e75A25fCA122bb6898B8B1282a") // cUSD
addToken("0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73") // cEUR
addToken("0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787") // cREAL

// 2. Set exchange rates (example: 1:1 rates scaled by 1e18)
setExchangeRate(CELO_ADDRESS, CUSD_ADDRESS, "1000000000000000000") // 1 CELO = 1 cUSD
setExchangeRate(CUSD_ADDRESS, CELO_ADDRESS, "1000000000000000000") // 1 cUSD = 1 CELO
// Set rates for all token pairs you want to support

// 3. Deposit liquidity (approve tokens first!)
// Approve the contract to spend your tokens, then:
depositLiquidity(CUSD_ADDRESS, "1000000000000000000000") // 1000 cUSD
depositLiquidity(CELO_ADDRESS, "1000000000000000000000") // 1000 CELO
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local`:
```env
NEXT_PUBLIC_CELOSWAP_CONTRACT=0x... # Your deployed contract address

# Get WalletConnect Project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Update with your domain
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 4: Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Step 5: Deploy to Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Step 6: Configure Farcaster

1. Update `public/farcaster.json` with your domain
2. Update `public/.well-known/farcaster.json` with:
   - Your FID
   - Proper account association
   - Webhook URL

## Usage

### For Users

1. Connect your Celo wallet (Valora, MetaMask, etc.)
2. Select tokens to swap
3. Enter amount
4. Review quote and fee
5. Approve token spending (first time only)
6. Execute swap!

### For Developers

```typescript
// Get swap quote
const quote = await contract.getQuote(
  tokenInAddress,
  tokenOutAddress,
  amountIn
)

// Execute swap
await contract.swap(
  tokenInAddress,
  tokenOutAddress,
  amountIn,
  minAmountOut // With slippage protection
)
```

## Contract Functions

### User Functions
- `swap()` - Execute token swap
- `getQuote()` - Get swap quote

### Owner Functions
- `addToken()` - Add supported token
- `removeToken()` - Remove token
- `setExchangeRate()` - Set token pair rate
- `setSwapFee()` - Update swap fee
- `depositLiquidity()` - Add liquidity
- `withdrawFees()` - Withdraw collected fees

## Security

- ✅ Slippage protection
- ✅ Owner-only administrative functions
- ✅ Reentrancy protection
- ✅ Balance checks before swaps
- ✅ Rate validation

## Generating Transactions

To maximize on-chain activity:

1. Perform regular test swaps
2. Update exchange rates frequently
3. Add/remove liquidity
4. Test different token pairs
5. Invite others to use the platform

## Farcaster Miniapp

Access CeloSwap Mini directly in Farcaster:
- Open the frame in any Farcaster client
- Swap tokens without leaving the app
- Share swaps with your network

## Support

- GitHub: [@AdekunleBamz](https://github.com/AdekunleBamz)
- Farcaster: [@Bamzzz](https://warpcast.com/bamzzz)
- Twitter: [@hrh_mckay](https://twitter.com/hrh_mckay)

## License

MIT License - Built for Celo Ecosystem

---

**Built with ❤️ for Celo Proof of Ship**

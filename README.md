# OpenCure - Decentralized Rare Disease Research Funding

A blockchain-based crowdfunding platform for accelerating rare disease research through transparent, milestone-based fund management.

## Overview

OpenCure connects patients, scientists, and donors to fund critical rare disease research. Using smart contracts, donations are held in escrow and released only when research milestones are achieved - ensuring transparency and accountability.

## Features

- **Milestone-Based Funding**: Funds released incrementally as research goals are met
- **Transparent Tracking**: All donations and releases recorded on blockchain
- **USDC Payments**: Stable cryptocurrency eliminates volatility risk
- **Owner Controls**: Project owners manage milestones and fund releases
- **Real-time Updates**: Live funding progress and milestone status

## Project Structure

```
my-crowdfund/
├── hardhat-contracts/          # Smart contracts
│   ├── contracts/
│   │   └── core/
│   │       ├── OpenCureEscrow.sol    # Main escrow contract
│   │       └── OpenCureV1.sol        # Advanced version with voting
│   ├── scripts/
│   │   └── deploy-mainnet.js         # Mainnet deployment script
│   └── test/
│       └── OpenCureEscrow.test.js    # Comprehensive tests
│
├── opencure-frontend/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React Context (Web3)
│   │   └── utils/              # Utilities and configs
│   └── public/
│
└── OPENCURE_30DAY_COMPLETE_GUIDE.md  # Learning guide
```

## Quick Start

### Prerequisites

- Node.js v18+
- MetaMask wallet
- Sepolia testnet ETH (for testing)

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/opencure.git
cd opencure

# Install contract dependencies
cd hardhat-contracts
npm install

# Install frontend dependencies
cd ../opencure-frontend
npm install
```

### Running Locally

```bash
# Terminal 1: Start local blockchain
cd hardhat-contracts
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start frontend
cd opencure-frontend
npm start
```

### Running Tests

```bash
cd hardhat-contracts
npx hardhat test

# With gas reporting
REPORT_GAS=true npx hardhat test
```

## Smart Contract Architecture

### OpenCureEscrow.sol

The main escrow contract managing:

- **Donations**: Accept USDC donations from supporters
- **Milestones**: Define and track research milestones
- **Fund Release**: Release funds to scientist upon milestone completion

```solidity
// Key functions
function donate(uint256 amount) external;
function addMilestone(string description, uint256 amount) external;
function completeMilestone(uint256 milestoneId) external;
function releaseFunds(uint256 milestoneId) external;
```

### Security Features

- Owner-only administrative functions
- Milestone completion verification before release
- Balance checks before transfers
- Event logging for transparency

## Frontend Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with project overview |
| Projects | `/projects` | List of research projects |
| Project Detail | `/projects/:id` | Individual project with donation |
| Dashboard | `/dashboard` | User stats and owner management |
| Create Project | `/create` | Project creation wizard |
| Deployment Guide | `/deploy` | Mainnet deployment checklist |

## Deployment

### Testnet (Sepolia)

```bash
cd hardhat-contracts
cp .env.example .env
# Edit .env with your keys
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet

```bash
# Run pre-deployment checks
npx hardhat test

# Deploy (requires confirmation)
CONFIRM_DEPLOY=true npx hardhat run scripts/deploy-mainnet.js --network mainnet
```

See `/deploy` page in frontend for complete checklist.

## Environment Variables

### Contract (.env)

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
SCIENTIST_ADDRESS=0x...
GOAL_AMOUNT=100000
```

### Frontend (.env.local)

```env
REACT_APP_NETWORK=sepolia
REACT_APP_ESCROW_ADDRESS=0x...
REACT_APP_USDC_ADDRESS=0x...
```

## Tech Stack

- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Frontend**: React 18, ethers.js v6
- **Styling**: CSS-in-JS
- **Charts**: Recharts
- **Notifications**: react-hot-toast

## Contract Addresses

### Sepolia Testnet

- Escrow: `0xF0A7b71FB5f28a702A2B8d485390117cE229beA2`
- Mock USDC: `0x8410f9Cf462C4dCc9Fb97971fe65F8D711Fa3F96`

### Ethereum Mainnet

- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- Escrow: (Deploy using deploy-mainnet.js)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## Security

- Never commit private keys or .env files
- Always test on testnet before mainnet
- Have contracts audited before significant deployment

## License

MIT License - see LICENSE file for details

## Resources

- [Solidity Documentation](https://docs.soliditylang.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org)
- [React Documentation](https://react.dev)

---

Built with care for the rare disease community.

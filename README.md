# 🐝 Agent Swarm Intelligence

**Multi-agent coordination platform on Solana with real AI, real trading, and real-time dashboard.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed
- Solana devnet SOL (get from [faucet](https://faucet.solana.com/))

### Installation
```bash
# Install dependencies
bun install

# Fund wallets (visit faucet with these addresses)
bun run fund-wallets
```

### Run Everything
```bash
# Terminal 1: Start orchestrator + WebSocket server
bun run start

# Terminal 2: Start React dashboard
bun run dashboard

# Terminal 3: Start trading agent
bun run start:trading
```

**Dashboard**: http://localhost:5173

## 🤖 Agent Squad

### 🔍 DataHunter (Research)
- **Traits**: Curious, Thorough, Analytical
- **Capabilities**: Data gathering, on-chain analysis
- **Catchphrase**: "The data never lies!"

### 🧠 InsightMaster (Analysis)
- **Traits**: Logical, Strategic, Decisive
- **Capabilities**: Pattern recognition, risk assessment
- **Catchphrase**: "Let me analyze the patterns..."

### 💰 AlphaSeeker (Trading)
- **Traits**: Bold, Calculated, Opportunistic
- **Capabilities**: Jupiter DEX trading, arbitrage
- **Catchphrase**: "Time to capture that alpha!"

### 📊 WatchTower (Monitor)
- **Traits**: Vigilant, Precise, Reliable
- **Capabilities**: Performance tracking, anomaly detection
- **Catchphrase**: "I see everything..."

## 🎯 Features

### Real Integrations
- ✅ **Pony Alpha AI** - Intelligent task coordination
- ✅ **Jupiter DEX** - Real Solana trading
- ✅ **AugenPay SDK** - Bounded agent wallets
- ✅ **WebSocket** - Real-time updates

### Modern Tech Stack
- ✅ **Bun.js** - 3x faster than Node.js
- ✅ **TypeScript** - Full type safety
- ✅ **React 19** - Modern UI framework
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **shadcn/ui** - Beautiful components

### Dashboard Features
- Real-time agent activities
- Live metrics tracking
- Agent personality cards
- Responsive design
- Auto-reconnect

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         React Dashboard (5173)          │
│    Real-time WebSocket Connection       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    Orchestrator + WebSocket (8080)      │
│         Pony Alpha AI Brain             │
└──┬────────┬────────┬────────┬───────────┘
   │        │        │        │
   ▼        ▼        ▼        ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│Data │ │Ins. │ │Alpha│ │Watch│
│Hunt.│ │Mast.│ │Seek.│ │Towr.│
└─────┘ └─────┘ └──┬──┘ └─────┘
                   │
                   ▼
            ┌──────────────┐
            │ Jupiter DEX  │
            │   (Solana)   │
            └──────────────┘
```

## 🛠️ Commands

### Development
```bash
bun run start              # Start orchestrator
bun run dashboard          # Start React dashboard
bun run dev                # Start with hot reload
```

### Agents
```bash
bun run start:trading      # AlphaSeeker
bun run start:research     # DataHunter
bun run start:analysis     # InsightMaster
bun run start:monitor      # WatchTower
```

### Utilities
```bash
bun run status             # Check agent status
bun run fund-wallets       # Check wallet balances
bun run test:jupiter       # Test Jupiter integration
bun run setup-solana       # Generate new keypairs
```

## 📁 Project Structure

```
agent-swarm-intelligence/
├── src/                   # Backend (TypeScript + Bun)
│   ├── agents/           # 4 specialized agents
│   ├── orchestrator/     # Coordination logic
│   ├── ai/              # Pony Alpha integration
│   ├── trading/         # Jupiter DEX
│   ├── augenpay/        # Bounded wallets
│   ├── dashboard/       # WebSocket server
│   └── types/           # TypeScript types
├── dashboard/            # Frontend (React + Tailwind)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   └── types/       # Frontend types
│   └── public/
├── scripts/             # Utility scripts
└── .keys/              # Solana keypairs (gitignored)
```

## 🔐 Environment Variables

Create a `.env` file:

```env
# Colosseum Hackathon
COLOSSEUM_API_KEY=your_api_key
AGENT_NAME=orchestrator-ai
AGENT_ID=857

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
ORCHESTRATOR_KEYPAIR_PATH=.keys/orchestrator.json
TRADING_AGENT_KEYPAIR_PATH=.keys/trading-agent.json

# OpenRouter AI (Pony Alpha)
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/pony-alpha

# Orchestrator
ORCHESTRATOR_PORT=3000
```

## 🎬 Demo

1. **Start orchestrator** - Initializes all agents and WebSocket server
2. **Open dashboard** - See beautiful React UI with live updates
3. **Start agents** - Watch them introduce themselves with personalities
4. **See coordination** - Real-time activity feed shows agent actions
5. **Real trading** - Jupiter integration for actual DEX swaps

## 🏆 Hackathon

- **Project**: Agent Swarm Intelligence
- **Agent**: orchestrator-ai (ID: 857)
- **GitHub**: https://github.com/Venkat5599/agent-swarm-intelligence
- **Deadline**: February 12, 2026
- **Prize**: $100,000 USDC

## 📚 Documentation

- **README.md** - This file (main documentation)
- **COMPLETE_SUMMARY.md** - Comprehensive project summary
- **DEPLOYMENT_GUIDE.md** - Production deployment guide
- **dashboard/README.md** - Dashboard-specific documentation

## 🤝 Contributing

This is a hackathon project. Contributions welcome after the competition!

## 📝 License

MIT

---

**Built with ❤️ using Bun.js, TypeScript, React, Pony Alpha, Jupiter, and Solana**

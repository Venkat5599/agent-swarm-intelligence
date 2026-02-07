# 🚀 Deployment Guide - Agent Swarm Intelligence

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Converted to TypeScript + Bun.js
- [x] Integrated Pony Alpha AI (working)
- [x] Integrated Jupiter DEX (code ready)
- [x] Integrated AugenPay SDK (code ready)
- [x] Generated Solana keypairs
- [x] Created all agent types
- [x] Set up WebSocket coordination
- [x] Updated documentation

### ⏳ Pending
- [ ] Fund Solana wallets with devnet SOL
- [ ] Test Jupiter swaps with real funds
- [ ] Configure AugenPay with real program ID
- [ ] Test full agent swarm coordination
- [ ] Deploy to production (if needed)

## 🔑 Wallet Funding (CRITICAL)

Your wallets need devnet SOL to function:

### Addresses to Fund
```
Orchestrator: FfieHaF1ahDN4axYgUzHkmNRgJmNetNcd4AoaK1BSSHY
Trading Agent: AJSE1sSiqPfm7zUcf7TGFeg2JLHzkLwQfr4mXQdrZ5v6
```

### How to Fund
1. **Via Web Faucet** (Recommended)
   - Visit: https://faucet.solana.com/
   - Paste address
   - Request 2 SOL per address
   - Wait for confirmation

2. **Via Solana CLI**
   ```bash
   solana airdrop 2 FfieHaF1ahDN4axYgUzHkmNRgJmNetNcd4AoaK1BSSHY --url devnet
   solana airdrop 2 AJSE1sSiqPfm7zUcf7TGFeg2JLHzkLwQfr4mXQdrZ5v6 --url devnet
   ```

3. **Check Balances**
   ```bash
   bun run scripts/fund-wallets.ts
   ```

## 🧪 Testing Procedure

### 1. Test Orchestrator
```bash
bun run start
```

Expected output:
```
🐝 Starting Agent Swarm Intelligence Platform...
🎯 Initializing orchestrator-ai...
📋 Registered 4 agent types
🦞 Setting up AugenPay bounded wallets...
✅ AugenPay integration ready
🌐 Swarm coordinator listening on port 3000
✅ Announced swarm on forum
✅ Orchestrator ready to coordinate swarm
```

### 2. Test Individual Agents

**Terminal 1: Research Agent**
```bash
bun run start:research
```

**Terminal 2: Analysis Agent**
```bash
bun run start:analysis
```

**Terminal 3: Trading Agent**
```bash
bun run start:trading
```

**Terminal 4: Monitor Agent**
```bash
bun run start:monitor
```

Each should connect to orchestrator and show:
```
🔍 Research Agent connected to orchestrator
```

### 3. Test Jupiter Integration

Once wallets are funded:
```bash
bun run scripts/test-jupiter.ts
```

Expected: Quote fetching and arbitrage detection working.

### 4. Test Full Swarm

Create a test task submission script or use the orchestrator API.

## 🔧 Configuration

### Environment Variables

Ensure `.env` has all required values:

```env
# Colosseum (Required)
COLOSSEUM_API_KEY=0caa138d42faadcd795b8fff16b4a3dd86cad1ed24ba2c270d6fd11b4e61f222
AGENT_NAME=orchestrator-ai
AGENT_ID=857

# Solana (Required)
SOLANA_RPC_URL=https://api.devnet.solana.com
ORCHESTRATOR_KEYPAIR_PATH=.keys/orchestrator.json
TRADING_AGENT_KEYPAIR_PATH=.keys/trading-agent.json

# OpenRouter (Required)
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=openrouter/pony-alpha

# AugenPay (Optional - needs real program ID)
AUGENPAY_PROGRAM_ID=AugenPayProgramId111111111111111111111111111

# Orchestrator (Optional)
ORCHESTRATOR_PORT=3000
```

### Security Checklist

- [x] `.keys/` directory in `.gitignore`
- [x] `.env` file in `.gitignore`
- [x] Private keys never committed
- [x] Using devnet (not mainnet)
- [ ] AugenPay bounded wallets configured (when ready)

## 🎯 Production Deployment

### Option 1: Cloud VM (Recommended)

**DigitalOcean / AWS / GCP**

1. **Create VM**
   - Ubuntu 22.04 LTS
   - 2 CPU, 4GB RAM minimum
   - Open port 3000 for WebSocket

2. **Install Bun**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Clone & Setup**
   ```bash
   git clone https://github.com/Venkat5599/agent-swarm-intelligence
   cd agent-swarm-intelligence
   bun install
   ```

4. **Configure**
   ```bash
   # Copy .env and .keys from local
   scp .env user@server:/path/to/project/
   scp -r .keys user@server:/path/to/project/
   ```

5. **Run with PM2**
   ```bash
   bun add -g pm2
   pm2 start "bun run start" --name orchestrator
   pm2 start "bun run start:trading" --name trading-agent
   pm2 start "bun run start:research" --name research-agent
   pm2 start "bun run start:analysis" --name analysis-agent
   pm2 start "bun run start:monitor" --name monitor-agent
   pm2 save
   pm2 startup
   ```

### Option 2: Docker (Alternative)

Create `Dockerfile`:
```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
```

Build and run:
```bash
docker build -t agent-swarm .
docker run -p 3000:3000 --env-file .env -v $(pwd)/.keys:/app/.keys agent-swarm
```

### Option 3: Kubernetes (Advanced)

For high availability and scaling, deploy to Kubernetes with:
- Orchestrator as Deployment
- Each agent type as separate Deployment
- Service for WebSocket communication
- ConfigMap for environment variables
- Secret for private keys

## 📊 Monitoring

### Health Checks

```bash
# Check orchestrator status
curl http://localhost:3000/health

# Check agent connections
bun run status

# Check wallet balances
bun run scripts/fund-wallets.ts
```

### Logs

```bash
# PM2 logs
pm2 logs orchestrator
pm2 logs trading-agent

# Docker logs
docker logs -f agent-swarm

# Kubernetes logs
kubectl logs -f deployment/orchestrator
```

## 🐛 Troubleshooting

### Agents Not Connecting

**Problem**: Agents can't connect to orchestrator

**Solution**:
1. Check orchestrator is running: `curl http://localhost:3000`
2. Check firewall allows port 3000
3. Verify `ORCHESTRATOR_PORT` in `.env`

### Jupiter API Errors

**Problem**: "Unable to connect" or rate limiting

**Solution**:
1. Check internet connectivity
2. Try different RPC endpoint
3. Wait a few minutes (rate limit)
4. Use Jupiter API key (if available)

### Wallet Insufficient Funds

**Problem**: "Insufficient funds" errors

**Solution**:
1. Check balances: `bun run scripts/fund-wallets.ts`
2. Fund via faucet: https://faucet.solana.com/
3. Wait for confirmation (30-60 seconds)

### TypeScript Errors

**Problem**: Type errors when running

**Solution**:
1. Check `tsconfig.json` is present
2. Run `bun install` to ensure types are installed
3. Restart IDE/editor for IntelliSense

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Orchestrator starts without errors
- ✅ All 4 agents connect successfully
- ✅ Pony Alpha responds to task analysis
- ✅ Jupiter quotes are fetched successfully
- ✅ Wallets have sufficient SOL
- ✅ WebSocket communication works
- ✅ Tasks can be submitted and completed

## 📞 Support

- **GitHub Issues**: https://github.com/Venkat5599/agent-swarm-intelligence/issues
- **Colosseum Discord**: https://discord.gg/colosseum
- **Solana Discord**: https://discord.gg/solana

## 🏆 Hackathon Submission

Before submitting:

1. **Test Everything**
   - [ ] All agents working
   - [ ] Jupiter integration tested
   - [ ] Pony Alpha responding
   - [ ] Documentation complete

2. **Update GitHub**
   ```bash
   git add .
   git commit -m "feat: complete TypeScript migration with real integrations"
   git push origin main
   ```

3. **Submit Project**
   ```bash
   bun run scripts/submit-project.ts
   ```

4. **Create Demo Video**
   - Show orchestrator starting
   - Show agents connecting
   - Show task execution
   - Show Jupiter quote fetching
   - Show Pony Alpha coordination

---

**Good luck with the hackathon! 🚀**

Deadline: February 12, 2026
Prize Pool: $100,000 USDC

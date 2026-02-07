# 🚀 Deployment Guide

Complete guide for deploying Agent Swarm Intelligence to production.

## 📋 Quick Checklist

### Before Deployment
- [ ] Fund Solana wallets (2 SOL each on devnet)
- [ ] Test all agents locally
- [ ] Verify Jupiter integration
- [ ] Test WebSocket dashboard
- [ ] Review environment variables

### Deployment Steps
- [ ] Choose deployment platform
- [ ] Configure environment
- [ ] Deploy backend services
- [ ] Deploy frontend dashboard
- [ ] Set up monitoring
- [ ] Test production environment

## 🔑 Wallet Setup

### 1. Check Current Balances
```bash
bun run fund-wallets
```

### 2. Fund Wallets
Visit [Solana Faucet](https://faucet.solana.com/) and request 2 SOL for each:

```
Orchestrator: FfieHaF1ahDN4axYgUzHkmNRgJmNetNcd4AoaK1BSSHY
Trading Agent: AJSE1sSiqPfm7zUcf7TGFeg2JLHzkLwQfr4mXQdrZ5v6
```

### 3. Verify Funding
```bash
bun run fund-wallets
# Should show: Orchestrator: 2 SOL, Trading Agent: 2 SOL
```

## 🧪 Local Testing

### Test Backend
```bash
# Terminal 1: Start orchestrator
bun run start

# Terminal 2: Start trading agent
bun run start:trading

# Verify: Agent connects and shows personality
```

### Test Frontend
```bash
# Terminal 3: Start dashboard
bun run dashboard

# Open: http://localhost:5173
# Verify: Dashboard connects, shows agents, displays metrics
```

### Test Jupiter Integration
```bash
bun run test:jupiter

# Expected: Quote fetching works (may fail if network issues)
```

## 🌐 Production Deployment

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel)**
```bash
cd dashboard
vercel --prod
```

**Backend (Railway)**
1. Visit [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo
4. Add environment variables
5. Deploy

**Advantages**: Easy, free tier, auto-scaling

### Option 2: Single VPS (DigitalOcean/AWS)

**1. Create Server**
- Ubuntu 22.04 LTS
- 2 vCPU, 4GB RAM
- Open ports: 3000, 5173, 8080

**2. Install Dependencies**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install PM2
npm install -g pm2
```

**3. Clone & Setup**
```bash
git clone https://github.com/Venkat5599/agent-swarm-intelligence
cd agent-swarm-intelligence
bun install
cd dashboard && bun install && cd ..
```

**4. Configure Environment**
```bash
# Copy .env and .keys
nano .env  # Add your keys
```

**5. Build Frontend**
```bash
cd dashboard
bun run build
cd ..
```

**6. Start Services**
```bash
# Start orchestrator
pm2 start "bun run start" --name orchestrator

# Start agents
pm2 start "bun run start:trading" --name trading
pm2 start "bun run start:research" --name research
pm2 start "bun run start:analysis" --name analysis
pm2 start "bun run start:monitor" --name monitor

# Serve dashboard
pm2 start "bun run dashboard" --name dashboard

# Save configuration
pm2 save
pm2 startup
```

**Advantages**: Full control, cost-effective

### Option 3: Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  orchestrator:
    build: .
    ports:
      - "3000:3000"
      - "8080:8080"
    env_file: .env
    volumes:
      - ./.keys:/app/.keys
    command: bun run start

  trading-agent:
    build: .
    env_file: .env
    volumes:
      - ./.keys:/app/.keys
    command: bun run start:trading
    depends_on:
      - orchestrator

  dashboard:
    build: ./dashboard
    ports:
      - "5173:5173"
    depends_on:
      - orchestrator
```

**Deploy**
```bash
docker-compose up -d
```

**Advantages**: Containerized, reproducible, easy scaling

## 🔧 Environment Configuration

### Required Variables
```env
# Colosseum
COLOSSEUM_API_KEY=your_key_here
AGENT_NAME=orchestrator-ai
AGENT_ID=857

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
ORCHESTRATOR_KEYPAIR_PATH=.keys/orchestrator.json
TRADING_AGENT_KEYPAIR_PATH=.keys/trading-agent.json

# OpenRouter (Pony Alpha)
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openrouter/pony-alpha

# Orchestrator
ORCHESTRATOR_PORT=3000
```

### Optional Variables
```env
# AugenPay (when configured)
AUGENPAY_PROGRAM_ID=your_program_id

# Custom RPC (for better performance)
SOLANA_RPC_URL=https://your-custom-rpc.com
```

## 📊 Monitoring

### Health Checks
```bash
# Check orchestrator
curl http://localhost:3000/health

# Check WebSocket
wscat -c ws://localhost:8080

# Check agents
bun run status
```

### PM2 Monitoring
```bash
# View all processes
pm2 list

# View logs
pm2 logs orchestrator
pm2 logs trading

# Monitor resources
pm2 monit
```

### Metrics to Track
- Agent connection status
- Task completion rate
- WebSocket connections
- Memory usage
- CPU usage
- Error rates

## 🐛 Common Issues

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /F /PID <pid>

# Kill process (Linux/Mac)
kill -9 <pid>
```

### Agents Not Connecting
1. Verify orchestrator is running
2. Check firewall settings
3. Verify WebSocket port (3000) is open
4. Check `.env` configuration

### Dashboard Not Loading
1. Check if dashboard is running on port 5173
2. Verify WebSocket URL in dashboard config
3. Check browser console for errors
4. Try clearing browser cache

### Jupiter API Errors
1. Check internet connectivity
2. Verify RPC endpoint is working
3. Try different RPC provider
4. Check for rate limiting

### Out of Memory
1. Increase server RAM
2. Restart services: `pm2 restart all`
3. Check for memory leaks in logs
4. Consider horizontal scaling

## 🔒 Security Best Practices

### Production Checklist
- [ ] Use environment variables for secrets
- [ ] Never commit `.env` or `.keys/`
- [ ] Use HTTPS for production
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Use strong API keys
- [ ] Implement rate limiting

### Recommended Tools
- **SSL**: Let's Encrypt (free)
- **Firewall**: UFW (Ubuntu) or Security Groups (AWS)
- **Monitoring**: PM2, Datadog, or New Relic
- **Logging**: Winston, Pino, or CloudWatch

## 📈 Scaling

### Horizontal Scaling
```bash
# Start multiple trading agents
pm2 start "bun run start:trading" --name trading-1
pm2 start "bun run start:trading" --name trading-2
pm2 start "bun run start:trading" --name trading-3
```

### Load Balancing
Use Nginx or HAProxy to distribute load:

```nginx
upstream orchestrator {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://orchestrator;
    }
}
```

### Database (Optional)
For persistent storage, add PostgreSQL or MongoDB:
```bash
# Store task history
# Store agent metrics
# Store trading history
```

## 🎯 Performance Optimization

### Backend
- Use Bun.js (already 3x faster than Node.js)
- Enable HTTP/2
- Implement caching
- Optimize database queries
- Use connection pooling

### Frontend
- Build for production: `bun run build`
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Network
- Use faster RPC endpoint
- Implement request batching
- Add retry logic
- Use WebSocket compression

## 📞 Support & Resources

### Documentation
- [Bun.js Docs](https://bun.sh/docs)
- [Solana Docs](https://docs.solana.com/)
- [Jupiter Docs](https://docs.jup.ag/)
- [React Docs](https://react.dev/)

### Community
- [Colosseum Discord](https://discord.gg/colosseum)
- [Solana Discord](https://discord.gg/solana)
- [GitHub Issues](https://github.com/Venkat5599/agent-swarm-intelligence/issues)

### Monitoring Services
- [PM2 Plus](https://pm2.io/) - Process monitoring
- [Datadog](https://www.datadoghq.com/) - Full-stack monitoring
- [Sentry](https://sentry.io/) - Error tracking

## ✅ Post-Deployment Checklist

- [ ] All services running
- [ ] Dashboard accessible
- [ ] Agents connecting
- [ ] WebSocket working
- [ ] Metrics tracking
- [ ] Logs configured
- [ ] Backups set up
- [ ] Monitoring alerts
- [ ] Documentation updated
- [ ] Team notified

## 🎬 Demo Preparation

### For Hackathon Judges

1. **Prepare Environment**
   - Ensure all services are running
   - Fund wallets with sufficient SOL
   - Test all features beforehand

2. **Demo Script** (2 minutes)
   - Show dashboard (0:15)
   - Start orchestrator (0:20)
   - Start agents (0:25)
   - Show live coordination (0:30)
   - Explain tech stack (0:30)

3. **Backup Plan**
   - Record video demo
   - Prepare screenshots
   - Have local environment ready

---

**Ready to deploy? Start with local testing, then choose your deployment option!** 🚀

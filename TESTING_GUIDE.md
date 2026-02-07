# 🧪 Testing Guide - Agent Swarm Intelligence

Complete guide to test your multi-agent system with the beautiful dashboard.

## 🚀 Quick Test (3 Steps)

### Step 1: Start the Orchestrator + WebSocket Server
```bash
bun run start
```

**What happens:**
- ✅ Orchestrator agent initializes
- ✅ WebSocket server starts on port 8080
- ✅ Dashboard server ready for connections
- ✅ Pony Alpha AI coordinator activates

**Expected output:**
```
🚀 Starting Agent Swarm Intelligence...
🤖 Orchestrator Agent initialized
📡 WebSocket server started on port 8080
✅ Ready to coordinate agents!
```

### Step 2: Start the Dashboard (New Terminal)
```bash
bun run dashboard
```

**What happens:**
- ✅ React dev server starts on port 5173
- ✅ Connects to WebSocket server
- ✅ Beautiful Raydium-inspired UI loads

**Open in browser:**
```
http://localhost:5173
```

**You should see:**
- 🟢 Green "Live" indicator (top-right)
- 📊 Swarm Metrics (all zeros initially)
- 🤖 "Initializing Agent Squad..." message
- 📡 Empty activity feed

### Step 3: Start Individual Agents (New Terminals)

**Terminal 3 - Trading Agent:**
```bash
bun run start:trading
```

**Terminal 4 - Research Agent:**
```bash
bun run start:research
```

**Terminal 5 - Analysis Agent:**
```bash
bun run start:analysis
```

**Terminal 6 - Monitor Agent:**
```bash
bun run start:monitor
```

**What you'll see in dashboard:**
- 🎨 Agent cards appear with personalities
- 🟢 Status indicators turn green
- 📡 Activity feed shows agent introductions
- 📊 Metrics update in real-time

---

## 🎯 Detailed Testing Scenarios

### Test 1: Basic Agent Communication

**Start orchestrator + dashboard:**
```bash
# Terminal 1
bun run start

# Terminal 2
bun run dashboard
```

**Expected Dashboard State:**
- Connection: 🟢 Live
- Agents: 0 active
- Activities: "Waiting for Activities..."

**Start one agent:**
```bash
# Terminal 3
bun run start:trading
```

**Expected Dashboard Updates:**
- ✅ AlphaSeeker card appears
- ✅ Status: "ready" with green pulse
- ✅ Activity: "💰 AlphaSeeker: Agent initialized and ready"
- ✅ Metrics: Active Tasks = 1

---

### Test 2: Multi-Agent Coordination

**Start all agents in sequence:**
```bash
# Terminal 3
bun run start:trading

# Terminal 4
bun run start:research

# Terminal 5
bun run start:analysis

# Terminal 6
bun run start:monitor
```

**Expected Dashboard:**
- 4 agent cards with unique colors:
  - 💰 AlphaSeeker (Emerald gradient)
  - 🔍 DataHunter (Purple gradient)
  - 🧠 InsightMaster (Cyan gradient)
  - 📊 WatchTower (Orange gradient)
- Activity feed shows all introductions
- Metrics show 4 active tasks

**Watch for:**
- Each agent's catchphrase in their card
- Personality traits displayed
- Real-time activity timestamps
- Smooth animations on card hover

---

### Test 3: Jupiter Trading Integration

**Test Jupiter DEX connection:**
```bash
bun run test:jupiter
```

**What it tests:**
- ✅ Jupiter API connectivity
- ✅ Token price fetching (SOL/USDC)
- ✅ Quote generation for swaps
- ✅ Route optimization

**Expected output:**
```
🧪 Testing Jupiter Integration...
✅ Jupiter API connected
💰 SOL Price: $XX.XX
📊 Quote: 1 SOL → X.XX USDC
✅ All tests passed!
```

**Dashboard should show:**
- Activity: "💰 AlphaSeeker: Jupiter price check completed"
- Details: token, price, timestamp

---

### Test 4: Wallet Status Check

**Check wallet balances:**
```bash
bun run status
```

**What it shows:**
- Orchestrator wallet balance
- Trading agent wallet balance
- Network status (devnet)
- RPC connection health

**Expected output:**
```
📊 Agent Swarm Status

Orchestrator Wallet:
  Address: FfieHaF1ahDN4axYgUzHkmNRgJmNetNcd4AoaK1BSSHY
  Balance: X.XX SOL

Trading Agent Wallet:
  Address: AJSE1sSiqPfm7zUcf7TGFeg2JLHzkLwQfr4mXQdrZ5v6
  Balance: X.XX SOL

Network: devnet
RPC: https://api.devnet.solana.com
```

---

### Test 5: WebSocket Reconnection

**Test auto-reconnect:**

1. Stop orchestrator (Ctrl+C in Terminal 1)
2. Watch dashboard: 🔴 "Connecting..." appears
3. Restart orchestrator: `bun run start`
4. Watch dashboard: 🟢 "Live" returns automatically

**Expected behavior:**
- Dashboard detects disconnection
- Shows red "Connecting..." badge
- Automatically reconnects when server is back
- Restores all agent states

---

### Test 6: Real-Time Activity Feed

**Generate activities:**

With all agents running, the orchestrator will:
- Assign tasks to agents
- Coordinate responses
- Log all activities

**Watch the activity feed for:**
- Agent introductions
- Task assignments
- Status updates
- Coordination messages
- Trading activities

**Each activity shows:**
- Agent emoji + name
- Timestamp
- Action description
- Expandable details

---

### Test 7: Responsive Design

**Test different screen sizes:**

1. **Desktop (1920x1080):**
   - 4-column agent grid
   - 4-column metrics grid
   - Full activity feed

2. **Tablet (768px):**
   - 2-column agent grid
   - 2-column metrics grid
   - Scrollable feed

3. **Mobile (375px):**
   - Single column layout
   - Stacked cards
   - Touch-friendly

**Test by resizing browser window**

---

### Test 8: Performance & Animations

**Check visual effects:**

1. **Hover over agent cards:**
   - Gradient glow appears
   - Border brightens
   - Smooth transition

2. **Hover over metric cards:**
   - Gradient overlay fades in
   - Shadow intensifies
   - Icon pulses

3. **Watch activity feed:**
   - New items slide in from left
   - Hover shows gradient border
   - Smooth scrolling

4. **Background animations:**
   - Pulsing gradient orbs
   - Grid pattern overlay
   - Smooth color transitions

---

## 🐛 Troubleshooting

### Issue: Dashboard shows "Connecting..."

**Solution:**
```bash
# Check if orchestrator is running
# Terminal 1 should show:
📡 WebSocket server started on port 8080

# If not, restart:
bun run start
```

### Issue: No agents appearing

**Solution:**
```bash
# Start agents individually:
bun run start:trading
bun run start:research
bun run start:analysis
bun run start:monitor
```

### Issue: "Insufficient funds" error

**Solution:**
```bash
# Check balances
bun run status

# Fund wallets from faucet:
# Visit: https://faucet.solana.com/
# Paste addresses shown in status command
```

### Issue: Jupiter test fails

**Solution:**
```bash
# Check RPC connection
curl https://api.devnet.solana.com

# Verify .env has correct RPC URL:
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Issue: Port already in use

**Solution:**
```bash
# Kill process on port 8080 (orchestrator)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (dashboard)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📊 Expected Metrics

After running for a few minutes:

- **Active Tasks**: 4-8 (depends on agent activity)
- **Completed Tasks**: 10-50 (increases over time)
- **Success Rate**: 85-100% (should be high)
- **Activities**: 20-100 (grows continuously)

---

## 🎬 Full Demo Flow

**Complete test sequence (5 minutes):**

```bash
# 1. Start orchestrator (Terminal 1)
bun run start

# 2. Start dashboard (Terminal 2)
bun run dashboard

# 3. Open browser
# http://localhost:5173

# 4. Start all agents (Terminals 3-6)
bun run start:trading
bun run start:research
bun run start:analysis
bun run start:monitor

# 5. Test Jupiter (Terminal 7)
bun run test:jupiter

# 6. Check status (Terminal 7)
bun run status

# 7. Watch dashboard for 2-3 minutes
# - See agents coordinate
# - Watch metrics update
# - View activity feed grow
# - Test hover effects
```

---

## ✅ Success Checklist

- [ ] Orchestrator starts without errors
- [ ] Dashboard connects (green "Live" badge)
- [ ] All 4 agents appear with correct colors
- [ ] Activity feed shows agent introductions
- [ ] Metrics update in real-time
- [ ] Hover effects work smoothly
- [ ] Jupiter test passes
- [ ] Wallet balances show correctly
- [ ] WebSocket auto-reconnects
- [ ] No console errors in browser

---

## 🎯 Next Steps

After successful testing:

1. **Deploy to production** - See `DEPLOYMENT_GUIDE.md`
2. **Add custom agents** - Extend the agent squad
3. **Implement trading strategies** - Real Jupiter swaps
4. **Monitor performance** - Track success rates
5. **Submit to hackathon** - Win that $100k! 🏆

---

**Need help? Check the logs in each terminal for detailed information.**

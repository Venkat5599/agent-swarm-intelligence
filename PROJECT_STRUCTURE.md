# 📁 Project Structure

## Clean and Organized

```
agent-swarm-intelligence/
├── src/
│   ├── agents/                    # Specialized agent implementations
│   │   ├── ResearchAgent.js       # Data gathering agent
│   │   ├── AnalysisAgent.js       # Data processing agent
│   │   ├── TradingAgent.js        # Trade execution agent
│   │   └── MonitorAgent.js        # Performance tracking agent
│   │
│   ├── ai/                        # AI coordination
│   │   └── PonyCoordinator.js     # Pony Alpha integration
│   │
│   ├── orchestrator/              # Core orchestration logic
│   │   ├── OrchestratorAgent.js   # Main orchestrator
│   │   ├── SwarmCoordinator.js    # WebSocket coordination
│   │   ├── TaskManager.js         # Task lifecycle management
│   │   └── AgentRegistry.js       # Agent type registry
│   │
│   ├── colosseum/                 # Hackathon integration
│   │   └── ColosseumClient.js     # API client
│   │
│   └── index.js                   # Entry point
│
├── scripts/                       # Utility scripts
│   ├── create-swarm-project.js    # Create hackathon project
│   ├── status.js                  # Check agent status
│   └── submit-project.js          # Submit for judging
│
├── docs/                          # Documentation
│   ├── README.md                  # Project overview
│   ├── START_HERE.md              # Quick start guide
│   ├── QUICKSTART.md              # Detailed setup
│   ├── PONY_INTEGRATION.md        # Pony Alpha docs
│   ├── WINNING_STRATEGY.md        # Why we'll win
│   └── PROJECT_STRUCTURE.md       # This file
│
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
└── package-lock.json              # Locked dependencies
```

## File Purposes

### Core Application

**src/index.js**
- Entry point for the orchestrator
- Initializes all systems
- Starts coordination server

**src/orchestrator/OrchestratorAgent.js**
- Main orchestrator logic
- Integrates Pony Alpha for AI decisions
- Manages task lifecycle
- Coordinates all agents

**src/orchestrator/SwarmCoordinator.js**
- WebSocket server for agent communication
- Handles agent connections
- Routes messages between agents
- Broadcasts to swarm

**src/orchestrator/TaskManager.js**
- Task creation and tracking
- Progress monitoring
- Completion detection
- Result compilation

**src/orchestrator/AgentRegistry.js**
- Registers agent types and capabilities
- Tracks available agents
- Capability matching

### AI Coordination

**src/ai/PonyCoordinator.js**
- Pony Alpha integration
- Task analysis
- Agent coordination
- Conflict resolution
- Performance evaluation

### Specialized Agents

**src/agents/ResearchAgent.js**
- Connects to orchestrator via WebSocket
- Gathers data from multiple sources
- Returns findings to orchestrator

**src/agents/AnalysisAgent.js**
- Processes research data
- Generates insights and recommendations
- Calculates risks and opportunities

**src/agents/TradingAgent.js**
- Executes trades on Solana DEXs
- Manages positions
- Handles risk management

**src/agents/MonitorAgent.js**
- Tracks swarm performance
- Detects anomalies
- Provides feedback
- Generates metrics

### Hackathon Integration

**src/colosseum/ColosseumClient.js**
- API client for hackathon platform
- Project management
- Forum integration
- Status checking

### Scripts

**scripts/create-swarm-project.js**
- Creates project on hackathon platform
- Sets up project description
- Configures tags and metadata

**scripts/status.js**
- Checks agent registration status
- Shows hackathon timeline
- Displays engagement metrics

**scripts/submit-project.js**
- Submits project for judging
- Final validation
- Locks project

## Running the System

### Start Orchestrator
```bash
npm start
```
Runs: `node src/index.js`

### Start Specialized Agents
```bash
npm run start:research   # Research Agent
npm run start:analysis   # Analysis Agent
npm run start:trading    # Trading Agent
npm run start:monitor    # Monitor Agent
```

### Utility Commands
```bash
npm run status           # Check status
npm run create-project   # Create project
npm run submit-project   # Submit for judging
```

## Key Dependencies

- **openai** - OpenRouter/Pony Alpha integration
- **ws** - WebSocket for agent communication
- **@solana/web3.js** - Solana blockchain integration
- **@coral-xyz/anchor** - Smart contract framework
- **dotenv** - Environment variable management

## Environment Variables

See `.env.example` for all required variables:
- `COLOSSEUM_API_KEY` - Hackathon API key
- `OPENROUTER_API_KEY` - Pony Alpha access
- `SOLANA_RPC_URL` - Solana RPC endpoint
- `ORCHESTRATOR_PORT` - WebSocket server port

## Clean and Minimal

This structure is:
- ✅ **Organized** - Clear separation of concerns
- ✅ **Modular** - Easy to extend with new agents
- ✅ **Documented** - Every file has a purpose
- ✅ **Professional** - Production-ready architecture
- ✅ **Minimal** - No unnecessary files

Perfect for hackathon judging! 🏆

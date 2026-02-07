# 🎨 Agent Swarm Intelligence Dashboard

Modern React + TypeScript + Tailwind CSS + shadcn/ui dashboard for real-time agent monitoring.

## ✨ Features

- **Real-time WebSocket Connection** - Live updates from agent activities
- **Beautiful UI** - Modern design with Tailwind CSS and shadcn/ui components
- **Agent Personalities** - Each agent displayed with unique traits and emojis
- **Live Metrics** - Active tasks, completion rate, success rate
- **Activity Feed** - Real-time stream of agent actions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - Supports dark mode (toggle coming soon)

## 🚀 Quick Start

### Development
```bash
# From root directory
bun run dashboard

# Or from dashboard directory
cd dashboard
bun run dev
```

### Build for Production
```bash
# From root directory
bun run dashboard:build

# Or from dashboard directory
cd dashboard
bun run build
```

## 🎨 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Modern icon library
- **Bun** - Fast JavaScript runtime

## 📦 Components

### UI Components (shadcn/ui)
- `Card` - Container component
- `Badge` - Tag/label component
- `ScrollArea` - Scrollable container

### Custom Components
- `MetricsCard` - Displays swarm metrics
- `AgentCard` - Shows agent personality and status
- `ActivityFeed` - Real-time activity stream

### Hooks
- `useWebSocket` - WebSocket connection management

## 🔌 WebSocket API

The dashboard connects to `ws://localhost:8080` and receives:

### Message Types

**initial_state**
```json
{
  "type": "initial_state",
  "data": {
    "agents": [...],
    "metrics": {...}
  }
}
```

**activity**
```json
{
  "type": "activity",
  "data": {
    "timestamp": 1234567890,
    "agentType": "trading",
    "agentName": "AlphaSeeker",
    "action": "trade_executed",
    "details": {...},
    "emoji": "💰"
  }
}
```

**metrics**
```json
{
  "type": "metrics",
  "data": {
    "activeTasks": 5,
    "completedTasks": 42,
    "successRate": 95.5,
    "totalActivities": 128
  }
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```js
theme: {
  extend: {
    colors: {
      primary: "hsl(262 83% 58%)", // Purple
      // Add your colors here
    }
  }
}
```

### Components
All components are in `src/components/` and can be customized.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚧 Future Enhancements

- [ ] Dark mode toggle
- [ ] Agent filtering
- [ ] Activity search
- [ ] Export metrics
- [ ] Real-time charts
- [ ] Agent chat interface
- [ ] Task submission UI
- [ ] Settings panel

## 📝 License

MIT

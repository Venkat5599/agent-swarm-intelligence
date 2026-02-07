import { useWebSocket } from './hooks/useWebSocket';
import { MetricsCard } from './components/MetricsCard';
import { AgentCard } from './components/AgentCard';
import { ActivityFeed } from './components/ActivityFeed';
import { Wifi, WifiOff } from 'lucide-react';

const WS_URL = 'ws://localhost:8080';

function App() {
  const { isConnected, agents, activities, metrics } = useWebSocket(WS_URL);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
          isConnected 
            ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
            : 'bg-red-500/20 text-red-700 dark:text-red-300'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Connecting...</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🐝 Agent Swarm Intelligence
          </h1>
          <p className="text-xl text-muted-foreground">
            Live Multi-Agent Coordination Dashboard
          </p>
        </header>

        {/* Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 Swarm Metrics</h2>
          <MetricsCard metrics={metrics} />
        </div>

        {/* Agent Squad */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🤖 Agent Squad</h2>
          {agents.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
              <p className="text-lg">Waiting for agents to connect...</p>
              <p className="text-sm mt-2">Start the orchestrator to see your agent squad</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.type} agent={agent} />
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed activities={activities} />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ using Bun.js, TypeScript, React, Tailwind CSS, and Solana</p>
          <p className="mt-2">
            <a 
              href="https://github.com/Venkat5599/agent-swarm-intelligence" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

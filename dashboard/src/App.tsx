import { useWebSocket } from './hooks/useWebSocket';
import { MetricsCard } from './components/MetricsCard';
import { AgentCard } from './components/AgentCard';
import { ActivityFeed } from './components/ActivityFeed';
import { Wifi, WifiOff, Github } from 'lucide-react';

const WS_URL = 'ws://localhost:8080';

function App() {
  const { isConnected, agents, activities, metrics } = useWebSocket(WS_URL);

  return (
    <div className="min-h-screen bg-[#0a0b0d] relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/20 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Connection Status */}
      <div className="fixed top-6 right-6 z-50">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
          isConnected 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/20' 
            : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-lg shadow-red-500/20'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-semibold">Connecting...</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold text-gray-300 tracking-wide">POWERED BY SOLANA</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            Agent Swarm
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Multi-Agent Intelligence Coordination System
          </p>
        </header>

        {/* Metrics */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
            <h2 className="text-2xl font-bold text-white">Swarm Metrics</h2>
          </div>
          <MetricsCard metrics={metrics} />
        </div>

        {/* Agent Squad */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            <h2 className="text-2xl font-bold text-white">Agent Squad</h2>
          </div>
          {agents.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-500 animate-spin" />
              </div>
              <p className="text-lg text-gray-300 font-medium">Initializing Agent Squad...</p>
              <p className="text-sm text-gray-500 mt-2">Start the orchestrator to activate agents</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.type} agent={agent} />
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="mb-12">
          <ActivityFeed activities={activities} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Built with</span>
              <span className="text-purple-400">Bun.js</span>
              <span>•</span>
              <span className="text-cyan-400">TypeScript</span>
              <span>•</span>
              <span className="text-blue-400">React</span>
              <span>•</span>
              <span className="text-purple-400">Solana</span>
            </div>
            <a 
              href="https://github.com/Venkat5599/agent-swarm-intelligence" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white group"
            >
              <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">View on GitHub</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

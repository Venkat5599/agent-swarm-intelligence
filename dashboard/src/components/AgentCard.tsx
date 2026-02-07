import type { AgentPersonality } from '../types';

interface AgentCardProps {
  agent: AgentPersonality;
}

export function AgentCard({ agent }: AgentCardProps) {
  const gradients = {
    research: 'from-purple-500 to-pink-500',
    analysis: 'from-cyan-500 to-blue-500',
    trading: 'from-emerald-500 to-green-500',
    monitor: 'from-orange-500 to-yellow-500',
  };

  const gradient = gradients[agent.type as keyof typeof gradients] || 'from-gray-500 to-gray-600';

  return (
    <div className="group relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Gradient Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      
      {/* Animated Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`text-5xl p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            {agent.emoji}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${agent.status === 'ready' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className={`text-xs font-semibold uppercase tracking-wider ${agent.status === 'ready' ? 'text-emerald-400' : 'text-gray-500'}`}>
              {agent.status}
            </span>
          </div>
        </div>

        {/* Agent Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
          <p className="text-sm text-gray-400 font-medium">{agent.role}</p>
        </div>

        {/* Traits */}
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.traits.map((trait) => (
            <span 
              key={trait} 
              className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-gray-300 border border-white/10"
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Catchphrase */}
        <div className="relative pl-4 py-2">
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${gradient}`} />
          <p className="text-sm italic text-gray-400 leading-relaxed">
            "{agent.catchphrase}"
          </p>
        </div>
      </div>
    </div>
  );
}

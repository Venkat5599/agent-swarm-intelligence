import { ScrollArea } from './ui/scroll-area';
import type { AgentActivity } from '../types';

interface ActivityFeedProps {
  activities: AgentActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Live Activity Feed</h2>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300">LIVE</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-500 animate-spin" />
                </div>
                <p className="text-lg text-gray-300 font-medium">Waiting for Activities...</p>
                <p className="text-sm text-gray-500 mt-2">Start the orchestrator to see live updates</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={`${activity.timestamp}-${index}`}
                  className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 animate-in slide-in-from-left"
                >
                  {/* Gradient Left Border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                        {activity.emoji}
                      </div>
                      <div>
                        <span className="font-bold text-white">{activity.agentName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs text-gray-400 font-medium">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed mb-3 pl-14">
                    {activity.action}
                  </p>
                  
                  {Object.keys(activity.details).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 pl-14">
                      <div className="space-y-2">
                        {Object.entries(activity.details).map(([key, value]) => (
                          <div key={key} className="flex gap-3 text-xs">
                            <span className="font-semibold text-purple-400 uppercase tracking-wider min-w-[80px]">
                              {key}:
                            </span>
                            <span className="text-gray-400 truncate flex-1">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

import { Activity, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import type { SwarmMetrics } from '../types';

interface MetricsCardProps {
  metrics: SwarmMetrics;
}

export function MetricsCard({ metrics }: MetricsCardProps) {
  const metricItems = [
    {
      label: 'Active Tasks',
      value: metrics.activeTasks,
      icon: Activity,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      label: 'Completed',
      value: metrics.completedTasks,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-500',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/20',
    },
    {
      label: 'Activities',
      value: metrics.totalActivities,
      icon: Zap,
      gradient: 'from-orange-500 to-yellow-500',
      shadowColor: 'shadow-orange-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricItems.map((item) => (
        <div 
          key={item.label} 
          className={`group relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:shadow-2xl ${item.shadowColor}`}
        >
          {/* Gradient Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg ${item.shadowColor}`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="text-4xl font-black text-white tracking-tight">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

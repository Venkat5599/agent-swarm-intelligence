import { Card, CardContent } from './ui/card';
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
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Completed',
      value: metrics.completedTasks,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Activities',
      value: metrics.totalActivities,
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricItems.map((item) => (
        <Card key={item.label} className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-3xl font-bold mt-2">{item.value}</p>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📡</span>
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Waiting for agent activities...</p>
                <p className="text-sm mt-2">Start the orchestrator to see live updates</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={`${activity.timestamp}-${index}`}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors animate-in slide-in-from-left duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{activity.emoji}</span>
                      <span className="font-semibold">{activity.agentName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">{activity.action}</p>
                  
                  {Object.keys(activity.details).length > 0 && (
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground space-y-1">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span className="truncate">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

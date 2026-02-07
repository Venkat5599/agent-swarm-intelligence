import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { AgentPersonality } from '../types';

interface AgentCardProps {
  agent: AgentPersonality;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{agent.emoji}</div>
          <div className="flex-1">
            <CardTitle className="text-xl">{agent.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{agent.role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${agent.status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium capitalize">{agent.status}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {agent.traits.map((trait) => (
            <Badge key={trait} variant="secondary" className="text-xs">
              {trait}
            </Badge>
          ))}
        </div>
        
        <p className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
          "{agent.catchphrase}"
        </p>
      </CardContent>
    </Card>
  );
}

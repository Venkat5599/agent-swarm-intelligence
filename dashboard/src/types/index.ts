export interface AgentPersonality {
  type: string;
  name: string;
  role: string;
  emoji: string;
  traits: string[];
  catchphrase: string;
  communicationStyle: string;
  status: string;
}

export interface AgentActivity {
  timestamp: number;
  agentType: string;
  agentName: string;
  action: string;
  details: Record<string, any>;
  emoji: string;
}

export interface SwarmMetrics {
  activeTasks: number;
  completedTasks: number;
  successRate: number;
  totalActivities: number;
  registeredAgents?: number;
}

export interface WebSocketMessage {
  type: 'initial_state' | 'activities' | 'activity' | 'metrics';
  data: any;
}

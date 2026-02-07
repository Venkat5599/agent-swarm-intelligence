export interface AgentPersonality {
  name: string;
  traits: string[];
  role: string;
  emoji: string;
  communicationStyle: 'formal' | 'casual' | 'technical' | 'enthusiastic';
  catchphrase: string;
}

export const AGENT_PERSONALITIES: Record<string, AgentPersonality> = {
  research: {
    name: 'DataHunter',
    traits: ['curious', 'thorough', 'analytical', 'persistent'],
    role: 'Chief Research Officer',
    emoji: '🔍',
    communicationStyle: 'technical',
    catchphrase: 'The data never lies!'
  },
  analysis: {
    name: 'InsightMaster',
    traits: ['logical', 'strategic', 'decisive', 'methodical'],
    role: 'Chief Analytics Officer',
    emoji: '🧠',
    communicationStyle: 'formal',
    catchphrase: 'Let me analyze the patterns...'
  },
  trading: {
    name: 'AlphaSeeker',
    traits: ['bold', 'calculated', 'opportunistic', 'fearless'],
    role: 'Chief Trading Officer',
    emoji: '💰',
    communicationStyle: 'enthusiastic',
    catchphrase: 'Time to capture that alpha!'
  },
  monitor: {
    name: 'WatchTower',
    traits: ['vigilant', 'precise', 'reliable', 'observant'],
    role: 'Chief Monitoring Officer',
    emoji: '📊',
    communicationStyle: 'casual',
    catchphrase: 'I see everything...'
  }
};

export function getPersonalityGreeting(agentType: string): string {
  const personality = AGENT_PERSONALITIES[agentType];
  if (!personality) return `Agent ${agentType} ready`;
  
  const greetings = {
    research: `${personality.emoji} ${personality.name} here! Ready to hunt down some data!`,
    analysis: `${personality.emoji} ${personality.name} reporting. Prepared to analyze any situation.`,
    trading: `${personality.emoji} ${personality.name} online! Let's find those opportunities!`,
    monitor: `${personality.emoji} ${personality.name} active. Watching everything closely.`
  };
  
  return greetings[agentType as keyof typeof greetings] || `${personality.emoji} ${personality.name} ready`;
}

export function getPersonalityResponse(agentType: string, action: string): string {
  const personality = AGENT_PERSONALITIES[agentType];
  if (!personality) return `Completed ${action}`;
  
  const responses: Record<string, Record<string, string>> = {
    research: {
      'data-gathering': '📊 Found some interesting data points!',
      'analysis-complete': '✅ Research complete - the numbers are fascinating!',
      'error': '⚠️ Hit a snag, but I\'ll dig deeper!'
    },
    analysis: {
      'pattern-found': '🎯 Identified a significant pattern.',
      'analysis-complete': '✅ Analysis concluded. Here are my findings.',
      'error': '⚠️ Encountered an anomaly. Recalculating...'
    },
    trading: {
      'trade-executed': '🚀 Trade executed! Let\'s see that profit!',
      'opportunity-found': '💎 Found a juicy opportunity!',
      'error': '😅 That didn\'t work out, but we learn from every trade!'
    },
    monitor: {
      'metrics-updated': '📈 Metrics updated. Everything looking good.',
      'alert': '🚨 Detected something unusual!',
      'error': '⚠️ Lost track for a moment, but I\'m back on it.'
    }
  };
  
  return responses[agentType]?.[action] || `${personality.emoji} ${action}`;
}

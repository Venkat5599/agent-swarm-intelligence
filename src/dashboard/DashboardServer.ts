import { WebSocketServer, WebSocket } from 'ws';
import type { OrchestratorAgent } from '../orchestrator/OrchestratorAgent';
import { AGENT_PERSONALITIES } from '../types/personality';

interface AgentActivity {
  timestamp: number;
  agentType: string;
  agentName: string;
  action: string;
  details: any;
  emoji: string;
}

export class DashboardServer {
  private wss: WebSocketServer;
  private orchestrator: OrchestratorAgent;
  private activities: AgentActivity[] = [];
  private maxActivities = 100;

  constructor(orchestrator: OrchestratorAgent, port: number = 8080) {
    this.orchestrator = orchestrator;
    this.wss = new WebSocketServer({ port });
    
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('📊 Dashboard client connected');
      
      // Send initial state
      this.sendInitialState(ws);
      
      // Send recent activities
      ws.send(JSON.stringify({
        type: 'activities',
        data: this.activities.slice(-20)
      }));
    });
    
    console.log(`📊 Dashboard WebSocket server running on ws://localhost:${port}`);
    console.log(`   Connect to see live agent activities!`);
  }

  private sendInitialState(ws: WebSocket): void {
    const state = {
      type: 'initial_state',
      data: {
        agents: Object.entries(AGENT_PERSONALITIES).map(([type, personality]) => ({
          type,
          ...personality,
          status: 'ready'
        })),
        metrics: this.orchestrator.getMetrics(),
        timestamp: Date.now()
      }
    };
    
    ws.send(JSON.stringify(state));
  }

  logActivity(agentType: string, action: string, details: any = {}): void {
    const personality = AGENT_PERSONALITIES[agentType];
    
    const activity: AgentActivity = {
      timestamp: Date.now(),
      agentType,
      agentName: personality?.name || agentType,
      action,
      details,
      emoji: personality?.emoji || '🤖'
    };
    
    this.activities.push(activity);
    
    // Keep only last N activities
    if (this.activities.length > this.maxActivities) {
      this.activities = this.activities.slice(-this.maxActivities);
    }
    
    // Broadcast to all connected clients
    this.broadcast({
      type: 'activity',
      data: activity
    });
    
    // Also log to console with personality
    const time = new Date(activity.timestamp).toLocaleTimeString();
    console.log(`[${time}] ${activity.emoji} ${activity.agentName}: ${action}`);
    if (Object.keys(details).length > 0) {
      console.log(`   Details:`, details);
    }
  }

  logTrade(trade: any): void {
    this.logActivity('trading', 'trade_executed', {
      inputToken: trade.inputToken || 'SOL',
      outputToken: trade.outputToken || 'USDC',
      amount: trade.amount,
      profit: trade.profit,
      signature: trade.signature
    });
  }

  logResearch(research: any): void {
    this.logActivity('research', 'data_gathered', {
      sources: research.sources?.length || 0,
      findings: research.findings
    });
  }

  logAnalysis(analysis: any): void {
    this.logActivity('analysis', 'analysis_complete', {
      confidence: analysis.confidence,
      recommendation: analysis.recommendation
    });
  }

  logMonitoring(metrics: any): void {
    this.logActivity('monitor', 'metrics_updated', {
      successRate: metrics.successRate,
      activeTasks: metrics.activeTasks
    });
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  getActivities(): AgentActivity[] {
    return this.activities;
  }

  getMetrics(): any {
    return {
      totalActivities: this.activities.length,
      connectedClients: this.wss.clients.size,
      orchestratorMetrics: this.orchestrator.getMetrics(),
      agentPersonalities: AGENT_PERSONALITIES
    };
  }
}

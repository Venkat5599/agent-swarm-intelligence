import { WebSocketServer, WebSocket } from 'ws';
import type { OrchestratorAgent } from './OrchestratorAgent';
import type { Task } from '../types';
import type { IncomingMessage } from 'http';

interface Agent {
  type: string;
  id: string;
  ws: WebSocket;
  connectedAt: Date;
  tasksCompleted: number;
}

interface AgentMessage {
  type: string;
  taskId?: string;
  result?: any;
  progress?: number;
}

export class SwarmCoordinator {
  private orchestrator: OrchestratorAgent;
  private wss: WebSocketServer | null;
  private agents: Map<string, Agent>;
  private port: number;

  constructor(orchestrator: OrchestratorAgent) {
    this.orchestrator = orchestrator;
    this.wss = null;
    this.agents = new Map();
    this.port = parseInt(process.env.ORCHESTRATOR_PORT || '3000');
  }

  async start(): Promise<void> {
    this.wss = new WebSocketServer({ port: this.port });
    
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const agentType = req.headers['x-agent-type'] as string;
      const agentId = req.headers['x-agent-id'] as string;
      
      if (agentType && agentId) {
        this.registerAgent(agentType, agentId, ws);
        
        ws.on('message', async (data: Buffer) => {
          const message = JSON.parse(data.toString()) as AgentMessage;
          await this.handleAgentMessage(agentType, agentId, message);
        });
        
        ws.on('close', () => {
          this.unregisterAgent(agentType, agentId);
        });
      }
    });
    
    console.log(`🌐 Swarm coordinator listening on port ${this.port}`);
  }

  private registerAgent(agentType: string, agentId: string, ws: WebSocket): void {
    const key = `${agentType}:${agentId}`;
    this.agents.set(key, {
      type: agentType,
      id: agentId,
      ws,
      connectedAt: new Date(),
      tasksCompleted: 0
    });
    
    console.log(`🔗 ${agentType} agent connected (${agentId})`);
  }

  private unregisterAgent(agentType: string, agentId: string): void {
    const key = `${agentType}:${agentId}`;
    this.agents.delete(key);
    console.log(`🔌 ${agentType} agent disconnected (${agentId})`);
  }

  async delegateTask(taskId: string, task: Task, recommendedAgents?: string[]): Promise<void> {
    console.log(`🎯 Delegating task ${taskId}...`);
    
    // Use Pony's recommended agents if provided, otherwise determine from task
    const requiredAgents = (recommendedAgents && recommendedAgents.length > 0)
      ? recommendedAgents
      : this.determineRequiredAgents(task);
    
    for (const agentType of requiredAgents) {
      const agent = this.findAvailableAgent(agentType);
      
      if (agent) {
        this.sendTaskToAgent(agent, taskId, task);
      } else {
        console.log(`⚠️  No ${agentType} agent available, queuing task...`);
      }
    }
  }

  private determineRequiredAgents(task: any): string[] {
    const agents: string[] = [];
    
    if (task.requiresData) agents.push('research');
    if (task.requiresAnalysis) agents.push('analysis');
    if (task.requiresExecution) agents.push('trading');
    
    // Monitor agent always tracks
    agents.push('monitor');
    
    return agents;
  }

  private findAvailableAgent(agentType: string): Agent | null {
    for (const [key, agent] of this.agents) {
      if (agent.type === agentType && agent.ws.readyState === WebSocket.OPEN) {
        return agent;
      }
    }
    return null;
  }

  private sendTaskToAgent(agent: Agent, taskId: string, task: Task): void {
    const message = {
      type: 'TASK_ASSIGNMENT',
      taskId,
      task,
      assignedAt: new Date().toISOString()
    };
    
    agent.ws.send(JSON.stringify(message));
    console.log(`📤 Task ${taskId} assigned to ${agent.type} agent`);
  }

  private async handleAgentMessage(agentType: string, agentId: string, message: AgentMessage): Promise<void> {
    switch (message.type) {
      case 'TASK_COMPLETE':
        if (message.taskId && message.result) {
          await this.orchestrator.handleAgentResponse(
            agentType,
            message.taskId,
            message.result
          );
        }
        break;
        
      case 'TASK_PROGRESS':
        console.log(`📊 Progress from ${agentType}: ${message.progress}%`);
        break;
        
      case 'AGENT_STATUS':
        console.log(`💓 Heartbeat from ${agentType} agent`);
        break;
        
      default:
        console.log(`Unknown message type from ${agentType}: ${message.type}`);
    }
  }

  broadcast(message: any): void {
    for (const [key, agent] of this.agents) {
      if (agent.ws.readyState === WebSocket.OPEN) {
        agent.ws.send(JSON.stringify(message));
      }
    }
  }

  getConnectedAgents(): Record<string, any[]> {
    const agents: Record<string, any[]> = {};
    for (const [key, agent] of this.agents) {
      if (!agents[agent.type]) agents[agent.type] = [];
      agents[agent.type].push({
        id: agent.id,
        connectedAt: agent.connectedAt,
        tasksCompleted: agent.tasksCompleted
      });
    }
    return agents;
  }
}

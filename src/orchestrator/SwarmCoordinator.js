import { WebSocketServer } from 'ws';

export class SwarmCoordinator {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.wss = null;
    this.agents = new Map(); // Connected specialized agents
    this.port = process.env.ORCHESTRATOR_PORT || 3000;
  }

  async start() {
    this.wss = new WebSocketServer({ port: this.port });
    
    this.wss.on('connection', (ws, req) => {
      const agentType = req.headers['x-agent-type'];
      const agentId = req.headers['x-agent-id'];
      
      if (agentType && agentId) {
        this.registerAgent(agentType, agentId, ws);
        
        ws.on('message', async (data) => {
          const message = JSON.parse(data.toString());
          await this.handleAgentMessage(agentType, agentId, message);
        });
        
        ws.on('close', () => {
          this.unregisterAgent(agentType, agentId);
        });
      }
    });
    
    console.log(`🌐 Swarm coordinator listening on port ${this.port}`);
  }

  registerAgent(agentType, agentId, ws) {
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

  unregisterAgent(agentType, agentId) {
    const key = `${agentType}:${agentId}`;
    this.agents.delete(key);
    console.log(`🔌 ${agentType} agent disconnected (${agentId})`);
  }

  async delegateTask(taskId, task) {
    console.log(`🎯 Delegating task ${taskId}...`);
    
    // Determine which agents are needed for this task
    const requiredAgents = this.determineRequiredAgents(task);
    
    for (const agentType of requiredAgents) {
      const agent = this.findAvailableAgent(agentType);
      
      if (agent) {
        this.sendTaskToAgent(agent, taskId, task);
      } else {
        console.log(`⚠️  No ${agentType} agent available, queuing task...`);
      }
    }
  }

  determineRequiredAgents(task) {
    // Based on task type, determine which agents are needed
    const agents = [];
    
    if (task.requiresData) agents.push('research');
    if (task.requiresAnalysis) agents.push('analysis');
    if (task.requiresExecution) agents.push('trading');
    
    // Monitor agent always tracks
    agents.push('monitor');
    
    return agents;
  }

  findAvailableAgent(agentType) {
    for (const [key, agent] of this.agents) {
      if (agent.type === agentType && agent.ws.readyState === 1) {
        return agent;
      }
    }
    return null;
  }

  sendTaskToAgent(agent, taskId, task) {
    const message = {
      type: 'TASK_ASSIGNMENT',
      taskId,
      task,
      assignedAt: new Date().toISOString()
    };
    
    agent.ws.send(JSON.stringify(message));
    console.log(`📤 Task ${taskId} assigned to ${agent.type} agent`);
  }

  async handleAgentMessage(agentType, agentId, message) {
    switch (message.type) {
      case 'TASK_COMPLETE':
        await this.orchestrator.handleAgentResponse(
          agentType,
          message.taskId,
          message.result
        );
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

  broadcast(message) {
    for (const [key, agent] of this.agents) {
      if (agent.ws.readyState === 1) {
        agent.ws.send(JSON.stringify(message));
      }
    }
  }

  getConnectedAgents() {
    const agents = {};
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

import WebSocket from 'ws';

interface MonitorAgentConfig {
  id?: string;
  orchestratorUrl?: string;
}

interface Message {
  type: string;
  taskId?: string;
  task?: any;
}

interface Metric {
  taskId: string;
  startTime: Date;
  agentsInvolved: string[];
  status: string;
  timestamp: string;
}

export class MonitorAgent {
  private id: string;
  private orchestratorUrl: string;
  private ws: WebSocket | null;
  private metrics: Metric[];

  constructor(config: MonitorAgentConfig) {
    this.id = config.id || 'monitor-1';
    this.orchestratorUrl = config.orchestratorUrl || 'ws://localhost:3000';
    this.ws = null;
    this.metrics = [];
  }

  async connect(): Promise<void> {
    this.ws = new WebSocket(this.orchestratorUrl, {
      headers: {
        'x-agent-type': 'monitor',
        'x-agent-id': this.id
      }
    });

    this.ws.on('open', () => {
      console.log('📊 Monitor Agent connected to orchestrator');
      this.sendStatus();
    });

    this.ws.on('message', async (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString()) as Message;
        await this.handleMessage(message);
      } catch (err) {
        console.error('⚠️ Failed to parse message:', (err as Error).message);
      }
    });

    this.ws.on('close', () => {
      console.log('🔌 Disconnected from orchestrator');
    });

    this.ws.on('error', (err: Error) => {
      console.error('❌ WebSocket error:', err.message);
    });
  }

  private async handleMessage(message: Message): Promise<void> {
    switch (message.type) {
      case 'TASK_ASSIGNMENT':
        if (message.taskId && message.task) {
          await this.executeTask(message.taskId, message.task);
        }
        break;
    }
  }

  private async executeTask(taskId: string, task: any): Promise<void> {
    console.log(`📊 Monitor Agent tracking task: ${taskId}`);
    
    const metrics = await this.trackPerformance(task);
    
    this.sendResult(taskId, { metrics });
  }

  private async trackPerformance(task: any): Promise<any> {
    console.log('📈 Tracking swarm performance...');
    
    // In real implementation:
    // - Performance metrics
    // - Success rates
    // - Anomaly detection
    // - Feedback generation
    
    const metric: Metric = {
      taskId: task.id,
      startTime: new Date(),
      agentsInvolved: ['research', 'analysis', 'trading'],
      status: 'in-progress',
      timestamp: new Date().toISOString()
    };
    
    this.metrics.push(metric);
    
    return {
      totalTasks: this.metrics.length,
      successRate: 0.95,
      avgDuration: 5000,
      anomalies: [],
      feedback: 'Swarm performing optimally',
      timestamp: new Date().toISOString()
    };
  }

  private sendResult(taskId: string, result: any): void {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'TASK_COMPLETE',
      taskId,
      result
    }));
    console.log(`✅ Monitoring complete for task ${taskId}`);
  }

  private sendStatus(): void {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'AGENT_STATUS',
      status: 'ready',
      capabilities: ['performance-tracking', 'anomaly-detection', 'reporting']
    }));
  }
}

if (import.meta.main) {
  const agent = new MonitorAgent({ id: process.env.AGENT_ID || 'monitor-1' });
  agent.connect();
}

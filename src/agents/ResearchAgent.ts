import WebSocket from 'ws';

interface ResearchAgentConfig {
  id?: string;
  orchestratorUrl?: string;
}

interface Message {
  type: string;
  taskId?: string;
  task?: any;
}

export class ResearchAgent {
  private id: string;
  private orchestratorUrl: string;
  private ws: WebSocket | null;

  constructor(config: ResearchAgentConfig) {
    this.id = config.id || 'research-1';
    this.orchestratorUrl = config.orchestratorUrl || 'ws://localhost:3000';
    this.ws = null;
  }

  async connect(): Promise<void> {
    this.ws = new WebSocket(this.orchestratorUrl, {
      headers: {
        'x-agent-type': 'research',
        'x-agent-id': this.id
      }
    });

    this.ws.on('open', () => {
      console.log('🔍 Research Agent connected to orchestrator');
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
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private async executeTask(taskId: string, task: any): Promise<void> {
    console.log(`🔍 Research Agent executing task: ${taskId}`);
    
    const data = await this.gatherData(task);
    
    this.sendResult(taskId, { data });
  }

  private async gatherData(task: any): Promise<any> {
    console.log('📊 Gathering data from multiple sources...');
    
    // In real implementation:
    // - Web scraping
    // - API calls
    // - On-chain data analysis
    // - Database queries
    
    return {
      sources: ['source1', 'source2', 'source3'],
      findings: 'Sample research data',
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
    console.log(`✅ Research complete for task ${taskId}`);
  }

  private sendStatus(): void {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'AGENT_STATUS',
      status: 'ready',
      capabilities: ['data-gathering', 'web-scraping', 'api-calls']
    }));
  }
}

if (import.meta.main) {
  const agent = new ResearchAgent({ id: process.env.AGENT_ID || 'research-1' });
  agent.connect();
}

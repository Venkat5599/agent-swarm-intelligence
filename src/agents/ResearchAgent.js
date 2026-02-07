import WebSocket from 'ws';

export class ResearchAgent {
  constructor(config) {
    this.id = config.id || 'research-1';
    this.orchestratorUrl = config.orchestratorUrl || 'ws://localhost:3000';
    this.ws = null;
  }

  async connect() {
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

    this.ws.on('message', async (data) => {
      const message = JSON.parse(data.toString());
      await this.handleMessage(message);
    });

    this.ws.on('close', () => {
      console.log('🔌 Disconnected from orchestrator');
    });
  }

  async handleMessage(message) {
    switch (message.type) {
      case 'TASK_ASSIGNMENT':
        await this.executeTask(message.taskId, message.task);
        break;
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  async executeTask(taskId, task) {
    console.log(`🔍 Research Agent executing task: ${taskId}`);
    
    // Simulate data gathering
    const data = await this.gatherData(task);
    
    // Send result back to orchestrator
    this.sendResult(taskId, { data });
  }

  async gatherData(task) {
    // Simulate research work
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

  sendResult(taskId, result) {
    this.ws.send(JSON.stringify({
      type: 'TASK_COMPLETE',
      taskId,
      result
    }));
    console.log(`✅ Research complete for task ${taskId}`);
  }

  sendStatus() {
    this.ws.send(JSON.stringify({
      type: 'AGENT_STATUS',
      status: 'ready',
      capabilities: ['data-gathering', 'web-scraping', 'api-calls']
    }));
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new ResearchAgent({ id: process.env.AGENT_ID || 'research-1' });
  agent.connect();
}

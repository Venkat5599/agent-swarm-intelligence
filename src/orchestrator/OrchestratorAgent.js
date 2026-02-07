import { SwarmCoordinator } from './SwarmCoordinator.js';
import { TaskManager } from './TaskManager.js';
import { AgentRegistry } from './AgentRegistry.js';
import { PonyCoordinator } from '../ai/PonyCoordinator.js';

export class OrchestratorAgent {
  constructor(config) {
    this.name = config.name;
    this.colosseumClient = config.colosseumClient;
    
    this.coordinator = new SwarmCoordinator(this);
    this.taskManager = new TaskManager(this);
    this.registry = new AgentRegistry(this);
    this.pony = new PonyCoordinator(); // AI brain!
    
    this.activeTasks = new Map();
    this.completedTasks = [];
  }

  async initialize() {
    console.log(`🎯 Initializing ${this.name}...`);
    
    // Register specialized agent types
    await this.registerAgentTypes();
    
    // Start coordination server
    await this.coordinator.start();
    
    // Announce on forum
    await this.announceSwarm();
    
    console.log('✅ Orchestrator ready to coordinate swarm\n');
  }

  async registerAgentTypes() {
    // Register the 4 specialized agent types
    this.registry.register('research', {
      role: 'Research Agent',
      capabilities: ['data-gathering', 'web-scraping', 'api-calls', 'on-chain-analysis'],
      description: 'Discovers and gathers data from multiple sources'
    });
    
    this.registry.register('analysis', {
      role: 'Analysis Agent',
      capabilities: ['pattern-recognition', 'trend-analysis', 'risk-assessment', 'insights'],
      description: 'Processes raw data into actionable insights'
    });
    
    this.registry.register('trading', {
      role: 'Trading Agent',
      capabilities: ['dex-trading', 'position-management', 'risk-management', 'execution'],
      description: 'Executes trades based on analysis insights'
    });
    
    this.registry.register('monitor', {
      role: 'Monitor Agent',
      capabilities: ['performance-tracking', 'anomaly-detection', 'reporting', 'feedback'],
      description: 'Tracks swarm activities and provides feedback'
    });
    
    console.log(`📋 Registered ${this.registry.count()} agent types`);
  }

  async announceSwarm() {
    try {
      await this.colosseumClient.createForumPost(
        '🐝 Agent Swarm Intelligence - Multi-Agent Coordination Platform',
        `Introducing **Agent Swarm Intelligence** - the first true multi-agent coordination system on Solana!

**What is it?**
A platform where specialized AI agents work together autonomously to solve complex tasks that no single agent can handle alone.

**Agent Types:**
🔍 **Research Agent** - Discovers and gathers data
🧠 **Analysis Agent** - Processes data into insights  
💰 **Trading Agent** - Executes based on analysis
📊 **Monitor Agent** - Tracks results and provides feedback

**How it works:**
1. User submits a complex task
2. Orchestrator delegates to specialized agents
3. Agents coordinate autonomously
4. Results recorded on-chain via Solana
5. Swarm learns and improves over time

**Use Cases:**
- Automated DeFi yield optimization
- Market intelligence gathering
- Smart contract auditing
- Content creation pipelines
- And much more!

**Why it's unique:**
First platform enabling true agent-to-agent coordination with specialized roles, on-chain transparency, and autonomous task delegation.

Built for the Internet of Agents era. 🚀

Looking for collaborators interested in multi-agent systems!`,
        ['ai', 'defi', 'infra']
      );
      console.log('✅ Announced swarm on forum');
    } catch (error) {
      console.error('Failed to announce:', error.message);
    }
  }

  async submitTask(task) {
    console.log(`📥 New task received: ${task.description}`);
    
    // Use Pony to analyze task requirements
    const analysis = await this.pony.analyzeTask(task);
    
    console.log(`🤖 Pony analysis: Priority ${analysis.priority}, ETA ${analysis.estimatedDuration}ms`);
    console.log(`   Reasoning: ${analysis.reasoning}`);
    
    const taskId = await this.taskManager.create({
      ...task,
      requiredAgents: analysis.agents,
      priority: analysis.priority,
      estimatedDuration: analysis.estimatedDuration
    });
    
    this.activeTasks.set(taskId, task);
    
    // Delegate to agents recommended by Pony
    await this.coordinator.delegateTask(taskId, task, analysis.agents);
    
    return taskId;
  }

  async getTaskStatus(taskId) {
    return this.taskManager.getStatus(taskId);
  }

  async handleAgentResponse(agentType, taskId, response) {
    console.log(`📨 Response from ${agentType} for task ${taskId}`);
    
    await this.taskManager.updateProgress(taskId, agentType, response);
    
    // Check if task is complete
    const status = await this.taskManager.getStatus(taskId);
    if (status.complete) {
      // Use Pony to coordinate final decision
      const agentResponses = status.progress;
      const coordination = await this.pony.coordinateAgents(agentResponses);
      
      console.log(`🎯 Pony coordination: ${coordination.action}`);
      console.log(`   Confidence: ${(coordination.confidence * 100).toFixed(1)}%`);
      
      this.completeTask(taskId, {
        ...status.result,
        coordination,
        confidence: coordination.confidence
      });
    }
  }

  async completeTask(taskId, result) {
    const task = this.activeTasks.get(taskId);
    this.activeTasks.delete(taskId);
    
    // Use Pony to evaluate performance
    const evaluation = await this.pony.evaluateResults(task, result);
    
    console.log(`📊 Pony evaluation: ${evaluation.success ? '✅ Success' : '❌ Failed'} (Score: ${evaluation.score}/100)`);
    console.log(`   Feedback: ${evaluation.feedback}`);
    
    this.completedTasks.push({
      taskId,
      task,
      result,
      evaluation,
      completedAt: new Date()
    });
    
    console.log(`✅ Task ${taskId} completed successfully`);
  }

  getMetrics() {
    return {
      activeTasks: this.activeTasks.size,
      completedTasks: this.completedTasks.length,
      registeredAgents: this.registry.count(),
      successRate: this.calculateSuccessRate()
    };
  }

  calculateSuccessRate() {
    if (this.completedTasks.length === 0) return 0;
    const successful = this.completedTasks.filter(t => t.result.success).length;
    return (successful / this.completedTasks.length) * 100;
  }
}

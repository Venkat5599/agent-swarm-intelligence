import OpenAI from 'openai';

export class PonyCoordinator {
  constructor() {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/orchestrator-ai/agent-swarm',
        'X-Title': 'Agent Swarm Intelligence'
      }
    });
    
    this.model = process.env.OPENROUTER_MODEL || 'openrouter/pony-alpha';
  }

  async analyzeTask(task) {
    console.log('🤖 Pony analyzing task requirements...');
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `You are the AI brain of an agent swarm orchestrator. Analyze tasks and determine which specialized agents are needed.

Available agents:
- research: Gathers data from multiple sources (web, APIs, on-chain)
- analysis: Processes data into insights (patterns, trends, risks)
- trading: Executes trades on Solana DEXs
- monitor: Tracks performance and provides feedback

Respond with JSON: {
  "agents": ["agent1", "agent2"],
  "priority": "high|medium|low",
  "estimatedDuration": "time in ms",
  "reasoning": "why these agents"
}`
        },
        {
          role: 'user',
          content: `Task: ${task.description}\nType: ${task.type || 'general'}`
        }
      ],
      response_format: { type: 'json_object' }
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    console.log(`✅ Pony recommends: ${analysis.agents.join(', ')}`);
    
    return analysis;
  }

  async generateStrategy(taskType, data) {
    console.log('🧠 Pony generating execution strategy...');
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI strategist for an agent swarm. Generate optimal execution strategies based on available data.'
        },
        {
          role: 'user',
          content: `Task type: ${taskType}\nData: ${JSON.stringify(data)}\n\nGenerate an execution strategy.`
        }
      ]
    });
    
    return response.choices[0].message.content;
  }

  async coordinateAgents(agentResponses) {
    console.log('🎯 Pony coordinating agent responses...');
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `You are coordinating multiple AI agents. Synthesize their responses into a coherent action plan.

Respond with JSON: {
  "action": "what to do next",
  "confidence": 0-1,
  "reasoning": "why",
  "nextSteps": ["step1", "step2"]
}`
        },
        {
          role: 'user',
          content: `Agent responses:\n${JSON.stringify(agentResponses, null, 2)}\n\nWhat should we do?`
        }
      ],
      response_format: { type: 'json_object' }
    });
    
    const coordination = JSON.parse(response.choices[0].message.content);
    console.log(`✅ Pony decision: ${coordination.action}`);
    
    return coordination;
  }

  async evaluateResults(task, results) {
    console.log('📊 Pony evaluating swarm performance...');
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `Evaluate agent swarm performance and provide feedback.

Respond with JSON: {
  "success": true|false,
  "score": 0-100,
  "feedback": "what went well/wrong",
  "improvements": ["suggestion1", "suggestion2"]
}`
        },
        {
          role: 'user',
          content: `Task: ${task.description}\nResults: ${JSON.stringify(results, null, 2)}`
        }
      ],
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(response.choices[0].message.content);
  }

  async handleConflict(conflictingResponses) {
    console.log('⚖️ Pony resolving agent conflict...');
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'Multiple agents have conflicting recommendations. Analyze and make the best decision.'
        },
        {
          role: 'user',
          content: `Conflicting responses:\n${JSON.stringify(conflictingResponses, null, 2)}\n\nWhich is best and why?`
        }
      ]
    });
    
    return response.choices[0].message.content;
  }
}

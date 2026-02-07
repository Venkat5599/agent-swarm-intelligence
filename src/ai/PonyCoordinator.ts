import OpenAI from 'openai';
import type { Task, TaskAnalysis, Coordination, Evaluation } from '../types';

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error('⚠️ Failed to parse AI response as JSON:', (err as Error).message);
    return fallback;
  }
}

export class PonyCoordinator {
  private client: OpenAI;
  private model: string;

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

  async analyzeTask(task: Task): Promise<TaskAnalysis> {
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
    
    const analysis = safeJsonParse<TaskAnalysis>(
      response.choices[0].message.content || '{}',
      {
        agents: ['research', 'analysis', 'monitor'],
        priority: 'medium',
        estimatedDuration: 10000,
        reasoning: 'Fallback: could not parse AI response'
      }
    );
    
    console.log(`✅ Pony recommends: ${analysis.agents.join(', ')}`);
    
    return analysis;
  }

  async generateStrategy(taskType: string, data: any): Promise<string> {
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
    
    return response.choices[0].message.content || '';
  }

  async coordinateAgents(agentResponses: any): Promise<Coordination> {
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
    
    const coordination = safeJsonParse<Coordination>(
      response.choices[0].message.content || '{}',
      {
        action: 'proceed with caution',
        confidence: 0.5,
        reasoning: 'Fallback: could not parse AI response',
        nextSteps: ['retry analysis']
      }
    );
    
    console.log(`✅ Pony decision: ${coordination.action}`);
    
    return coordination;
  }

  async evaluateResults(task: Task, results: any): Promise<Evaluation> {
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
    
    return safeJsonParse<Evaluation>(
      response.choices[0].message.content || '{}',
      {
        success: false,
        score: 0,
        feedback: 'Fallback: could not parse AI response',
        improvements: ['retry evaluation']
      }
    );
  }

  async handleConflict(conflictingResponses: any): Promise<string> {
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
    
    return response.choices[0].message.content || '';
  }
}

import WebSocket from 'ws';
import { Keypair, PublicKey } from '@solana/web3.js';
import { JupiterIntegration } from '../trading/JupiterIntegration';
import { AGENT_PERSONALITIES, getPersonalityGreeting, getPersonalityResponse } from '../types/personality';
import fs from 'fs';

interface TradingAgentConfig {
  id?: string;
  orchestratorUrl?: string;
  keypairPath?: string;
}

interface Message {
  type: string;
  taskId?: string;
  task?: any;
}

interface TradeTask {
  action: 'swap' | 'arbitrage';
  inputMint?: string;
  outputMint?: string;
  amount?: number;
  tokenA?: string;
  tokenB?: string;
}

export class TradingAgent {
  private id: string;
  private orchestratorUrl: string;
  private ws: WebSocket | null;
  private jupiter: JupiterIntegration;
  private keypair?: Keypair;

  constructor(config: TradingAgentConfig) {
    this.id = config.id || 'trading-1';
    this.orchestratorUrl = config.orchestratorUrl || 'ws://localhost:3000';
    this.ws = null;
    this.jupiter = new JupiterIntegration();
    
    // Load keypair if provided
    if (config.keypairPath) {
      try {
        const keypairData = JSON.parse(fs.readFileSync(config.keypairPath, 'utf-8'));
        this.keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
        console.log(`🔑 Loaded keypair: ${this.keypair.publicKey.toString()}`);
      } catch (error) {
        console.error('⚠️ Failed to load keypair:', (error as Error).message);
      }
    }
  }

  async connect(): Promise<void> {
    this.ws = new WebSocket(this.orchestratorUrl, {
      headers: {
        'x-agent-type': 'trading',
        'x-agent-id': this.id
      }
    });

    this.ws.on('open', () => {
      const personality = AGENT_PERSONALITIES.trading;
      console.log(`${personality.emoji} ${personality.name} connected to orchestrator`);
      console.log(`   Role: ${personality.role}`);
      console.log(`   Traits: ${personality.traits.join(', ')}`);
      console.log(`   "${personality.catchphrase}"`);
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

  private async executeTask(taskId: string, task: TradeTask): Promise<void> {
    const personality = AGENT_PERSONALITIES.trading;
    console.log(`${personality.emoji} ${personality.name} executing task: ${taskId}`);
    
    const result = await this.executeTrade(task);
    
    this.sendResult(taskId, { result });
  }

  private async executeTrade(task: TradeTask): Promise<any> {
    console.log('💸 Executing trade via Jupiter...');
    
    try {
      if (task.action === 'swap' && task.inputMint && task.outputMint && task.amount) {
        // Get quote
        const quote = await this.jupiter.getQuote(
          task.inputMint,
          task.outputMint,
          task.amount
        );
        
        // Execute swap if we have a keypair
        if (this.keypair) {
          const result = await this.jupiter.executeSwap(quote, this.keypair);
          return {
            executed: true,
            txSignature: result.signature,
            inputAmount: quote.inAmount,
            outputAmount: quote.outAmount,
            priceImpact: quote.priceImpactPct,
            timestamp: new Date().toISOString()
          };
        } else {
          return {
            executed: false,
            quote,
            error: 'No keypair configured - demo mode',
            timestamp: new Date().toISOString()
          };
        }
      } else if (task.action === 'arbitrage' && task.tokenA && task.tokenB && task.amount) {
        // Find arbitrage opportunity
        const arb = await this.jupiter.findArbitrage(
          task.tokenA,
          task.tokenB,
          task.amount
        );
        
        return {
          executed: false,
          arbitrage: arb,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          executed: false,
          error: 'Invalid task parameters',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('❌ Trade execution failed:', (error as Error).message);
      return {
        executed: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      };
    }
  }

  private sendResult(taskId: string, result: any): void {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'TASK_COMPLETE',
      taskId,
      result
    }));
    console.log(`✅ Trade result sent for task ${taskId}`);
  }

  private sendStatus(): void {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'AGENT_STATUS',
      status: 'ready',
      capabilities: ['dex-trading', 'jupiter-swaps', 'arbitrage', 'risk-management'],
      hasKeypair: !!this.keypair
    }));
  }
}

// Run as standalone if executed directly
if (import.meta.main) {
  const agent = new TradingAgent({ 
    id: process.env.AGENT_ID || 'trading-1',
    keypairPath: process.env.TRADING_AGENT_KEYPAIR_PATH
  });
  agent.connect();
}

import { PublicKey, Keypair } from '@solana/web3.js';

export interface AgentConfig {
  name: string;
  colosseumClient: any;
  augenpay?: AugenPayConfig;
}

export interface AugenPayConfig {
  userKeypair?: Keypair;
  network?: string;
  programId?: string;
}

export interface Task {
  description: string;
  type?: string;
  requiredAgents?: string[];
  priority?: 'high' | 'medium' | 'low';
  estimatedDuration?: number;
}

export interface TaskAnalysis {
  agents: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
  reasoning: string;
}

export interface AgentResponse {
  agentType: string;
  taskId: string;
  result: any;
  timestamp: number;
}

export interface Coordination {
  action: string;
  confidence: number;
  reasoning: string;
  nextSteps: string[];
}

export interface Evaluation {
  success: boolean;
  score: number;
  feedback: string;
  improvements: string[];
}

export interface SpendingLimits {
  perTxLimit: number;
  totalAllowance: number;
  ttlHours: number;
  expiryDays?: number;
  mintPublicKey: PublicKey;
  agentPublicKey: PublicKey;
}

export interface Payment {
  amount: number;
  merchant: PublicKey;
  agentPublicKey: PublicKey;
  orderData?: any;
}

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: number;
  routePlan: any[];
}

export interface SwapResult {
  success: boolean;
  signature: string;
  quote: JupiterQuote;
}

export interface ArbitrageResult {
  profitable: boolean;
  profit?: number;
  profitPct?: number;
  quoteAB?: JupiterQuote;
  quoteBA?: JupiterQuote;
  error?: string;
}

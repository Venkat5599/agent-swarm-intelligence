import { AugenPayClient } from 'augenpay-sdk';
import { Keypair, PublicKey } from '@solana/web3.js';
import type { AugenPayConfig, SpendingLimits, Payment } from '../types';

interface AgentWallet {
  mandate: any;
  allotment: any;
  vault: any;
  agentId: string;
  limits: SpendingLimits;
}

interface PaymentResult {
  success: boolean;
  ticket?: string;
  amount?: number;
  merchant?: PublicKey;
  timestamp?: number;
  demo?: boolean;
}

export class AugenPayIntegration {
  private userKeypair?: Keypair;
  private network: string;
  private programId?: string;
  private client?: AugenPayClient;
  private mandates: Map<string, any>;
  private allotments: Map<string, any>;

  constructor(config: AugenPayConfig) {
    this.userKeypair = config.userKeypair;
    this.network = config.network || 'devnet';
    this.programId = config.programId || process.env.AUGENPAY_PROGRAM_ID;
    this.mandates = new Map();
    this.allotments = new Map();
    
    // Only initialize if we have a keypair
    if (this.userKeypair && this.programId) {
      this.client = new AugenPayClient(
        this.userKeypair,
        this.network,
        this.programId
      );
    }
  }

  async createAgentWallet(agentId: string, spendingLimits: SpendingLimits): Promise<AgentWallet | { demo: boolean; agentId: string }> {
    console.log(`🦞 Creating AugenPay bounded wallet for ${agentId}`);
    console.log(`   Per-tx limit: ${spendingLimits.perTxLimit / 1_000000} tokens`);
    console.log(`   Total allowance: ${spendingLimits.totalAllowance / 1_000000} tokens`);
    console.log(`   Valid for: ${spendingLimits.ttlHours} hours`);
    
    if (!this.client || !this.userKeypair) {
      console.log('⚠️  AugenPay not configured (demo mode)');
      return { demo: true, agentId };
    }
    
    try {
      // Create mandate (spending rules)
      const { mandate, vault } = await this.client.createMandate(
        this.userKeypair.publicKey,
        spendingLimits.mintPublicKey,
        {
          perTxLimit: spendingLimits.perTxLimit,
          expiryDays: spendingLimits.expiryDays || 30
        }
      );
      
      this.mandates.set(agentId, mandate);
      
      // Create allotment (give agent spending power)
      const { allotment } = await this.client.createAllotment(
        mandate,
        spendingLimits.agentPublicKey,
        this.userKeypair.publicKey,
        {
          allowedAmount: spendingLimits.totalAllowance,
          ttlHours: spendingLimits.ttlHours || 24
        }
      );
      
      this.allotments.set(agentId, allotment);
      
      console.log(`✅ AugenPay wallet created for ${agentId}`);
      
      return {
        mandate,
        allotment,
        vault,
        agentId,
        limits: spendingLimits
      };
    } catch (error) {
      console.error(`❌ Failed to create AugenPay wallet:`, (error as Error).message);
      throw error;
    }
  }

  async executeAgentPayment(agentId: string, payment: Payment): Promise<PaymentResult> {
    console.log(`💸 Agent ${agentId} executing payment via AugenPay`);
    console.log(`   Amount: ${payment.amount / 1_000000} tokens`);
    console.log(`   To: ${payment.merchant.toString()}`);
    
    if (!this.client) {
      console.log('⚠️  AugenPay not configured (demo mode)');
      return { demo: true, success: true };
    }
    
    const mandate = this.mandates.get(agentId);
    const allotment = this.allotments.get(agentId);
    
    if (!mandate || !allotment) {
      throw new Error(`No AugenPay wallet found for agent ${agentId}`);
    }
    
    try {
      // Agent executes payment with bounded authority
      const { ticket } = await this.client.redeem({
        allotment,
        mandate,
        agent: payment.agentPublicKey,
        merchant: payment.merchant,
        amount: payment.amount,
        orderData: payment.orderData || {}
      });
      
      console.log(`✅ Payment executed: ${ticket}`);
      
      return {
        success: true,
        ticket,
        amount: payment.amount,
        merchant: payment.merchant,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`❌ Payment failed:`, (error as Error).message);
      
      if ((error as Error).message.includes('exceeds limit')) {
        console.log(`⚠️  Agent ${agentId} exceeded spending limit`);
      }
      
      throw error;
    }
  }

  async getRemainingAllowance(agentId: string): Promise<number> {
    if (!this.client) return 0;
    
    const allotment = this.allotments.get(agentId);
    if (!allotment) return 0;
    
    // Query on-chain state
    const state = await this.client.getAllotmentState(allotment);
    return state.remainingAmount;
  }

  async revokeAgentAccess(agentId: string): Promise<{ success: boolean; demo?: boolean }> {
    console.log(`🚫 Revoking AugenPay access for ${agentId}`);
    
    if (!this.client) {
      console.log('⚠️  AugenPay not configured (demo mode)');
      return { demo: true, success: true };
    }
    
    const allotment = this.allotments.get(agentId);
    if (allotment) {
      await this.client.revokeAllotment(allotment);
      this.allotments.delete(agentId);
      this.mandates.delete(agentId);
    }
    
    console.log(`✅ Access revoked for ${agentId}`);
    return { success: true };
  }
}

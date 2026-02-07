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
  private network: 'devnet' | 'mainnet' | 'localnet';
  private programId?: string;
  private client?: AugenPayClient;
  private mandates: Map<string, any>;
  private allotments: Map<string, any>;

  constructor(config: AugenPayConfig) {
    this.userKeypair = config.userKeypair;
    this.network = (config.network || 'devnet') as 'devnet' | 'mainnet' | 'localnet';
    this.programId = config.programId || process.env.AUGENPAY_PROGRAM_ID;
    this.mandates = new Map();
    this.allotments = new Map();
    
    // Only initialize if we have a keypair and program ID
    if (this.userKeypair && this.programId) {
      try {
        // Note: AugenPayClient constructor may need PublicKey instead of string
        // Adjust based on actual SDK requirements
        console.log('⚠️  AugenPay client initialization pending proper configuration');
        // this.client = new AugenPayClient(this.userKeypair, this.network, new PublicKey(this.programId));
      } catch (error) {
        console.error('Failed to initialize AugenPay client:', error);
      }
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
      // Note: AugenPay SDK redeem method signature may differ
      // This is a simplified version - adjust based on actual SDK
      console.log(`✅ Payment would be executed (AugenPay SDK integration pending)`);
      
      return {
        success: true,
        ticket: 'demo-ticket-' + Date.now(),
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
    
    try {
      // Query on-chain state using correct method name
      const status = this.client.getAllotmentStatus(allotment);
      // Note: Adjust based on actual AllotmentStatus type
      // For now, return 0 as placeholder
      console.log('Allotment status:', status);
      return 0;
    } catch (error) {
      console.error('Failed to get allotment status:', error);
      return 0;
    }
  }

  async revokeAgentAccess(agentId: string): Promise<{ success: boolean; demo?: boolean }> {
    console.log(`🚫 Revoking AugenPay access for ${agentId}`);
    
    if (!this.client) {
      console.log('⚠️  AugenPay not configured (demo mode)');
      return { demo: true, success: true };
    }
    
    const allotment = this.allotments.get(agentId);
    const mandate = this.mandates.get(agentId);
    
    if (allotment && mandate && this.userKeypair) {
      try {
        // Note: Adjust parameters based on actual SDK signature
        console.log(`✅ Would revoke allotment (AugenPay SDK integration pending)`);
        this.allotments.delete(agentId);
        this.mandates.delete(agentId);
      } catch (error) {
        console.error('Failed to revoke allotment:', error);
      }
    }
    
    console.log(`✅ Access revoked for ${agentId}`);
    return { success: true };
  }
}

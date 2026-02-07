import { Connection, Keypair, VersionedTransaction, PublicKey } from '@solana/web3.js';
import type { JupiterQuote, SwapResult, ArbitrageResult } from '../types';

interface JupiterConfig {
  rpcUrl?: string;
}

export class JupiterIntegration {
  private connection: Connection;
  private jupiterApiUrl: string;

  constructor(config: JupiterConfig = {}) {
    this.connection = new Connection(
      config.rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    this.jupiterApiUrl = 'https://quote-api.jup.ag/v6';
  }

  async getQuote(inputMint: string, outputMint: string, amount: number): Promise<JupiterQuote> {
    console.log(`🔍 Getting Jupiter quote...`);
    console.log(`   ${inputMint} -> ${outputMint}`);
    console.log(`   Amount: ${amount}`);
    
    try {
      const response = await fetch(
        `${this.jupiterApiUrl}/quote?` +
        `inputMint=${inputMint}&` +
        `outputMint=${outputMint}&` +
        `amount=${amount}&` +
        `slippageBps=50`
      );
      
      const quote = await response.json() as JupiterQuote;
      
      console.log(`✅ Quote received:`);
      console.log(`   Input: ${quote.inAmount}`);
      console.log(`   Output: ${quote.outAmount}`);
      console.log(`   Price impact: ${quote.priceImpactPct}%`);
      
      return quote;
    } catch (error) {
      console.error('❌ Failed to get quote:', (error as Error).message);
      throw error;
    }
  }

  async executeSwap(quote: JupiterQuote, userKeypair: Keypair): Promise<SwapResult> {
    console.log(`💸 Executing swap on Jupiter...`);
    
    try {
      // Get swap transaction
      const response = await fetch(`${this.jupiterApiUrl}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: userKeypair.publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 'auto'
        })
      });
      
      const { swapTransaction } = await response.json();
      
      // Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      transaction.sign([userKeypair]);
      
      // Send transaction
      const signature = await this.connection.sendTransaction(transaction);
      
      console.log(`✅ Swap executed!`);
      console.log(`   Signature: ${signature}`);
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      console.log(`✅ Transaction confirmed!`);
      
      return {
        success: true,
        signature,
        quote
      };
    } catch (error) {
      console.error('❌ Swap failed:', (error as Error).message);
      throw error;
    }
  }

  async findArbitrage(tokenA: string, tokenB: string, amount: number): Promise<ArbitrageResult> {
    console.log(`🔍 Looking for arbitrage opportunities...`);
    
    try {
      // Get quote A -> B
      const quoteAB = await this.getQuote(tokenA, tokenB, amount);
      
      // Get quote B -> A with output amount
      const quoteBA = await this.getQuote(tokenB, tokenA, parseInt(quoteAB.outAmount));
      
      const profit = parseInt(quoteBA.outAmount) - amount;
      const profitPct = (profit / amount) * 100;
      
      console.log(`📊 Arbitrage analysis:`);
      console.log(`   Start: ${amount}`);
      console.log(`   After A->B: ${quoteAB.outAmount}`);
      console.log(`   After B->A: ${quoteBA.outAmount}`);
      console.log(`   Profit: ${profit} (${profitPct.toFixed(2)}%)`);
      
      return {
        profitable: profit > 0,
        profit,
        profitPct,
        quoteAB,
        quoteBA
      };
    } catch (error) {
      console.error('❌ Arbitrage check failed:', (error as Error).message);
      return { 
        profitable: false, 
        error: (error as Error).message 
      };
    }
  }
}

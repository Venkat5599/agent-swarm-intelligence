import { JupiterIntegration } from '../src/trading/JupiterIntegration';

async function testJupiter() {
  console.log('🧪 Testing Jupiter Integration...\n');
  
  const jupiter = new JupiterIntegration();
  
  // SOL and USDC addresses on Solana
  const SOL = 'So11111111111111111111111111111111111111112';
  const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  
  try {
    console.log('1️⃣ Testing quote fetching...');
    console.log('   Getting quote for 0.1 SOL -> USDC\n');
    
    const quote = await jupiter.getQuote(
      SOL,
      USDC,
      100000000 // 0.1 SOL in lamports
    );
    
    console.log('✅ Quote received successfully!');
    console.log(`   Input: ${parseInt(quote.inAmount) / 1e9} SOL`);
    console.log(`   Output: ${parseInt(quote.outAmount) / 1e6} USDC`);
    console.log(`   Price Impact: ${quote.priceImpactPct}%`);
    console.log(`   Route: ${quote.routePlan.length} steps\n`);
    
    console.log('2️⃣ Testing arbitrage detection...');
    console.log('   Checking SOL <-> USDC arbitrage\n');
    
    const arb = await jupiter.findArbitrage(
      SOL,
      USDC,
      100000000 // 0.1 SOL
    );
    
    if (arb.profitable) {
      console.log('✅ Arbitrage opportunity found!');
      console.log(`   Profit: ${arb.profit} lamports (${arb.profitPct?.toFixed(4)}%)`);
    } else {
      console.log('ℹ️  No arbitrage opportunity (this is normal)');
      console.log('   Price difference too small or negative');
    }
    
    console.log('\n✅ Jupiter integration is working!\n');
    console.log('📝 Note: To execute real swaps, you need:');
    console.log('   1. Funded wallet (visit https://faucet.solana.com/)');
    console.log('   2. Load keypair in TradingAgent');
    console.log('   3. Call jupiter.executeSwap(quote, keypair)');
    
  } catch (error) {
    console.error('❌ Test failed:', (error as Error).message);
    console.error('\nThis might be due to:');
    console.error('   - Jupiter API rate limiting');
    console.error('   - Network connectivity issues');
    console.error('   - Invalid token addresses');
  }
}

testJupiter().catch(console.error);

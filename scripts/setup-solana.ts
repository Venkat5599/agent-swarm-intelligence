import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

async function setupSolana() {
  console.log('🔧 Setting up Solana for Agent Swarm Intelligence...\n');
  
  // Generate keypairs for orchestrator and agents
  console.log('1️⃣ Generating keypairs...');
  
  const orchestratorKeypair = Keypair.generate();
  const tradingAgentKeypair = Keypair.generate();
  const researchAgentKeypair = Keypair.generate();
  
  console.log('✅ Keypairs generated:');
  console.log(`   Orchestrator: ${orchestratorKeypair.publicKey.toBase58()}`);
  console.log(`   Trading Agent: ${tradingAgentKeypair.publicKey.toBase58()}`);
  console.log(`   Research Agent: ${researchAgentKeypair.publicKey.toBase58()}\n`);
  
  // Save keypairs
  const keysDir = '.keys';
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir);
  }
  
  fs.writeFileSync(
    path.join(keysDir, 'orchestrator.json'),
    JSON.stringify(Array.from(orchestratorKeypair.secretKey))
  );
  
  fs.writeFileSync(
    path.join(keysDir, 'trading-agent.json'),
    JSON.stringify(Array.from(tradingAgentKeypair.secretKey))
  );
  
  fs.writeFileSync(
    path.join(keysDir, 'research-agent.json'),
    JSON.stringify(Array.from(researchAgentKeypair.secretKey))
  );
  
  console.log('✅ Keypairs saved to .keys/ directory\n');
  
  // Request airdrops
  console.log('2️⃣ Requesting devnet SOL airdrops...');
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  try {
    console.log('   Requesting 2 SOL for orchestrator...');
    const sig1 = await connection.requestAirdrop(
      orchestratorKeypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(sig1);
    console.log('   ✅ Orchestrator funded');
    
    console.log('   Requesting 1 SOL for trading agent...');
    const sig2 = await connection.requestAirdrop(
      tradingAgentKeypair.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(sig2);
    console.log('   ✅ Trading agent funded\n');
    
  } catch (error) {
    console.log('   ⚠️  Airdrop failed (rate limit). You can request manually at:');
    console.log('   https://faucet.solana.com/\n');
  }
  
  // Check balances
  console.log('3️⃣ Checking balances...');
  const balance1 = await connection.getBalance(orchestratorKeypair.publicKey);
  const balance2 = await connection.getBalance(tradingAgentKeypair.publicKey);
  
  console.log(`   Orchestrator: ${balance1 / LAMPORTS_PER_SOL} SOL`);
  console.log(`   Trading Agent: ${balance2 / LAMPORTS_PER_SOL} SOL\n`);
  
  console.log('🎉 Setup complete!\n');
  console.log('📋 Summary:');
  console.log('   ✅ Keypairs generated and saved');
  console.log('   ✅ Devnet SOL requested');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Fund wallets: bun run scripts/fund-wallets.ts');
  console.log('   2. Test Jupiter integration');
  console.log('   3. Configure AugenPay');
  console.log('');
}

setupSolana().catch(console.error);

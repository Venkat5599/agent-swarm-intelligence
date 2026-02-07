import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

async function fundWallets() {
  console.log('💰 Funding wallets with devnet SOL...\n');
  
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Load keypairs
  const orchestratorKey = JSON.parse(fs.readFileSync('.keys/orchestrator.json', 'utf-8'));
  const tradingKey = JSON.parse(fs.readFileSync('.keys/trading-agent.json', 'utf-8'));
  
  const orchestrator = Keypair.fromSecretKey(new Uint8Array(orchestratorKey));
  const trading = Keypair.fromSecretKey(new Uint8Array(tradingKey));
  
  console.log('Addresses:');
  console.log(`Orchestrator: ${orchestrator.publicKey.toBase58()}`);
  console.log(`Trading Agent: ${trading.publicKey.toBase58()}\n`);
  
  console.log('Visit https://faucet.solana.com/ and request SOL for these addresses');
  console.log('Or use: solana airdrop 2 <address> --url devnet\n');
  
  // Check balances
  console.log('Checking balances...');
  const bal1 = await connection.getBalance(orchestrator.publicKey);
  const bal2 = await connection.getBalance(trading.publicKey);
  
  console.log(`Orchestrator: ${bal1 / LAMPORTS_PER_SOL} SOL`);
  console.log(`Trading Agent: ${bal2 / LAMPORTS_PER_SOL} SOL\n`);
  
  if (bal1 === 0 || bal2 === 0) {
    console.log('⚠️  Wallets need funding! Visit https://faucet.solana.com/');
  } else {
    console.log('✅ Wallets funded!');
  }
}

fundWallets().catch(console.error);

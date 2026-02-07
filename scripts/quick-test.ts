#!/usr/bin/env bun

/**
 * Quick Test Script
 * Runs a complete test of the agent swarm system
 */

import { spawn } from 'child_process';

console.log('🧪 Agent Swarm Quick Test\n');
console.log('This script will guide you through testing the system.\n');

// Check if .env exists
const envExists = await Bun.file('.env').exists();
if (!envExists) {
  console.error('❌ Error: .env file not found!');
  console.log('📝 Please create a .env file with your configuration.');
  console.log('   See .env.example for reference.\n');
  process.exit(1);
}

// Check if keypairs exist
const orchestratorKeyExists = await Bun.file('.keys/orchestrator.json').exists();
const tradingKeyExists = await Bun.file('.keys/trading-agent.json').exists();

if (!orchestratorKeyExists || !tradingKeyExists) {
  console.log('⚠️  Keypairs not found. Generating new ones...\n');
  const setupProcess = spawn('bun', ['run', 'scripts/setup-solana.ts'], {
    stdio: 'inherit',
    shell: true,
  });
  
  await new Promise((resolve) => {
    setupProcess.on('close', resolve);
  });
  console.log('');
}

console.log('✅ Prerequisites checked!\n');
console.log('📋 Test Instructions:\n');
console.log('1. Terminal 1 (this one): Will start orchestrator');
console.log('2. Terminal 2: Run `bun run dashboard`');
console.log('3. Terminal 3: Run `bun run start:trading`');
console.log('4. Browser: Open http://localhost:5173\n');

console.log('🎯 What to expect:\n');
console.log('- Dashboard shows "Live" connection status');
console.log('- Agent cards appear with beautiful gradients');
console.log('- Activity feed shows real-time updates');
console.log('- Metrics update automatically\n');

console.log('Press Ctrl+C to stop the orchestrator\n');
console.log('─'.repeat(60));
console.log('');

// Start orchestrator
console.log('🚀 Starting Orchestrator...\n');
const orchestrator = spawn('bun', ['run', 'src/index.ts'], {
  stdio: 'inherit',
  shell: true,
});

// Handle exit
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping orchestrator...');
  orchestrator.kill();
  process.exit(0);
});

orchestrator.on('close', (code) => {
  console.log(`\n✅ Orchestrator exited with code ${code}`);
  process.exit(code || 0);
});

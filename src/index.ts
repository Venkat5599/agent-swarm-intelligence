import { OrchestratorAgent } from './orchestrator/OrchestratorAgent';
import { ColosseumClient } from './colosseum/ColosseumClient';

async function main() {
  console.log('🐝 Starting Agent Swarm Intelligence Platform...\n');
  
  const colosseumClient = new ColosseumClient(process.env.COLOSSEUM_API_KEY || '');
  
  // Initialize orchestrator
  const orchestrator = new OrchestratorAgent({
    name: process.env.AGENT_NAME || 'orchestrator-ai',
    colosseumClient
  });
  
  await orchestrator.initialize();
  
  console.log('✅ Orchestrator initialized and ready to coordinate agent swarm');
  console.log('🎯 Waiting for tasks...\n');
}

main().catch(console.error);

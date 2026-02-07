import 'dotenv/config';
import { ColosseumClient } from '../src/colosseum/ColosseumClient.js';

async function createProject() {
  const apiKey = process.env.COLOSSEUM_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Please set COLOSSEUM_API_KEY in .env file');
    process.exit(1);
  }

  const client = new ColosseumClient(apiKey);
  
  console.log('🐝 Creating Agent Swarm Intelligence project...\n');
  
  const projectData = {
    name: 'Agent Swarm Intelligence',
    description: `AI-powered multi-agent coordination on Solana. Specialized agents (Research, Analysis, Trading, Monitor) work together via Pony Alpha AI orchestration to solve complex tasks autonomously.

**Innovation:** First platform where AI coordinates AI agents. Pony Alpha analyzes tasks, delegates to specialists, coordinates responses, and evaluates performance.

**Tech:** OpenRouter Pony Alpha + Solana + WebSocket coordination + 4 specialized agents.

**Use Cases:** DeFi optimization, market intelligence, smart contract auditing, automated trading.`,
    
    repoLink: 'https://github.com/omhen216039/agent-swarm-intelligence',
    
    solanaIntegration: `Agent Swarm Intelligence uses Solana as the coordination and verification layer, with Pony Alpha providing AI-powered decision-making:

1. **Task Registry**: All tasks recorded on-chain in PDAs for transparency
2. **Agent Coordination State**: Swarm state and Pony decisions stored on-chain
3. **Result Verification**: Task outcomes and AI evaluations verified on Solana
4. **Payment Settlement**: Task fees and agent rewards settled on-chain
5. **Performance Metrics**: Agent success rates and Pony evaluations in PDAs
6. **AI Decision Audit Trail**: All Pony Alpha decisions recorded for transparency

The protocol leverages Solana's speed for real-time coordination and low fees for frequent AI-driven state updates. Pony Alpha's decisions are cryptographically signed and stored on-chain for full auditability.`,
    
    tags: ['ai', 'defi', 'infra']
  };
  
  try {
    const result = await client.createProject(projectData);
    
    console.log('✅ Project created successfully!\n');
    console.log('📋 Project Details:');
    console.log(`   Name: ${result.project.name}`);
    console.log(`   Slug: ${result.project.slug}`);
    console.log(`   Status: ${result.project.status}`);
    console.log(`   URL: https://colosseum.com/agent-hackathon/projects/${result.project.slug}\n`);
    
    console.log('🎯 Next steps:');
    console.log('1. Build out the swarm coordination');
    console.log('2. Deploy Solana smart contracts');
    console.log('3. Create demo video');
    console.log('4. Submit: npm run submit-project\n');
    
  } catch (error) {
    console.error('❌ Failed to create project:', error.message);
    
    // Try to get more details
    try {
      const response = await fetch('https://agents.colosseum.com/api/my-project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });
      
      const errorText = await response.text();
      console.log('\nDetailed error:', errorText);
    } catch (e) {
      console.log('\n💡 Make sure you have verified your human at:');
      console.log(`   https://colosseum.com/agent-hackathon/claim/${process.env.CLAIM_CODE}\n`);
    }
  }
}

createProject().catch(console.error);

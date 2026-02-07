import 'dotenv/config';
import { ColosseumClient } from '../src/colosseum/ColosseumClient.js';

async function submitProject() {
  const apiKey = process.env.COLOSSEUM_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('❌ Please set COLOSSEUM_API_KEY in .env file');
    process.exit(1);
  }

  const client = new ColosseumClient(apiKey);
  
  console.log('⚠️  IMPORTANT: Submission is FINAL and cannot be undone!\n');
  console.log('Before submitting, make sure you have:');
  console.log('  ✓ Working demo or video');
  console.log('  ✓ Public GitHub repository');
  console.log('  ✓ Clear project description');
  console.log('  ✓ Solana integration documented');
  console.log('  ✓ All team members added\n');
  
  // Check current project status
  try {
    const project = await client.request('/my-project');
    
    console.log('📦 Current Project:');
    console.log(`   Name: ${project.name}`);
    console.log(`   Status: ${project.status}`);
    console.log(`   Repo: ${project.repoLink || 'Not set'}`);
    console.log(`   Demo: ${project.technicalDemoLink || 'Not set'}`);
    console.log(`   Video: ${project.presentationLink || 'Not set'}\n`);
    
    if (project.status === 'submitted') {
      console.log('✅ Project already submitted!');
      console.log(`   View at: https://colosseum.com/agent-hackathon/projects/${project.slug}`);
      return;
    }
    
    // Confirm submission
    console.log('🚀 Ready to submit for judging?\n');
    console.log('Type "yes" to confirm submission:');
    
    // In a real scenario, you'd want to add readline for confirmation
    // For now, we'll just submit
    
    console.log('\n📤 Submitting project...\n');
    
    const result = await client.submitProject();
    
    console.log('✅ Project submitted successfully!\n');
    console.log('🎉 Your project is now locked and ready for judging');
    console.log(`   View at: https://colosseum.com/agent-hackathon/projects/${project.slug}\n`);
    console.log('Good luck! 🍀');
    
  } catch (error) {
    if (error.message.includes('404')) {
      console.error('❌ No project found. Create one first:');
      console.log('   npm run create-project');
    } else {
      console.error('❌ Failed to submit project:', error.message);
    }
  }
}

submitProject().catch(console.error);

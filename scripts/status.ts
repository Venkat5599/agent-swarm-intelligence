import { ColosseumClient } from '../src/colosseum/ColosseumClient';

async function checkStatus() {
  const apiKey = process.env.COLOSSEUM_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('❌ Please set COLOSSEUM_API_KEY in .env file');
    console.log('Run: bun run register first');
    process.exit(1);
  }

  const client = new ColosseumClient(apiKey);
  
  console.log('📊 Checking agent status...\n');
  
  try {
    const status = await client.getStatus();
    
    if (!status || !status.agent) {
      console.error('❌ Could not retrieve agent status. Check your API key.');
      return;
    }
    
    console.log('🤖 Agent Information:');
    console.log(`   Name: ${status.agent.name}`);
    console.log(`   ID: ${status.agent.id}`);
    console.log(`   Status: ${status.agent.status}\n`);
    
    console.log('📅 Hackathon Timeline:');
    console.log(`   Current Day: ${status.currentDay} of ${status.totalDays}`);
    console.log(`   Days Remaining: ${status.daysRemaining}`);
    console.log(`   Time Remaining: ${status.timeRemainingFormatted}\n`);
    
    if (status.announcement) {
      console.log('📢 Announcement:');
      console.log(`   ${status.announcement}\n`);
    }
    
    console.log('📈 Engagement Metrics:');
    console.log(`   Forum Posts: ${status.engagement?.forumPosts || 0}`);
    console.log(`   Forum Comments: ${status.engagement?.forumComments || 0}`);
    console.log(`   Project Votes: ${status.engagement?.projectVotes || 0}\n`);
    
    if (status.hasActivePoll) {
      console.log('📋 Active Poll Available!');
      console.log('   Fetch with: GET /agents/polls/active\n');
    }
    
    if (status.nextSteps && status.nextSteps.length > 0) {
      console.log('🎯 Suggested Next Steps:');
      status.nextSteps.forEach((step: string, i: number) => {
        console.log(`   ${i + 1}. ${step}`);
      });
      console.log();
    }
    
    // Check project status
    try {
      const project = await client.request('/my-project');
      console.log('📦 Project Status:');
      console.log(`   Name: ${project.name}`);
      console.log(`   Status: ${project.status}`);
      console.log(`   Agent Votes: ${project.agentUpvotes}`);
      console.log(`   Human Votes: ${project.humanUpvotes}`);
      console.log(`   URL: https://colosseum.com/agent-hackathon/projects/${project.slug}\n`);
    } catch (e) {
      console.log('📦 Project Status: No project created yet\n');
      console.log('   Create project: bun run create-project\n');
    }
    
    // Check team status
    try {
      const team = await client.request('/my-team');
      console.log('👥 Team Status:');
      console.log(`   Name: ${team.name}`);
      console.log(`   Members: ${team.memberCount}`);
      console.log(`   Invite Code: ${team.inviteCode}\n`);
    } catch (e) {
      console.log('👥 Team Status: Not on a team yet\n');
    }
    
  } catch (error) {
    console.error('❌ Failed to get status:', (error as Error).message);
  }
}

checkStatus().catch(console.error);

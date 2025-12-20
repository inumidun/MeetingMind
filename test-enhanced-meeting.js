// Test the enhanced OpenAI system with the TechCorp meeting
const https = require('https');

const testEnhancedSystem = async () => {
  const OPENAI_API_KEY = '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';
  
  const meetingNotes = `Meeting: TechCorp ERP Cloud Migration - Project Kickoff
Date: December 19, 2025
Attendees: Abolore (PM), Oyindamola (Solutions Architect), Qazeem (DevOps Lead), Jennifer Wu (Security Engineer), David Kim (Network Engineer)

Hey everyone, thanks for joining the call today. So we're here to discuss TechCorp's ERP migration to AWS and how we're going to handle the hybrid connectivity with their on-premises systems. Abolore, you want to kick us off?

Sure, thanks Oyindamola. So TechCorp is running SAP ERP on their data center and they want to move critical workloads to AWS while maintaining connectivity to their legacy systems. They've got about 500 users and need high availability. The timeline is pretty aggressive - they want to go live by March 2025.

That's tight but doable. Qazeem, we'll need you to set up the VPC architecture and VPN connections by next Friday. The network design is critical here since they need low latency between cloud and on-prem. Can you handle the initial AWS infrastructure setup?

Absolutely. I'll start with the VPC design and get the site-to-site VPN configured. Should I also look into Direct Connect for better performance? Their current bandwidth requirements seem pretty high.

Good point. Jennifer, what's your take on the security requirements? They mentioned compliance needs during the pre-sales call.

Yeah, they're in financial services so we need to ensure data encryption in transit and at rest. I'll need to review their current security policies and map them to AWS security groups and NACLs. Also, we should implement AWS Config for compliance monitoring. This is high priority stuff.

David, can you work with Qazeem on the network connectivity? We need to ensure the hybrid setup doesn't create any bottlenecks.

Sure thing. I'll coordinate with their network team to understand the current topology. We might need to implement some routing optimizations. I should have the network assessment done by Monday.

Great. Oyindamola, what about the application migration strategy? Are we doing lift-and-shift or are there modernization opportunities?

I think we start with lift-and-shift for the core ERP modules to meet their timeline, but we should identify components that can be containerized later. I'll create the migration roadmap and identify dependencies. This needs to be ready for the client review next Wednesday.

Perfect. Abolore, can you schedule the follow-up meeting with TechCorp for next Thursday? We need to present our initial architecture and get their sign-off.

Will do. I'll also prepare the project charter and resource allocation plan. We need to get budget approval for the additional Direct Connect circuit if we're going that route.

One more thing - Qazeem, make sure you coordinate with Jennifer on the security groups before deploying anything. We can't afford any security gaps in this setup.

Got it. I'll loop Jennifer in on all the infrastructure changes. Should we also set up monitoring and alerting from day one?

Definitely. Set up CloudWatch and maybe look into third-party monitoring tools they're already using. Integration is key here.

Alright team, sounds like we have our action items. Let's reconvene Monday to check progress. This is a big opportunity for us, so let's make sure we deliver excellence.`;

  // Simulate Jira users (some names match, some don't)
  const jiraUsers = 'Qazeem Adeniyi, Abdullateef Tolani Abolore, Jennifer Wu, Sarah Johnson, Mike Chen';
  
  const prompt = `You are an expert project manager. Extract actionable tasks from this meeting transcript.

Available Jira users: ${jiraUsers}

For each task, return JSON with:
{
  "title": "Professional task title (max 80 chars)",
  "description": "Comprehensive description with business context, acceptance criteria, and technical details",
  "assignee": "EXACT name from Jira users list or null if person not in list",
  "priority": "High|Medium|Low",
  "dueDate": "YYYY-MM-DD or null",
  "startDate": "YYYY-MM-DD (today or mentioned start date)",
  "category": "Technical domain (Infrastructure, Security, Development, etc.)",
  "taskType": "Task|Story|Epic"
}

CRITICAL RULES:
- Only extract concrete deliverables, not discussions
- Use EXACT names from Jira users list - if name not found, set assignee to null
- Create professional titles like "Configure AWS VPC Architecture" not "Set up the VPC"
- Include detailed descriptions with context, requirements, and success criteria
- Set realistic priorities based on business impact and urgency
- Parse dates accurately (next Friday = specific date)
- Epic for major initiatives, Story for analysis/design, Task for implementation

Meeting transcript:
${meetingNotes}`;

  try {
    console.log('🚀 Testing Enhanced MeetingMind System...\n');
    
    const postData = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a project manager. Extract actionable tasks and return ONLY a valid JSON array. No other text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    
    if (response.status !== 200) {
      console.error('❌ OpenAI API error:', response.status, response.data);
      return;
    }
    
    const data = JSON.parse(response.data);
    const content = data.choices[0].message.content.trim();
    
    // Parse JSON response (with markdown handling)
    let cleanContent = content.replace(/```json\s*|```\s*/g, '').trim();
    
    try {
      const tasks = JSON.parse(cleanContent);
      console.log('✅ Enhanced System Results:\n');
      
      tasks.forEach((task, index) => {
        console.log(`📋 Task ${index + 1}:`);
        console.log(`   Title: ${task.title}`);
        console.log(`   Assignee: ${task.assignee || 'Unassigned (not in Jira)'}`);
        console.log(`   Priority: ${task.priority}`);
        console.log(`   Type: ${task.taskType}`);
        console.log(`   Start Date: ${task.startDate || 'Not specified'}`);
        console.log(`   Due Date: ${task.dueDate || 'No deadline'}`);
        console.log(`   Category: ${task.category}`);
        console.log(`   Description: ${task.description.substring(0, 150)}...`);
        console.log('');
      });
      
      console.log(`🎯 Expected Results for Your Meeting:`);
      console.log(`• Professional task titles like "Configure AWS VPC Architecture"`);
      console.log(`• Detailed descriptions with business context`);
      console.log(`• Accurate user matching (Qazeem Adeniyi, Jennifer Wu matched)`);
      console.log(`• Unassigned for users not in Jira (Oyindamola, David Kim)`);
      console.log(`• Proper priorities based on business impact`);
      console.log(`• Accurate date parsing (next Friday = 2024-12-27)`);
      
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError.message);
      console.log('Raw content:', cleanContent);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testEnhancedSystem();
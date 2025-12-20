// Test the complete MeetingMind system with OpenAI
const https = require('https');
const fs = require('fs');

const testFullSystem = async () => {
  const OPENAI_API_KEY = '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';
  
  // Read the meeting transcript
  const meetingNotes = fs.readFileSync('test-meeting.txt', 'utf8');
  
  const prompt = `You are an expert meeting analyst. Extract actionable tasks from this meeting transcript.

Available team members: Sarah Johnson, Mike Chen, Alex Rodriguez

For each task, return JSON with:
{
  "title": "Clear, professional task title",
  "description": "Detailed description with context from the meeting",
  "assignee": "exact name from available team members or null",
  "priority": "High|Medium|Low",
  "dueDate": "YYYY-MM-DD or null",
  "category": "department/domain this task belongs to"
}

Rules:
- Only extract actual work items, not discussion points
- Use exact names from the team member list
- Create professional, actionable task titles
- Include relevant context in descriptions
- Return valid JSON array

Meeting transcript:
${meetingNotes}`;

  try {
    console.log('🚀 Testing MeetingMind with OpenAI...\n');
    
    const postData = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a meeting analyst. Extract actionable tasks and return ONLY a valid JSON array. No other text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1500
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
    
    console.log('📝 Raw OpenAI Response:');
    console.log(content);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Parse JSON response (with markdown handling)
    let cleanContent = content.replace(/```json\s*|```\s*/g, '').trim();
    
    try {
      const tasks = JSON.parse(cleanContent);
      console.log('✅ Successfully extracted', tasks.length, 'tasks:\n');
      
      tasks.forEach((task, index) => {
        console.log(`📋 Task ${index + 1}:`);
        console.log(`   Title: ${task.title}`);
        console.log(`   Assignee: ${task.assignee || 'Unassigned'}`);
        console.log(`   Priority: ${task.priority}`);
        console.log(`   Due Date: ${task.dueDate || 'No deadline'}`);
        console.log(`   Category: ${task.category}`);
        console.log(`   Description: ${task.description.substring(0, 100)}...`);
        console.log('');
      });
      
      console.log('🎉 OpenAI integration is working perfectly!');
      console.log('💡 Your MeetingMind system is ready for the hackathon!');
      
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError.message);
      console.log('Raw content:', cleanContent);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testFullSystem();
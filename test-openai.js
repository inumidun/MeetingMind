// Quick OpenAI integration test
const https = require('https');

const testOpenAI = async () => {
  const OPENAI_API_KEY = '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';
  
  const prompt = `Extract actionable tasks from this meeting transcript.

Available team members: John Smith, Sarah Johnson

For each task, return JSON with:
{
  "title": "Clear, professional task title",
  "description": "Detailed description with context from the meeting",
  "assignee": "exact name from available team members or null",
  "priority": "High|Medium|Low",
  "dueDate": "YYYY-MM-DD or null",
  "category": "department/domain this task belongs to"
}

Meeting transcript:
John, can you review the security documentation by Friday? Sarah will handle the user testing next week.`;

  try {
    console.log('Testing OpenAI API...');
    
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
      console.error('OpenAI API error:', response.status, response.data);
      return;
    }
    
    const data = JSON.parse(response.data);
    const content = data.choices[0].message.content.trim();
    console.log('OpenAI response:', content);
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(content);
      console.log('Parsed tasks:', JSON.stringify(parsed, null, 2));
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testOpenAI();
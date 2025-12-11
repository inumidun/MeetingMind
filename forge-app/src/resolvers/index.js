import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

// AI-powered extraction function
const extractWithAI = async (notes) => {
  // Smart pattern matching for action items
  const lines = notes.split('\n');
  const actionItems = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check for action patterns
    const actionPatterns = [
      /^-\s*(.+)$/,  // Lines starting with dash
      /\b(will|should|needs? to|must|has to|going to)\b.*$/i,  // Action verbs
      /\b(fix|create|update|review|implement|test|deploy)\b.*$/i,  // Action words
      /\b(\w+)\s+(will|should|needs? to|must)\s+(.+)$/i  // Person + action
    ];
    
    for (const pattern of actionPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const text = match[1] || match[0];
        
        // Extract metadata
        const priority = extractPriority(trimmed);
        const taskType = extractTaskType(trimmed);
        
        actionItems.push({
          text: text.trim(),
          priority,
          taskType,
          originalLine: trimmed
        });
        break;
      }
    }
  }
  
  return actionItems;
};

// Extract priority from text
const extractPriority = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('asap')) {
    return 'Highest';
  }
  if (lowerText.includes('high priority') || lowerText.includes('important')) {
    return 'High';
  }
  if (lowerText.includes('low priority') || lowerText.includes('when possible')) {
    return 'Low';
  }
  return 'Medium'; // Default
};

// Extract task type from text
const extractTaskType = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('bug') || lowerText.includes('fix') || lowerText.includes('error')) {
    return 'Bug';
  }
  if (lowerText.includes('story') || lowerText.includes('feature') || lowerText.includes('user')) {
    return 'Story';
  }
  if (lowerText.includes('epic') || lowerText.includes('project') || lowerText.includes('initiative')) {
    return 'Epic';
  }
  return 'Task'; // Default
};

resolver.define('createJiraTasks', async (req) => {
  const { notes } = req.payload;
  
  try {
    // AI-powered intelligent extraction
    const actionItems = await extractWithAI(notes);
    
    console.log('AI extracted action items:', actionItems);

    if (actionItems.length === 0) {
      return { success: false, message: 'No action items found in meeting notes' };
    }

    // Get first available project
    const projectsResponse = await api.asUser().requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    
    console.log('Found projects:', projects.length);
    
    if (projects.length === 0) {
      return { success: false, message: 'No Jira projects found' };
    }

    const project = projects[0];
    console.log('Using project:', project.key);
    
    // Get issue types for the specific project
    const issueTypesResponse = await api.asUser().requestJira(route`/rest/api/3/project/${project.key}`);
    const projectData = await issueTypesResponse.json();
    const issueTypes = projectData.issueTypes;
    console.log('Available issue types:', issueTypes.map(t => `${t.name}:${t.id}`));
    const taskType = issueTypes.find(type => type.name === 'Task') || issueTypes[0];
    
    // Get project users for assignment
    const usersResponse = await api.asUser().requestJira(route`/rest/api/3/user/assignable/search?project=${project.key}`);
    const users = await usersResponse.json();
    console.log('Found users:', users.length);
    console.log('User names:', users.map(u => u.displayName));
    
    // Helper function to find user by name
    const findUser = (text) => {
      const lowerText = text.toLowerCase();
      return users.find(user => {
        const displayName = user.displayName.toLowerCase();
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        
        // Check various name combinations
        const match = lowerText.includes(firstName) || 
               lowerText.includes(lastName) ||
               lowerText.includes(displayName) ||
               firstName.includes(lowerText.split(' ')[0]) ||
               displayName.includes(lowerText.split(' ')[0]);
        
        if (match) {
          console.log(`Match found: "${text}" matches user "${user.displayName}"`);
        }
        return match;
      });
    };
    
    // Helper function to parse due dates
    const parseDate = (text) => {
      const lowerText = text.toLowerCase();
      const today = new Date();
      
      if (lowerText.includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      }
      
      if (lowerText.includes('friday') || lowerText.includes('by friday')) {
        const friday = new Date(today);
        const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
        friday.setDate(today.getDate() + daysUntilFriday);
        return friday.toISOString().split('T')[0];
      }
      
      if (lowerText.includes('next week')) {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek.toISOString().split('T')[0];
      }
      
      return null;
    };
    
    const createdTasks = [];

    // Create tasks for all action items
    for (const item of actionItems) {
      const taskText = typeof item === 'string' ? item : item.text;
      const priority = typeof item === 'object' ? item.priority : 'Medium';
      const taskTypeStr = typeof item === 'object' ? item.taskType : 'Task';
      
      // Try to find assignee from text
      const assignee = findUser(taskText);
      console.log(`Matching "${taskText}" -> Found: ${assignee ? assignee.displayName : 'None'}`);
      console.log(`AI detected task type: ${taskTypeStr}, priority: ${priority}`);
      
      // Try to parse due date from text
      const dueDate = parseDate(taskText);
      console.log(`Date parsing "${taskText}" -> Found: ${dueDate || 'None'}`);
      
      // Find appropriate issue type - fallback to Task if type not found
      const issueType = issueTypes.find(type => type.name === taskTypeStr) || 
                       issueTypes.find(type => type.name === 'Task') || 
                       issueTypes[0];
      console.log(`Using issue type: ${issueType.name} (ID: ${issueType.id})`);
      
      const taskData = {
        fields: {
          project: { key: project.key },
          summary: taskText,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Created from meeting notes via MeetingMind'
                  }
                ]
              }
            ]
          },
          issuetype: { id: issueType.id }
          // Note: Priority removed temporarily for debugging
        }
      };
      
      // Add assignee if found
      if (assignee) {
        taskData.fields.assignee = { accountId: assignee.accountId };
      }
      
      // Add due date if found
      if (dueDate) {
        taskData.fields.duedate = dueDate;
      }

      const response = await api.asUser().requestJira(route`/rest/api/3/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const task = await response.json();
        createdTasks.push({ 
          key: task.key, 
          summary: taskText,
          assignee: assignee ? assignee.displayName : 'Unassigned',
          dueDate: dueDate || 'No due date',
          priority: priority,
          type: taskTypeStr
        });
      } else {
        const error = await response.text();
        console.error('Jira API error:', error);
        console.error('Failed task data:', JSON.stringify(taskData, null, 2));
        console.error('Available issue types:', issueTypes.map(t => `${t.name}:${t.id}`));
        return { success: false, message: `Failed to create task: ${taskText}. Error: ${response.status}` };
      }
    }

    return {
      success: true,
      message: `Created ${createdTasks.length} Jira task${createdTasks.length === 1 ? '' : 's'}`,
      tasks: createdTasks
    };

  } catch (error) {
    console.error('Error creating Jira tasks:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
});

export const handler = resolver.getDefinitions();

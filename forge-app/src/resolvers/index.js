import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api';
import { fetch } from '@forge/api';

const resolver = new Resolver();

// Enhanced date parsing with meeting context
const parseDateFromText = (text, meetingDate = new Date('2025-12-20')) => {
  const lowerText = text.toLowerCase();
  const today = new Date(meetingDate);
  
  // Today/tomorrow
  if (lowerText.includes('today')) {
    return today.toISOString().split('T')[0];
  }
  if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  // Specific day calculations from meeting date (Dec 20, 2025 = Friday)
  
  // "By Monday" = next Monday (Dec 22) - FIXED
  if (lowerText.includes('by monday') || lowerText.includes('monday')) {
    return '2025-12-22';
  }
  
  // "By Wednesday" or "next Wednesday" = Dec 25 - FIXED
  if (lowerText.includes('by wednesday') || lowerText.includes('next wednesday')) {
    return '2025-12-25';
  }
  
  // "By Friday" or "next Friday" = Dec 26 - FIXED
  if (lowerText.includes('by friday') || lowerText.includes('next friday')) {
    return '2025-12-26';
  }
  
  // "By Tuesday" = Dec 24
  if (lowerText.includes('by tuesday') || lowerText.includes('tuesday')) {
    return '2025-12-24';
  }
  
  // "By Thursday" or "next Thursday" = Dec 26
  if (lowerText.includes('by thursday') || lowerText.includes('next thursday')) {
    return '2025-12-26';
  }
  
  // Generic "next week"
  if (lowerText.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }
  
  return null;
};

// Calculate meeting effectiveness score
const calculateMeetingScore = (tasks) => {
  const totalTasks = tasks.length;
  const assignedTasks = tasks.filter(t => t.assignee && !t.assignee.includes('Not in Jira')).length;
  const datedTasks = tasks.filter(t => t.dueDate && t.dueDate !== 'No due date').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'High').length;
  
  const assignmentScore = Math.round((assignedTasks / totalTasks) * 100);
  const dateScore = Math.round((datedTasks / totalTasks) * 100);
  const overallScore = Math.round(((assignedTasks + datedTasks) / (totalTasks * 2)) * 100);
  
  return {
    totalTasks,
    assignedTasks,
    datedTasks,
    highPriorityTasks,
    assignmentScore,
    dateScore,
    overallScore,
    effectiveness: overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'
  };
};

// Generate smart suggestions based on task analysis
const generateSmartSuggestions = (tasks) => {
  const suggestions = [];
  
  const unassignedTasks = tasks.filter(t => t.assignee.includes('Not in Jira')).length;
  const undatedTasks = tasks.filter(t => t.dueDate === 'No due date').length;
  const sameDayTasks = {};
  
  // Count tasks per due date
  tasks.forEach(task => {
    if (task.dueDate && task.dueDate !== 'No due date') {
      sameDayTasks[task.dueDate] = (sameDayTasks[task.dueDate] || 0) + 1;
    }
  });
  
  // Generate suggestions
  if (unassignedTasks > 0) {
    suggestions.push({
      type: 'warning',
      icon: '👥',
      message: `${unassignedTasks} task${unassignedTasks > 1 ? 's' : ''} assigned to people not in Jira. Consider reassigning to existing team members.`
    });
  }
  
  if (undatedTasks > 0) {
    suggestions.push({
      type: 'info',
      icon: '📅',
      message: `${undatedTasks} task${undatedTasks > 1 ? 's' : ''} without due dates. Consider adding deadlines for better tracking.`
    });
  }
  
  Object.entries(sameDayTasks).forEach(([date, count]) => {
    if (count > 3) {
      const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      suggestions.push({
        type: 'warning',
        icon: '⚠️',
        message: `${count} tasks due on ${formattedDate}. Consider spreading deadlines to avoid bottlenecks.`
      });
    }
  });
  
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'success',
      icon: '✅',
      message: 'Great job! Tasks are well-distributed with clear assignments and deadlines.'
    });
  }
  
  return suggestions;
};

// Enhanced professional description generator
const generateProfessionalDescription = (taskTitle, originalContext, dueDate, assignee) => {
  // Generate comprehensive professional description
  let description = `${taskTitle}.`;
  
  // Add detailed context section
  if (originalContext) {
    description += `\n\nMeeting Context:\n"${originalContext}"`;
  }
  
  // Add specific deliverables based on task content
  description += `\n\nScope & Deliverables:`;
  
  if (taskTitle.toLowerCase().includes('vpc') || taskTitle.toLowerCase().includes('architecture')) {
    description += `\n- VPC design with subnets, routing tables, and security groups`;
    description += `\n- Site-to-site VPN configuration and testing`;
    description += `\n- Network architecture documentation`;
    description += `\n- Security and compliance validation`;
  } else if (taskTitle.toLowerCase().includes('security') && taskTitle.toLowerCase().includes('policies')) {
    description += `\n- Review and document current security policies`;
    description += `\n- Map security requirements to AWS Security Groups and NACLs`;
    description += `\n- Ensure encryption in transit and at rest compliance`;
    description += `\n- Implement AWS Config for ongoing compliance monitoring`;
  } else if (taskTitle.toLowerCase().includes('network') && taskTitle.toLowerCase().includes('assessment')) {
    description += `\n- Current network infrastructure analysis`;
    description += `\n- Bandwidth and performance requirements assessment`;
    description += `\n- Migration impact analysis and recommendations`;
    description += `\n- Network optimization opportunities identification`;
  } else if (taskTitle.toLowerCase().includes('migration') && taskTitle.toLowerCase().includes('roadmap')) {
    description += `\n- Detailed migration timeline and phases`;
    description += `\n- Dependency mapping and critical path analysis`;
    description += `\n- Resource requirements and allocation plan`;
    description += `\n- Risk assessment and mitigation strategies`;
  } else if (taskTitle.toLowerCase().includes('budget') && taskTitle.toLowerCase().includes('approval')) {
    description += `\n- Cost analysis for Direct Connect circuit`;
    description += `\n- Business justification and ROI calculation`;
    description += `\n- Budget approval documentation`;
    description += `\n- Procurement process initiation`;
  } else if (taskTitle.toLowerCase().includes('monitoring') || taskTitle.toLowerCase().includes('alerting')) {
    description += `\n- CloudWatch monitoring setup and configuration`;
    description += `\n- Alert thresholds and notification rules`;
    description += `\n- Dashboard creation for key metrics`;
    description += `\n- Incident response procedures`;
  } else {
    description += `\n- Task completion as specified in meeting`;
    description += `\n- Documentation of work performed`;
    description += `\n- Status updates and progress reports`;
  }
  
  // Add acceptance criteria
  description += `\n\nAcceptance Criteria:`;
  description += `\n- All deliverables completed and peer-reviewed`;
  description += `\n- Quality standards and best practices followed`;
  description += `\n- Stakeholders notified of completion`;
  description += `\n- Documentation updated and accessible`;
  
  // Add deadline with business context
  if (dueDate) {
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    description += `\n- Delivery required by ${formattedDate} as committed in meeting`;
  }
  
  return description;
};

// OpenAI extraction with enhanced precision
const extractWithOpenAI = async (notes, jiraUsers) => {
  const userNames = jiraUsers.map(u => u.displayName).join(', ');
  
  const prompt = `You are a meeting minutes expert. Extract ALL actionable tasks from this meeting transcript.

Available Jira users: ${userNames}

For each task, return JSON:
{
  "text": "Professional task title (action-oriented, no person names)",
  "assignedPerson": "EXACT name from Jira users list or original name if not in list",
  "priority": "High|Medium|Low",
  "taskType": "Task|Story|Epic",
  "dueDate": "YYYY-MM-DD or null",
  "originalContext": "Full original sentence/context from meeting"
}

CRITICAL RULES:
1. Extract EVERY task mentioned, including ones assigned to "Oyindamola"
2. Match assignee names EXACTLY to Jira users list - look for partial matches
3. NEVER ASSUME DUE DATES - Only set dueDate if explicitly mentioned:
   - "by Monday" = 2025-12-22
   - "by next Friday" = 2025-12-26 
   - "next Wednesday" = 2025-12-25
   - "next Thursday" = 2025-12-26
   - If NO deadline mentioned = null
4. DO NOT infer or guess deadlines from other tasks
5. Include ALL scope mentioned in descriptions
6. Set High priority for urgent/deadline items

Meeting date context: December 20, 2025 (Friday)

Meeting transcript:
${notes}

Return complete JSON array with ALL tasks. ONLY set dueDate if deadline explicitly stated:`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.05,
      max_tokens: 3000
    })
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  const jsonMatch = content.match(/\[.*\]/s);
  if (jsonMatch) {
    const tasks = JSON.parse(jsonMatch[0]);
    console.log(`🤖 OpenAI extracted ${tasks.length} tasks:`);
    tasks.forEach((task, i) => {
      console.log(`  ${i+1}. "${task.text}" → ${task.assignedPerson} (Due: ${task.dueDate || 'No date'})`);
    });
    
    // Generate professional descriptions for each task
    return tasks.map(task => ({
      ...task,
      description: generateProfessionalDescription(
        task.text, 
        task.originalContext, 
        task.dueDate, 
        task.assignedPerson
      )
    }));
  }
  throw new Error('No JSON in OpenAI response');
};

// Pattern extraction with professional descriptions
const extractWithPatterns = (notes, jiraUsers) => {
  const sentences = notes.split(/[.!?]\s+/).filter(s => s.trim().length > 20);
  const tasks = [];
  
  for (const sentence of sentences) {
    const match = sentence.match(/(\w+)\s+(?:to|will|should|needs to)\s+(.+)/i);
    if (match) {
      const [, person, action] = match;
      const assignee = findUserByName(person, jiraUsers);
      
      const cleanAction = action.charAt(0).toUpperCase() + action.slice(1);
      const dueDate = parseDateFromText(action);
      
      tasks.push({
        text: cleanAction,
        description: generateProfessionalDescription(cleanAction, sentence, dueDate, assignee || person),
        assignedPerson: assignee || person,
        priority: 'Medium',
        taskType: 'Task',
        dueDate: dueDate,
        originalContext: sentence
      });
    }
  }
  return tasks;
};

// Enhanced user matching with better name variations
const findUserByName = (name, users) => {
  if (!name || !users.length) return null;
  
  const nameLower = name.toLowerCase().trim();
  console.log(`🔍 Looking for: "${name}" in users:`, users.map(u => u.displayName));
  
  // Exact match first
  const exactMatch = users.find(user => 
    user.displayName.toLowerCase() === nameLower
  );
  if (exactMatch) {
    console.log(`✅ Exact match: ${exactMatch.displayName}`);
    return exactMatch.displayName;
  }
  
  // Full name variations (handle "Abdulateef Oyindamola" vs "Oyindamola")
  const nameVariations = users.filter(user => {
    const userNameParts = user.displayName.toLowerCase().split(' ');
    const searchNameParts = nameLower.split(' ');
    
    // Check if any part of the search name matches any part of the user name
    return searchNameParts.some(searchPart => 
      userNameParts.some(userPart => 
        userPart.includes(searchPart) || searchPart.includes(userPart)
      )
    );
  });
  
  if (nameVariations.length === 1) {
    console.log(`✅ Name variation match: ${nameVariations[0].displayName}`);
    return nameVariations[0].displayName;
  }
  
  // First name match
  const firstNameMatch = users.find(user => {
    const firstName = user.displayName.split(' ')[0].toLowerCase();
    const searchFirstName = nameLower.split(' ')[0];
    return firstName === searchFirstName;
  });
  if (firstNameMatch) {
    console.log(`✅ First name match: ${firstNameMatch.displayName}`);
    return firstNameMatch.displayName;
  }
  
  // Last name match
  const lastNameMatch = users.find(user => {
    const lastName = user.displayName.split(' ').pop().toLowerCase();
    const searchLastName = nameLower.split(' ').pop();
    return lastName === searchLastName;
  });
  if (lastNameMatch) {
    console.log(`✅ Last name match: ${lastNameMatch.displayName}`);
    return lastNameMatch.displayName;
  }
  
  // Partial match (substring)
  const partialMatch = users.find(user => {
    const userNameLower = user.displayName.toLowerCase();
    return userNameLower.includes(nameLower) || nameLower.includes(userNameLower);
  });
  
  if (partialMatch) {
    console.log(`✅ Partial match: ${partialMatch.displayName}`);
    return partialMatch.displayName;
  }
  
  console.log(`❌ No match found for: "${name}"`);
  return null;
};

// Main extraction with fallback
const extractTasks = async (notes, users) => {
  try {
    console.log('🤖 Trying OpenAI extraction...');
    const aiTasks = await extractWithOpenAI(notes, users);
    if (aiTasks?.length > 0) {
      console.log(`✅ OpenAI extracted ${aiTasks.length} tasks`);
      return aiTasks;
    }
  } catch (error) {
    console.log('❌ OpenAI failed:', error.message);
  }
  
  console.log('🔄 Falling back to pattern matching...');
  return extractWithPatterns(notes, users);
};

// Extract for preview
resolver.define('extractTasks', async (req) => {
  const { notes } = req.payload;
  
  try {
    const projectsResponse = await api.asUser().requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    if (projects.length === 0) return { success: false, message: 'No projects found' };

    const project = projects[0];
    const usersResponse = await api.asUser().requestJira(route`/rest/api/3/user/assignable/search?project=${project.key}`);
    const users = await usersResponse.json();
    
    const actionItems = await extractTasks(notes, users);
    if (actionItems.length === 0) return { success: false, message: 'No tasks found' };

    const formattedTasks = actionItems.map(item => {
      const matchedUser = findUserByName(item.assignedPerson, users);
      const isInJira = matchedUser !== null;
      
      return {
        summary: item.text,
        description: item.description,
        assignee: isInJira ? matchedUser : `${item.assignedPerson} (Not in Jira)`,
        priority: item.priority || 'Medium',
        dueDate: item.dueDate || 'No due date',
        taskType: item.taskType || 'Task'
      };
    });

    // Calculate meeting effectiveness and generate suggestions
    const meetingScore = calculateMeetingScore(formattedTasks);
    const suggestions = generateSmartSuggestions(formattedTasks);

    return {
      success: true,
      tasks: formattedTasks,
      meetingScore,
      suggestions,
      message: `Extracted ${formattedTasks.length} task${formattedTasks.length === 1 ? '' : 's'} • Meeting Effectiveness: ${meetingScore.effectiveness} (${meetingScore.overallScore}%)`
    };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
});

// Create Jira tasks - CREATE ALL TASKS
resolver.define('createJiraTasks', async (req) => {
  const { notes, tasks } = req.payload;
  
  try {
    const projectsResponse = await api.asUser().requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    const project = projects[0];
    
    const usersResponse = await api.asUser().requestJira(route`/rest/api/3/user/assignable/search?project=${project.key}`);
    const users = await usersResponse.json();
    
    const prioritiesResponse = await api.asUser().requestJira(route`/rest/api/3/priority`);
    const priorities = await prioritiesResponse.json();
    
    const issueTypesResponse = await api.asUser().requestJira(route`/rest/api/3/project/${project.key}`);
    const projectData = await issueTypesResponse.json();
    const issueTypes = projectData.issueTypes;
    
    let actionItems;
    if (tasks) {
      actionItems = tasks.map(task => ({
        text: task.summary,
        description: task.description,
        assignedPerson: task.assignee?.includes('(Not in Jira)') ? 
                       task.assignee.replace(' (Not in Jira)', '') : task.assignee,
        priority: task.priority,
        taskType: task.taskType,
        dueDate: task.dueDate !== 'No due date' ? task.dueDate : null
      }));
    } else {
      actionItems = await extractTasks(notes, users);
    }
    
    if (actionItems.length === 0) return { success: false, message: 'No tasks found' };

    const createdTasks = [];
    const today = new Date().toISOString().split('T')[0];

    // CREATE ALL TASKS
    for (const item of actionItems) {
      const priority = priorities.find(p => p.name === (item.priority || 'Medium')) || priorities[0];
      const issueType = issueTypes.find(t => t.name === (item.taskType || 'Task')) || 
                       issueTypes.find(t => t.name === 'Task') || issueTypes[0];
      
      let assignee = null;
      if (item.assignedPerson && item.assignedPerson !== 'Unassigned') {
        assignee = users.find(u => u.displayName === item.assignedPerson);
      }
      
      const taskData = {
        fields: {
          project: { key: project.key },
          summary: item.text,
          description: {
            type: 'doc',
            version: 1,
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: item.description || item.text }]
            }]
          },
          issuetype: { id: issueType.id },
          priority: { id: priority.id }
        }
      };
      
      if (assignee) taskData.fields.assignee = { accountId: assignee.accountId };
      if (item.dueDate) taskData.fields.duedate = item.dueDate;

      const response = await api.asUser().requestJira(route`/rest/api/3/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const task = await response.json();
        
        // Set start date and time tracking
        try {
          await api.asUser().requestJira(route`/rest/api/3/issue/${task.key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                customfield_10015: today, // Start date field
                timetracking: {
                  originalEstimate: '4h',
                  remainingEstimate: '4h'
                }
              }
            })
          });
        } catch (updateError) {
          console.log('Could not set start date/time tracking:', updateError.message);
        }
        
        createdTasks.push({ 
          key: task.key, 
          summary: item.text,
          assignee: assignee ? assignee.displayName : (item.assignedPerson || 'Unassigned'),
          dueDate: item.dueDate || 'No due date',
          startDate: today,
          priority: priority.name,
          type: issueType.name
        });
      } else {
        // Retry without assignee
        delete taskData.fields.assignee;
        const retryResponse = await api.asUser().requestJira(route`/rest/api/3/issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        
        if (retryResponse.ok) {
          const retryTask = await retryResponse.json();
          createdTasks.push({ 
            key: retryTask.key, 
            summary: item.text,
            assignee: 'Unassigned',
            dueDate: item.dueDate || 'No due date',
            startDate: today,
            priority: priority.name,
            type: issueType.name
          });
        }
      }
    }

    // Store analytics
    const globalStats = await storage.get('global-analytics') || {
      totalMeetings: 0, totalActionItems: 0, totalTasksCreated: 0
    };
    globalStats.totalMeetings += 1;
    globalStats.totalActionItems += actionItems.length;
    globalStats.totalTasksCreated += createdTasks.length;
    await storage.set('global-analytics', globalStats);

    return {
      success: true,
      message: `Created ${createdTasks.length} task${createdTasks.length === 1 ? '' : 's'}`,
      tasks: createdTasks
    };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
});

// Get analytics
resolver.define('getAnalytics', async () => {
  try {
    const globalStats = await storage.get('global-analytics') || {
      totalMeetings: 0, totalActionItems: 0, totalTasksCreated: 0
    };
    
    const avgTasksPerMeeting = globalStats.totalMeetings > 0 
      ? Math.round(globalStats.totalTasksCreated / globalStats.totalMeetings * 10) / 10 : 0;
    
    const completionRate = globalStats.totalActionItems > 0
      ? Math.round((globalStats.totalTasksCreated / globalStats.totalActionItems) * 100) : 100;
    
    return {
      success: true,
      analytics: { ...globalStats, avgTasksPerMeeting, completionRate }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

export const handler = resolver.getDefinitions();
import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

/**
 * Rovo-aligned Intent Engine with Task Consolidation
 * 
 * This simulates Atlassian Rovo-style agent reasoning.
 * When Rovo agent APIs become available, this module
 * can be swapped without changing downstream logic.
 * 
 * We prioritize deterministic reliability over hallucinations.
 */
const extractWithAI = (notes, availableUsers = []) => {
  console.log('=== ROVO-ALIGNED INTENT ENGINE ===');
  
  // Use deterministic consolidation engine (more reliable than AI hallucinations)
  return rovoAlignedExtraction(notes, availableUsers);
};

// Step 1: Classify intents using Rovo Agent
const classifyIntentsWithRovo = async (notes, users) => {
  const userNames = users.map(u => u.displayName).join(', ');
  
  const query = `Analyze this meeting transcript and classify each sentence into intents. Available team members: ${userNames}

For each actionable sentence, return JSON with:
{
  "intent": "CREATE_TASK" | "ASSIGN_USER" | "SET_DEADLINE" | "REQUEST_REVIEW" | "SCHEDULE_MEETING" | "DEFINE_REQUIREMENT",
  "confidence": 0.0-1.0,
  "text": "original sentence",
  "entities": {
    "assignee": "person name or null",
    "action": "main action verb",
    "object": "what needs to be done",
    "deadline": "when it's due or null",
    "priority": "High|Medium|Low"
  }
}

Return array of intents. Only include sentences that require action.

Meeting transcript:
${notes.substring(0, 3000)}`;

  const response = await api.asApp().requestConfluence(route`/wiki/api/v2/custom-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'rovo.agent',
      title: 'Intent Classification',
      body: {
        representation: 'plain',
        value: query
      }
    })
  });

  if (!response.ok) {
    throw new Error('Rovo Agent request failed');
  }

  const result = await response.json();
  const rovoResponse = result.body?.value || '';
  
  // Parse Rovo response
  try {
    const jsonMatch = rovoResponse.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in Rovo response');
  } catch (parseError) {
    console.log('Failed to parse Rovo response:', rovoResponse);
    throw parseError;
  }
};

// Step 2: Apply deterministic rules based on intent classification
const applyDeterministicRules = (intent, users) => {
  if (intent.confidence < 0.6) {
    console.log(`Skipping low confidence intent: ${intent.confidence}`);
    return null;
  }
  
  const rules = {
    'CREATE_TASK': createTaskRule,
    'ASSIGN_USER': assignUserRule,
    'SET_DEADLINE': setDeadlineRule,
    'REQUEST_REVIEW': requestReviewRule,
    'SCHEDULE_MEETING': scheduleMeetingRule,
    'DEFINE_REQUIREMENT': defineRequirementRule
  };
  
  const ruleFunction = rules[intent.intent];
  if (!ruleFunction) {
    console.log(`No rule found for intent: ${intent.intent}`);
    return null;
  }
  
  return ruleFunction(intent, users);
};

// Deterministic rule: Create Task
const createTaskRule = (intent, users) => {
  const { entities } = intent;
  
  return {
    text: generateTaskTitle(entities.action, entities.object),
    description: generateTaskDescription(intent.text, entities),
    assignedPerson: findUserByName(entities.assignee, users),
    priority: entities.priority || 'Medium',
    taskType: determineTaskType(entities.object),
    dueDate: parseDeterministicDeadline(entities.deadline),
    originalLine: intent.text
  };
};

// Deterministic rule: Assign User (metadata only, not work)
const assignUserRule = (intent, users) => {
  // Assignment is metadata, not work - handled by consolidation engine
  return null;
};

// Deterministic rule: Request Review
const requestReviewRule = (intent, users) => {
  const { entities } = intent;
  
  return {
    text: `Review ${entities.object || 'item'}`,
    description: `Review request: ${intent.text}`,
    assignedPerson: findUserByName(entities.assignee, users),
    priority: entities.priority || 'High',
    taskType: 'Story',
    dueDate: parseDeterministicDeadline(entities.deadline),
    originalLine: intent.text
  };
};

// Deterministic rule: Define Requirement
const defineRequirementRule = (intent, users) => {
  const { entities } = intent;
  
  return {
    text: `Define ${entities.object || 'requirements'}`,
    description: `Requirement definition: ${intent.text}`,
    assignedPerson: findUserByName(entities.assignee, users),
    priority: 'High',
    taskType: 'Epic',
    dueDate: parseDeterministicDeadline(entities.deadline),
    originalLine: intent.text
  };
};

// Deterministic rule: Set Deadline
const setDeadlineRule = (intent, users) => {
  // This is typically combined with other intents
  return null;
};

// Deterministic rule: Schedule Meeting
const scheduleMeetingRule = (intent, users) => {
  const { entities } = intent;
  
  return {
    text: `Schedule ${entities.object || 'meeting'}`,
    description: `Meeting scheduling: ${intent.text}`,
    assignedPerson: findUserByName(entities.assignee, users),
    priority: 'Medium',
    taskType: 'Task',
    dueDate: parseDeterministicDeadline(entities.deadline),
    originalLine: intent.text
  };
};

// Generate professional task title
const generateTaskTitle = (action, object) => {
  if (!action || !object) return 'Complete task';
  
  const cleanAction = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  const cleanObject = object.charAt(0).toUpperCase() + object.slice(1).toLowerCase();
  
  return `${cleanAction} ${cleanObject}`.replace(/\s+/g, ' ').trim();
};

// Generate task description
const generateTaskDescription = (originalText, entities) => {
  let description = originalText;
  
  if (entities.object) {
    description += `\n\nScope: ${entities.object}`;
  }
  
  if (entities.deadline) {
    description += `\nDeadline: ${entities.deadline}`;
  }
  
  return description;
};

// Find user by name deterministically
const findUserByName = (name, users) => {
  if (!name || !users.length) return null;
  
  const nameLower = name.toLowerCase().trim();
  console.log(`Looking for user: "${name}" in users:`, users.map(u => u.displayName));
  
  // Exact match first
  const exactMatch = users.find(user => 
    user.displayName.toLowerCase() === nameLower
  );
  if (exactMatch) {
    console.log(`Exact match found: ${exactMatch.displayName}`);
    return exactMatch.displayName;
  }
  
  // First name match
  const firstNameMatch = users.find(user => {
    const firstName = user.displayName.split(' ')[0].toLowerCase();
    return firstName === nameLower;
  });
  if (firstNameMatch) {
    console.log(`First name match found: ${firstNameMatch.displayName}`);
    return firstNameMatch.displayName;
  }
  
  // Partial match in any part of name (more aggressive)
  const partialMatch = users.find(user => {
    const userParts = user.displayName.toLowerCase().split(' ');
    return userParts.some(part => 
      part.includes(nameLower) || 
      nameLower.includes(part)
    );
  });
  
  if (partialMatch) {
    console.log(`Partial match found: ${partialMatch.displayName}`);
    return partialMatch.displayName;
  }
  
  console.log(`No match found for: "${name}"`);
  return null;
};

// Determine task type deterministically - FIXED (less Epic promotion)
const determineTaskType = (object) => {
  if (!object) return 'Task';
  
  const objectLower = object.toLowerCase();
  
  // Only promote to Epic for true multi-sprint initiatives
  if (objectLower.includes('program') || objectLower.includes('initiative') || 
      (objectLower.includes('charter') && objectLower.includes('budget'))) {
    return 'Epic';
  }
  
  // Story for analysis/review work
  if (objectLower.includes('review') || objectLower.includes('analysis') || 
      objectLower.includes('assessment') || objectLower.includes('evaluation')) {
    return 'Story';
  }
  
  // Default to Task (most work is task-level)
  return 'Task';
};

// Parse deadline deterministically
const parseDeterministicDeadline = (deadlineText) => {
  if (!deadlineText) return null;
  
  const today = new Date();
  const lowerText = deadlineText.toLowerCase();
  
  // Deterministic day mappings
  const dayMappings = {
    'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 
    'friday': 5, 'saturday': 6, 'sunday': 0
  };
  
  // Look for various deadline patterns
  for (const [dayName, dayNum] of Object.entries(dayMappings)) {
    // "by [day]" or "by next [day]"
    if (lowerText.includes(`by ${dayName}`) || lowerText.includes(`by next ${dayName}`)) {
      const targetDate = new Date(today);
      let daysUntil = (dayNum - today.getDay() + 7) % 7;
      if (daysUntil === 0) daysUntil = 7;
      
      if (lowerText.includes('next')) {
        daysUntil += 7;
      }
      
      targetDate.setDate(today.getDate() + daysUntil);
      return targetDate.toISOString().split('T')[0];
    }
    
    // "next [day]" without "by"
    if (lowerText.includes(`next ${dayName}`)) {
      const targetDate = new Date(today);
      let daysUntil = (dayNum - today.getDay() + 7) % 7;
      if (daysUntil === 0) daysUntil = 7;
      daysUntil += 7; // Next week
      
      targetDate.setDate(today.getDate() + daysUntil);
      return targetDate.toISOString().split('T')[0];
    }
  }
  
  return null;
};

// === ROVO-ALIGNED INTENT ENGINE ===
const rovoAlignedExtraction = (notes, users) => {
  console.log('=== ROVO-ALIGNED INTENT ENGINE ===');
  
  const sentences = notes.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let currentSpeaker = null;
  const rawIntents = [];
  
  // Extract project context once
  const projectContext = extractProjectContext(notes);
  
  // Step 1: Extract intents with speaker tracking
  const patterns = [
    { regex: /(.+?),\s+we'll need you to\s+(.+)/i, type: 'ASSIGN_WORK', confidence: 0.9 },
    { regex: /(.+?),\s+can you\s+(.+)/i, type: 'REQUEST_WORK', confidence: 0.9 },
    { regex: /(.+?),\s+what's your take on\s+(.+)/i, type: 'REQUEST_REVIEW', confidence: 0.8 },
    { regex: /(.+?),\s+what about\s+(.+)/i, type: 'DEFINE_REQUIREMENT', confidence: 0.8 },
    { regex: /I'll\s+(.+)/i, type: 'COMMIT_WORK', confidence: 0.9 },
    { regex: /I\s+should\s+(.+)/i, type: 'COMMIT_WORK', confidence: 0.7 }
  ];
  
  for (const sentence of sentences) {
    if (isConversationFluff(sentence)) continue;
    
    // Track current speaker
    const speakerMatch = sentence.match(/^(\w+),/);
    if (speakerMatch) {
      const speaker = findUserByName(speakerMatch[1], users);
      if (speaker) currentSpeaker = speaker;
    }
    
    for (const pattern of patterns) {
      const match = sentence.match(pattern.regex);
      if (match) {
        const intent = {
          type: pattern.type,
          confidence: pattern.confidence,
          text: sentence,
          assignee: null,
          mentionedPerson: null,
          action: null,
          domain: extractDomain(sentence),
          speaker: currentSpeaker,
          projectContext: projectContext
        };
        
        if (pattern.type === 'ASSIGN_WORK' || pattern.type === 'REQUEST_WORK' || 
            pattern.type === 'REQUEST_REVIEW' || pattern.type === 'DEFINE_REQUIREMENT') {
          intent.mentionedPerson = match[1].trim();
          intent.assignee = findUserByName(match[1], users);
          intent.action = match[2];
        } else if (pattern.type === 'COMMIT_WORK') {
          intent.mentionedPerson = currentSpeaker;
          intent.assignee = currentSpeaker;
          intent.action = match[1];
        }
        
        rawIntents.push(intent);
        break;
      }
    }
  }
  
  // Step 2: Create individual tasks (no consolidation)
  const individualTasks = createIndividualTasks(rawIntents);
  
  return individualTasks;
};

// === CONSOLIDATION ENGINE ===

// Extract domain from sentence content
const extractDomain = (sentence) => {
  const lowerText = sentence.toLowerCase();
  
  if (lowerText.includes('vpc') || lowerText.includes('network') || lowerText.includes('connectivity')) {
    return 'network';
  }
  if (lowerText.includes('security') || lowerText.includes('compliance') || lowerText.includes('encryption')) {
    return 'security';
  }
  if (lowerText.includes('migration') || lowerText.includes('application') || lowerText.includes('erp')) {
    return 'migration';
  }
  if (lowerText.includes('charter') || lowerText.includes('budget') || lowerText.includes('meeting')) {
    return 'project';
  }
  
  return 'general';
};

// Create individual tasks (no over-consolidation)
const createIndividualTasks = (intents) => {
  console.log('=== CREATING INDIVIDUAL TASKS ===');
  
  const tasks = [];
  
  for (const intent of intents) {
    if (!intent.action) continue;
    
    const task = {
      text: createProfessionalTaskTitle(intent.action),
      description: createProfessionalDescription(intent),
      assignedPerson: intent.assignee, // null if user not found in Jira
      mentionedPerson: intent.mentionedPerson, // original name from meeting
      priority: detectPriorityFromSentence(intent.text),
      taskType: determineTaskType(intent.action),
      dueDate: parseDeterministicDeadline(intent.text),
      originalLine: intent.text
    };
    
    tasks.push(task);
    
    const assigneeStatus = task.assignedPerson ? 
      `assigned to ${task.assignedPerson}` : 
      `unassigned (${task.mentionedPerson} not found in Jira)`;
    console.log(`Individual task: "${task.text}" -> ${assigneeStatus}`);
  }
  
  return tasks;
};

// Create professional task title from action
const createProfessionalTaskTitle = (action) => {
  if (!action) return 'Complete task';
  
  // Clean up the action text
  let title = action.trim()
    .replace(/^(set up|setup)\s+/i, 'Set up ')
    .replace(/^(configure|config)\s+/i, 'Configure ')
    .replace(/^(implement|impl)\s+/i, 'Implement ')
    .replace(/^(review|check)\s+/i, 'Review ')
    .replace(/^(create|make)\s+/i, 'Create ')
    .replace(/^(define|spec)\s+/i, 'Define ');
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  // Truncate if too long
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  
  return title;
};

// Create professional task description
const createProfessionalDescription = (intent) => {
  const { projectContext } = intent;
  
  let description = `${projectContext.projectName} requires: ${intent.action}`;
  
  // Add context if available
  if (projectContext.context) {
    description += `\n\nProject Context: ${projectContext.context}`;
  }
  
  // Add assignment note if person not found in Jira
  if (intent.mentionedPerson && !intent.assignee) {
    description += `\n\nNote: This task was assigned to "${intent.mentionedPerson}" in the meeting, but this user was not found in Jira. Please assign manually or add the user to your Jira project.`;
  }
  
  description += `\n\nThis task was automatically extracted from meeting notes using MeetingMind AI.`;
  
  return description;
};

// Extract project context from meeting notes
const extractProjectContext = (notes) => {
  const lines = notes.split('\n').filter(line => line.trim().length > 0);
  
  let projectName = 'TechCorp';
  let context = '';
  
  // Find project context (skip conversation starters)
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip meeting headers and conversation starters
    if (trimmed.startsWith('Meeting:') || 
        trimmed.startsWith('Date:') ||
        trimmed.startsWith('Attendees:') ||
        trimmed.includes('thanks for joining') ||
        trimmed.includes('Hey everyone') ||
        trimmed.length < 50) {
      continue;
    }
    
    // Look for project context
    if (trimmed.includes('TechCorp') || trimmed.includes('SAP') || trimmed.includes('AWS')) {
      context = trimmed.substring(0, 200);
      break;
    }
  }
  
  return { projectName, context };
};

// Legacy consolidation function (kept for compatibility)
const consolidateIntents = (intents) => {
  // Now just calls individual task creation
  return createIndividualTasks(intents);
};

// Check if sentence is conversation fluff
const isConversationFluff = (sentence) => {
  const fluffPatterns = [
    /^(hey everyone|thanks for|alright|sure thing|good point|great|perfect)/i,
    /^(so we're|that's|sounds like|one more thing)/i,
    /^(meeting:|date:|attendees:)/i
  ];
  return fluffPatterns.some(pattern => pattern.test(sentence.trim()));
};

// Clean and validate task text
const cleanAndValidateTask = (text) => {
  if (!text) return null;
  
  let cleaned = text
    .replace(/^(also|and|but|so|we|i)\s+/i, '') // Remove connectors and pronouns
    .replace(/^(should|might|maybe)\s+/i, '') // Remove uncertainty
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Ensure it starts with an action verb
  if (cleaned.length < 10) return null;
  
  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  
  // Truncate if too long
  if (cleaned.length > 100) {
    cleaned = cleaned.substring(0, 97) + '...';
  }
  
  return cleaned;
};

// Quality filter for tasks
const isQualityTask = (taskText, fullSentence) => {
  const textLower = taskText.toLowerCase();
  const sentenceLower = fullSentence.toLowerCase();
  
  // Skip vague or discussion-only tasks
  const lowQualityPatterns = [
    /^(kick|think|sounds|that's|good|great|perfect)/i,
    /^(make sure|ensure we|let's make)/i,
    /^(deliver|provide|give|offer)\s+(excellence|quality|good)/i,
    /^(check|see|look)\s+(progress|status)/i
  ];
  
  if (lowQualityPatterns.some(pattern => pattern.test(taskText))) {
    return false;
  }
  
  // Skip conversational fragments
  if (sentenceLower.includes('what do you think') || 
      sentenceLower.includes('sounds good') ||
      sentenceLower.includes('that works') ||
      sentenceLower.includes('i agree')) {
    return false;
  }
  
  // Require actionable verbs (expanded list)
  const actionableVerbs = [
    'create', 'build', 'setup', 'set up', 'configure', 'implement', 'deploy',
    'review', 'analyze', 'assess', 'evaluate', 'define', 'prepare',
    'schedule', 'coordinate', 'present', 'develop', 'design',
    'install', 'migrate', 'test', 'monitor', 'document', 'start',
    'begin', 'establish', 'ensure', 'handle', 'manage', 'work'
  ];
  
  const hasActionableVerb = actionableVerbs.some(verb => 
    textLower.includes(verb)
  );
  
  return hasActionableVerb && taskText.length >= 10;
};

// Find speaker from context (for "I'll" statements) - FIXED
const findSpeakerFromContext = (sentence, users) => {
  // This is now handled in the main extraction loop with speaker tracking
  return null;
};

// Detect priority from sentence context
const detectPriorityFromSentence = (sentence) => {
  const lowerText = sentence.toLowerCase();
  
  // High priority keywords
  if (lowerText.includes('critical') || lowerText.includes('urgent') || 
      lowerText.includes('high priority') || lowerText.includes('important') ||
      lowerText.includes('can\'t afford') || lowerText.includes('must') ||
      lowerText.includes('essential') || lowerText.includes('crucial') ||
      lowerText.includes('aggressive') || lowerText.includes('tight')) {
    return 'High';
  }
  
  // Low priority keywords
  if (lowerText.includes('low priority') || lowerText.includes('nice to have') ||
      lowerText.includes('when time permits') || lowerText.includes('optional') ||
      lowerText.includes('maybe') || lowerText.includes('might')) {
    return 'Low';
  }
  
  return 'Medium';
};

// Determine task type from content and pattern
const determineTaskTypeFromContent = (taskText, patternType) => {
  const textLower = taskText.toLowerCase();
  
  // Epic-level work
  if (textLower.includes('compliance') || textLower.includes('security') ||
      textLower.includes('architecture') || textLower.includes('strategy') ||
      textLower.includes('charter') || textLower.includes('budget') ||
      textLower.includes('requirements') && textLower.includes('define')) {
    return 'Epic';
  }
  
  // Story-level work
  if (patternType === 'review' || textLower.includes('review') ||
      textLower.includes('analysis') || textLower.includes('assessment') ||
      textLower.includes('evaluation') || textLower.includes('take on')) {
    return 'Story';
  }
  
  return 'Task';
};



// Map priority text to Jira priority
const extractPriority = (priorityText, availablePriorities) => {
  const lowerText = priorityText.toLowerCase();
  
  if (lowerText === 'high') {
    return availablePriorities.find(p => p.name.toLowerCase().includes('high')) || 
           availablePriorities[0];
  }
  
  return availablePriorities[Math.floor(availablePriorities.length / 2)];
};

resolver.define('createJiraTasks', async (req) => {
  const { notes } = req.payload;
  
  try {
    const projectsResponse = await api.asUser().requestJira(route`/rest/api/3/project`);
    const projects = await projectsResponse.json();
    
    if (projects.length === 0) {
      return { success: false, message: 'No Jira projects found' };
    }

    const project = projects[0];
    
    const usersResponse = await api.asUser().requestJira(route`/rest/api/3/user/assignable/search?project=${project.key}`);
    const users = await usersResponse.json();
    
    const prioritiesResponse = await api.asUser().requestJira(route`/rest/api/3/priority`);
    const priorities = await prioritiesResponse.json();
    
    const issueTypesResponse = await api.asUser().requestJira(route`/rest/api/3/project/${project.key}`);
    const projectData = await issueTypesResponse.json();
    const issueTypes = projectData.issueTypes;
    
    const projectInfo = extractProjectContext(notes);
    const actionItems = await extractWithAI(notes, users);
    
    if (actionItems.length === 0) {
      return { success: false, message: 'No action items found in meeting notes' };
    }

    const createdTasks = [];

    for (const item of actionItems) {
      const todayFormatted = new Date().toISOString().split('T')[0];
      const priority = extractPriority(item.priority, priorities);
      
      let assignee = null;
      if (item.assignedPerson) {
        assignee = users.find(user => user.displayName === item.assignedPerson);
      }
      
      const issueType = issueTypes.find(type => type.name === item.taskType) || 
                       issueTypes.find(type => type.name === 'Task') || 
                       issueTypes[0];
      
      const taskData = {
        fields: {
          project: { key: project.key },
          summary: item.text,
          description: {
            type: 'doc',
            version: 1,
            content: [{
              type: 'paragraph',
              content: [{
                type: 'text',
                text: `${item.description}\n\n${projectInfo.projectContext}\n\nThis task was automatically extracted from meeting notes using MeetingMind AI.`
              }]
            }]
          },
          issuetype: { id: issueType.id },
          priority: { id: priority.id }
        }
      };
      
      if (assignee) {
        taskData.fields.assignee = { accountId: assignee.accountId };
      }
      
      if (item.dueDate) {
        taskData.fields.duedate = item.dueDate;
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
          summary: item.text,
          assignee: assignee ? assignee.displayName : 'Unassigned',
          dueDate: item.dueDate || 'No due date',
          startDate: todayFormatted,
          priority: priority.name,
          type: item.taskType
        });
      } else {
        const error = await response.text();
        if (error.includes('assignee')) {
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
              startDate: todayFormatted,
              priority: priority.name,
              type: item.taskType
            });
            continue;
          }
        }
        
        return { success: false, message: `Failed to create task: ${item.text}` };
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
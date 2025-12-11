# 🔌 MeetingMind: Complete API Reference

## Quick Reference

All APIs you'll use in MeetingMind with exact endpoints, parameters, and examples.

---

## 1. Confluence REST API

**Base URL:** `https://your-site.atlassian.net/wiki/rest/api`

**Authentication:** Handled by Forge (`api.asUser()` or `api.asApp()`)

### 1.1 Get Page Content

**Endpoint:** `GET /content/{pageId}`

**Parameters:**
- `pageId` (path): The ID of the Confluence page
- `expand` (query): Additional data to include

**Example:**
```javascript
import api, { route } from '@forge/api';

const pageId = '123456';
const response = await api.asUser().requestConfluence(
  route`/wiki/rest/api/content/${pageId}?expand=body.storage,version`
);

const data = await response.json();
console.log(data.body.storage.value); // HTML content
```

**Response:**
```json
{
  "id": "123456",
  "type": "page",
  "title": "Team Meeting - Dec 5, 2025",
  "body": {
    "storage": {
      "value": "<p>Meeting notes here...</p>",
      "representation": "storage"
    }
  },
  "version": {
    "number": 1
  }
}
```

---

### 1.2 Update Page Content

**Endpoint:** `PUT /content/{pageId}`

**Parameters:**
- `pageId` (path): The ID of the page to update

**Body:**
```json
{
  "version": {
    "number": 2
  },
  "title": "Team Meeting - Dec 5, 2025",
  "type": "page",
  "body": {
    "storage": {
      "value": "<p>Updated content...</p>",
      "representation": "storage"
    }
  }
}
```

**Example:**
```javascript
const pageId = '123456';
const currentVersion = 1;
const newContent = '<p>Meeting notes with decisions...</p>';

const response = await api.asUser().requestConfluence(
  route`/wiki/rest/api/content/${pageId}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: { number: currentVersion + 1 },
      title: 'Team Meeting - Dec 5, 2025',
      type: 'page',
      body: {
        storage: {
          value: newContent,
          representation: 'storage'
        }
      }
    })
  }
);
```

---

### 1.3 Create New Page

**Endpoint:** `POST /content`

**Body:**
```json
{
  "type": "page",
  "title": "Meeting Summary",
  "space": {
    "key": "TEAM"
  },
  "body": {
    "storage": {
      "value": "<p>Content here...</p>",
      "representation": "storage"
    }
  }
}
```

**Example:**
```javascript
const response = await api.asUser().requestConfluence(
  route`/wiki/rest/api/content`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'page',
      title: 'Meeting Summary - Dec 5',
      space: { key: 'TEAM' },
      body: {
        storage: {
          value: '<p>Meeting summary content...</p>',
          representation: 'storage'
        }
      }
    })
  }
);
```

---

## 2. Jira REST API

**Base URL:** `https://your-site.atlassian.net/rest/api/3`

**Authentication:** Handled by Forge (`api.asUser()` or `api.asApp()`)

### 2.1 Create Issue (Task)

**Endpoint:** `POST /issue`

**Body:**
```json
{
  "fields": {
    "project": {
      "key": "PROJ"
    },
    "summary": "Update budget spreadsheet",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Action item from meeting on Dec 5"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "name": "Task"
    },
    "assignee": {
      "accountId": "5b10a2844c20165700ede21g"
    },
    "duedate": "2025-12-08",
    "priority": {
      "name": "Medium"
    },
    "labels": ["meeting-action", "q1-planning"]
  }
}
```

**Example:**
```javascript
import api, { route } from '@forge/api';

async function createJiraTask(taskData) {
  const response = await api.asUser().requestJira(
    route`/rest/api/3/issue`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          project: { key: taskData.projectKey },
          summary: taskData.summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: taskData.description
                  }
                ]
              }
            ]
          },
          issuetype: { name: 'Task' },
          assignee: { accountId: taskData.assigneeId },
          duedate: taskData.dueDate,
          priority: { name: taskData.priority || 'Medium' }
        }
      })
    }
  );
  
  return await response.json();
}

// Usage
const result = await createJiraTask({
  projectKey: 'PROJ',
  summary: 'Update budget spreadsheet',
  description: 'From meeting on Dec 5: Update Q1 budget',
  assigneeId: '5b10a2844c20165700ede21g',
  dueDate: '2025-12-08',
  priority: 'High'
});

console.log(`Created task: ${result.key}`); // PROJ-123
```

**Response:**
```json
{
  "id": "10000",
  "key": "PROJ-123",
  "self": "https://your-site.atlassian.net/rest/api/3/issue/10000"
}
```

---

### 2.2 Search Users

**Endpoint:** `GET /user/search`

**Parameters:**
- `query` (query): Search term (name or email)

**Example:**
```javascript
const searchTerm = 'john';
const response = await api.asUser().requestJira(
  route`/rest/api/3/user/search?query=${searchTerm}`
);

const users = await response.json();
console.log(users);
```

**Response:**
```json
[
  {
    "accountId": "5b10a2844c20165700ede21g",
    "displayName": "John Smith",
    "emailAddress": "john@company.com",
    "active": true
  },
  {
    "accountId": "5b10a2844c20165700ede21h",
    "displayName": "John Doe",
    "emailAddress": "johndoe@company.com",
    "active": true
  }
]
```

---

### 2.3 Get Projects

**Endpoint:** `GET /project`

**Example:**
```javascript
const response = await api.asUser().requestJira(
  route`/rest/api/3/project`
);

const projects = await response.json();
console.log(projects);
```

**Response:**
```json
[
  {
    "id": "10000",
    "key": "PROJ",
    "name": "Project Name",
    "projectTypeKey": "software"
  }
]
```

---

### 2.4 Get Issue Details

**Endpoint:** `GET /issue/{issueIdOrKey}`

**Example:**
```javascript
const issueKey = 'PROJ-123';
const response = await api.asUser().requestJira(
  route`/rest/api/3/issue/${issueKey}`
);

const issue = await response.json();
console.log(issue.fields.status.name); // "To Do"
```

---

### 2.5 Update Issue

**Endpoint:** `PUT /issue/{issueIdOrKey}`

**Example:**
```javascript
const issueKey = 'PROJ-123';
const response = await api.asUser().requestJira(
  route`/rest/api/3/issue/${issueKey}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        summary: 'Updated task summary',
        priority: { name: 'High' }
      }
    })
  }
);
```

---

## 3. Rovo Agent API

**Purpose:** AI-powered text analysis

**Module:** `@forge/rovo`

### 3.1 Query Agent

**Example:**
```javascript
import { agent } from '@forge/rovo';

async function extractActionItems(meetingText) {
  const prompt = `
You are an expert meeting analyst. Analyze this meeting transcript and extract structured information.

Meeting Transcript:
${meetingText}

Extract the following in JSON format:
1. Action Items: Tasks that need to be done
   - Look for phrases like "will do", "needs to", "should", "must"
   - Identify WHO is responsible
   - Identify WHAT needs to be done
   - Identify WHEN it's due (if mentioned)

2. Decisions: Conclusions or agreements made
   - Look for phrases like "we decided", "agreed to", "approved"

3. Blockers: Issues preventing progress
   - Look for phrases like "blocked by", "waiting on", "can't proceed"

Return JSON in this exact format:
{
  "actionItems": [
    {
      "description": "Update budget spreadsheet",
      "assignee": "John",
      "dueDate": "Wednesday",
      "priority": "High"
    }
  ],
  "decisions": [
    {
      "decision": "Selected Vendor A for CRM",
      "timestamp": "current"
    }
  ],
  "blockers": [
    {
      "blocker": "Waiting on legal approval",
      "owner": "Sarah"
    }
  ]
}
`;

  try {
    const result = await agent.query({
      prompt: prompt,
      context: {
        meetingText: meetingText
      }
    });

    return JSON.parse(result.response);
  } catch (error) {
    console.error('Rovo Agent error:', error);
    throw error;
  }
}

// Usage
const meetingNotes = `
- John will update the budget by Wednesday
- We decided to go with Vendor A
- Sarah needs to call the client
`;

const extracted = await extractActionItems(meetingNotes);
console.log(extracted.actionItems); // Array of action items
```

---

## 4. Forge Storage API

**Purpose:** Store app data (analytics, cache, preferences)

**Module:** `@forge/api`

### 4.1 Set Data

**Example:**
```javascript
import { storage } from '@forge/api';

// Store meeting metrics
await storage.set('meeting-123-metrics', {
  actionItemCount: 4,
  decisionsCount: 2,
  completionRate: 0.92,
  processedAt: new Date().toISOString()
});

// Store user cache
await storage.set('user-cache-john', {
  accountId: '5b10a2844c20165700ede21g',
  displayName: 'John Smith',
  cachedAt: Date.now()
});
```

---

### 4.2 Get Data

**Example:**
```javascript
import { storage } from '@forge/api';

// Retrieve metrics
const metrics = await storage.get('meeting-123-metrics');
console.log(metrics.actionItemCount); // 4

// Check if exists
if (metrics) {
  console.log('Metrics found');
} else {
  console.log('No metrics stored');
}
```

---

### 4.3 Delete Data

**Example:**
```javascript
import { storage } from '@forge/api';

await storage.delete('meeting-123-metrics');
```

---

### 4.4 Query Data

**Example:**
```javascript
import { storage } from '@forge/api';

// Get all meeting metrics
const results = await storage.query()
  .where('key', 'startsWith', 'meeting-')
  .getMany();

console.log(results.results); // Array of stored items

// Iterate through results
for (const item of results.results) {
  console.log(item.key, item.value);
}
```

---

## 5. Forge Bridge API

**Purpose:** Communication between frontend and backend

**Module:** `@forge/bridge`

### 5.1 Invoke Backend Function

**Frontend:**
```javascript
import { invoke } from '@forge/bridge';

async function handleProcessMeeting() {
  try {
    const result = await invoke('processMeeting', {
      pageId: '123456',
      projectKey: 'PROJ'
    });
    
    console.log(result); // Response from backend
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Backend (index.js):**
```javascript
import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('processMeeting', async (req) => {
  const { pageId, projectKey } = req.payload;
  
  // Process meeting logic here
  const result = await processMeetingLogic(pageId, projectKey);
  
  return result;
});

export const handler = resolver.getDefinitions();
```

---

## 6. Complete Integration Example

### Full Workflow Implementation

```javascript
// src/backend/meetingProcessor.js
import api, { route, storage } from '@forge/api';
import { agent } from '@forge/rovo';
import { parseNaturalDate } from './dateParser';
import { matchUserByName } from './userMatcher';

export async function processMeeting(pageId, projectKey) {
  try {
    // Step 1: Read Confluence page
    const pageResponse = await api.asUser().requestConfluence(
      route`/wiki/rest/api/content/${pageId}?expand=body.storage`
    );
    const pageData = await pageResponse.json();
    const meetingContent = pageData.body.storage.value;
    
    // Step 2: Extract action items using Rovo
    const extracted = await agent.query({
      prompt: `Extract action items from: ${meetingContent}`,
      context: { meetingContent }
    });
    const parsedData = JSON.parse(extracted.response);
    
    // Step 3: Process each action item
    const createdTasks = [];
    
    for (const item of parsedData.actionItems) {
      // Match user
      const assigneeId = await matchUserByName(item.assignee);
      
      // Parse date
      const dueDate = parseNaturalDate(item.dueDate);
      
      // Create Jira task
      const taskResponse = await api.asUser().requestJira(
        route`/rest/api/3/issue`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              project: { key: projectKey },
              summary: item.description,
              description: {
                type: 'doc',
                version: 1,
                content: [{
                  type: 'paragraph',
                  content: [{
                    type: 'text',
                    text: `Action item from meeting: ${pageData.title}`
                  }]
                }]
              },
              issuetype: { name: 'Task' },
              assignee: { accountId: assigneeId },
              duedate: dueDate,
              priority: { name: item.priority || 'Medium' }
            }
          })
        }
      );
      
      const task = await taskResponse.json();
      createdTasks.push(task);
    }
    
    // Step 4: Store analytics
    await storage.set(`meeting-${pageId}-metrics`, {
      actionItemCount: createdTasks.length,
      decisionsCount: parsedData.decisions.length,
      processedAt: new Date().toISOString()
    });
    
    // Step 5: Return results
    return {
      success: true,
      tasksCreated: createdTasks.length,
      tasks: createdTasks.map(t => ({
        key: t.key,
        summary: t.fields.summary
      }))
    };
    
  } catch (error) {
    console.error('Error processing meeting:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## 7. Error Handling

### Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request body/parameters |
| 401 | Unauthorized | Check authentication |
| 403 | Forbidden | Check permissions in manifest.yml |
| 404 | Not Found | Check resource ID/key |
| 429 | Rate Limited | Implement retry with backoff |
| 500 | Server Error | Retry or report issue |

### Error Handling Example

```javascript
async function createTaskWithRetry(taskData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await api.asUser().requestJira(
        route`/rest/api/3/issue`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: taskData })
        }
      );
      
      if (response.status === 201) {
        return await response.json();
      }
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        await sleep(2000 * (i + 1));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1));
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 8. Rate Limits

### Atlassian API Rate Limits

- **Confluence:** ~200 requests per minute per user
- **Jira:** ~200 requests per minute per user
- **Forge Storage:** ~100 operations per second

### Best Practices

1. **Cache frequently accessed data**
```javascript
// Cache user lookups for 24 hours
const cached = await storage.get(`user-${name}`);
if (cached && Date.now() - cached.timestamp < 86400000) {
  return cached.accountId;
}
```

2. **Batch operations**
```javascript
// Process multiple items in parallel
await Promise.all(
  items.map(item => createTask(item))
);
```

3. **Implement exponential backoff**
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

---

## 9. Testing APIs

### Using Forge Tunnel for Development

```bash
# Start tunnel for live testing
forge tunnel

# Your app will reload on code changes
# Test in browser immediately
```

### Logging API Responses

```javascript
const response = await api.asUser().requestJira(route`/rest/api/3/issue`);
console.log('Status:', response.status);
console.log('Headers:', response.headers);
const data = await response.json();
console.log('Data:', JSON.stringify(data, null, 2));

// View logs
// forge logs
```

---

## 10. Quick Reference

### Essential Imports

```javascript
// Forge API
import api, { route, storage } from '@forge/api';

// Rovo Agent
import { agent } from '@forge/rovo';

// Frontend Bridge
import { invoke } from '@forge/bridge';

// UI Components
import { Button, Form, TextField } from '@forge/react';
```

### Common Patterns

**Get Confluence Page:**
```javascript
const response = await api.asUser().requestConfluence(
  route`/wiki/rest/api/content/${pageId}?expand=body.storage`
);
```

**Create Jira Task:**
```javascript
const response = await api.asUser().requestJira(
  route`/rest/api/3/issue`,
  { method: 'POST', body: JSON.stringify({ fields: {...} }) }
);
```

**Query Rovo:**
```javascript
const result = await agent.query({ prompt: '...', context: {...} });
```

**Store Data:**
```javascript
await storage.set('key', { data: 'value' });
```

---

**This API reference contains everything you need to integrate with Atlassian services. Keep it open while coding!** 🚀

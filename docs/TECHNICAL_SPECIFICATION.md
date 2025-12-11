# 🔧 MeetingMind: Technical Specification

## Table of Contents
1. [System Architecture](#architecture)
2. [Technology Stack](#tech-stack)
3. [API Documentation](#apis)
4. [Data Models](#data-models)
5. [Code Structure](#code-structure)
6. [Implementation Details](#implementation)
7. [Security & Performance](#security)

---

## 1. System Architecture {#architecture}

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Meeting        │  │ Dashboard      │  │ Settings     │  │
│  │ Template UI    │  │ Analytics UI   │  │ Panel        │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Meeting        │  │ Task           │  │ Analytics    │  │
│  │ Processor      │  │ Creator        │  │ Engine       │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                         │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Confluence     │  │ Jira           │  │ Rovo Agent   │  │
│  │ Service        │  │ Service        │  │ Service      │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Forge          │  │ Confluence     │  │ Jira         │  │
│  │ Storage        │  │ Database       │  │ Database     │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Sequence

```
1. User types meeting notes in Confluence
   ↓
2. User clicks "Process Meeting" button
   ↓
3. Frontend sends request to Forge backend
   ↓
4. Backend reads Confluence page content via API
   ↓
5. Backend sends content to Rovo Agent
   ↓
6. Rovo Agent analyzes text, returns structured JSON
   ↓
7. Backend parses AI response
   ↓
8. Backend matches names to Jira users
   ↓
9. Backend parses dates from natural language
   ↓
10. Backend creates Jira tasks via API
    ↓
11. Backend updates Confluence page with decisions
    ↓
12. Backend stores analytics in Forge Storage
    ↓
13. Frontend shows success message
    ↓
14. Users receive notifications
```

---

## 2. Technology Stack {#tech-stack}

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Platform** | Atlassian Forge | Latest | Serverless app platform |
| **Runtime** | Node.js | 18.x | JavaScript runtime |
| **Frontend** | Forge UI Kit | 2.x | React-based UI components |
| **Backend** | JavaScript/Node.js | ES6+ | Business logic |
| **AI/NLP** | Rovo Agent | Latest | Action item extraction |
| **Storage** | Forge Storage | Built-in | Key-value data store |
| **APIs** | REST | - | Confluence, Jira integration |

### NPM Dependencies

```json
{
  "dependencies": {
    "@forge/api": "^3.0.0",
    "@forge/react": "^10.0.0",
    "@forge/ui": "^2.0.0",
    "@forge/rovo": "^1.0.0",
    "chrono-node": "^2.7.0",
    "fuse.js": "^7.0.0"
  },
  "devDependencies": {
    "@forge/cli": "^8.0.0"
  }
}
```

### Why These Choices?

**Forge**: Required by hackathon, provides serverless infrastructure

**Forge UI Kit**: Pre-built Atlassian-styled components, faster development

**Rovo Agent**: Atlassian's AI platform, bonus prize eligible, handles NLP

**chrono-node**: Best JavaScript library for natural language date parsing

**fuse.js**: Fuzzy string matching for name-to-user matching

---

## 3. API Documentation {#apis}

### 3.1 Confluence REST API

**Base URL**: `https://your-site.atlassian.net/wiki/rest/api`

#### Get Page Content
```http
GET /content/{pageId}?expand=body.storage,version

Response:
{
  "id": "123456",
  "type": "page",
  "title": "Team Meeting - Dec 5, 2025",
  "body": {
    "storage": {
      "value": "<p>Meeting notes here...</p>"
    }
  },
  "version": {
    "number": 1
  }
}
```

#### Update Page Content
```http
PUT /content/{pageId}

Body:
{
  "version": {
    "number": 2
  },
  "title": "Team Meeting - Dec 5, 2025",
  "type": "page",
  "body": {
    "storage": {
      "value": "<p>Updated content with decisions...</p>"
    }
  }
}
```

#### Create Page
```http
POST /content

Body:
{
  "type": "page",
  "title": "Meeting Summary",
  "space": {
    "key": "TEAM"
  },
  "body": {
    "storage": {
      "value": "<p>Meeting content...</p>"
    }
  }
}
```

**Forge Implementation:**
```javascript
import api, { route } from '@forge/api';

async function getPageContent(pageId) {
  const response = await api.asUser().requestConfluence(
    route`/wiki/rest/api/content/${pageId}?expand=body.storage`
  );
  const data = await response.json();
  return data.body.storage.value;
}
```

---

### 3.2 Jira REST API

**Base URL**: `https://your-site.atlassian.net/rest/api/3`

#### Create Issue
```http
POST /issue

Body:
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
              "text": "From meeting on Dec 5: Update Q1 budget with new figures"
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

Response:
{
  "id": "10000",
  "key": "PROJ-123",
  "self": "https://your-site.atlassian.net/rest/api/3/issue/10000"
}
```

#### Search Users
```http
GET /user/search?query=john

Response:
[
  {
    "accountId": "5b10a2844c20165700ede21g",
    "displayName": "John Smith",
    "emailAddress": "john@company.com"
  }
]
```

#### Get Projects
```http
GET /project

Response:
[
  {
    "id": "10000",
    "key": "PROJ",
    "name": "Project Name"
  }
]
```

**Forge Implementation:**
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
          description: formatDescription(taskData.description),
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
```

---

### 3.3 Rovo Agent API

**Purpose**: AI-powered text analysis for action item extraction

**Forge Implementation:**
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

  const result = await agent.query({
    prompt: prompt,
    context: {
      meetingText: meetingText
    }
  });

  return JSON.parse(result.response);
}
```

---

### 3.4 Forge Storage API

**Purpose**: Store analytics, user preferences, cached data

**Operations:**
```javascript
import { storage } from '@forge/api';

// Store data
await storage.set('meeting-123-metrics', {
  actionItemCount: 4,
  decisionsCount: 2,
  completionRate: 0.92,
  timeSaved: 30,
  processedAt: new Date().toISOString()
});

// Retrieve data
const metrics = await storage.get('meeting-123-metrics');

// Delete data
await storage.delete('meeting-123-metrics');

// List all keys
const keys = await storage.query()
  .where('key', 'startsWith', 'meeting-')
  .getMany();
```

**Storage Schema:**
```javascript
// User preferences
{
  key: `user-${accountId}-preferences`,
  value: {
    defaultProject: "PROJ",
    defaultPriority: "Medium",
    notificationsEnabled: true
  }
}

// Meeting metrics
{
  key: `meeting-${pageId}-metrics`,
  value: {
    actionItemCount: 4,
    decisionsCount: 2,
    blockersCount: 1,
    processedAt: "2025-12-05T10:30:00Z",
    completionRate: 0.92
  }
}

// User cache (name → accountId)
{
  key: `user-cache-${normalizedName}`,
  value: {
    accountId: "5b10a2844c20165700ede21g",
    displayName: "John Smith",
    cachedAt: "2025-12-05T10:00:00Z"
  }
}
```

---

## 4. Data Models {#data-models}

### Action Item Model
```javascript
{
  id: "uuid",
  description: "Update budget spreadsheet",
  assignee: "John Smith",
  assigneeId: "5b10a2844c20165700ede21g",
  dueDate: "2025-12-08",
  priority: "High" | "Medium" | "Low",
  status: "pending" | "created" | "failed",
  jiraIssueKey: "PROJ-123",
  meetingPageId: "123456",
  createdAt: "2025-12-05T10:30:00Z"
}
```

### Decision Model
```javascript
{
  id: "uuid",
  decision: "Selected Vendor A for CRM",
  context: "After evaluating 3 vendors...",
  deciders: ["John Smith", "Sarah Johnson"],
  timestamp: "2025-12-05T10:30:00Z",
  meetingPageId: "123456",
  tags: ["vendor-selection", "crm"]
}
```

### Meeting Model
```javascript
{
  id: "uuid",
  pageId: "123456",
  title: "Team Meeting - Dec 5, 2025",
  date: "2025-12-05",
  attendees: ["John Smith", "Sarah Johnson", "Mike Chen"],
  actionItemsCount: 4,
  decisionsCount: 2,
  blockersCount: 1,
  processedAt: "2025-12-05T11:00:00Z",
  completionRate: 0.92
}
```

### Analytics Model
```javascript
{
  totalMeetings: 25,
  totalActionItems: 100,
  completedActionItems: 92,
  completionRate: 0.92,
  averageActionItemsPerMeeting: 4,
  totalTimeSaved: 750, // minutes
  lastUpdated: "2025-12-05T11:00:00Z"
}
```

---

## 5. Code Structure {#code-structure}

### Project Directory Structure

```
meetingmind/
├── manifest.yml                    # Forge app configuration
├── package.json                    # Dependencies
├── README.md                       # Documentation
│
├── src/
│   ├── index.js                   # Main entry point
│   │
│   ├── frontend/                  # UI Components (React)
│   │   ├── MeetingTemplate.jsx       # Main note-taking interface
│   │   ├── ProcessButton.jsx         # Action button component
│   │   ├── Dashboard.jsx             # Analytics dashboard
│   │   ├── SettingsPanel.jsx         # User settings
│   │   └── components/
│   │       ├── ActionItemList.jsx    # Display action items
│   │       ├── DecisionLog.jsx       # Display decisions
│   │       └── MetricsCard.jsx       # Analytics card
│   │
│   ├── backend/                   # Business Logic
│   │   ├── meetingProcessor.js       # Main processing orchestrator
│   │   ├── confluenceService.js      # Confluence API wrapper
│   │   ├── jiraService.js            # Jira API wrapper
│   │   ├── userMatcher.js            # Name → User matching
│   │   ├── dateParser.js             # Natural language date parsing
│   │   ├── decisionTracker.js        # Decision extraction & storage
│   │   └── analyticsService.js       # Metrics calculation
│   │
│   ├── ai/                        # AI/NLP
│   │   ├── rovoAgent.js              # Rovo Agent integration
│   │   ├── prompts.js                # AI prompt templates
│   │   └── responseParser.js         # Parse AI responses
│   │
│   ├── utils/                     # Utilities
│   │   ├── logger.js                 # Logging utility
│   │   ├── validators.js             # Input validation
│   │   ├── formatters.js             # Data formatting
│   │   └── constants.js              # App constants
│   │
│   └── config/                    # Configuration
│       ├── defaults.js               # Default settings
│       └── permissions.js            # Permission scopes
│
└── tests/                         # Tests (if time permits)
    ├── userMatcher.test.js
    ├── dateParser.test.js
    └── meetingProcessor.test.js
```

### manifest.yml Configuration

```yaml
modules:
  # Confluence macro for meeting notes
  confluence:macro:
    - key: meetingmind-note-taker
      title: MeetingMind Note Taker
      description: AI-powered meeting note template
      resolver:
        function: main
      render: native
      
  # Jira issue panel
  jira:issuePanel:
    - key: meeting-action-items
      title: Meeting Action Items
      resolver:
        function: jiraPanel
      
  # Analytics dashboard
  confluence:globalPage:
    - key: meetingmind-dashboard
      title: MeetingMind Dashboard
      resolver:
        function: dashboard
        
  # Backend functions
  function:
    - key: main
      handler: index.run
    - key: processMeeting
      handler: backend/meetingProcessor.process
    - key: jiraPanel
      handler: frontend/JiraPanel.render
    - key: dashboard
      handler: frontend/Dashboard.render

  # Rovo Agent
  rovo:agent:
    - key: action-item-extractor
      name: Action Item Extractor
      description: Extracts action items from meeting notes
      
permissions:
  scopes:
    - read:confluence-content.all
    - write:confluence-content
    - read:jira-work
    - write:jira-work
    - read:jira-user
    - storage:app
    
app:
  id: ari:cloud:ecosystem::app/your-app-id
```

---

## 6. Implementation Details {#implementation}

### 6.1 Meeting Processor (Core Logic)

**File**: `src/backend/meetingProcessor.js`

```javascript
import { extractActionItems } from '../ai/rovoAgent';
import { matchUserByName } from './userMatcher';
import { parseNaturalDate } from './dateParser';
import { createJiraTask } from './jiraService';
import { updateConfluencePage } from './confluenceService';
import { storage } from '@forge/api';

export async function processMeeting(pageId, projectKey) {
  try {
    // Step 1: Read meeting notes from Confluence
    const meetingContent = await getPageContent(pageId);
    
    // Step 2: Extract structured data using AI
    const extracted = await extractActionItems(meetingContent);
    
    // Step 3: Process action items
    const processedItems = await Promise.all(
      extracted.actionItems.map(async (item) => {
        // Match assignee name to Jira user
        const assigneeId = await matchUserByName(item.assignee);
        
        // Parse due date
        const dueDate = parseNaturalDate(item.dueDate);
        
        // Create Jira task
        const jiraIssue = await createJiraTask({
          projectKey,
          summary: item.description,
          description: `Action item from meeting: ${meetingContent.title}`,
          assigneeId,
          dueDate,
          priority: item.priority || 'Medium'
        });
        
        return {
          ...item,
          jiraIssueKey: jiraIssue.key,
          status: 'created'
        };
      })
    );
    
    // Step 4: Update Confluence page with decisions
    if (extracted.decisions.length > 0) {
      await updateConfluencePage(pageId, extracted.decisions);
    }
    
    // Step 5: Store analytics
    await storage.set(`meeting-${pageId}-metrics`, {
      actionItemCount: processedItems.length,
      decisionsCount: extracted.decisions.length,
      processedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      actionItems: processedItems,
      decisions: extracted.decisions
    };
    
  } catch (error) {
    console.error('Error processing meeting:', error);
    throw error;
  }
}
```

---

### 6.2 User Matcher

**File**: `src/backend/userMatcher.js`

```javascript
import api, { route } from '@forge/api';
import { storage } from '@forge/api';
import Fuse from 'fuse.js';

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function matchUserByName(name) {
  if (!name) return null;
  
  // Check cache first
  const cacheKey = `user-cache-${name.toLowerCase()}`;
  const cached = await storage.get(cacheKey);
  
  if (cached && Date.now() - cached.cachedAt < CACHE_DURATION) {
    return cached.accountId;
  }
  
  // Search Jira users
  const response = await api.asUser().requestJira(
    route`/rest/api/3/user/search?query=${name}`
  );
  const users = await response.json();
  
  if (users.length === 0) {
    return null;
  }
  
  // Exact match
  const exactMatch = users.find(u => 
    u.displayName.toLowerCase() === name.toLowerCase()
  );
  
  if (exactMatch) {
    await cacheUser(name, exactMatch);
    return exactMatch.accountId;
  }
  
  // Fuzzy match
  const fuse = new Fuse(users, {
    keys: ['displayName', 'emailAddress'],
    threshold: 0.3
  });
  
  const fuzzyResults = fuse.search(name);
  
  if (fuzzyResults.length > 0) {
    const bestMatch = fuzzyResults[0].item;
    await cacheUser(name, bestMatch);
    return bestMatch.accountId;
  }
  
  return null;
}

async function cacheUser(name, user) {
  const cacheKey = `user-cache-${name.toLowerCase()}`;
  await storage.set(cacheKey, {
    accountId: user.accountId,
    displayName: user.displayName,
    cachedAt: Date.now()
  });
}
```

---

### 6.3 Date Parser

**File**: `src/backend/dateParser.js`

```javascript
import chrono from 'chrono-node';

export function parseNaturalDate(dateString, referenceDate = new Date()) {
  if (!dateString) {
    // Default: 1 week from now
    const defaultDate = new Date(referenceDate);
    defaultDate.setDate(defaultDate.getDate() + 7);
    return formatDate(defaultDate);
  }
  
  // Try chrono-node first (handles most natural language)
  const parsed = chrono.parseDate(dateString, referenceDate);
  
  if (parsed) {
    return formatDate(parsed);
  }
  
  // Fallback: manual parsing for common phrases
  const lower = dateString.toLowerCase();
  const today = new Date(referenceDate);
  
  if (lower.includes('today')) {
    return formatDate(today);
  }
  
  if (lower.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  }
  
  if (lower.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return formatDate(nextWeek);
  }
  
  if (lower.includes('friday')) {
    return getNextDayOfWeek(today, 5); // Friday = 5
  }
  
  // Default: 1 week from now
  const defaultDate = new Date(today);
  defaultDate.setDate(defaultDate.getDate() + 7);
  return formatDate(defaultDate);
}

function getNextDayOfWeek(date, targetDay) {
  const current = date.getDay();
  const distance = (targetDay + 7 - current) % 7 || 7;
  const result = new Date(date);
  result.setDate(result.getDate() + distance);
  return formatDate(result);
}

function formatDate(date) {
  // Jira format: YYYY-MM-DD
  return date.toISOString().split('T')[0];
}
```

---

### 6.4 Frontend: Meeting Template

**File**: `src/frontend/MeetingTemplate.jsx`

```javascript
import React, { useState } from 'react';
import { invoke } from '@forge/bridge';
import {
  Form,
  TextField,
  TextArea,
  Button,
  Text,
  Stack,
  Box
} from '@forge/react';

export default function MeetingTemplate() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleProcess = async () => {
    setProcessing(true);
    setResult(null);
    
    try {
      const response = await invoke('processMeeting', {
        pageId: context.extension.content.id,
        projectKey: 'PROJ' // TODO: Make configurable
      });
      
      setResult({
        success: true,
        message: `Created ${response.actionItems.length} tasks!`,
        items: response.actionItems
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Box>
      <Stack space="medium">
        <Text size="large" weight="bold">
          MeetingMind Note Taker
        </Text>
        
        <TextField
          label="Meeting Title"
          value={title}
          onChange={setTitle}
          placeholder="Team Sync - Dec 5, 2025"
        />
        
        <TextArea
          label="Meeting Notes"
          value={notes}
          onChange={setNotes}
          placeholder="Type your meeting notes here...
          
Example:
- John will update the budget by Wednesday
- We decided to go with Vendor A
- Sarah needs to schedule follow-up call"
          rows={15}
        />
        
        <Button
          text={processing ? "Processing..." : "Process Meeting"}
          onClick={handleProcess}
          isDisabled={processing || !notes}
          appearance="primary"
        />
        
        {result && (
          <Box
            backgroundColor={result.success ? "green" : "red"}
            padding="medium"
          >
            <Text color="white">{result.message}</Text>
            
            {result.success && result.items && (
              <Stack space="small">
                {result.items.map((item, i) => (
                  <Text key={i} color="white">
                    ✓ {item.jiraIssueKey}: {item.description}
                  </Text>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
```

---

## 7. Security & Performance {#security}

### Security Considerations

**1. Authentication**
- Use `api.asUser()` for user-specific actions
- Use `api.asApp()` only for system-level operations
- Never expose API tokens in frontend code

**2. Data Privacy**
- Meeting notes may contain sensitive information
- Store only metadata in Forge Storage
- Don't log meeting content
- Respect Atlassian's data residency requirements

**3. Input Validation**
```javascript
function validateMeetingInput(notes) {
  if (!notes || notes.trim().length === 0) {
    throw new Error('Meeting notes cannot be empty');
  }
  
  if (notes.length > 50000) {
    throw new Error('Meeting notes too long (max 50,000 characters)');
  }
  
  return true;
}
```

**4. Rate Limiting**
- Forge has built-in rate limits
- Cache API responses when possible
- Batch operations where feasible

### Performance Optimization

**1. Caching Strategy**
```javascript
// Cache user lookups for 24 hours
// Cache project data for 1 hour
// Don't cache meeting content
```

**2. Async Processing**
```javascript
// Process action items in parallel
await Promise.all(
  actionItems.map(item => createJiraTask(item))
);
```

**3. Lazy Loading**
```javascript
// Load analytics dashboard data only when viewed
// Paginate large result sets
```

**4. Error Handling**
```javascript
try {
  await processMeeting(pageId);
} catch (error) {
  // Log error
  console.error('Processing failed:', error);
  
  // Show user-friendly message
  return {
    success: false,
    message: 'Failed to process meeting. Please try again.'
  };
}
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Forge project
- [ ] Configure manifest.yml
- [ ] Create basic UI components
- [ ] Test deployment

### Phase 2: Integrations
- [ ] Confluence API integration
- [ ] Jira API integration
- [ ] Rovo Agent setup
- [ ] Test end-to-end flow

### Phase 3: Intelligence
- [ ] User matching logic
- [ ] Date parsing logic
- [ ] Decision tracking
- [ ] Analytics calculation

### Phase 4: Polish
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Performance optimization
- [ ] Testing

---

**This technical specification provides all the details needed to implement MeetingMind. Follow the code examples and API documentation to build each component.** 🚀

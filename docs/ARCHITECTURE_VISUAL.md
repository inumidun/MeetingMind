# 🏗️ MeetingMind: Visual Architecture Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Sarah)                             │
│                    Opens Confluence Page                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONFLUENCE CLOUD                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  MeetingMind Template (Forge Macro)                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Meeting Title: "Team Sync - Dec 5"                 │  │  │
│  │  │  Date: Dec 5, 2025                                   │  │  │
│  │  │  Attendees: John, Sarah, Mike                        │  │  │
│  │  │  ─────────────────────────────────────────────────  │  │  │
│  │  │  Notes:                                              │  │  │
│  │  │  - John will update budget by Wednesday             │  │  │
│  │  │  - We decided to go with Vendor A                   │  │  │
│  │  │  - Sarah needs to call client tomorrow              │  │  │
│  │  │  ─────────────────────────────────────────────────  │  │  │
│  │  │  [Process Meeting] ← User clicks this button        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FORGE APP (Backend)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 1: Read Confluence Page                            │  │
│  │  GET /wiki/rest/api/content/{pageId}                     │  │
│  │  → Extract meeting notes text                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 2: Send to Rovo Agent                              │  │
│  │  agent.query({ prompt: "Extract action items..." })      │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROVO AGENT (AI)                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Analyzes: "John will update budget by Wednesday"        │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  Extracts:                                                │  │
│  │  {                                                        │  │
│  │    "actionItems": [                                       │  │
│  │      {                                                    │  │
│  │        "description": "Update budget",                    │  │
│  │        "assignee": "John",                                │  │
│  │        "dueDate": "Wednesday",                            │  │
│  │        "priority": "Medium"                               │  │
│  │      }                                                    │  │
│  │    ],                                                     │  │
│  │    "decisions": ["Selected Vendor A"]                    │  │
│  │  }                                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ Returns JSON
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FORGE APP (Processing)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 3: Match "John" to Jira User                       │  │
│  │  GET /rest/api/3/user/search?query=john                  │  │
│  │  → Find: John Smith (accountId: abc123)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 4: Parse "Wednesday" to Date                       │  │
│  │  chrono.parseDate("Wednesday")                            │  │
│  │  → 2025-12-08                                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JIRA CLOUD                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 5: Create Jira Task                                │  │
│  │  POST /rest/api/3/issue                                   │  │
│  │  {                                                        │  │
│  │    "summary": "Update budget",                            │  │
│  │    "assignee": "abc123",                                  │  │
│  │    "duedate": "2025-12-08"                                │  │
│  │  }                                                        │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  ✓ Created: PROJ-123                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FORGE STORAGE                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 6: Store Analytics                                 │  │
│  │  storage.set('meeting-123-metrics', {                    │  │
│  │    actionItemCount: 3,                                    │  │
│  │    decisionsCount: 1,                                     │  │
│  │    completionRate: 0.92                                   │  │
│  │  })                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Sarah)                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ✓ Success! Created 3 tasks:                             │  │
│  │  • PROJ-123: Update budget (John, Dec 8)                 │  │
│  │  • PROJ-124: Call client (Sarah, Dec 6)                  │  │
│  │  • PROJ-125: Review vendor docs (Mike, Dec 10)           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Frontend (Confluence UI)

**File:** `src/frontend/MeetingTemplate.jsx`

**Components:**
- Text input for meeting title
- Date picker
- Attendees selector
- Large textarea for notes
- "Process Meeting" button
- Success/error message display

**User Interaction:**
1. User types notes naturally
2. Clicks button
3. Sees loading spinner
4. Gets success message with task links

---

### 2. Backend Orchestrator

**File:** `src/backend/meetingProcessor.js`

**Responsibilities:**
- Coordinate all processing steps
- Handle errors gracefully
- Return results to frontend

**Flow:**
```javascript
async function processMeeting(pageId) {
  // 1. Read Confluence
  const content = await confluenceService.getPage(pageId);
  
  // 2. AI extraction
  const extracted = await rovoAgent.extract(content);
  
  // 3. Process each action item
  for (const item of extracted.actionItems) {
    const userId = await userMatcher.match(item.assignee);
    const date = dateParser.parse(item.dueDate);
    await jiraService.createTask(item, userId, date);
  }
  
  // 4. Store analytics
  await analyticsService.store(pageId, extracted);
  
  return { success: true, count: extracted.actionItems.length };
}
```

---

### 3. AI Processing (Rovo Agent)

**File:** `src/ai/rovoAgent.js`

**Input:** Raw meeting notes text

**Output:** Structured JSON
```json
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
      "context": "After evaluating 3 vendors"
    }
  ],
  "blockers": [
    {
      "blocker": "Waiting on legal approval",
      "owner": "Sarah"
    }
  ]
}
```

---

### 4. User Matching Service

**File:** `src/backend/userMatcher.js`

**Challenge:** "John" → John Smith's Jira account

**Algorithm:**
```
1. Check cache (Forge Storage)
   ├─ Hit? → Return cached accountId
   └─ Miss? → Continue

2. Search Jira users
   GET /rest/api/3/user/search?query=john
   
3. Try exact match
   "John" === "John" → Match!
   
4. Try fuzzy match (if no exact)
   "Jon" ≈ "John" (typo tolerance)
   
5. Cache result
   storage.set('user-john', accountId)
   
6. Return accountId
```

---

### 5. Date Parsing Service

**File:** `src/backend/dateParser.js`

**Challenge:** Natural language → ISO date

**Examples:**
```javascript
parseDate("tomorrow")      → "2025-12-06"
parseDate("Friday")        → "2025-12-10" (next Friday)
parseDate("next week")     → "2025-12-12"
parseDate("Dec 15")        → "2025-12-15"
parseDate("by end of month") → "2025-12-31"
```

**Library:** `chrono-node` (handles most cases)

---

### 6. Jira Service

**File:** `src/backend/jiraService.js`

**Operations:**
- Create task
- Search users
- Get projects
- Link to Confluence page

**Task Creation:**
```javascript
async function createTask(data) {
  const response = await api.asUser().requestJira(
    route`/rest/api/3/issue`,
    {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          project: { key: data.projectKey },
          summary: data.summary,
          assignee: { accountId: data.assigneeId },
          duedate: data.dueDate,
          priority: { name: data.priority }
        }
      })
    }
  );
  return response.json();
}
```

---

### 7. Analytics Service

**File:** `src/backend/analyticsService.js`

**Metrics Tracked:**
- Total meetings processed
- Total action items created
- Average items per meeting
- Completion rate (if tasks are done)
- Time saved estimate

**Storage:**
```javascript
// Per-meeting metrics
{
  key: 'meeting-123-metrics',
  value: {
    actionItemCount: 4,
    decisionsCount: 2,
    processedAt: '2025-12-05T10:30:00Z'
  }
}

// Aggregate metrics
{
  key: 'global-metrics',
  value: {
    totalMeetings: 25,
    totalActionItems: 100,
    completionRate: 0.92
  }
}
```

---

## Data Flow Example

### Input (Meeting Notes)
```
Team Sync - December 5, 2025

Attendees: John, Sarah, Mike

Discussion:
- Reviewed Q4 budget status
- John will update the budget spreadsheet by Wednesday
- We decided to go with Vendor A for the new CRM system
- Sarah needs to schedule a follow-up call with the client tomorrow
- Mike mentioned the website is running slow - needs investigation by end of week

Next meeting: December 12
```

### Processing Steps

**Step 1: Rovo Agent Extraction**
```json
{
  "actionItems": [
    {
      "description": "Update budget spreadsheet",
      "assignee": "John",
      "dueDate": "Wednesday",
      "priority": "Medium"
    },
    {
      "description": "Schedule follow-up call with client",
      "assignee": "Sarah",
      "dueDate": "tomorrow",
      "priority": "High"
    },
    {
      "description": "Investigate website performance",
      "assignee": "Mike",
      "dueDate": "end of week",
      "priority": "High"
    }
  ],
  "decisions": [
    {
      "decision": "Selected Vendor A for CRM system",
      "timestamp": "2025-12-05"
    }
  ]
}
```

**Step 2: User Matching**
```
"John" → Search Jira → John Smith (accountId: 5b10a2844c20165700ede21g)
"Sarah" → Search Jira → Sarah Johnson (accountId: 5b10a2844c20165700ede21h)
"Mike" → Search Jira → Mike Chen (accountId: 5b10a2844c20165700ede21i)
```

**Step 3: Date Parsing**
```
"Wednesday" → Next Wednesday → 2025-12-08
"tomorrow" → 2025-12-06
"end of week" → Next Friday → 2025-12-10
```

**Step 4: Jira Task Creation**
```
✓ PROJ-123: Update budget spreadsheet
  Assignee: John Smith
  Due: Dec 8, 2025
  Priority: Medium

✓ PROJ-124: Schedule follow-up call with client
  Assignee: Sarah Johnson
  Due: Dec 6, 2025
  Priority: High

✓ PROJ-125: Investigate website performance
  Assignee: Mike Chen
  Due: Dec 10, 2025
  Priority: High
```

**Step 5: Confluence Update**
```markdown
## Decisions Made
- ✅ Selected Vendor A for CRM system (Dec 5, 2025)

## Action Items Created
- [PROJ-123] Update budget spreadsheet (John, Dec 8)
- [PROJ-124] Schedule follow-up call (Sarah, Dec 6)
- [PROJ-125] Investigate website performance (Mike, Dec 10)
```

### Output (User Sees)
```
✓ Success! Created 3 tasks in Jira:
• PROJ-123: Update budget spreadsheet (John, Dec 8)
• PROJ-124: Schedule follow-up call (Sarah, Dec 6)
• PROJ-125: Investigate website performance (Mike, Dec 10)

Time saved: 30 minutes
```

---

## Technology Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                    ATLASSIAN FORGE                           │
│                  (Serverless Platform)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Node.js   │  │   Storage   │  │  Functions  │        │
│  │   Runtime   │  │  Key-Value  │  │  Handlers   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Confluence  │  │     Jira     │  │     Rovo     │
│     API      │  │     API      │  │    Agent     │
└──────────────┘  └──────────────┘  └──────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Meeting    │  │    Tasks     │  │  AI/NLP      │
│    Notes     │  │  Management  │  │ Processing   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Deployment Architecture

```
Developer Machine
       │
       │ forge deploy
       ▼
┌─────────────────────────────────────┐
│   Atlassian Developer Console       │
│   - Builds app                      │
│   - Validates manifest              │
│   - Deploys to cloud                │
└─────────────────────────────────────┘
       │
       │ forge install
       ▼
┌─────────────────────────────────────┐
│   Customer's Atlassian Instance     │
│   - Confluence Cloud                │
│   - Jira Cloud                      │
│   - MeetingMind installed           │
└─────────────────────────────────────┘
       │
       │ Users access
       ▼
┌─────────────────────────────────────┐
│   End Users                         │
│   - Open Confluence                 │
│   - Use MeetingMind macro           │
│   - See results in Jira             │
└─────────────────────────────────────┘
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                    USER                                  │
│              (Authenticated in Atlassian)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ OAuth 2.0
                         ▼
┌─────────────────────────────────────────────────────────┐
│                FORGE APP                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Permissions (manifest.yml):                      │  │
│  │  - read:confluence-content.all                    │  │
│  │  - write:confluence-content                       │  │
│  │  - read:jira-work                                 │  │
│  │  - write:jira-work                                │  │
│  │  - read:jira-user                                 │  │
│  │  - storage:app                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  API Calls:                                              │
│  - api.asUser() → Acts as current user                  │
│  - api.asApp() → Acts as app (system level)             │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            ATLASSIAN CLOUD                               │
│  - Validates permissions                                 │
│  - Enforces rate limits                                  │
│  - Audits all actions                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

### Bottlenecks & Solutions

**1. Rovo Agent Processing Time**
- Problem: AI can take 5-10 seconds
- Solution: Show loading spinner, process async

**2. Multiple API Calls**
- Problem: Sequential calls are slow
- Solution: Use Promise.all() for parallel execution

**3. User Lookup Caching**
- Problem: Searching Jira users repeatedly
- Solution: Cache results in Forge Storage (24h TTL)

**4. Large Meeting Notes**
- Problem: Very long notes slow down AI
- Solution: Limit to 50,000 characters, chunk if needed

---

## Error Handling Strategy

```
User Action
    │
    ▼
Try: Process Meeting
    │
    ├─ Success → Show success message
    │
    └─ Error
        │
        ├─ Network Error → "Connection failed. Try again."
        │
        ├─ AI Timeout → "Processing took too long. Try shorter notes."
        │
        ├─ User Not Found → "Couldn't find 'John'. Please select from list."
        │
        ├─ Permission Error → "You don't have permission to create tasks."
        │
        └─ Unknown Error → "Something went wrong. Contact support."
```

---

**This visual guide shows how all components work together. Reference this when building each piece!** 🚀

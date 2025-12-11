# 🚀 MeetingMind: Complete Implementation Guide for Codegeist 2025

## Table of Contents
1. [The Problem We're Solving](#the-problem)
2. [Our Solution](#our-solution)
3. [User Journey](#user-journey)
4. [Technology Stack & Why](#technology-stack)
5. [Architecture Overview](#architecture)
6. [APIs & Integrations](#apis-integrations)
7. [Detailed Implementation Plan](#implementation-plan)
8. [File Structure](#file-structure)
9. [Testing Strategy](#testing-strategy)
10. [Submission Checklist](#submission-checklist)

---

## 1. The Problem We're Solving {#the-problem}

### The Real-World Pain Points

**Every business team faces these meeting challenges:**

1. **Lost Action Items** (37% forgotten)
   - Someone says "John will update the budget by Friday"
   - No one writes it down properly
   - Friday comes, nothing happens
   - Next meeting: "Wait, who was supposed to do that?"

2. **Decision Amnesia**
   - Team spends 30 minutes deciding on a vendor
   - Two weeks later: "Did we actually decide on that?"
   - Re-discussion wastes another 30 minutes

3. **Manual Follow-up Hell**
   - Meeting ends at 3 PM
   - Someone spends 3:00-4:00 PM creating Jira tickets manually
   - Copying notes, assigning people, setting dates
   - Boring, error-prone, time-wasting

4. **Accountability Black Holes**
   - "I thought YOU were doing that"
   - No clear ownership
   - Tasks fall through cracks

### The Business Impact

For a 50-person company:
- **23 hours/week** per manager in meetings
- **40% of outcomes** never executed
- **$5,000/week** wasted on manual follow-ups
- **Frustrated teams** with low morale

---

## 2. Our Solution {#our-solution}

### MeetingMind: The AI Meeting Assistant

**One-Sentence Pitch:**
"MeetingMind transforms chaotic meeting notes into structured action items, automatically creating Jira tasks and tracking decisions in Confluence—saving teams 40 hours per month."

### What It Does

**Before MeetingMind:**
```
Meeting → Someone takes notes → Someone manually creates tasks → 
People forget assignments → Low completion rate
```

**With MeetingMind:**
```
Meeting → AI extracts action items → Auto-creates Jira tasks → 
Everyone knows their work → High completion rate
```

### Key Features

1. **Smart Note Template** - Confluence macro with AI-powered structure
2. **Action Item Extraction** - NLP detects "John will...", "by Friday..."
3. **Auto-Task Creation** - Creates Jira tickets with proper assignees/dates
4. **Decision Tracking** - Logs all decisions with timestamps
5. **Analytics Dashboard** - Shows meeting effectiveness metrics

---

## 3. User Journey {#user-journey}

### Persona: Sarah (Marketing Manager)

**Monday 10:00 AM - Before Meeting**

Sarah opens Confluence and clicks "New Meeting Note"
- MeetingMind template loads automatically
- Pre-populated with agenda suggestions from last week's open items
- Shows who should attend based on Jira assignments

**Monday 10:15 AM - During Meeting**

Sarah types notes naturally:
```
- Discussed Q1 campaign results
- John will update the budget spreadsheet by Wednesday
- We decided to go with Vendor A for the new CRM
- Sarah needs to schedule follow-up with design team
- Mike mentioned the website is slow - needs investigation
```

**Monday 11:00 AM - Meeting Ends**

Sarah clicks "Process Meeting Notes" button
- AI analyzes the text in 3 seconds
- Extracts 4 action items, 1 decision, 1 blocker

**Monday 11:01 AM - Magic Happens**

MeetingMind automatically:
- Creates Jira ticket: "Update Q1 budget spreadsheet" → Assigned to John, Due: Wednesday
- Creates Jira ticket: "Schedule design team follow-up" → Assigned to Sarah, Due: Today
- Creates Jira ticket: "Investigate website performance" → Assigned to Mike, Priority: High
- Adds decision to Confluence: "✅ DECISION: Selected Vendor A for CRM (Dec 5, 2025)"
- Sends Slack notifications to John, Sarah, and Mike

**Monday 11:02 AM - Sarah's Done**

No manual work. Everyone knows their tasks. Meeting was productive.

**Friday 5:00 PM - Week Review**

Sarah opens MeetingMind Dashboard:
- "4/4 action items completed this week ✅"
- "Meeting effectiveness: 95%"
- "Time saved: 2.5 hours"

---

## 4. Technology Stack & Why {#technology-stack}

### Core Platform: Atlassian Forge

**What is Forge?**
Serverless platform for building Atlassian apps. Think of it like AWS Lambda but specifically for Jira/Confluence.

**Why Forge?**
- Required by hackathon
- No server management needed
- Built-in authentication with Atlassian products
- Free hosting during development

### Primary Technologies

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Atlassian Forge** | App platform | Hackathon requirement, serverless |
| **Confluence API** | Meeting notes storage | Where teams already take notes |
| **Jira API** | Task management | Where teams already track work |
| **Rovo Agent** | AI/NLP processing | Atlassian's AI platform, bonus prize eligible |
| **Forge UI Kit** | User interface | Pre-built React components for Atlassian |
| **Forge Storage** | Data persistence | Built-in key-value store |

### Language & Framework

**JavaScript/Node.js**
- Forge's primary language
- Easy to learn
- Rich ecosystem
- Fast development

---

## 5. Architecture Overview {#architecture}

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                    (Sarah - Manager)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONFLUENCE                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MeetingMind Note Template (Macro)                   │  │
│  │  - Smart fields for agenda, attendees, notes         │  │
│  │  - "Process Meeting" button                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ User clicks "Process Meeting"
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   FORGE APP (Backend)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Extract Confluence page content                  │  │
│  │  2. Send to Rovo Agent for NLP processing            │  │
│  │  3. Parse AI response (action items, decisions)      │  │
│  │  4. Match names to Atlassian users                   │  │
│  │  5. Calculate due dates from text                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    ROVO AGENT (AI)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Analyzes meeting notes text                         │  │
│  │  Returns structured JSON:                            │  │
│  │  {                                                    │  │
│  │    "actionItems": [...],                             │  │
│  │    "decisions": [...],                               │  │
│  │    "blockers": [...]                                 │  │
│  │  }                                                    │  │
│  └──────���───────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      JIRA                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Auto-created tasks:                                 │  │
│  │  ✓ Task 1: Update budget (John, Wed)                │  │
│  │  ✓ Task 2: Schedule follow-up (Sarah, Today)        │  │
│  │  ✓ Task 3: Fix website (Mike, High Priority)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input**: User writes meeting notes in Confluence
2. **Trigger**: User clicks "Process Meeting" button
3. **Extraction**: Forge function reads Confluence page content
4. **AI Processing**: Rovo Agent analyzes text, returns structured data
5. **User Matching**: Names → Atlassian account IDs
6. **Date Parsing**: "by Friday" → actual date
7. **Task Creation**: Jira API creates tickets
8. **Notification**: Users get notified of new assignments
9. **Analytics**: Store metrics in Forge Storage

---

## 6. APIs & Integrations {#apis-integrations}

### Required APIs

#### 1. Confluence REST API

**Purpose**: Read/write meeting notes

**Key Endpoints:**
```javascript
// Get page content
GET /wiki/rest/api/content/{pageId}?expand=body.storage

// Update page with decision log
PUT /wiki/rest/api/content/{pageId}

// Create new meeting page
POST /wiki/rest/api/content
```

**Authentication**: Forge handles automatically via `api.asApp()` or `api.asUser()`

**What We'll Use It For:**
- Read meeting notes text
- Add "Decisions" section to page
- Create meeting summary
- Link to created Jira tasks

#### 2. Jira REST API

**Purpose**: Create and manage tasks

**Key Endpoints:**
```javascript
// Create issue
POST /rest/api/3/issue
Body: {
  "fields": {
    "project": {"key": "PROJ"},
    "summary": "Update budget spreadsheet",
    "description": "From meeting on Dec 5: Update Q1 budget",
    "issuetype": {"name": "Task"},
    "assignee": {"accountId": "user123"},
    "duedate": "2025-12-08"
  }
}

// Search for users
GET /rest/api/3/user/search?query=john

// Get project details
GET /rest/api/3/project/{projectKey}
```

**What We'll Use It For:**
- Create tasks from action items
- Assign to correct users
- Set due dates and priorities
- Link tasks back to Confluence page

#### 3. Rovo Agent API

**Purpose**: AI-powered text analysis

**How It Works:**
```javascript
// Forge Rovo integration
import { agent } from '@forge/rovo';

const result = await agent.query({
  prompt: `Analyze this meeting transcript and extract action items...`,
  context: meetingNotesText
});
```

**What We'll Use It For:**
- Extract action items from natural language
- Identify decisions
- Detect deadlines ("by Friday", "next week")
- Recognize assignees ("John will...", "Sarah needs to...")

#### 4. Forge Storage API

**Purpose**: Store analytics and user preferences

**How It Works:**
```javascript
import { storage } from '@forge/api';

// Store meeting metrics
await storage.set('meeting-123-metrics', {
  actionItemCount: 4,
  completionRate: 0.92,
  timeSaved: 30
});

// Retrieve analytics
const metrics = await storage.get('meeting-123-metrics');
```

**What We'll Use It For:**
- Track meeting effectiveness over time
- Store user preferences
- Cache user mappings (name → accountId)

### Optional APIs (If Time Permits)

#### 5. Slack API (Bonus Feature)

**Purpose**: Send notifications

**Endpoint:**
```javascript
POST https://slack.com/api/chat.postMessage
Body: {
  "channel": "@john",
  "text": "New task assigned: Update budget spreadsheet (Due: Wed)"
}
```

#### 6. Google Calendar API (Bonus Feature)

**Purpose**: Schedule follow-up meetings

---

## 7. Detailed Implementation Plan {#implementation-plan}

### Phase 1: Foundation (Days 1-3)

#### Day 1: Environment Setup

**Tasks:**
1. Install Forge CLI
   ```bash
   npm install -g @forge/cli
   forge login
   ```

2. Create new Forge app
   ```bash
   forge create
   # Choose: confluence-macro template
   # Name: meetingmind
   ```

3. Set up test instances
   - Create free Confluence Cloud site
   - Create free Jira Cloud site
   - Link them together

4. Deploy hello world
   ```bash
   cd meetingmind
   forge deploy
   forge install --site your-site.atlassian.net
   ```

**Deliverable**: Basic Forge app running in Confluence

#### Day 2: Confluence Macro UI

**Tasks:**
1. Create meeting note template UI
   - File: `src/frontend/MeetingTemplate.jsx`
   - Components: Title, Date, Attendees, Notes textarea, Process button

2. Style with Forge UI Kit
   ```javascript
   import { Form, TextField, TextArea, Button } from '@forge/react';
   ```

3. Test in Confluence page

**Deliverable**: Beautiful meeting note template in Confluence

#### Day 3: Basic Jira Integration

**Tasks:**
1. Create function to create Jira task
   - File: `src/backend/jiraService.js`
   - Function: `createTask(summary, description, assignee, dueDate)`

2. Test manually with hardcoded data
   ```javascript
   await createTask(
     "Test task",
     "This is a test",
     "accountId123",
     "2025-12-10"
   );
   ```

3. Verify task appears in Jira

**Deliverable**: Can create Jira tasks from Forge app

### Phase 2: AI Integration (Days 4-7)

#### Day 4-5: Rovo Agent Setup

**Tasks:**
1. Create Rovo agent configuration
   - File: `src/ai/actionItemExtractor.js`
   - Prompt engineering for action item detection

2. Test with sample meeting notes
   ```javascript
   const sampleNotes = `
   - John will update the budget by Wednesday
   - We decided to use Vendor A
   - Sarah needs to call the client
   `;
   
   const result = await extractActionItems(sampleNotes);
   // Should return structured JSON
   ```

3. Refine prompt until accuracy is high

**Deliverable**: Rovo agent that extracts action items accurately

#### Day 6: Name Matching Logic

**Tasks:**
1. Create user matching function
   - File: `src/backend/userMatcher.js`
   - Function: `matchNameToUser(name, jiraUsers)`

2. Handle variations
   - "John" → "John Smith" → accountId
   - "Sarah" → "Sarah Johnson" → accountId
   - Fuzzy matching for typos

3. Cache results in Forge Storage

**Deliverable**: Reliable name-to-user matching

#### Day 7: Date Parsing Logic

**Tasks:**
1. Create date parser
   - File: `src/backend/dateParser.js`
   - Handle: "by Friday", "next week", "Dec 15", "tomorrow"

2. Use library like `chrono-node` or write custom logic

3. Test edge cases

**Deliverable**: Natural language date parsing

### Phase 3: Core Workflow (Days 8-10)

#### Day 8-9: End-to-End Integration

**Tasks:**
1. Connect all pieces:
   ```
   User clicks button → 
   Read Confluence content → 
   Send to Rovo → 
   Parse response → 
   Match users → 
   Parse dates → 
   Create Jira tasks
   ```

2. Add error handling
3. Add loading states in UI
4. Test with real meeting notes

**Deliverable**: Full workflow working end-to-end

#### Day 10: Decision Tracking

**Tasks:**
1. Detect decisions in meeting notes
   - Phrases: "we decided", "agreed to", "approved"

2. Add "Decisions" section to Confluence page
   ```markdown
   ## Decisions Made
   - ✅ Selected Vendor A for CRM (Dec 5, 2025)
   - ✅ Approved $50K budget increase (Dec 5, 2025)
   ```

3. Store in Forge Storage for analytics

**Deliverable**: Automatic decision logging

### Phase 4: Polish & Analytics (Days 11-14)

#### Day 11-12: Analytics Dashboard

**Tasks:**
1. Create dashboard UI
   - File: `src/frontend/Dashboard.jsx`
   - Metrics: completion rate, time saved, meeting count

2. Calculate metrics
   ```javascript
   const completionRate = completedTasks / totalTasks;
   const timeSaved = meetingCount * 30; // 30 min per meeting
   ```

3. Add charts (use Forge UI Kit charts)

**Deliverable**: Professional analytics dashboard

#### Day 13: UI/UX Polish

**Tasks:**
1. Improve visual design
2. Add helpful tooltips
3. Improve error messages
4. Add success animations
5. Mobile-responsive layout

**Deliverable**: Production-quality UI

#### Day 14: Testing & Bug Fixes

**Tasks:**
1. Test with various meeting formats
2. Test with edge cases (no action items, many action items)
3. Performance testing
4. Fix all bugs

**Deliverable**: Stable, reliable app

### Phase 5: Demo & Submission (Days 15-17)

#### Day 15: Demo Video Script

**Tasks:**
1. Write script (see template below)
2. Prepare demo data
3. Practice recording

#### Day 16: Record Demo Video

**Tasks:**
1. Record screen with Loom/OBS
2. Edit video
3. Add captions
4. Upload to YouTube (unlisted)

**Deliverable**: Professional 5-minute demo video

#### Day 17: Submit

**Tasks:**
1. Final deployment
2. Generate installation link
3. Complete Devpost form
4. Submit before deadline!

---

## 8. File Structure {#file-structure}

```
meetingmind/
├── manifest.yml                 # Forge app configuration
├── package.json                 # Dependencies
├── README.md                    # Documentation
│
├── src/
│   ├── index.js                # Main entry point
│   │
│   ├── frontend/               # UI Components
│   │   ├── MeetingTemplate.jsx    # Note-taking interface
│   │   ├── Dashboard.jsx          # Analytics dashboard
│   │   └── ProcessButton.jsx      # Action button
│   │
│   ├── backend/                # Business Logic
│   │   ├── confluenceService.js   # Confluence API calls
│   │   ├── jiraService.js         # Jira API calls
│   │   ├── userMatcher.js         # Name → User matching
│   │   ├── dateParser.js          # Date parsing logic
│   │   └── analyticsService.js    # Metrics calculation
│   │
│   ├── ai/                     # AI/NLP
│   │   ├── actionItemExtractor.js # Rovo agent integration
│   │   └── prompts.js             # AI prompts
│   │
│   └── utils/                  # Helpers
│       ├── logger.js              # Logging
│       └── validators.js          # Input validation
│
└── tests/                      # Unit tests (if time permits)
    ├── userMatcher.test.js
    └── dateParser.test.js
```

---

## 9. Testing Strategy {#testing-strategy}

### Manual Testing Checklist

**Test Case 1: Basic Action Item**
```
Input: "John will update the budget by Friday"
Expected: Jira task created, assigned to John, due Friday
```

**Test Case 2: Multiple Action Items**
```
Input: 
- John will update budget
- Sarah will call client
- Mike will fix bug
Expected: 3 Jira tasks created correctly
```

**Test Case 3: Decision Tracking**
```
Input: "We decided to go with Vendor A"
Expected: Decision logged in Confluence
```

**Test Case 4: No Action Items**
```
Input: "We discussed various topics"
Expected: No tasks created, friendly message shown
```

**Test Case 5: Edge Cases**
- Unknown names → prompt user to select
- Ambiguous dates → use reasonable default
- Very long notes → handle gracefully

---

## 10. Submission Checklist {#submission-checklist}

### Technical Requirements
- [ ] Built on Atlassian Forge
- [ ] Integrates with Confluence
- [ ] Integrates with Jira
- [ ] Uses Rovo Agent for AI
- [ ] Installation link works
- [ ] App ID from Developer Console

### Submission Materials
- [ ] Demo video ≤5 minutes
- [ ] Video uploaded to YouTube (unlisted)
- [ ] Category selected: "Apps for Business Teams"
- [ ] Devpost form completed
- [ ] All team members registered

### Bonus Prizes
- [ ] Runs on Atlassian: Documentation prepared
- [ ] Rovo Apps: Using rovo.agent module
- [ ] Rovo Dev: Social media post created

### Quality Checks
- [ ] UI is polished and professional
- [ ] No critical bugs
- [ ] Error handling works
- [ ] Demo video is engaging
- [ ] Installation instructions clear

---

## Demo Video Script Template

```
[0:00-0:30] THE PROBLEM
"Meet Sarah. She's in 10 meetings per week. 
After each meeting, she spends 30 minutes creating Jira tasks.
That's 5 hours per week of boring, manual work.
And still, 40% of action items get forgotten."

[0:30-1:00] THE SOLUTION
"Introducing MeetingMind - the AI meeting assistant for business teams.
It transforms meeting notes into action automatically."

[1:00-2:30] THE DEMO
"Watch this. Sarah opens Confluence and uses our meeting template.
She types naturally: 'John will update the budget by Wednesday'
She clicks 'Process Meeting'
[Show AI processing animation]
In 3 seconds, MeetingMind extracts 4 action items."

[2:30-3:30] THE MAGIC
"Now watch Jira. [Switch to Jira]
4 new tasks appear automatically.
Perfect descriptions. Correct assignees. Accurate due dates.
John gets notified immediately."

[3:30-4:00] THE IMPACT
"Sarah saved 30 minutes. But it's bigger than that.
[Show dashboard]
Teams using MeetingMind see 92% task completion.
That's up from 58% before.
40 hours saved per month for a 10-person team."

[4:00-4:30] THE TECHNOLOGY
"Built on Atlassian Forge with Rovo AI.
Native Confluence and Jira integration.
No context switching. No manual work."

[4:30-5:00] CALL TO ACTION
"MeetingMind: Turn meeting chaos into execution clarity.
Try it today at [installation link]
Built for Codegeist 2025."
```

---

## Key Success Factors

1. **Start Simple**: Get basic workflow working first
2. **Iterate Fast**: Deploy often, test often
3. **Focus on Demo**: The video sells the idea
4. **Show Real Value**: Use actual time-saving metrics
5. **Polish Matters**: Clean UI beats complex features

---

## Questions to Answer Before Building

1. Which Jira project should tasks be created in? (Let user configure)
2. What default priority for tasks? (Medium, unless specified)
3. How to handle unknown names? (Prompt user to select from dropdown)
4. What if no due date mentioned? (Default to 1 week from meeting date)
5. Should we support recurring meetings? (Phase 2 feature if time permits)

---

**You now have everything you need to build MeetingMind and win this hackathon. Let's start building!** 🚀

# 🏁 MeetingMind: Optimized 17-Day Roadmap to Win Codegeist 2025

## Critical Success Factors
- ✅ Working product (not just concept)
- ✅ Solves real business pain
- ✅ Professional demo video
- ✅ Eligible for 3 bonus prizes ($6K extra)
- ✅ Submitted before deadline

---

## Week 1: Build the Foundation (Days 1-7)

### Day 1 (Dec 6): Setup & First Deploy
**Time: 4 hours**

**Morning (2 hours):**
- [ ] Install Forge CLI: `npm install -g @forge/cli`
- [ ] Create Atlassian Developer account
- [ ] Set up free Confluence + Jira Cloud instances
- [ ] Register on Devpost for hackathon

**Afternoon (2 hours):**
- [ ] Create Forge app: `forge create meetingmind`
- [ ] Choose template: "confluence-macro"
- [ ] Deploy: `forge deploy`
- [ ] Install to test site: `forge install`
- [ ] Verify "Hello World" appears in Confluence

**Success Metric:** See your app running in Confluence

---

### Day 2 (Dec 7): Meeting Template UI
**Time: 5 hours**

**Tasks:**
- [ ] Design meeting note template layout
- [ ] Build UI with Forge UI Kit components:
  - Meeting title field
  - Date picker
  - Attendees multi-select
  - Notes textarea (main content)
  - "Process Meeting" button
- [ ] Add basic styling
- [ ] Test in Confluence page

**Code to Write:**
- `src/frontend/MeetingTemplate.jsx` (200 lines)
- `src/index.js` (50 lines)

**Success Metric:** Beautiful template in Confluence that users can type in

---

### Day 3 (Dec 8): Jira Integration Basics
**Time: 5 hours**

**Tasks:**
- [ ] Set up Jira API authentication in Forge
- [ ] Create function to create Jira issue
- [ ] Test with hardcoded data:
  ```javascript
  createJiraTask({
    summary: "Test task",
    description: "From meeting",
    assignee: "your-account-id"
  });
  ```
- [ ] Verify task appears in Jira
- [ ] Add error handling

**Code to Write:**
- `src/backend/jiraService.js` (150 lines)

**Success Metric:** Click button in Confluence → Task appears in Jira

---

### Day 4 (Dec 9): Confluence Content Reading
**Time: 4 hours**

**Tasks:**
- [ ] Set up Confluence API authentication
- [ ] Create function to read page content
- [ ] Extract text from meeting notes
- [ ] Parse basic structure (title, body, attendees)
- [ ] Test with sample meeting notes

**Code to Write:**
- `src/backend/confluenceService.js` (100 lines)

**Success Metric:** Can read meeting notes text from Confluence page

---

### Day 5-6 (Dec 10-11): Rovo Agent Integration
**Time: 10 hours total**

**Day 5 Tasks:**
- [ ] Study Rovo Agent documentation
- [ ] Set up Rovo in manifest.yml
- [ ] Create basic agent prompt:
  ```
  "Extract action items from this meeting transcript.
  Look for phrases like 'will do', 'needs to', 'by [date]'.
  Return JSON format."
  ```
- [ ] Test with simple examples

**Day 6 Tasks:**
- [ ] Refine prompt for better accuracy
- [ ] Handle AI response parsing
- [ ] Extract: action items, assignees, deadlines, decisions
- [ ] Test with 10 different meeting note samples
- [ ] Achieve 80%+ accuracy

**Code to Write:**
- `src/ai/actionItemExtractor.js` (200 lines)
- `src/ai/prompts.js` (100 lines)

**Success Metric:** AI correctly identifies action items from natural language

---

### Day 7 (Dec 12): Week 1 Integration Test
**Time: 4 hours**

**Tasks:**
- [ ] Connect all pieces: UI → Confluence → Rovo → Jira
- [ ] Test full workflow:
  1. Type meeting notes
  2. Click "Process Meeting"
  3. AI extracts items
  4. Jira tasks created
- [ ] Fix critical bugs
- [ ] Deploy updated version

**Success Metric:** End-to-end workflow works (even if rough)

---

## Week 2: Add Intelligence (Days 8-14)

### Day 8 (Dec 13): User Matching
**Time: 5 hours**

**Tasks:**
- [ ] Get list of Jira users via API
- [ ] Create name matching algorithm:
  - "John" → search Jira users → "John Smith" → accountId
  - Handle first name, last name, full name
  - Fuzzy matching for typos
- [ ] Cache results in Forge Storage
- [ ] Add fallback: if no match, prompt user to select

**Code to Write:**
- `src/backend/userMatcher.js` (150 lines)

**Success Metric:** "John will do X" correctly assigns to John's Jira account

---

### Day 9 (Dec 14): Date Parsing
**Time: 4 hours**

**Tasks:**
- [ ] Install date parsing library: `npm install chrono-node`
- [ ] Create date parser function
- [ ] Handle phrases:
  - "by Friday" → next Friday's date
  - "next week" → 7 days from now
  - "Dec 20" → 2025-12-20
  - "tomorrow" → tomorrow's date
- [ ] Test edge cases (weekends, holidays)

**Code to Write:**
- `src/backend/dateParser.js` (100 lines)

**Success Metric:** Natural language dates convert to actual dates

---

### Day 10 (Dec 15): Decision Tracking
**Time: 4 hours**

**Tasks:**
- [ ] Detect decision phrases: "we decided", "agreed to", "approved"
- [ ] Extract decision text
- [ ] Add "Decisions" section to Confluence page
- [ ] Format nicely with checkmarks and timestamps
- [ ] Store in Forge Storage for analytics

**Code to Write:**
- `src/backend/decisionTracker.js` (100 lines)

**Success Metric:** Decisions automatically logged in Confluence

---

### Day 11 (Dec 16): Analytics Dashboard
**Time: 6 hours**

**Tasks:**
- [ ] Create dashboard UI component
- [ ] Calculate metrics:
  - Total meetings processed
  - Action items created
  - Completion rate (if tasks are done)
  - Time saved estimate
- [ ] Add simple charts (bar chart, pie chart)
- [ ] Make it look professional

**Code to Write:**
- `src/frontend/Dashboard.jsx` (200 lines)
- `src/backend/analyticsService.js` (100 lines)

**Success Metric:** Dashboard shows impressive metrics

---

### Day 12 (Dec 17): UI Polish
**Time: 5 hours**

**Tasks:**
- [ ] Improve visual design (colors, spacing, fonts)
- [ ] Add loading spinners
- [ ] Add success/error messages
- [ ] Add helpful tooltips
- [ ] Improve button states
- [ ] Mobile-responsive layout
- [ ] Add MeetingMind logo/branding

**Success Metric:** App looks professional and polished

---

### Day 13 (Dec 18): Testing & Bug Fixes
**Time: 6 hours**

**Tasks:**
- [ ] Test with 20 different meeting note formats
- [ ] Test edge cases:
  - No action items
  - 20+ action items
  - Unknown names
  - Invalid dates
  - Very long notes
- [ ] Fix all critical bugs
- [ ] Improve error messages
- [ ] Performance optimization

**Success Metric:** App is stable and reliable

---

### Day 14 (Dec 19): Bonus Prize Prep
**Time: 4 hours**

**Tasks:**
- [ ] Document Rovo Agent usage (screenshots + code)
- [ ] Verify "Runs on Atlassian" requirements met
- [ ] Create social media post about using Rovo Dev:
  ```
  "Building MeetingMind for #Codegeist2025 using @Atlassian Rovo! 
  The AI agent makes extracting action items so easy. 
  Check it out: [link]"
  ```
- [ ] Post on Twitter/LinkedIn
- [ ] Prepare bonus prize submission materials

**Success Metric:** Eligible for all 3 bonus prizes ($6K)

---

## Week 3: Demo & Submit (Days 15-17)

### Day 15 (Dec 20): Demo Preparation
**Time: 5 hours**

**Tasks:**
- [ ] Write detailed demo script (see template in guide)
- [ ] Create demo data:
  - Sample meeting notes with clear action items
  - Pre-configured Jira project
  - Test users
- [ ] Practice demo 5 times
- [ ] Time it (must be under 5 minutes)
- [ ] Refine script based on timing

**Success Metric:** Confident demo script under 5 minutes

---

### Day 16 (Dec 21): Record Demo Video
**Time: 6 hours**

**Morning (3 hours):**
- [ ] Set up recording (Loom or OBS)
- [ ] Record demo (multiple takes if needed)
- [ ] Choose best take

**Afternoon (3 hours):**
- [ ] Edit video:
  - Add intro/outro
  - Add captions
  - Highlight key moments
  - Add background music (optional)
- [ ] Upload to YouTube (unlisted)
- [ ] Test video plays correctly
- [ ] Create compelling thumbnail

**Success Metric:** Professional 5-minute demo video on YouTube

---

### Day 17 (Dec 22): SUBMISSION DAY
**Time: 6 hours (start early!)**

**Morning (9 AM - 12 PM):**
- [ ] Final code review
- [ ] Final deployment: `forge deploy --no-verify`
- [ ] Generate installation link via Developer Console
- [ ] Test installation on fresh Confluence/Jira instance
- [ ] Take screenshots for submission

**Afternoon (12 PM - 4 PM):**
- [ ] Complete Devpost submission form:
  - Project name: "MeetingMind"
  - Tagline: "AI meeting assistant that transforms notes into action"
  - Description: (compelling story)
  - Installation link
  - Demo video URL
  - App ID
  - Category: "Apps for Business Teams"
  - Technologies: Forge, Rovo, Confluence, Jira
  - Bonus prize materials
- [ ] Write compelling project description
- [ ] Add team members
- [ ] Review everything 3 times

**Final Push (4 PM - 6 PM):**
- [ ] Submit on Devpost
- [ ] Verify submission went through
- [ ] Take screenshot of confirmation
- [ ] Keep 1-hour buffer for issues

**6:30 PM:** Celebrate! 🎉

---

## Daily Time Commitment

| Day | Date | Hours | Focus |
|-----|------|-------|-------|
| 1 | Dec 6 | 4h | Setup |
| 2 | Dec 7 | 5h | UI |
| 3 | Dec 8 | 5h | Jira |
| 4 | Dec 9 | 4h | Confluence |
| 5 | Dec 10 | 5h | Rovo (1/2) |
| 6 | Dec 11 | 5h | Rovo (2/2) |
| 7 | Dec 12 | 4h | Integration |
| **Weekend 1** | | **32h** | **Foundation** |
| 8 | Dec 13 | 5h | User matching |
| 9 | Dec 14 | 4h | Date parsing |
| 10 | Dec 15 | 4h | Decisions |
| 11 | Dec 16 | 6h | Analytics |
| 12 | Dec 17 | 5h | UI polish |
| 13 | Dec 18 | 6h | Testing |
| 14 | Dec 19 | 4h | Bonus prep |
| **Weekend 2** | | **34h** | **Features** |
| 15 | Dec 20 | 5h | Demo prep |
| 16 | Dec 21 | 6h | Video |
| 17 | Dec 22 | 6h | Submit |
| **Final 3** | | **17h** | **Submission** |
| **TOTAL** | | **83h** | |

---

## Risk Mitigation

### Risk 1: Rovo Agent Not Accurate Enough
**Backup Plan:** Use simple regex patterns for action items
```javascript
// Fallback pattern matching
if (text.includes("will") && text.includes("by")) {
  // Extract as action item
}
```

### Risk 2: Running Out of Time
**Priority Order:**
1. Basic workflow (Confluence → Jira) - MUST HAVE
2. Rovo AI extraction - MUST HAVE (for bonus prize)
3. User matching - SHOULD HAVE
4. Analytics dashboard - NICE TO HAVE
5. Decision tracking - NICE TO HAVE

### Risk 3: Technical Issues on Submission Day
**Mitigation:**
- Deploy 2 days early (Day 15)
- Test installation link on Day 16
- Have backup video hosting (Vimeo + YouTube)
- Start submission at 9 AM (10 hours before deadline)

---

## Success Checklist

### Must Have (Core Functionality)
- [ ] Confluence macro for meeting notes
- [ ] "Process Meeting" button works
- [ ] Rovo Agent extracts action items
- [ ] Jira tasks created automatically
- [ ] Basic user assignment works
- [ ] Demo video shows value clearly

### Should Have (Competitive Edge)
- [ ] User name matching (first name → account)
- [ ] Date parsing (natural language)
- [ ] Decision tracking
- [ ] Analytics dashboard
- [ ] Polished UI

### Nice to Have (If Time Permits)
- [ ] Slack notifications
- [ ] Meeting templates library
- [ ] Recurring meeting support
- [ ] Export to PDF
- [ ] Mobile optimization

---

## Winning Strategy

1. **Focus on Demo Impact**: Show dramatic before/after
2. **Emphasize Time Savings**: "40 hours/month saved"
3. **Show Real Business Value**: Use actual metrics
4. **Professional Polish**: Clean UI beats complex features
5. **Tell a Story**: Sarah's journey from chaos to clarity

---

**Remember: A working MVP with great demo beats a complex app with bugs. Ship early, polish often!** 🚀

# ❓ MeetingMind: FAQ & Troubleshooting Guide

## Table of Contents
1. [General Questions](#general)
2. [Technical Questions](#technical)
3. [Hackathon Specific](#hackathon)
4. [Common Errors](#errors)
5. [Best Practices](#best-practices)

---

## 1. General Questions {#general}

### Q: What exactly does MeetingMind do?

**A:** MeetingMind automatically converts meeting notes into actionable tasks. You type notes in Confluence like "John will update the budget by Friday", click a button, and MeetingMind:
- Extracts the action item
- Finds John's Jira account
- Creates a task assigned to John
- Sets the due date to Friday
- Logs decisions made in the meeting

### Q: Why is this better than manually creating Jira tasks?

**A:** Time savings and accuracy:
- **Manual way**: 30 minutes after each meeting creating tasks
- **MeetingMind way**: 3 seconds, zero manual work
- **Accuracy**: AI catches items you might forget
- **Consistency**: Every action item gets tracked

### Q: Who is this for?

**A:** Any business team that:
- Has regular meetings
- Uses Confluence for notes
- Uses Jira for task tracking
- Wants better accountability

Examples: Marketing teams, HR teams, Sales teams, Product teams

### Q: Do I need to be technical to use it?

**A:** No! Users just:
1. Open Confluence
2. Type meeting notes naturally
3. Click "Process Meeting"
4. Done!

The AI handles all the complexity.

---

## 2. Technical Questions {#technical}

### Q: What is Atlassian Forge?

**A:** Forge is Atlassian's serverless platform for building apps. Think of it like:
- AWS Lambda (serverless functions)
- But specifically for Atlassian products
- No servers to manage
- Built-in authentication
- Free hosting during development

**Key benefits:**
- No infrastructure setup
- Automatic scaling
- Secure by default
- Easy deployment

### Q: What is Rovo Agent?

**A:** Rovo is Atlassian's AI platform. A Rovo Agent is like ChatGPT but:
- Integrated into Forge apps
- Optimized for Atlassian data
- Can perform actions (not just chat)
- Eligible for bonus prizes in hackathon

**How we use it:**
Send meeting notes → Rovo analyzes → Returns structured JSON with action items

### Q: Do I need to know React?

**A:** Basic knowledge helps, but Forge UI Kit makes it easy:
```javascript
// This is all you need for a button:
<Button text="Click me" onClick={handleClick} />
```

The components are pre-styled and simple to use.

### Q: How does name matching work?

**A:** Multi-step process:
1. Extract name from text ("John will...")
2. Search Jira users for "John"
3. Try exact match first
4. If no match, use fuzzy matching (handles typos)
5. Cache result for future use
6. If still no match, prompt user to select

### Q: How does date parsing work?

**A:** We use the `chrono-node` library which understands:
- "tomorrow" → next day
- "Friday" → next Friday
- "next week" → 7 days from now
- "Dec 15" → December 15, 2025
- "by end of month" → last day of current month

If no date mentioned, defaults to 1 week from meeting date.

### Q: Where is data stored?

**A:** Three places:
1. **Meeting notes**: Confluence (where they already are)
2. **Tasks**: Jira (where they belong)
3. **Analytics**: Forge Storage (key-value store)

We don't duplicate data unnecessarily.

### Q: Is it secure?

**A:** Yes:
- Forge handles all authentication
- Uses Atlassian's security infrastructure
- No external servers
- Respects user permissions
- Data stays in Atlassian cloud

---

## 3. Hackathon Specific {#hackathon}

### Q: Does MeetingMind meet all hackathon requirements?

**A:** Yes! Checklist:
- ✅ Built on Atlassian Forge
- ✅ Integrates with Confluence
- ✅ Integrates with Jira (2 products = bonus eligible)
- ✅ Uses Rovo Agent (bonus prize eligible)
- ✅ Solves real business problem
- ✅ Category: Apps for Business Teams

### Q: Which bonus prizes can we win?

**A:** All three ($6,000 total):

1. **Best Runs on Atlassian** ($2,000)
   - We integrate Confluence + Jira
   - Provide value to users
   - Meet quality standards

2. **Best Rovo Apps** ($2,000)
   - We use `rovo.agent` module
   - We use `action` modules
   - Agent performs specific tasks

3. **Best App built using Rovo Dev** ($2,000)
   - We build using Rovo Dev platform
   - We post on social media about it
   - We include summary in submission

### Q: What should the demo video show?

**A:** Follow this structure (5 minutes max):

**0:00-0:30** - The Problem
- Show chaotic meeting
- Highlight lost action items
- Show manual Jira creation pain

**0:30-1:30** - The Solution
- Introduce MeetingMind
- Show the Confluence template
- Explain how it works

**1:30-3:30** - The Demo
- Type real meeting notes
- Click "Process Meeting"
- Show AI extraction
- Show Jira tasks created
- Show decision logging

**3:30-4:30** - The Impact
- Show analytics dashboard
- Highlight time savings
- Show completion rate improvement
- Calculate ROI

**4:30-5:00** - Call to Action
- Summarize benefits
- Show installation link
- Thank judges

### Q: How do I create the installation link?

**A:** In Atlassian Developer Console:
1. Go to your app
2. Click "Distribution"
3. Click "Start sharing your app"
4. Copy the installation link
5. Include in Devpost submission

### Q: What if my app has bugs on submission day?

**A:** Prioritize:
1. **Must work**: Basic workflow (notes → tasks)
2. **Should work**: User matching, date parsing
3. **Nice to have**: Analytics, decision tracking

Submit a working MVP rather than a buggy full-featured app.

---

## 4. Common Errors {#errors}

### Error: "forge: command not found"

**Problem:** Forge CLI not installed

**Solution:**
```bash
npm install -g @forge/cli
# If permission error on Mac/Linux:
sudo npm install -g @forge/cli
```

### Error: "You are not logged in"

**Problem:** Not authenticated with Atlassian

**Solution:**
```bash
forge login
# Follow the browser authentication flow
```

### Error: "App not found in manifest"

**Problem:** manifest.yml configuration issue

**Solution:**
1. Check manifest.yml syntax (YAML is indent-sensitive!)
2. Ensure all modules are properly defined
3. Run `forge lint` to check for errors

### Error: "Permission denied" when creating Jira task

**Problem:** Missing scopes in manifest.yml

**Solution:**
Add to manifest.yml:
```yaml
permissions:
  scopes:
    - write:jira-work
    - read:jira-user
```

Then redeploy:
```bash
forge deploy
forge install --upgrade
```

### Error: "Cannot read property 'accountId' of undefined"

**Problem:** User matching failed (name not found)

**Solution:**
Add fallback logic:
```javascript
const accountId = await matchUserByName(name);
if (!accountId) {
  // Prompt user to select from dropdown
  // OR assign to current user
  // OR skip this action item
}
```

### Error: "Rovo agent timeout"

**Problem:** AI processing taking too long

**Solution:**
1. Reduce meeting notes length (split into chunks)
2. Simplify prompt
3. Add timeout handling:
```javascript
try {
  const result = await Promise.race([
    extractActionItems(notes),
    timeout(30000) // 30 second timeout
  ]);
} catch (error) {
  // Fallback to regex pattern matching
}
```

### Error: "Storage quota exceeded"

**Problem:** Too much data in Forge Storage

**Solution:**
1. Clean up old data:
```javascript
// Delete metrics older than 90 days
const oldKeys = await storage.query()
  .where('key', 'startsWith', 'meeting-')
  .getMany();
  
for (const key of oldKeys) {
  const data = await storage.get(key);
  if (isOlderThan90Days(data.processedAt)) {
    await storage.delete(key);
  }
}
```

2. Store only essential data
3. Use Confluence/Jira as primary storage

### Error: "Module not found: @forge/rovo"

**Problem:** Rovo package not installed

**Solution:**
```bash
npm install @forge/rovo
forge deploy
```

---

## 5. Best Practices {#best-practices}

### Development Workflow

**1. Deploy Often**
```bash
# After every significant change:
forge deploy
# Test in browser
# Fix issues
# Repeat
```

**2. Use Logs**
```javascript
console.log('Processing meeting:', pageId);
console.log('Extracted items:', actionItems);
// View logs: forge logs
```

**3. Test with Real Data**
- Don't just test with "test test test"
- Use actual meeting notes
- Test edge cases (no action items, 20+ items, etc.)

### Code Organization

**1. Keep Functions Small**
```javascript
// Good: Single responsibility
async function createJiraTask(taskData) {
  // Only creates task
}

// Bad: Does too much
async function processEverything(data) {
  // Reads Confluence, calls AI, creates tasks, updates page...
}
```

**2. Handle Errors Gracefully**
```javascript
try {
  await createJiraTask(data);
} catch (error) {
  console.error('Failed to create task:', error);
  // Show user-friendly message
  return { success: false, message: 'Could not create task' };
}
```

**3. Use Constants**
```javascript
// Good
const DEFAULT_DUE_DATE_DAYS = 7;
const MAX_NOTES_LENGTH = 50000;

// Bad
if (notes.length > 50000) { ... }
```

### UI/UX Best Practices

**1. Show Loading States**
```javascript
<Button
  text={processing ? "Processing..." : "Process Meeting"}
  isDisabled={processing}
/>
```

**2. Provide Feedback**
```javascript
// After successful processing:
"✓ Created 4 tasks! Check Jira."

// After error:
"⚠ Could not process meeting. Please try again."
```

**3. Make It Obvious**
- Big, clear "Process Meeting" button
- Helpful placeholder text
- Tooltips for complex features

### Performance Best Practices

**1. Cache Expensive Operations**
```javascript
// Cache user lookups for 24 hours
// Don't search Jira for "John" every time
```

**2. Batch API Calls**
```javascript
// Good: Parallel
await Promise.all(items.map(item => createTask(item)));

// Bad: Sequential
for (const item of items) {
  await createTask(item); // Slow!
}
```

**3. Limit Data Size**
```javascript
// Don't store entire meeting transcript
// Store only metadata and references
```

### Demo Video Best Practices

**1. Script Everything**
- Write word-for-word script
- Practice 5+ times
- Time it (must be under 5 minutes)

**2. Show Real Value**
- Use realistic meeting notes
- Show actual time savings
- Demonstrate clear before/after

**3. Professional Production**
- Good audio quality (use microphone)
- Clean screen (close unnecessary tabs)
- Smooth transitions
- Add captions

**4. Tell a Story**
- Start with relatable problem
- Show your solution
- Demonstrate impact
- End with call to action

### Submission Best Practices

**1. Test Installation Link**
- Create fresh Atlassian account
- Install your app
- Verify it works
- Fix any issues

**2. Complete All Fields**
- Don't leave anything blank
- Provide detailed description
- Include all bonus prize materials
- Add compelling screenshots

**3. Submit Early**
- Don't wait until last minute
- Submit 2-3 hours before deadline
- Keep buffer for technical issues

---

## Quick Reference

### Essential Commands
```bash
# Create app
forge create

# Deploy
forge deploy

# Install
forge install

# View logs
forge logs

# Uninstall
forge uninstall

# Upgrade
forge install --upgrade
```

### Essential Links
- Forge Docs: https://developer.atlassian.com/platform/forge/
- Rovo Docs: https://developer.atlassian.com/rovo/
- Devpost: https://codegeistxawr.devpost.com/
- Developer Console: https://developer.atlassian.com/console/

### Support Resources
- Atlassian Community: https://community.developer.atlassian.com/
- Forge Slack: Join via developer.atlassian.com
- Stack Overflow: Tag with [atlassian-forge]

---

## Final Tips for Success

1. **Start Simple**: Get basic workflow working first
2. **Test Early**: Deploy and test every day
3. **Focus on Demo**: Video sells the idea
4. **Show Real Value**: Use actual metrics
5. **Polish Matters**: Clean UI beats complex features
6. **Submit Early**: Don't wait until deadline
7. **Have Fun**: Enjoy the process!

---

**You're ready to build MeetingMind and win this hackathon! If you get stuck, refer back to this guide.** 🚀

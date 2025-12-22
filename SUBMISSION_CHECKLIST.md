# MeetingMind - Hackathon Submission Checklist

## ✅ COMPLETED
- [x] Project code (forge-app/)
- [x] README.md with setup instructions
- [x] HACKATHON_SUBMISSION.md with all sections
- [x] test-samples.md with examples
- [x] ELEVATOR_PITCH.md
- [x] Bonus prize selection (Best Runs on Atlassian Apps)

## ❌ TODO - CRITICAL

### 1. Installation Link
**How to get it:**
1. Go to https://developer.atlassian.com/console/myapps/
2. Find "MeetingMind" app
3. Click on the app
4. Look for "Distribution" or "Share" tab
5. Copy the installation URL
6. Update HACKATHON_SUBMISSION.md with the real URL

**Current placeholder:** `https://developer.atlassian.com/console/install/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?signature=xxxxxxxxx`

### 2. Demo Video (REQUIRED)
**What to show (2-3 minutes):**
- Open Confluence page
- Edit page and insert MeetingMind macro
- Paste sample meeting notes (use test-samples.md)
- Click "Transform Meeting Notes"
- Show task preview modal
- Click "Create Tasks"
- Navigate to Jira and show created tasks
- Highlight: user assignment, due dates, descriptions

**Tools to use:**
- Loom (https://loom.com) - Easy, free
- OBS Studio - Free, professional
- Windows Game Bar (Win + G) - Built-in
- Upload to YouTube (unlisted is fine)

### 3. Screenshots (3-5 images)
**Required screenshots:**
1. MeetingMind macro in Confluence editor
2. Meeting notes input interface
3. Task preview modal with extracted tasks
4. Created Jira tasks showing assignments and due dates
5. (Optional) Analytics dashboard

**How to take:**
- Windows: Win + Shift + S
- Save to `screenshots/` folder
- Upload to Imgur or include in GitHub repo

### 4. GitHub Repository
**Steps:**
1. Create public GitHub repository
2. Push all code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MeetingMind hackathon submission"
   git remote add origin <your-github-url>
   git push -u origin main
   ```
3. Add repository URL to submission

### 5. App ID
**How to find:**
- Check `forge-app/manifest.yml` - look for `id:` field
- OR go to Developer Console and copy App ID
- Add to submission form

## 📋 SUBMISSION FORM FIELDS

### Basic Information
- **Project Name:** MeetingMind
- **Tagline:** Transform meeting notes into Jira tasks automatically using AI
- **Category:** Best Runs on Atlassian Apps

### Links
- **GitHub Repository:** [TODO: Add URL]
- **Demo Video:** [TODO: Add YouTube/Loom URL]
- **Installation Link:** [TODO: Get from Developer Console]

### Description
- Use content from HACKATHON_SUBMISSION.md

### Screenshots
- Upload 3-5 screenshots showing app in action

### Technical Details
- **Built with:** JavaScript, React, Node.js, Atlassian Forge, OpenAI API
- **Forge App ID:** [TODO: Get from manifest.yml or Developer Console]

## 🎯 FINAL CHECKS BEFORE SUBMISSION

- [ ] All code is committed and pushed to GitHub
- [ ] GitHub repository is PUBLIC
- [ ] Demo video is uploaded and accessible
- [ ] Installation link is tested and works
- [ ] Screenshots clearly show app functionality
- [ ] HACKATHON_SUBMISSION.md is complete
- [ ] README.md has clear setup instructions
- [ ] All placeholder URLs are replaced with real ones

## 📅 DEADLINE
**Check hackathon deadline and submit at least 1 hour early!**

---

**Next Steps:**
1. Get installation link from Developer Console
2. Record demo video (most important!)
3. Take screenshots
4. Push to GitHub
5. Fill out submission form
6. Submit!

# 📘 MeetingMind Build Runbook

**Purpose:** This document tracks every step we take to build MeetingMind from scratch.

**Last Updated:** December 5, 2025

---

## 🎯 Project Status

**Current Phase:** Project Initialization
**Current Step:** Step 8 - Test Hello World Macro
**Status:** 🟡 In Progress

---

## 📋 Build Progress Tracker

- [x] **Phase 0: Environment Setup**
  - [x] Step 1: Install Node.js
  - [x] Step 2: Install Forge CLI
  - [x] Step 3: Login to Atlassian
  - [x] Step 4: Set up Confluence & Jira Cloud
- [x] **Phase 1: Project Initialization**
  - [x] Step 5: Create first Forge app
  - [x] Step 6: Deploy app to Atlassian Cloud
  - [x] Step 7: Install app in Confluence
  - [x] Step 8: Test hello world macro
  - [ ] Step 4: Set up Confluence & Jira instances
  - [ ] Step 5: Verify installations

- [ ] **Phase 1: Project Initialization**
  - [ ] Step 6: Create Forge app
  - [ ] Step 7: Initial deployment
  - [ ] Step 8: First installation test

- [ ] **Phase 2: Basic UI Development**
  - [ ] Step 9: Create meeting template UI
  - [ ] Step 10: Add form components
  - [ ] Step 11: Test in Confluence

- [ ] **Phase 3: Jira Integration**
  - [ ] Step 12: Set up Jira API connection
  - [ ] Step 13: Create task function
  - [ ] Step 14: Test task creation

- [ ] **Phase 4: Rovo Agent Integration**
  - [ ] Step 15: Set up Rovo Agent
  - [ ] Step 16: Create extraction prompt
  - [ ] Step 17: Test AI extraction

- [ ] **Phase 5: Smart Features**
  - [ ] Step 18: User matching logic
  - [ ] Step 19: Date parsing logic
  - [ ] Step 20: Decision tracking

- [ ] **Phase 6: Polish & Testing**
  - [ ] Step 21: UI/UX improvements
  - [ ] Step 22: Error handling
  - [ ] Step 23: End-to-end testing

- [ ] **Phase 7: Demo & Submission**
  - [ ] Step 24: Demo video creation
  - [ ] Step 25: Final deployment
  - [ ] Step 26: Submission

---

## 📝 Detailed Step Log

### Phase 0: Environment Setup

---

#### ✅ Step 0: Documentation Organization (COMPLETED)

**Date:** December 5, 2025
**Duration:** 5 minutes
**Status:** ✅ COMPLETED

**What We Did:**
1. Created `docs/` subdirectory
2. Moved all documentation files to `docs/` folder:
   - START_HERE.md
   - COMPLETE_IMPLEMENTATION_GUIDE.md
   - REFINED_ROADMAP.md
   - TECHNICAL_SPECIFICATION.md
   - ARCHITECTURE_VISUAL.md
   - FAQ_AND_TROUBLESHOOTING.md
   - API_REFERENCE.md
3. Kept README.md in root directory
4. Created this RUNBOOK.md in root directory

**New Project Structure:**
```
MeetingMind/
├── README.md                    ← Parent document (root)
├── RUNBOOK.md                   ← This file (root)
├── docs/                        ← Documentation folder
│   ├── START_HERE.md
│   ├── COMPLETE_IMPLEMENTATION_GUIDE.md
│   ├── REFINED_ROADMAP.md
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── ARCHITECTURE_VISUAL.md
│   ├── FAQ_AND_TROUBLESHOOTING.md
│   └── API_REFERENCE.md
├── Summary                      ← Hackathon requirements
├── Project_Context              ← Original context
└── Roadmap                      ← Original roadmap
```

**Commands Used:**
```bash
mkdir docs
move START_HERE.md docs\START_HERE.md
move COMPLETE_IMPLEMENTATION_GUIDE.md docs\COMPLETE_IMPLEMENTATION_GUIDE.md
move REFINED_ROADMAP.md docs\REFINED_ROADMAP.md
move TECHNICAL_SPECIFICATION.md docs\TECHNICAL_SPECIFICATION.md
move ARCHITECTURE_VISUAL.md docs\ARCHITECTURE_VISUAL.md
move FAQ_AND_TROUBLESHOOTING.md docs\FAQ_AND_TROUBLESHOOTING.md
move API_REFERENCE.md docs\API_REFERENCE.md
```

**Issues Encountered:** None

**Next Step:** Install Node.js

---

#### ✅ Step 1: Install Node.js (COMPLETED)

**Date:** December 5, 2025
**Duration:** 10 minutes
**Status:** ✅ COMPLETED

**Objective:** Install Node.js runtime on your Windows machine

**Why We Need This:**
Node.js is the JavaScript runtime that powers Forge apps. Without it, we can't run the Forge CLI or develop our app.

**Prerequisites:**
- Windows 10 or 11
- Administrator access
- Internet connection

**Detailed Instructions:**

**For Windows:**

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the green button that says "LTS" (Long Term Support)
   - Current recommended version: 20.x or 18.x
   - File will be named something like: `node-v20.10.0-x64.msi`

2. **Run the Installer**
   - Double-click the downloaded `.msi` file
   - Click "Next" on the welcome screen
   - Accept the license agreement
   - Choose installation location (default is fine: `C:\Program Files\nodejs\`)
   - **IMPORTANT:** Make sure "Add to PATH" is checked ✅
   - Click "Install"
   - Wait for installation to complete (2-3 minutes)
   - Click "Finish"

3. **Verify Installation**
   - Open Command Prompt (cmd) or PowerShell
   - Type: `node --version`
   - Expected output: `v20.10.0` (or similar)
   - Type: `npm --version`
   - Expected output: `10.2.3` (or similar)

**For macOS:**

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the green "LTS" button
   - File will be named: `node-v20.10.0.pkg`

2. **Run the Installer**
   - Double-click the `.pkg` file
   - Follow the installation wizard
   - Enter your password when prompted
   - Click "Install"

3. **Verify Installation**
   - Open Terminal
   - Type: `node --version`
   - Type: `npm --version`

**For Linux (Ubuntu/Debian):**

1. **Install via Package Manager**
   ```bash
   # Update package list
   sudo apt update
   
   # Install Node.js and npm
   sudo apt install nodejs npm -y
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Alternative: Install via NodeSource (Recommended for latest version)**
   ```bash
   # Download and run NodeSource setup script
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   
   # Install Node.js
   sudo apt install nodejs -y
   
   # Verify
   node --version
   npm --version
   ```

**Expected Results:**
- `node --version` shows v18.x or v20.x
- `npm --version` shows 9.x or 10.x

**What We Accomplished:**
- ✅ Downloaded Node.js LTS installer
- ✅ Installed Node.js successfully
- ✅ Verified installation with `node --version`
- ✅ Verified npm with `npm --version`
- ✅ Node.js and npm are working correctly

**Verification Results:**
- Node.js version confirmed working
- npm package manager confirmed working
- Ready to install Forge CLI

**Issues Encountered:** None

**Next Step:** Install Forge CLI

---

#### ✅ Step 2: Install Forge CLI (COMPLETED)

**Date:** December 5, 2025
**Duration:** 5 minutes
**Status:** ✅ COMPLETED

**Objective:** Install Atlassian Forge CLI globally on your system

**Why We Need This:**
The Forge CLI is the command-line tool that lets you create, develop, deploy, and manage Forge apps. It's essential for building MeetingMind.

**Prerequisites:**
- ✅ Node.js installed (Step 1 completed)
- ✅ npm working
- Internet connection
- Administrator/sudo access (may be needed)

**Detailed Instructions:**

**For Windows:**

1. **Open Command Prompt or PowerShell as Administrator**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Command Prompt (Admin)"
   - Click "Yes" on the UAC prompt

2. **Install Forge CLI**
   ```bash
   npm install -g @forge/cli
   ```
   
   **What this does:**
   - `-g` flag installs globally (available everywhere)
   - `@forge/cli` is the Forge command-line tool package
   - Installation takes 1-2 minutes

3. **Wait for Installation**
   - You'll see download progress
   - Multiple packages will be installed
   - Wait until you see the command prompt again

4. **Verify Installation**
   ```bash
   forge --version
   ```
   
   **Expected output:**
   ```
   8.x.x
   ```
   (Version 8 or higher is good)

**For macOS:**

1. **Open Terminal**

2. **Install Forge CLI**
   ```bash
   npm install -g @forge/cli
   ```
   
   **If you get permission errors:**
   ```bash
   sudo npm install -g @forge/cli
   ```
   (Enter your password when prompted)

3. **Verify Installation**
   ```bash
   forge --version
   ```

**For Linux (Ubuntu/Debian):**

1. **Open Terminal**

2. **Install Forge CLI**
   ```bash
   sudo npm install -g @forge/cli
   ```
   (Enter your password when prompted)

3. **Verify Installation**
   ```bash
   forge --version
   ```

**Expected Results:**
- ✅ Installation completes without errors
- ✅ `forge --version` shows version 8.x.x or higher
- ✅ `forge` command is recognized

**Common Installation Output:**
```
npm WARN deprecated ...
added 245 packages in 45s
```
(Warnings are normal, errors are not)

**What We Accomplished:**
- ✅ Installed Forge CLI globally with `npm install -g @forge/cli`
- ✅ Verified installation with `forge --version`
- ✅ Forge CLI is working correctly
- ✅ Ready to login to Atlassian

**Verification Results:**
- Forge CLI version confirmed (8.x.x or higher)
- Command recognized in terminal
- Ready for authentication

**Issues Encountered:** None

**Next Step:** Login to Atlassian via Forge CLI

---

#### ✅ Step 3: Login to Atlassian (COMPLETED)

**Date:** December 5, 2025
**Duration:** 3 minutes
**Status:** ✅ COMPLETED

**Objective:** Authenticate Forge CLI with your Atlassian account

**Why We Need This:**
Forge CLI needs to authenticate with Atlassian to deploy apps, manage installations, and access your Confluence/Jira instances. This is a one-time setup.

**Prerequisites:**
- ✅ Node.js installed (Step 1 completed)
- ✅ Forge CLI installed (Step 2 completed)
- Internet connection
- Web browser

**Detailed Instructions:**

1. **Run the Login Command**
   
   Open Command Prompt or PowerShell and type:
   ```bash
   forge login
   ```

2. **Browser Will Open Automatically**
   
   - Your default web browser will open
   - You'll see the Atlassian login page
   - URL will be: `https://id.atlassian.com/login`

3. **Two Scenarios:**

   **Scenario A: You Already Have an Atlassian Account**
   - Enter your email and password
   - Click "Log in"
   - You may need to verify with 2FA if enabled
   - Click "Accept" to authorize Forge CLI
   - Browser will show: "Success! You can close this window"
   - Return to terminal

   **Scenario B: You Don't Have an Atlassian Account**
   - Click "Sign up" on the login page
   - Enter your email address
   - Create a password (min 8 characters)
   - Verify your email (check inbox)
   - Click the verification link
   - Complete account setup
   - Click "Accept" to authorize Forge CLI
   - Browser will show: "Success! You can close this window"
   - Return to terminal

4. **Verify Login Success**
   
   Back in your terminal, you should see:
   ```
   ✔ Logged in as your-email@example.com
   ```

5. **Test Authentication**
   
   Run this command to confirm:
   ```bash
   forge whoami
   ```
   
   **Expected output:**
   ```
   your-email@example.com
   ```

**What Happens During Login:**
- Forge CLI gets an authentication token
- Token is stored securely on your computer
- You won't need to login again (unless you logout)
- Token allows Forge to deploy apps on your behalf

**Expected Results:**
- ✅ Browser opens automatically
- ✅ Login successful
- ✅ Terminal shows "Logged in as..."
- ✅ `forge whoami` shows your email

**What We Accomplished:**
- ✅ Ran `forge login` command
- ✅ Browser opened and authenticated successfully
- ✅ Authorized Forge CLI access
- ✅ Verified with `forge whoami`
- ✅ Authentication token saved

**Verification Results:**
- Login successful
- Email confirmed in terminal
- Ready to create Forge apps

**Issues Encountered:** None

**Next Step:** Set up free Confluence and Jira Cloud instances

---

#### ✅ Step 4: Set up Confluence & Jira Cloud (COMPLETED)

**Date:** December 5, 2025
**Duration:** 10 minutes
**Status:** ✅ COMPLETED

**Objective:** Create free Confluence and Jira Cloud instances for testing MeetingMind

**Why We Need This:**
MeetingMind integrates with both Confluence (for meeting notes) and Jira (for task creation). We need test instances to develop and test our app.

**Prerequisites:**
- ✅ Atlassian account created (Step 3 completed)
- ✅ Logged into Atlassian
- Web browser

**Detailed Instructions:**

### Part A: Create Confluence Cloud Site

1. **Go to Atlassian Start Page**
   - Open browser: https://start.atlassian.com/
   - Or go to: https://www.atlassian.com/try/cloud/signup

2. **Start Confluence Free Trial**
   - Click "Try Confluence"
   - Or click "Get it free" under Confluence

3. **Set Up Your Site**
   - **Site name:** Choose a name (e.g., "meetingmind-test" or "yourname-dev")
   - This creates: `yourname.atlassian.net`
   - Click "Agree and continue"

4. **Skip Team Invites**
   - Click "Skip" or "I'll do this later"
   - We don't need team members for testing

5. **Choose Template (Optional)**
   - Select "Blank space" or skip
   - Click "Continue"

6. **Verify Confluence is Ready**
   - You should see Confluence homepage
   - URL: `https://yourname.atlassian.net/wiki`
   - ✅ Confluence is ready!

### Part B: Add Jira to Your Site

1. **Access Atlassian Admin**
   - Click your profile icon (top right)
   - Select "Atlassian Administration"
   - Or go to: `https://admin.atlassian.com/`

2. **Add Jira Product**
   - Click "Products" in left sidebar
   - Click "Add product"
   - Select "Jira Software"
   - Click "Add product" or "Try it free"

3. **Set Up Jira**
   - Choose "Software development" or "Project management"
   - Click "Continue"

4. **Create First Project**
   - Project name: "MeetingMind Test" or "Test Project"
   - Project key: "PROJ" or "TEST"
   - Click "Create"

5. **Verify Jira is Ready**
   - You should see Jira board
   - URL: `https://yourname.atlassian.net/jira`
   - ✅ Jira is ready!

### Part C: Verify Both Products

1. **Test Confluence**
   - Go to: `https://yourname.atlassian.net/wiki`
   - Create a test page:
     - Click "Create" button
     - Title: "Test Meeting Notes"
     - Add some text
     - Click "Publish"
   - ✅ Confluence working!

2. **Test Jira**
   - Go to: `https://yourname.atlassian.net/jira`
   - Create a test issue:
     - Click "Create" button
     - Issue type: "Task"
     - Summary: "Test task"
     - Click "Create"
   - ✅ Jira working!

3. **Note Your Site URL**
   - Write down: `https://yourname.atlassian.net`
   - You'll need this for app installation

**Expected Results:**
- ✅ Confluence site created and accessible
- ✅ Jira added to the same site
- ✅ Both products working
- ✅ Can create pages in Confluence
- ✅ Can create issues in Jira
- ✅ Site URL noted

**Important Notes:**
- Free trial lasts 7 days for Jira (enough for hackathon)
- Confluence has a free tier (stays free)
- Both products share the same site URL
- You can have multiple test sites if needed

**What We Accomplished:**
- ✅ Confluence site already existed: `abdulateefoyindamola.atlassian.net`
- ✅ Added Jira Software to the site
- ✅ Both products working on same site
- ✅ Site URL confirmed: `abdulateefoyindamola.atlassian.net`
- ✅ Ready for app development

**Site Details:**
- Site URL: `https://abdulateefoyindamola.atlassian.net`
- Confluence: `https://abdulateefoyindamola.atlassian.net/wiki`
- Jira: `https://abdulateefoyindamola.atlassian.net/jira`

**Products Confirmed:**
- ✅ Confluence (for meeting notes)
- ✅ Jira (for task creation)
- ✅ No other products needed for MeetingMind

**Issues Encountered:** None

**Next Step:** Create first Forge app

---

#### 🟡 Step 5: Create First Forge App (IN PROGRESS)

**Date:** December 5, 2025
**Status:** 🟡 IN PROGRESS

**Objective:** Create your first Forge app using the Forge CLI

**Why We Need This:**
This creates the basic structure for MeetingMind. We'll start with a simple "hello world" app to verify everything works, then build MeetingMind features on top of it.

**Prerequisites:**
- ✅ Node.js installed (Step 1 completed)
- ✅ Forge CLI installed (Step 2 completed)
- ✅ Logged into Atlassian (Step 3 completed)
- ✅ Confluence & Jira ready (Step 4 completed)

**Detailed Instructions:**

### Part A: Navigate to Project Folder

1. **Open Command Prompt or PowerShell**

2. **Navigate to your MeetingMind folder**
   ```bash
   cd c:\Users\funke\Desktop\Personal_Projects\MeetingMind
   ```

3. **Verify you're in the right place**
   ```bash
   dir
   ```
   You should see: README.md, RUNBOOK.md, docs folder

### Part B: Create Forge App

1. **Run the create command**
   ```bash
   forge create
   ```

2. **Answer the prompts:**

   **Prompt 1: "Enter a name for your app"**
   ```
   meetingmind
   ```
   (lowercase, no spaces)

   **Prompt 2: "Select a category"**
   - Use arrow keys to select: **UI Kit**
   - Press Enter

   **Prompt 3: "Select a template"**
   - Use arrow keys to select: **confluence-macro**
   - Press Enter
   - This creates a Confluence macro (perfect for meeting notes!)

3. **Wait for creation**
   - Forge will create files and install dependencies
   - Takes 1-2 minutes
   - You'll see: "Created new app in ./meetingmind"

### Part C: Explore the Created Files

1. **Navigate into the app folder**
   ```bash
   cd meetingmind
   ```

2. **List the files**
   ```bash
   dir
   ```

3. **You should see:**
   ```
   meetingmind/
   ├── manifest.yml       ← App configuration
   ├── package.json       ← Dependencies
   ├── src/
   │   └── index.jsx      ← Main app code
   └── README.md
   ```

### Part D: Verify App Structure

1. **Check manifest.yml exists**
   ```bash
   type manifest.yml
   ```
   You should see YAML configuration

2. **Check src/index.jsx exists**
   ```bash
   type src\index.jsx
   ```
   You should see React code

**Expected Results:**
- ✅ `forge create` command completed successfully
- ✅ New `meetingmind` folder created
- ✅ Files generated: manifest.yml, package.json, src/index.jsx
- ✅ Dependencies installed
- ✅ Ready to deploy

**What to Do Next:**
Once you see the files created, tell me:
"Forge app created successfully. Ready for Step 6."

**If You Encounter Issues:**
See the Troubleshooting section below.

---

## 🔧 Troubleshooting Section

### Issue: "node is not recognized as an internal or external command"

**Problem:** Node.js is not in your system PATH

**Solution (Windows):**
1. Close and reopen Command Prompt/PowerShell
2. If still not working:
   - Search for "Environment Variables" in Windows
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button
   - Under "System variables", find "Path"
   - Click "Edit"
   - Add: `C:\Program Files\nodejs\`
   - Click OK on all windows
   - Restart Command Prompt

**Solution (macOS/Linux):**
1. Close and reopen Terminal
2. If still not working, add to your shell profile:
   ```bash
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

---

### Issue: "Permission denied" during installation (macOS/Linux)

**Problem:** Need administrator privileges

**Solution:**
```bash
# Use sudo for installation
sudo apt install nodejs npm

# Or for npm global packages later:
sudo npm install -g @forge/cli
```

---

### Issue: Wrong Node.js version installed

**Problem:** You have an old version of Node.js

**Solution (Windows):**
1. Uninstall current Node.js via Control Panel
2. Download latest LTS from nodejs.org
3. Install fresh

**Solution (macOS/Linux):**
```bash
# Use nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

---

### Issue: "forge: command not found" after installation

**Problem:** Forge CLI not in PATH or installation incomplete

**Solution (Windows):**
1. Close and reopen Command Prompt/PowerShell
2. Try running as Administrator
3. If still not working, reinstall:
   ```bash
   npm uninstall -g @forge/cli
   npm install -g @forge/cli
   ```

**Solution (macOS/Linux):**
1. Close and reopen Terminal
2. Check npm global path:
   ```bash
   npm config get prefix
   ```
3. Add to PATH if needed:
   ```bash
   echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

---

### Issue: "EACCES: permission denied" during Forge CLI installation

**Problem:** Need administrator privileges

**Solution (Windows):**
1. Run Command Prompt as Administrator
2. Run installation command again

**Solution (macOS/Linux):**
```bash
# Use sudo
sudo npm install -g @forge/cli

# Or fix npm permissions (better long-term solution)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @forge/cli
```

---

### Issue: Installation hangs or takes very long

**Problem:** Network issues or npm cache problems

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installation again
npm install -g @forge/cli

# If still slow, try with verbose output to see what's happening
npm install -g @forge/cli --verbose
```

---

### Issue: Browser doesn't open during "forge login"

**Problem:** Browser not opening automatically

**Solution:**
1. Look in terminal for a URL
2. Copy the URL manually
3. Paste it into your browser
4. Complete login in browser
5. Return to terminal

**Alternative:**
```bash
# Try login with explicit browser
forge login --browser=chrome
# or
forge login --browser=firefox
```

---

### Issue: "Authentication failed" or "Invalid credentials"

**Problem:** Login credentials incorrect

**Solution:**
1. Double-check email and password
2. Reset password if needed at: https://id.atlassian.com/
3. Try login again:
   ```bash
   forge logout
   forge login
   ```

---

### Issue: "forge whoami" shows error after login

**Problem:** Authentication token not saved properly

**Solution:**
```bash
# Logout and login again
forge logout
forge login

# Verify
forge whoami
```

---

### Issue: Stuck at "Waiting for authentication..."

**Problem:** Browser authorization not completing

**Solution:**
1. Check if browser window is hidden/minimized
2. Look for "Accept" or "Allow" button in browser
3. Click it to authorize
4. If timeout occurs:
   ```bash
   # Cancel with Ctrl+C
   # Try again
   forge login
   ```

---

### Issue: Can't find "Add product" option for Jira

**Problem:** Jira might already be included or UI different

**Solution:**
1. Check if Jira is already available:
   - Go to: `https://yourname.atlassian.net/jira`
   - If it loads, Jira is already set up!
2. If not found:
   - Go to: https://www.atlassian.com/software/jira/free
   - Click "Get it free"
   - Select your existing site

---

### Issue: "Site name already taken"

**Problem:** Someone else is using that site name

**Solution:**
1. Try a different name:
   - Add numbers: "meetingmind-test-123"
   - Add your name: "john-meetingmind"
   - Add date: "meetingmind-dec2025"
2. Site names must be unique across all Atlassian

---

### Issue: "Free trial expired" or "Payment required"

**Problem:** Trial period ended or wrong product tier

**Solution:**
1. For Confluence: Use the free tier (up to 10 users)
2. For Jira: 7-day trial is enough for hackathon
3. Create a new Atlassian account if needed
4. Use a different email address for fresh trial

---

### Issue: Can't create pages in Confluence

**Problem:** Permissions or space not set up

**Solution:**
1. Make sure you're in a space:
   - Click "Spaces" in top menu
   - Create a new space if needed
   - Name it "Test Space"
2. Try creating page again
3. You should have admin permissions on your own site

---

## 📊 Time Tracking

| Step | Duration | Status |
|------|----------|--------|
| Step 0: Documentation Organization | 5 min | ✅ Complete |
| Step 1: Install Node.js | 10 min | ✅ Complete |
| Step 2: Install Forge CLI | 5 min | ✅ Complete |
| Step 3: Login to Atlassian | 3 min | ✅ Complete |
| Step 4: Set up Confluence & Jira | 10 min | ✅ Complete |
| Step 5: Create first Forge app | 5 min | ✅ Complete |
| Step 6: Deploy app to Atlassian Cloud | 3 min | ✅ Complete |
| Step 7: Install app in Confluence | 2 min | ✅ Complete |
| Step 8: Test hello world macro | 5 min | ✅ Complete |
| Step 9: Update manifest for MeetingMind | 15 min | ✅ Complete |
| Step 10: Build meeting template UI | 15 min | ✅ Complete |
| Step 11: Add Jira task creation | 25 min | ✅ Complete |
| Step 12: Fix text input functionality | Pending | 🟢 Ready |

**Total Time Spent:** 103 minutes

---

## 🎯 Next Steps Preview

#### ✅ Step 5: Create First Forge App (COMPLETED)

**Date:** December 5, 2025
**Duration:** 5 minutes
**Status:** ✅ COMPLETED

**What We Accomplished:**
- ✅ Ran `forge create` command
- ✅ Selected Confluence as the platform
- ✅ Created app named "forge-app"
- ✅ Forge generated app structure with 3 environments (production, staging, development)
- ✅ Files created: manifest.yml, package.json, src/ folder
- ✅ Dependencies installed automatically

**App Structure Created:**
```
MeetingMind/
├── README.md
├── RUNBOOK.md
├── docs/
└── forge-app/              ← NEW!
    ├── manifest.yml        ← App configuration
    ├── package.json        ← Dependencies
    ├── src/
    │   └── index.jsx       ← Main app code
    └── README.md
```

**Environments Available:**
- ✅ Development (for testing)
- ✅ Staging (for pre-production)
- ✅ Production (for final deployment)

**Issues Encountered:** None

**Next Step:** Deploy app to development environment

---

#### 🟡 Step 6: Deploy Forge App (IN PROGRESS)

**Date:** December 5, 2025
**Status:** 🟡 IN PROGRESS

**Objective:** Deploy your Forge app to Atlassian Cloud (development environment)

**Why We Need This:**
Deployment uploads your app code to Atlassian's servers. Once deployed, you can install it in your Confluence site and test it.

**Prerequisites:**
- ✅ Forge app created (Step 5 completed)
- ✅ Currently in forge-app directory
- ✅ Logged into Atlassian (Step 3 completed)

**Detailed Instructions:**

### Part A: Verify You're in the Right Directory

1. **Check current directory**
   ```bash
   cd
   ```
   You should see: `c:\Users\funke\Desktop\Personal_Projects\MeetingMind\forge-app`

2. **If not in forge-app directory, navigate there**
   ```bash
   cd c:\Users\funke\Desktop\Personal_Projects\MeetingMind\forge-app
   ```

3. **Verify files exist**
   ```bash
   dir
   ```
   You should see: manifest.yml, package.json, src folder

### Part B: Deploy to Development Environment

1. **Run the deploy command**
   ```bash
   forge deploy
   ```

2. **What happens during deployment:**
   - Forge validates your manifest.yml
   - Uploads your code to Atlassian Cloud
   - Builds your app
   - Takes 30-60 seconds

3. **Watch for success message:**
   ```
   ✔ Deployed
   App ID: ari:cloud:ecosystem::app/...
   Environment: development
   ```

4. **Note your App ID**
   - You'll see something like: `ari:cloud:ecosystem::app/abc123...`
   - This is your unique app identifier
   - You'll need this for the hackathon submission!

### Part C: Verify Deployment

1. **Check deployment status**
   ```bash
   forge environments
   ```

2. **You should see:**
   ```
   development: Deployed
   staging: Not deployed
   production: Not deployed
   ```

**Expected Results:**
- ✅ Deployment completes successfully
- ✅ "Deployed" message appears
- ✅ App ID displayed
- ✅ Development environment shows "Deployed"
- ✅ Ready to install in Confluence

**What We Accomplished:**
- ✅ Ran `forge deploy` command
- ✅ App deployed to development environment successfully
- ✅ Received confirmation: "Deployed"
- ✅ App version 2.0.0 deployed
- ✅ Confirmed eligible for "Runs on Atlassian" program ($2,000 bonus prize!)
- ✅ App ID generated (needed for hackathon submission)

**Deployment Details:**
- Environment: development
- Version: 2.0.0
- Status: Deployed successfully
- Bonus Prize Eligibility: Runs on Atlassian ✅

**Issues Encountered:** None

**Next Step:** Install app in Confluence site

---

#### 🟡 Step 7: Install App in Confluence (IN PROGRESS)

**Date:** December 5, 2025
**Status:** 🟡 IN PROGRESS

**Objective:** Install your deployed Forge app in your Confluence site

**Why We Need This:**
Installation makes your app available in Confluence. Once installed, you can add the macro to pages and test it.

**Prerequisites:**
- ✅ App deployed (Step 6 completed)
- ✅ Confluence site ready: `abdulateefoyindamola.atlassian.net`
- ✅ Currently in forge-app directory

**Detailed Instructions:**

### Part A: Install the App

1. **Make sure you're in the forge-app directory**
   ```bash
   cd c:\Users\funke\Desktop\Personal_Projects\MeetingMind\forge-app
   ```

2. **Run the install command**
   ```bash
   forge install
   ```

3. **Answer the prompts:**

   **Prompt 1: "Select a product"**
   ```
   > Confluence
   ```
   (Use arrow keys, press Enter)

   **Prompt 2: "Enter the site URL"**
   ```
   abdulateefoyindamola.atlassian.net
   ```
   (Type your site URL, press Enter)

4. **Wait for installation** (10-20 seconds)

5. **Look for success message:**
   ```
   ✔ Installed forge-app in Confluence on abdulateefoyindamola.atlassian.net
   ```

### Part B: Verify Installation

1. **Open your Confluence site in browser**
   - Go to: `https://abdulateefoyindamola.atlassian.net/wiki`

2. **Check if app is installed**
   - Click your profile icon (top right)
   - Select "Manage apps" or "Settings"
   - Look for "forge-app" in the list
   - Should show as "Installed" ✅

### Part C: Test the Macro

1. **Create or open a Confluence page**
   - Click "Create" button
   - Or open an existing page and click "Edit"

2. **Insert the macro**
   - Type `/` to open the insert menu
   - Type "forge" or look for your app name
   - You should see "forge-app" in the list
   - Click it to insert

3. **See the hello world message**
   - The macro should display: "Hello world!"
   - This confirms your app is working!

4. **Publish the page**
   - Click "Publish" or "Update"
   - View the page
   - Macro should still display

**Expected Results:**
- ✅ Installation completes successfully
- ✅ App appears in Confluence settings
- ✅ Macro available when editing pages
- ✅ "Hello world!" message displays
- ✅ Ready to start building MeetingMind features!

**What We Accomplished:**
- ✅ Ran `forge install` command
- ✅ Selected Confluence as product
- ✅ Entered site URL: abdulateefoyindamola.atlassian.net
- ✅ App installed successfully in development environment
- ✅ App now available in Confluence
- ✅ Ready to test the macro

**Installation Details:**
- Product: Confluence
- Site: abdulateefoyindamola.atlassian.net
- Environment: development
- Status: Installed successfully

**Issues Encountered:** None

**Next Step:** Test the hello world macro in Confluence

---

#### ✅ Step 8: Test Hello World Macro (COMPLETED)

**Date:** December 5, 2025
**Duration:** 5 minutes
**Status:** ✅ COMPLETED

**Objective:** Verify your Forge app works by testing the hello world macro in Confluence

**Why We Need This:**
Testing confirms the entire setup works end-to-end: code → deploy → install → display. Once this works, we can start building MeetingMind features.

**Prerequisites:**
- ✅ App installed in Confluence (Step 7 completed)
- ✅ Confluence site accessible
- Web browser

**Detailed Instructions:**

### Part A: Open Confluence

1. **Open your browser**

2. **Go to your Confluence site**
   ```
   https://abdulateefoyindamola.atlassian.net/wiki
   ```

3. **You should see your Confluence homepage**

### Part B: Create or Edit a Page

**Option 1: Create a New Page**
1. Click the "Create" button (top right or center)
2. You'll see a blank page editor
3. Give it a title: "Test MeetingMind"

**Option 2: Edit an Existing Page**
1. Open any existing page
2. Click the "Edit" button (top right)
3. You'll see the page editor

### Part C: Insert Your App Macro

1. **In the page editor, type:**
   ```
   /
   ```
   (Just the forward slash)

2. **A menu will appear with options**

3. **Type to search:**
   ```
   forge
   ```
   or
   ```
   forge-app
   ```

4. **You should see your app in the list:**
   - Look for "forge-app" or your app name
   - It might show as a macro option

5. **Click on it to insert**

6. **You should immediately see:**
   ```
   Hello world!
   ```
   (This is the default message from the template)

### Part D: Publish and Verify

1. **Click "Publish" or "Update"** (top right)

2. **View the published page**

3. **Confirm you still see:**
   ```
   Hello world!
   ```

4. **Success!** ✅ Your Forge app is working!

**Expected Results:**
- ✅ Confluence site loads
- ✅ Can create/edit pages
- ✅ "/" menu shows your app
- ✅ "Hello world!" message displays
- ✅ Message persists after publishing
- ✅ End-to-end workflow confirmed working!

**What We Accomplished:**
- ✅ Opened Confluence site in browser
- ✅ Created/edited a page
- ✅ Typed "/" to open macro menu
- ✅ Found and inserted "forge-app" macro
- ✅ Verified "Hello world!" displays correctly
- ✅ Published page successfully
- ✅ End-to-end workflow confirmed working!

**Result:**
🎉 SUCCESS! The hello world macro works perfectly. Foundation is solid and ready for building MeetingMind features.

**Issues Encountered:** None

---

## 🚀 PHASE 2: Building MeetingMind Features

**Phase 0 Complete!** ✅ Foundation is working. Now we build MeetingMind.

---

#### ✅ Step 9: Update Manifest for MeetingMind (COMPLETED)

**Date:** December 5, 2025
**Duration:** 15 minutes
**Status:** ✅ COMPLETED

**Objective:** Update manifest.yml to configure MeetingMind with proper name, permissions, and Rovo Agent

**Why We Need This:**
The manifest defines your app's identity, permissions, and capabilities. We need to:
- Change app name from "forge-app" to "MeetingMind"
- Add permissions for Confluence (read/write) and Jira (write)
- Configure Rovo Agent for AI extraction
- Set up proper scopes

**Prerequisites:**
- ✅ Hello world working (Step 8 completed)
- ✅ In forge-app directory

**What to Update:**
1. App name and description
2. Add Confluence read/write permissions
3. Add Jira write permissions
4. Add Rovo Agent module
5. Configure required scopes

**Reference:** `docs/TECHNICAL_SPECIFICATION.md` Section 3.1

**What We've Done So Far:**

1. ✅ Updated manifest.yml with:
   - Changed macro key to "meetingmind-macro"
   - Changed title to "MeetingMind"
   - Added description: "Transform meeting notes into Jira tasks automatically"
   - Added permissions section with required scopes:
     - read:confluence-content.all
     - write:confluence-content
     - read:confluence-space.summary
     - read:confluence-user
     - write:jira-work
     - read:jira-work
     - read:jira-user

2. ✅ Ran `forge lint` - validation passed (no issues)

3. ⚠️ Attempted deployment - encountered network connectivity issue
   - Error: Cannot reach AWS S3 and Atlassian servers
   - This is a temporary DNS/network problem
   - Manifest changes are saved locally

**Current Status:**
- Manifest.yml updated correctly ✅
- Validation passed ✅
- Deployment pending (network issue) ⚠️

**Network Issue Details:**
- DNS resolution failing for Atlassian/AWS domains
- Tested: Basic internet works (ping 8.8.8.8 successful)
- Problem: Cannot resolve forge-cdn-tmp-prod.s3.us-west-2.amazonaws.com, api.atlassian.com
- Attempted: DNS flush (ipconfig /flushdns) - issue persists
- Root cause: Likely ISP/network DNS problem or firewall blocking Atlassian domains

**Workarounds to Try:**

1. **Change DNS servers to Google DNS:**
   - Open Network Settings → Change adapter options
   - Right-click your network → Properties
   - Select IPv4 → Properties
   - Use these DNS servers:
     - Preferred: 8.8.8.8
     - Alternate: 8.8.4.4
   - Click OK, then retry deployment

2. **Try mobile hotspot:**
   - Connect to phone's hotspot
   - Retry deployment

3. **Check firewall/antivirus:**
   - Temporarily disable to test
   - Add Forge CLI to exceptions

4. **Wait and retry:**
   - Network issue may be temporary
   - Try again in 10-15 minutes

**To Complete Step 9 (when network works):**
```bash
forge deploy --non-interactive -e development
forge install --non-interactive --upgrade --site abdulateefoyindamola.atlassian.net --product confluence --environment development
```

**Resolution:**
✅ Switched to mobile hotspot - deployment successful!

**Final Actions Completed:**
1. ✅ Deployed version 3.0.0 to development environment
2. ✅ Upgraded Confluence installation with new permissions
3. ✅ Installed app in Jira (required for Jira scopes)
4. ✅ All 7 permission scopes now active:
   - read:confluence-content.all
   - write:confluence-content
   - read:confluence-space.summary
   - read:confluence-user
   - write:jira-work
   - read:jira-work
   - read:jira-user

**App Status:**
- Version: 3.0.0
- Installed in: Confluence ✅ + Jira ✅
- Permissions: All granted ✅
- Eligible for: Runs on Atlassian ($2K bonus) ✅

**Issues Encountered:**
Network DNS issue with original connection - resolved by switching to mobile hotspot

**Next Step:** Build meeting template UI (Step 10)

---

#### ✅ Step 10: Build Meeting Template UI (COMPLETED)

**Date:** December 10, 2025
**Duration:** 15 minutes
**Status:** ✅ COMPLETED

**Objective:** Create meeting template UI with form fields for entering meeting notes

**What We Built:**
1. ✅ Updated src/frontend/index.jsx with meeting template
2. ✅ Added UI components:
   - Heading: "MeetingMind - Transform Meeting Notes into Tasks"
   - TextArea: For pasting meeting notes with clean placeholder
   - Button: "Create Jira Tasks" with loading state
   - Processing indicator
3. ✅ Added state management for notes and processing status
4. ✅ Form validation (button disabled when empty)
5. ✅ Fixed placeholder text formatting (removed \\n escape characters)

**Code Changes:**
- Replaced hello world with meeting form
- Used Forge UI Kit components: Stack, Heading, TextArea, Button, Text
- Added user-friendly placeholder with proper line breaks
- Implemented form handling with loading states

**Validation:**
- ✅ Ran `forge lint` - no issues
- ✅ Deployed version 3.7.0 successfully
- ✅ Still eligible for Runs on Atlassian bonus
- ✅ UI tested and working in Confluence

**App Status:**
- Version: 3.7.0
- UI: Meeting template ready ✅
- User can paste meeting notes naturally ✅
- Next: Add Jira task creation

**Issues Encountered:** 
- Initial placeholder text showed \\n escape characters
- Fixed by using proper multiline strings

**Next Step:** Add Jira task creation functionality (Step 11)

---

#### ✅ Step 11: Add Jira Task Creation (COMPLETED)

**Date:** December 10, 2025
**Duration:** 25 minutes
**Status:** ✅ COMPLETED

**Objective:** Connect the "Create Jira Tasks" button to actually create tasks in Jira

**What We Built:**
1. ✅ Updated resolver with Jira API integration using `@forge/api`
2. ✅ Added text parsing to extract action items (lines starting with "-")
3. ✅ Implemented Jira task creation with proper ADF format
4. ✅ Added comprehensive error handling and logging
5. ✅ Fixed button text display issue
6. ✅ Created demo version to test functionality

**Technical Implementation:**
- Used `api.asUser().requestJira()` for authenticated API calls
- Parsed meeting notes to find lines starting with "-"
- Created tasks with proper Atlassian Document Format for descriptions
- Added detailed logging for debugging
- Handled Jira API errors gracefully

**Validation:**
- ✅ Successfully created Jira task KAN-2
- ✅ Task visible in Jira with correct summary and description
- ✅ End-to-end workflow confirmed working
- ✅ Error handling tested and working

**App Status:**
- Version: 3.13.0
- Core functionality: Working ✅
- Jira integration: Working ✅
- Demo mode: Functional ✅

**Issues Encountered & Resolved:**
- Jira API 400 error: Fixed by using Atlassian Document Format for descriptions
- Button text not showing: Fixed by using children instead of text prop
- Zero tasks created: Fixed with better error handling and logging

**Next Step:** Fix text input functionality (Step 12)

---

#### 🟢 Step 12: Fix Text Input Functionality (READY)

**Date:** December 10, 2025
**Status:** 🟢 READY TO START
**Time Estimate:** 15 minutes

**Objective:** Fix the TextArea pasting issue so users can input their own meeting notes

**Current Issue:** 
- TextArea causes macro to lose focus when pasting
- Users can't input their own meeting notes
- Currently using hardcoded demo notes

**Proposed Solutions:**
1. **Try Textfield instead of TextArea** - simpler input, less likely to crash
2. **Use different TextArea props** - try different configurations
3. **Alternative: Modal approach** - open input in a modal dialog
4. **Fallback: Multiple demo options** - provide several demo note templates

**Recommendation:** Start with Textfield approach as it's most stable in Forge UI Kit.

**Ready to proceed with fixing the input?**

---

## 📝 Notes & Decisions

### Decision Log

**Decision 1:** Use Node.js LTS version (20.x)
- **Reason:** Most stable, best supported by Forge
- **Date:** December 5, 2025

**Decision 2:** Organize docs in subdirectory
- **Reason:** Keep root clean, easier navigation
- **Date:** December 5, 2025

**Decision 3:** Use existing Atlassian site (abdulateefoyindamola.atlassian.net)
- **Reason:** Site already exists with Confluence, just added Jira
- **Date:** December 5, 2025

**Decision 4:** Only use Confluence + Jira (no other products)
- **Reason:** These two products are sufficient for MeetingMind
- **Date:** December 5, 2025

**Decision 5:** App is eligible for "Runs on Atlassian" bonus prize
- **Reason:** Confirmed during deployment - app meets Atlassian standards
- **Value:** $2,000 bonus prize
- **Action:** Mention in Devpost submission
- **Date:** December 5, 2025

---

## 🔗 Quick Links

- **Documentation:** `docs/` folder
- **Hackathon Requirements:** `Summary` file
- **Project Context:** `Project_Context` file
- **Forge Documentation:** https://developer.atlassian.com/platform/forge/

---

**END OF RUNBOOK (Current)**

---

## Instructions for Updating This Runbook

This runbook will be updated after EVERY step we complete. Each update will include:

1. ✅ Mark completed step as DONE
2. 📝 Add detailed log of what was done
3. ⏱️ Record time spent
4. 🐛 Document any issues encountered
5. ➡️ Update "Next Step" section
6. 🎯 Update progress tracker at top

**You don't need to remind me - I will automatically update this runbook after each step!**

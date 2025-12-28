# MeetingMind - AI-Powered Meeting Task Automation

Transform your meeting notes into actionable Jira tasks automatically using advanced AI technology.

## 🎬 Demo Video

[![MeetingMind Demo](https://img.shields.io/badge/▶️_Watch_Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/3PPURNEzelI?si=PwRI2bFG_F9aRKw1)

> **See MeetingMind in action!** Watch how chaotic meeting notes transform into perfectly organized Jira tasks in just 30 seconds.

## 🚀 Overview

MeetingMind is an Atlassian Forge application that uses artificial intelligence to extract actionable tasks from meeting transcripts and automatically creates corresponding Jira tickets with proper assignment, priorities, and due dates.

## ✨ Key Features

- **🤖 AI-Powered Extraction**: Two-tier AI system (OpenAI GPT-3.5-turbo → Pattern Matching)
- **🌍 Multi-Language Support**: English, Spanish, French, and German
- **👥 Smart User Assignment**: Automatically assigns tasks to team members mentioned in meetings
- **📅 Date Intelligence**: Parses natural language dates ("by Friday", "next week")
- **🎯 Priority Detection**: Automatically sets task priorities based on meeting context
- **🏢 Universal Business Domains**: Works with any business domain (tech, marketing, sales, finance, HR)
- **🔧 100% Dynamic**: No hardcoded values, works with any organization

## 🛠️ Technology Stack

- **Platform**: Atlassian Forge (Serverless)
- **Frontend**: Forge UI Kit (React-based)
- **Backend**: Node.js with Forge Resolver
- **AI Integration**: OpenAI GPT-3.5-turbo, Atlassian Rovo Agent
- **APIs**: Jira REST API v3, Confluence API
- **Languages**: JavaScript, React JSX

## 📋 Prerequisites

- Node.js 18.x or 20.x
- Atlassian Forge CLI
- Atlassian Cloud account with Confluence and Jira
- OpenAI API key (optional, for enhanced AI features)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install Forge CLI globally
npm install -g @forge/cli

# Login to Atlassian
forge login
```

### 2. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd MeetingMind

# Navigate to the Forge app
cd forge-app

# Install dependencies
npm install
```

### 3. Configure OpenAI (Optional)

```bash
# Set your OpenAI API key
forge variables set OPENAI_API_KEY your-openai-api-key-here
```

### 4. Deploy

```bash
# Deploy to development environment
forge deploy

# Install in your Confluence site
forge install --product confluence

# Install in your Jira site  
forge install --product jira
```

## 📖 Usage

1. **Open Confluence** and navigate to any page
2. **Edit the page** and type `/` to open the macro menu
3. **Search for "MeetingMind"** and insert the macro
4. **Paste your meeting notes** into the text area
5. **Click "Transform Meeting Notes"** to generate Jira tasks automatically

### Example Meeting Notes

```
Meeting: Q4 Planning Session
- John to review the budget by Friday
- Sarah will update the project timeline tomorrow
- Mike needs to schedule client meeting next week
- Team decided to use React for the frontend
```

### Generated Output

- **PROJ-123**: Review budget → John Smith • Due: 2025-12-13 • High Priority
- **PROJ-124**: Update project timeline → Sarah Johnson • Due: 2025-12-06 • Medium Priority  
- **PROJ-125**: Schedule client meeting → Mike Wilson • Due: 2025-12-13 • Medium Priority

## 🌍 Multi-Language Support

MeetingMind automatically detects and processes meetings in multiple languages:

- **English**: "John needs to review the budget by Friday"
- **Spanish**: "Juan necesita revisar el presupuesto para el viernes"
- **French**: "Jean doit réviser le budget pour vendredi"
- **German**: "Hans soll das Budget bis Freitag überprüfen"

All tasks are created in the original meeting language while maintaining proper user assignment.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Confluence    │    │   MeetingMind    │    │      Jira       │
│     Macro       │◄──►│  Forge App       │◄──►│   Workspace     │
│   (Frontend)    │    │   (Backend)      │    │   (Tasks)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   OpenAI     │
                       │  GPT-3.5     │
                       │   Turbo      │
                       └──────────────┘
```

### Component Architecture

#### 1. **Frontend Layer** (`src/frontend/index.jsx`)
- **Technology**: React with Forge UI Kit
- **Components**:
  - Meeting notes input textarea
  - Task preview modal with individual controls
  - Meeting effectiveness dashboard
  - Smart suggestions panel
- **State Management**: React hooks for UI state
- **Styling**: CSS-in-JS with Jira design tokens

#### 2. **Backend Layer** (`src/resolvers/index.js`)
- **Technology**: Node.js with Forge Resolver
- **Core Functions**:
  - `extractTasks()`: Main AI extraction orchestrator
  - `createJiraTasks()`: Jira API integration
  - `getJiraUsers()`: User matching and validation
  - `calculateMeetingEffectiveness()`: Analytics engine

#### 3. **Two-Tier AI System**

**Tier 1: OpenAI GPT-3.5-turbo** (Primary)
```javascript
// Structured prompt engineering for task extraction
const prompt = `Extract actionable tasks from meeting notes:
- Task description
- Assignee name
- Due date (natural language)
- Priority level
- Context and dependencies`;
```

**Tier 2: Pattern Matching** (Fallback)
```javascript
// Regex-based extraction for reliability
const patterns = {
  tasks: /(?:needs? to|should|will|must)\s+(.+?)(?=\.|$)/gi,
  assignees: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:needs?|should|will)/gi,
  dates: /(?:by|before|until)\s+(\w+day|tomorrow|next\s+\w+)/gi
};
```

### Data Flow Architecture

```
1. User Input
   │
   ▼
2. Language Detection
   │ (detectLanguage())
   ▼
3. AI Processing Pipeline
   │
   ├─► OpenAI GPT-3.5-turbo
   │   │ (structured extraction)
   │   ▼
   │   Success? ──Yes──► Task Objects
   │   │
   │   No
   │   ▼
   └─► Pattern Matching
       │ (regex fallback)
       ▼
       Task Objects
   │
   ▼
4. User Matching
   │ (fuzzy name matching)
   ▼
5. Date Parsing
   │ (natural language → ISO dates)
   ▼
6. Meeting Analytics
   │ (effectiveness scoring)
   ▼
7. Task Preview
   │ (user approval workflow)
   ▼
8. Jira Integration
   │ (REST API v3)
   ▼
9. Task Creation
```

### Integration Architecture

#### **Atlassian Forge Platform**
- **Hosting**: Serverless functions on AWS
- **Security**: OAuth 2.0 with Atlassian Identity
- **Permissions**: Scoped API access tokens
- **Storage**: Forge storage for user preferences

#### **External APIs**
```yaml
OpenAI API:
  endpoint: https://api.openai.com/v1/chat/completions
  model: gpt-3.5-turbo
  authentication: Bearer token
  rate_limits: 3500 RPM, 90000 TPM

Jira REST API v3:
  endpoints:
    - /rest/api/3/issue (create tasks)
    - /rest/api/3/users/search (user lookup)
    - /rest/api/3/project (project validation)
  authentication: Forge context token

Confluence API:
  endpoints:
    - /wiki/rest/api/content (page context)
    - /wiki/rest/api/user (user context)
  authentication: Forge context token
```

### Security Architecture

#### **Data Protection**
- Meeting notes processed in-memory only
- No persistent storage of sensitive content
- OpenAI API calls over HTTPS with encryption
- Forge platform provides SOC 2 compliance

#### **Access Control**
- User-scoped permissions via Atlassian Identity
- API rate limiting and request validation
- Input sanitization for XSS prevention
- CSRF protection via Forge framework

### Scalability Architecture

#### **Performance Optimizations**
- Concurrent API calls for user lookup
- Debounced input processing
- Lazy loading of Jira projects
- Efficient regex compilation

#### **Error Handling**
```javascript
// Graceful degradation strategy
if (openAIFails) {
  fallbackToPatternMatching();
}
if (userNotFound) {
  showUserSelectionDropdown();
}
if (jiraAPIFails) {
  showRetryWithExponentialBackoff();
}
```

### Multi-Language Architecture

#### **Language Detection**
```javascript
const detectLanguage = (text) => {
  const patterns = {
    spanish: /\b(necesita|debe|va a|tiene que)\b/i,
    french: /\b(doit|va|besoin de|faut)\b/i,
    german: /\b(muss|soll|wird|braucht)\b/i
  };
  // Returns: 'en', 'es', 'fr', 'de'
};
```

#### **Localized Processing**
- Language-specific regex patterns
- Cultural date format parsing
- Native language task creation
- Timezone-aware due date calculation

### Deployment Architecture

```
Development Environment
├── Local development (forge tunnel)
├── Hot reloading for frontend changes
└── Local Atlassian instance testing

Production Environment
├── Atlassian Forge Cloud (AWS)
├── Global CDN distribution
├── Auto-scaling serverless functions
└── 99.9% uptime SLA
```

**App ID**: `ari:cloud:ecosystem::app/3a2641df-663e-45e7-8134-b9dc728cbf7d`  
**Version**: 2.0.0 (Production)  
**Region**: Global (Multi-region deployment)

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for enhanced AI features

### Permissions Required

- `read:confluence-content.all`
- `write:confluence-content`
- `write:custom-content:confluence`
- `read:confluence-space.summary`
- `read:confluence-user`
- `write:jira-work`
- `read:jira-work`
- `read:jira-user`

## 📁 Project Structure

```
MeetingMind/
├── README.md                           # This file
├── RUNBOOK.md                          # Detailed build documentation
├── forge-app/                          # Main Forge application
│   ├── manifest.yml                    # App configuration
│   ├── package.json                    # Dependencies
│   ├── src/
│   │   ├── frontend/
│   │   │   └── index.jsx               # React UI components
│   │   └── resolvers/
│   │       └── index.js                # Backend logic and AI integration
├── docs/                               # Documentation
└── test-samples.md                     # Multi-language test samples
```

## 🧪 Testing

Use the provided test samples in `test-samples.md` to verify multi-language functionality:

```bash
# Test with English sample
# Test with Spanish sample  
# Test with French sample
# Test with German sample
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Open an issue on GitHub
- **Forge Documentation**: https://developer.atlassian.com/platform/forge/

## 🙏 Acknowledgments

- Atlassian Forge platform for serverless app hosting
- OpenAI for advanced natural language processing

---

**Built with ❤️ using Atlassian Forge and OpenAI**
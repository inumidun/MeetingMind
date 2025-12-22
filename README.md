# MeetingMind - AI-Powered Meeting Task Automation

Transform your meeting notes into actionable Jira tasks automatically using advanced AI technology.

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

## 🏗️ Architecture

### Two-Tier AI System

1. **OpenAI GPT-3.5-turbo** (Primary): Advanced natural language understanding
2. **Pattern Matching** (Fallback): Deterministic extraction that always works

### Data Flow

```
Meeting Notes → Language Detection → AI Extraction → User Matching → Jira Task Creation
```

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
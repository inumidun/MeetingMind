# Architecture Overview

MeetingMind is an Atlassian Forge app with a Forge UI frontend and a resolver-based backend.

## Flow

1. A user opens the Confluence macro and pastes meeting notes.
2. The frontend invokes Forge resolvers.
3. The backend detects language, extracts tasks, and enriches them.
4. Jira users are queried for assignee matching.
5. Approved tasks are created in Jira through Forge-authenticated API calls.

## Main Components

- `forge-app/src/frontend/index.jsx`: user input, previews, review flows, and dashboard surfaces
- `forge-app/src/resolvers/index.js`: task extraction, date parsing, issue creation, and analytics logic
- `forge-app/manifest.yml`: scopes, module registration, runtime, and external fetch permissions

## AI Strategy

- Primary path: OpenAI chat completions for richer extraction
- Fallback path: rule-based pattern extraction when the AI path fails or is unavailable

## Security Model

- Atlassian Forge handles app hosting and scoped platform access
- OpenAI access is expected through `OPENAI_API_KEY` stored in Forge variables
- No repository-stored credentials are required for normal development

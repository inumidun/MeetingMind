# MeetingMind Forge App

This directory contains the deployable Atlassian Forge application for MeetingMind.

## Commands

```bash
npm install
npm run lint
npm run deploy
npm run install:confluence
npm run install:jira
```

## Configuration

Set secrets through Forge variables instead of committing local config files:

```bash
forge variables set OPENAI_API_KEY your-api-key
```

## Structure

- `manifest.yml`: Forge modules, permissions, and runtime settings
- `src/frontend/index.jsx`: Forge UI frontend
- `src/resolvers/index.js`: extraction, Jira integration, and backend logic
- `src/locales/`: UI strings
- `src/utils/i18n.js`: localization helpers

## More Context

Project-level documentation lives in the repository root under [`docs/`](../docs/README.md).

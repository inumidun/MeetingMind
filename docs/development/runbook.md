# Development Runbook

## Prerequisites

- Node.js 18+ or 20+
- Atlassian Forge CLI
- Access to an Atlassian Cloud site with Jira and Confluence

## Local Setup

```bash
cd forge-app
npm install
forge login
forge variables set OPENAI_API_KEY your-api-key
```

## Common Commands

```bash
npm run lint
forge deploy
forge install --product confluence
forge install --product jira
forge tunnel
```

## Development Notes

- The app expects OpenAI credentials through Forge hosted variables.
- Pattern-based extraction exists as a fallback when the OpenAI path is unavailable.
- Keep portfolio-facing docs in `docs/` and local-only notes in `docs/private/`.

## Release Hygiene

Before pushing public changes:

1. Run `npm run lint` inside `forge-app`.
2. Check that no secrets or local environment files are staged.
3. Keep root documentation current with actual product behavior.
4. Archive one-off hackathon collateral under `docs/archive/` instead of leaving it at repo root.

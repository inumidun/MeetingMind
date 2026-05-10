# MeetingMind

MeetingMind is an Atlassian Forge app that turns meeting notes into structured Jira work items. It was originally built during a hackathon and has since been cleaned up into a public portfolio repository with clearer documentation, safer configuration practices, and a more professional layout.

## What It Does

- Extracts action items from meeting notes
- Maps mentioned people to Jira users when possible
- Parses relative deadlines into Jira-ready dates
- Creates richer Jira issue descriptions with scope and acceptance criteria
- Supports English, Spanish, French, and German workflows

## Repository Layout

```text
.
├── docs/                     # Product, development, legal, and archive docs
├── forge-app/                # Atlassian Forge application
├── LICENSE
└── README.md
```

## Quick Start

1. Install the Forge CLI and authenticate with Atlassian.
2. Change into `forge-app/`.
3. Run `npm install`.
4. Set `OPENAI_API_KEY` with Forge variables if you want AI extraction enabled.
5. Run `forge deploy`.
6. Install the app into Confluence and Jira with the Forge CLI.

```bash
cd forge-app
npm install
forge variables set OPENAI_API_KEY your-api-key
forge deploy
forge install --product confluence
forge install --product jira
```

## Security Notes

- Secrets are expected to live in Forge environment variables, not in source control.
- A repository scan during this cleanup found no obvious committed API keys or private credentials.
- Public docs now live under `docs/`; `docs/private/` is reserved for local-only material and is gitignored.

## Documentation

- [Documentation Index](docs/README.md)
- [Architecture Overview](docs/architecture.md)
- [Development Runbook](docs/development/runbook.md)
- [Test Samples](docs/reference/test-samples.md)
- [Privacy Policy](docs/legal/privacy-policy.md)
- [Terms of Service](docs/legal/terms-of-service.md)
- [Security Policy](SECURITY.md)

## Status

This repo is best viewed as a polished portfolio project rather than a production SaaS product. The current codebase is deployable, but some hackathon-era implementation choices still exist and should be treated as follow-up hardening work if you decide to keep investing in it.

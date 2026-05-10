# Security Policy

## Secrets

- Do not commit API keys, tokens, `.env` files, or local credential exports.
- For OpenAI access, use Forge hosted variables:

```bash
forge variables set OPENAI_API_KEY your-api-key
```

## Reporting

If you find a security issue in this repository, report it privately to the repository owner instead of opening a public issue with exploit details.

## Scope

This repository is a public portfolio project. Security hygiene is still expected, but it should not be treated as a managed production service with formal SLAs.

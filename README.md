# Circumpolar.ai

Arctic intelligence platform. Users pin any location above 60°N on a map and ask Circe — an AI assistant — plain-language questions. She answers with data-backed responses drawn from public Arctic datasets.

**Status: MVP built, not yet deployed.**

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styles:** Tailwind CSS — custom Arctic dark theme
- **Map:** Mapbox GL JS — globe projection, click to pin
- **AI:** Claude claude-sonnet-4-6 via Anthropic SDK, streamed SSE
- **Auth:** NextAuth v5 (Google + GitHub)
- **Email:** Resend (proposal acceptance notifications)

## Running Locally

```bash
npm install
cp .env.example .env.local   # fill in real keys
npm run dev
```

App runs at http://localhost:3000. If `NEXT_PUBLIC_MAPBOX_TOKEN` is absent the map shows a fallback — auth and chat still work.

## Environment Variables

See `.env.example` for the full list. Key vars: `NEXT_PUBLIC_MAPBOX_TOKEN`, `ANTHROPIC_API_KEY`, `AUTH_SECRET`, `AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET`, `RESEND_API_KEY`.

## Deployment

Not yet deployed. Vercel is the target — `vercel.json` is already in place. Set all env vars from `.env.example` and update OAuth callback URLs to the production domain.

## Architecture

See `CLAUDE.md` for the full file map and internal docs, and `docs/decisions/2026-03-30-circumpolar-architecture.md` for the ADR.

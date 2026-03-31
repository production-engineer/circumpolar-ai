# Circumpolar.ai

Arctic intelligence platform. Users pin any location above 60°N on a map and ask an AI assistant (Circe) plain-language questions. She answers with data-backed responses drawn from 8 free public Arctic datasets.

**Status: MVP built, not yet deployed.**

ADR: `docs/decisions/2026-03-30-circumpolar-architecture.md` — read this before making significant decisions.

---

## What this is

A conversion-focused landing page that *is* the product demo. The goal is early-adopter signups from six Arctic industries (infrastructure, shipping, insurance, telecom, research, government). The map picker and AI chat are live on the landing page so visitors experience the product before filling a form.

This is not a ThawRisk feature. It's a separate product that may eventually absorb ThawRisk or run alongside it.

---

## Repo and Stack

- **Repo:** https://github.com/production-engineer/circumpolar-ai
- **Framework:** Next.js 14 (App Router), TypeScript
- **Styles:** Tailwind CSS with a custom Arctic dark theme (`tailwind.config.ts`)
- **Map:** Mapbox GL JS via react-map-gl — globe projection, crosshair click to pin
- **AI:** Claude claude-sonnet-4-6 via `@anthropic-ai/sdk`, streamed SSE from `/api/chat`
- **Mascot:** Circe the polar bear (🐻‍❄️) — QPA-inspired chat widget, bottom-right fixed

---

## File Map

```
app/
  page.tsx              Landing page (hero, industries, data sources, blog, CTA form)
  layout.tsx            HTML shell, metadata
  globals.css           Tailwind base + custom utilities + Mapbox overrides
  api/chat/route.ts     Streaming Claude API endpoint — edit system prompt here
  blog/
    page.tsx            Blog listing
    [slug]/page.tsx     Blog post (static, links back to map tool)

components/
  Nav.tsx               Top nav (pill style, mobile menu)
  HeroMap.tsx           Client wrapper: mounts MapPicker + CirceChat together
  MapPicker.tsx         Mapbox map — click to pin, reverse geocodes via Mapbox API
  CirceChat.tsx         Circe chat widget — streaming messages, suggested questions

lib/
  blog-posts.ts         5 static blog posts (expand here, no CMS yet)

docs/
  decisions/
    2026-03-30-circumpolar-architecture.md   ← The ADR. Read it.
```

---

## Environment Variables

Create `.env.local` (never commit it):

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

- **Mapbox token:** https://account.mapbox.com — free tier is fine (50k loads/month)
- **Anthropic key:** https://console.anthropic.com

If `NEXT_PUBLIC_MAPBOX_TOKEN` is absent, the map shows a fallback message. The rest of the page still renders.

---

## Running Locally

```bash
cd /Users/erikwilliams/repos/circumpolar.ai
npm install
cp .env.example .env.local   # then fill in real keys
npm run dev
```

App runs at http://localhost:3000.

---

## Deployment

Not yet deployed. Platform is unspecified — the app is standard Next.js with no platform-specific APIs. Any host that runs Node 20+ works (Vercel, Fly.io, Railway, Render, etc.).

Required env vars on the host: `NEXT_PUBLIC_MAPBOX_TOKEN`, `ANTHROPIC_API_KEY`.

---

## Things That Need Doing Before Go-Live

1. **Deploy** — pick a host and set env vars
2. **Formspree form ID** — replace `f/circumpolar` in `app/page.tsx` (line ~241) with a real ID from formspree.io
3. **Domain** — point circumpolar.ai at the deployment (DNS)

---

## Next Features (in priority order)

See the ADR roadmap section for full context. Short version:

1. Analytics (Plausible or PostHog) — instrument map pins and chat session starts
2. Live weather via MET Norway `locationforecast/2.0` — add tool use to `/api/chat/route.ts`
3. Live sea ice via NSIDC MASIE — nearest Arctic sub-region extent
4. Cellular overlay — OpenCelliD tile layer toggle on the Mapbox map
5. Auth + saved sessions
6. PDF report export

---

## Working in This Repo

- Default branch: `main`
- No worktree setup yet — create one when starting a new feature: `git worktree add ../circumpolar-<feature> -b <feature>`
- No CI yet — run `npm run build` before pushing to catch type errors
- No test suite yet — add Vitest when the first testable logic appears
- Follow the root workspace `CLAUDE.md` for general workflow rules

---

## Circe's Personality

Circe is direct, warm, and specific. She does not hedge with "I'm just an AI" disclaimers. She gives numbers, ranges, and risk ratings. She names her data sources. She keeps answers under 200 words unless asked for more. Edit the system prompt in `app/api/chat/route.ts` to adjust her behavior.

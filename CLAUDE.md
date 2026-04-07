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
  page.tsx                          Landing page (hero, industries, data sources, blog, CTA form)
  layout.tsx                        HTML shell, metadata
  globals.css                       Tailwind base + custom utilities + Mapbox overrides
  api/
    auth/[...nextauth]/route.ts     NextAuth v5 handler (Google + GitHub)
    proposals/[id]/accept/route.ts  POST — record acceptance, send email via Resend
  blog/
    page.tsx                        Blog listing
    [slug]/page.tsx                 Blog post
  proposals/
    [id]/page.tsx                   Proposal viewer + accept panel
  signin/
    page.tsx                        Sign-in page (Google + GitHub buttons)

auth.ts                             NextAuth v5 config — providers, session callback
middleware.ts                       (future) protect admin routes

components/
  Nav.tsx               Top nav (pill style, mobile menu)
  HeroMap.tsx           Client wrapper: mounts MapPicker + CirceChat together
  MapPicker.tsx         Mapbox map — click to pin, reverse geocodes via Mapbox API
  CirceChat.tsx         Circe chat widget — streaming messages, suggested questions
  AcceptProposal.tsx    Client component — sign-in gate + acceptance form
  SessionProvider.tsx   Thin wrapper around NextAuth SessionProvider

lib/
  blog-posts.ts         5 static blog posts (expand here, no CMS yet)
  proposals.ts          Proposal data + getProposal() / listProposals()

proposals/
  fde-beadedstream-2026-04.html     Printable PDF version of the FDE proposal

public/
  roi-calculator.html               ThawRisk permafrost monitoring ROI calculator (standalone HTML tool)
  signup-sheet.gs                   Google Apps Script — paste into a Sheet to capture ROI tool sign-ups + email erik@beaded.cloud

docs/
  decisions/
    2026-03-30-circumpolar-architecture.md   ← The ADR. Read it.
```

---

## Environment Variables

Create `.env.local` (never commit it — copy from `.env.example`):

```
NEXT_PUBLIC_MAPBOX_TOKEN=   # https://account.mapbox.com
ANTHROPIC_API_KEY=          # https://console.anthropic.com
AUTH_SECRET=                # npx node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_GITHUB_ID=             # https://github.com/settings/developers
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=             # https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_SECRET=
RESEND_API_KEY=             # https://resend.com/api-keys (optional — emails won't send without it)
```

OAuth callback URLs for local dev:
- GitHub: `http://localhost:3000/api/auth/callback/github`
- Google: `http://localhost:3000/api/auth/callback/google`

If `NEXT_PUBLIC_MAPBOX_TOKEN` is absent, the map shows a fallback. Auth works without Resend — acceptance emails are just skipped.

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

Not yet deployed. This is a server-rendered Next.js app (no longer static export). Vercel is the natural choice — the `vercel.json` is already in place.

Required env vars on the host: all vars from `.env.example`. Update OAuth callback URLs to the production domain.

**Was:** GitHub Pages static export (`output: "export"`). Removed to support auth + API routes.

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

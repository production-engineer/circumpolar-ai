# ADR: Circumpolar.ai — Initial Architecture

## ADR Author/s

Erik Williams

## Update Date

2026-03-30

## Status

Accepted

## Who should be notified of ADR changes?

@production-engineer

---

## Context

The ThawRisk product (permafrost risk scoring for Arctic asset managers and underwriters) surfaced a broader opportunity: many industries operating above 60°N are data-starved. They ask questions that have public answers — but those answers are scattered across NSIDC, Copernicus, MET Norway, USGS, ArcticDEM, and other sources that require GIS expertise to use.

The hypothesis: a product that aggregates those sources behind a map-first, AI-chat interface could serve six distinct Arctic industries (infrastructure, shipping, insurance, telecom, research, government) without custom integrations for each. This product is Circumpolar.ai.

Circumpolar is conceived as a **toolbox and question-answering service** rather than a dashboard. Users pin a location, ask a plain-language question, and get a data-backed answer. The primary goal for this phase is validation: get a conversion-capable landing page with a working demo in front of early adopters and collect signups.

---

## Options Considered

### Option 1: Static landing page + waitlist only

Build a clean marketing site, no interactive demo, collect emails.

- **Pros:** Ships in hours; zero API cost; no secrets to manage
- **Cons:** No differentiation; visitors can't feel the product; low conversion signal quality; someone else ships the demo first

### Option 2: Interactive map + AI chat on the landing page (chosen)

Ship the full demo experience as the landing page. Pin a location → ask Circe anything → get a streaming answer from Claude API with Arctic context.

- **Pros:** Product-led conversion (visitors experience value before they fill a form); high-quality signal on which locations and questions matter; differentiates immediately; reusable as the actual product when ready to productize
- **Cons:** Requires Mapbox token + Anthropic API key; streaming API calls cost money; more complex to deploy than a static site

### Option 3: Full SaaS with auth, user accounts, saved sessions

Build the complete platform before launch.

- **Pros:** Closer to the end state
- **Cons:** Months of work before anyone sees it; we don't know what users actually want yet; premature

**Decision: Option 2.** The interactive demo is itself the conversion mechanism. A visitor who has already asked Circe a question about their project site is far more likely to submit an access request than one who has only read bullet points.

---

## Architecture Decisions

### 1. Framework: Next.js 14 (App Router)

**Why:** Server components let us keep the Anthropic API key server-side while streaming responses to the client. The App Router's streaming support (`ReadableStream` in route handlers) is exactly what we need for the AI chat. Vercel-native but not Vercel-locked — deploys anywhere that runs Node.

**Alternatives considered:** Remix (streaming parity but smaller ecosystem for Mapbox), SvelteKit (smaller AI SDK ecosystem), plain React + Express (more wiring for no benefit).

### 2. Map: Mapbox GL JS via react-map-gl

**Why:** Globe projection with a custom `fog` layer gives the Arctic the visual weight it deserves. Mapbox's dark-v11 basemap is the closest match to the Arctic aesthetic. react-map-gl provides a React wrapper with SSR safety via `dynamic()` import. The geocoding reverse-lookup (lat/lon → place name) is a free Mapbox API call.

**Alternatives considered:** Google Maps (no globe projection, higher cost); MapLibre + OpenMapTiles (open source, but tile hosting overhead and no managed geocoding); Leaflet (2D only, not suitable for polar views).

**Constraint:** Requires `NEXT_PUBLIC_MAPBOX_TOKEN`. Free tier is sufficient for an MVP (50k loads/month). If the token is absent, the map renders a fallback message — the app does not crash.

### 3. AI: Claude claude-sonnet-4-6 via Anthropic SDK, streaming SSE

**Why:** claude-sonnet-4-6 has strong Arctic domain knowledge and follows structured system prompts reliably. The streaming route (`/api/chat`) uses `anthropic.messages.stream()` and emits SSE `data:` lines, which the client reads with a `ReadableStream` reader. `max_tokens: 512` keeps costs predictable and responses appropriately terse.

**System prompt design:** Circe's prompt covers 8 data domains (permafrost, sea ice, weather, cellular, terrain, infrastructure risk, ecology, logistics) and is injected with the pinned lat/lon on every request. This means the model is always grounded to a specific location without requiring function calling or tool use in the MVP — the model draws on training knowledge plus the prompt context.

**Future:** When real-time data matters (e.g., current sea ice extent), the API route will add tool use to call MET Norway, NSIDC, or Open-Meteo and inject the response into the context before the model replies. The route signature is already structured to support this.

### 4. AI Mascot: Circe (🐻‍❄️)

**Why a mascot:** QPA (quayside.app's duck) demonstrated that a named character dramatically increases engagement with an AI assistant. Circe is a polar bear, pinned bottom-right, opens a chat panel on click. The name is memorable and short. Implementation mirrors QPA's pattern: fixed positioning, click toggle, modal-like panel, typing indicator.

**Design:** The mascot animates (`animate-bounce`) when a location is pinned but the chat is closed — a visual cue that she has something to say. Suggested questions are shown after the first message so users aren't staring at a blank input.

### 5. Data Sources: 8 free public APIs

All data sources used are free, open, and require no commercial agreement:

| Source | Data | Auth |
|---|---|---|
| NSIDC | Sea ice extent, permafrost maps | NASA Earthdata login (free) |
| Copernicus / ESA | Sentinel-1 SAR, Sentinel-2 optical, sea ice | Free account |
| ArcticDEM (PGC) | 2m elevation, full Arctic | None |
| MET Norway | Arctic weather (Arome Arctic model) | None (User-Agent required) |
| OpenCelliD | Cell tower locations + signal | Free API key |
| EMODnet | Arctic bathymetry (Barents/Norwegian seas) | None |
| USGS | Alaska terrain, water data | None |
| GTN-P | Permafrost borehole temperatures | None |

In the MVP, Circe draws on Claude's training knowledge of these datasets rather than making live API calls. Live integration is the next milestone (see Roadmap below).

### 6. Conversion Design

The landing page follows research-backed B2B data product conversion patterns:

- **Hero with live demo** — visitors interact with the product before any CTA
- **Single primary CTA** repeated 3× (hero, footer, CTA section): "Get Early Access"
- **Trust strip** of data source logos immediately below the hero
- **Benefit copy** over feature copy: "Not a dashboard. A toolbox."
- **Lead form** collects: name, email, company, role, optional use-case description (≤5 fields for volume; role field self-qualifies)
- **Form action** points to Formspree — swap `circumpolar` slug for a real form ID

### 7. Deployment: TBD

The app builds to a standard Next.js output and can be deployed on any platform that supports Node.js 20+. No platform-specific APIs are used. `vercel.json` is included for convenience but is not required. Candidate platforms: Vercel, Fly.io, Railway, Render, self-hosted.

**Required environment variables:**
```
NEXT_PUBLIC_MAPBOX_TOKEN   # Mapbox public token (pk.*)
ANTHROPIC_API_KEY          # Anthropic secret key (sk-ant-*)
```

---

## Consequences

### Positive

- The demo-as-landing-page pattern means conversion signals are high-quality: we learn which locations, industries, and questions matter before building anything else
- All data sources are free — zero marginal cost per user until we add live API calls
- Claude's domain knowledge makes the MVP useful without a data pipeline
- The codebase is small (<500 lines of application code) and easy to extend
- No auth, no database, no migrations — nothing to break

### Negative

- Circe's answers are only as good as Claude's training data for specific locations; gaps will appear for obscure sites
- Without live API calls, answers may be out of date for fast-changing data (sea ice extent, weather)
- Mapbox has usage costs at scale (beyond 50k loads/month on free tier)
- The Formspree endpoint needs to be replaced with a real form ID before the site goes live
- No analytics instrumentation yet — we won't know which industries or questions are most popular until we add it

---

## Roadmap (ordered by priority)

1. **Deploy** — Pick a host, set env vars, go live. See `CLAUDE.md` for current state.
2. **Wire up Formspree** — Replace `f/circumpolar` in `app/page.tsx:241` with a real form ID.
3. **Add analytics** — Plausible or PostHog; instrument map pin events and chat session starts.
4. **Live data: weather** — Tool use in `/api/chat/route.ts` calling MET Norway `locationforecast/2.0`.
5. **Live data: sea ice** — NSIDC MASIE extent for the nearest Arctic sub-region.
6. **Cellular overlay** — OpenCelliD tile layer on the Mapbox map (toggle button).
7. **Auth + saved sessions** — When users return, Circe remembers their pinned locations.
8. **Report export** — PDF summary of Circe's answers for a given location.

---

## Spec

No separate spec exists for the initial build — the ADR and `CLAUDE.md` together constitute the working record.

## References

- GitHub repo: https://github.com/production-engineer/circumpolar-ai
- QPA implementation (inspiration for Circe): `/Users/erikwilliams/repos/quayside/app/templates/duckFeedBackModal.html`
- ThawRisk project context: `/Users/erikwilliams/.claude/projects/-Users-erikwilliams-repos/memory/project_thawrisk.md`
- MET Norway API: https://api.met.no/weatherapi/locationforecast/2.0/
- NSIDC MASIE: https://nsidc.org/data/G02186
- ArcticDEM STAC: https://stac.pgc.umn.edu/api/v1/
- OpenCelliD API: https://wiki.opencellid.org/wiki/API

## Consensus

Erik Williams

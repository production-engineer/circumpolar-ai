# Circumpolar.ai

Arctic intelligence platform. Pin any location, ask Circe (🐻‍❄️) plain-language questions, get data-backed answers.

**Live:** [circumpolar.ai](https://circumpolar.ai)

## What it does

- **Map** — click anywhere to pin a location; reverse-geocodes via Mapbox
- **Circe chat** — streaming AI assistant backed by Claude claude-sonnet-4-6
- **Field install planner** — ask "When should I plan my field install here?" and get a Go/Caution/Risky day-by-day forecast for your install window, shareable via link

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Mapbox GL JS · Claude claude-sonnet-4-6 · OpenWeather One Call API 3.0

## Running locally

```bash
cp .env.example .env.local   # fill in real keys
npm install
npm run dev                  # http://localhost:3000
```

Required env vars: `NEXT_PUBLIC_MAPBOX_TOKEN`, `ANTHROPIC_API_KEY`, `OPENWEATHER_API_KEY`, `NEXT_PUBLIC_BASE_URL`

## Tests

```bash
npm test
```

47 unit tests covering weather rating logic, input validation, and forecast summarization.

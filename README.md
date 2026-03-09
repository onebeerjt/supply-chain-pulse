# Supply Chain Pulse

**Live global logistics intelligence.**

Supply Chain Pulse is a public, map-first logistics intelligence MVP that combines live AIS vessel movement, density-based port congestion signals, disruption alerts, weather risk, webcams, and daily brief generation in one terminal-style dashboard.

## Screenshots

- `docs/screenshot-home.png` (placeholder)
- `docs/screenshot-ports.png` (placeholder)
- `docs/screenshot-alerts.png` (placeholder)

## Features

- Live ship map backed by AISStream WebSocket ingest
- Server-side vessel cache (rolling 10 minutes) exposed via `/api/vessels`
- Density-based congestion estimation around 6 major hubs:
  - Los Angeles
  - Long Beach
  - Rotterdam
  - Shanghai
  - Singapore
  - Panama Canal
- Congestion status heuristics from vessel counts within ~25km radius:
  - `0-10`: Normal
  - `10-25`: Elevated
  - `25+`: Severe
- Webcam cards with embeddable iframe mode and safe preview-card fallback
- Weather disruption module with logistics-impact text
- Daily Brief module:
  - LLM mode with `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
  - deterministic template fallback if keys are missing

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- React Server Components + client islands
- Leaflet + React Leaflet
- Recharts
- Lucide icons
- Zod
- `ws` for AISStream server-side WebSocket ingest

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Build and run production locally:

```bash
npm run build
npm run start
```

## Environment Variables

```bash
AISSTREAM_API_KEY=
OPENWEATHER_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

### AISSTREAM_API_KEY

1. Create an account at [aisstream.io](https://aisstream.io/)
2. Generate an API key
3. Add it to `.env.local` as `AISSTREAM_API_KEY`

This key is used only on the server and is never exposed to the browser.

## Vessel Tracking Architecture

- Server-side module establishes a WebSocket connection to AISStream.
- Incoming position reports are normalized to:

```ts
{
  id: string
  mmsi: number
  lat: number
  lon: number
  speed?: number
  course?: number
  updatedAt: string
}
```

- In-memory cache keeps only vessels updated in the last ~10 minutes.
- `/api/vessels` returns normalized JSON from cache.
- Browser map polls `/api/vessels`; no client-side WebSocket is opened.

## Fallback Behavior

- If `AISSTREAM_API_KEY` is missing: vessel module shows `Live vessel feed unavailable`.
- If AIS connection errors or is still warming up: fallback vessel sample is used temporarily.
- Weather and brief modules also degrade gracefully when optional keys are missing.

## Routes

- `/` dashboard
- `/ports` all ports overview
- `/ports/[slug]` port detail
- `/alerts` disruption + weather feed
- `/about` product explanation

API routes:

- `/api/vessels`
- `/api/ports`
- `/api/ports/[slug]`
- `/api/congestion`
- `/api/weather-alerts`
- `/api/webcams`
- `/api/daily-brief`
- `/api/disruptions`

## Repo Structure Overview

```text
app/
  api/
  alerts/
  about/
  ports/
components/
  dashboard/
  maps/
  ui/
lib/
  data/
  providers/
  types/
  utils/
public/
```

## GitHub + Vercel

1. Push to GitHub.
2. Import repo in Vercel.
3. Set env vars in Vercel project settings (especially `AISSTREAM_API_KEY`).
4. Deploy.

No database setup is required.

## Why This Is Different From Enterprise Logistics Software

- Public-facing and instantly accessible
- Map-first visual intelligence, not workflow-heavy back-office UX
- Combines webcams + weather + congestion + summary in one surface
- Lightweight and fast for operators, brokers, investors, and curious users

## Future Improvements

- Persisted time-series history for true congestion trend analytics
- Per-lane ETA and anomaly detection models
- Multi-provider AIS failover
- Alert subscriptions and watchlists

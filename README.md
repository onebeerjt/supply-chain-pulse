# Supply Chain Pulse

**Live global logistics intelligence.**

Supply Chain Pulse is a public, map-first logistics intelligence MVP that combines vessel movement, port congestion, disruption alerts, weather risk, webcams, and AI-generated daily briefings in one fast terminal-style dashboard.

## Screenshots

- `docs/screenshot-home.png` (placeholder)
- `docs/screenshot-ports.png` (placeholder)
- `docs/screenshot-alerts.png` (placeholder)

## Features

- Live ship map with key maritime zones and trade lane overlays
- Clickable vessel markers with ETA, lane, speed, and destination context
- Port congestion ranking with sortable metrics and mini trends
- Port detail pages with local map, weather risk, webcam links, and AI brief context
- Live port webcam cards with embeddable/official-link safe fallback handling
- Weather disruption alerts with logistics impact language
- Daily Brief module with:
  - LLM mode when `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set
  - deterministic template mode when keys are missing
- Disruption ticker and route-level alerts
- Demo/sample mode badges when live feeds are unavailable

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- React Server Components + client islands
- Leaflet + React Leaflet
- Recharts
- Lucide icons
- Zod

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

All env vars are optional for local/dev/demo usage.

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=
OPENWEATHER_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
VESSEL_API_KEY=
PORT_DATA_API_KEY=
```

## Mock vs Live Data Mode

Provider adapters in `lib/providers` choose mode per feed:

- `live` mode: corresponding API key exists
- `sample` mode: key missing or live call unavailable

The app is designed to remain fully functional with zero keys. UI badges clearly indicate demo/sample mode.

## Routes

- `/` dashboard
- `/ports` all ports overview
- `/ports/[slug]` port detail
- `/alerts` disruption + weather feed
- `/about` product explanation

API routes:

- `/api/ports`
- `/api/ports/[slug]`
- `/api/vessels`
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

## GitHub Setup

Recommended new repository: `github.com/onebeerjt/supply-chain-pulse`

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: Supply Chain Pulse MVP"
```

With GitHub CLI:

```bash
gh repo create onebeerjt/supply-chain-pulse --public --source=. --remote=origin --push
```

Without GitHub CLI:

1. Create a new empty GitHub repo named `supply-chain-pulse`.
2. Then run:

```bash
git remote add origin git@github.com:onebeerjt/supply-chain-pulse.git
git push -u origin main
```

## Vercel Deployment

1. Push repository to GitHub.
2. In Vercel, click **Add New Project** and import this repo.
3. Add any optional env vars in Project Settings > Environment Variables.
4. Deploy.

No database setup is required. API routes are serverless-compatible.

## Why This Is Different From Enterprise Logistics Software

- Public-facing and instantly accessible
- Map-first visual intelligence, not workflow-heavy back-office UX
- Combines webcams + weather + congestion + summaries in one terminal-style surface
- Lightweight and fast for operators, brokers, investors, and curious users

## Future Improvements

- Real AIS/terminal data connectors with provider failover
- Historical playback and congestion regime shifts
- Lane-level predictive ETA and disruption probability
- User watchlists and notification subscriptions
- Time-series warehouse for deeper analytics

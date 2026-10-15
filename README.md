<p align="center">
  <img src="docs/banner.svg" alt="JalDrishti — Amritsar Urban Flood Warning System" width="100%"/>
</p>

<p align="center">
  <a href="https://github.com/vishalvc950/amritsar-jaldrishti/actions/workflows/deploy.yml"><img src="https://github.com/vishalvc950/amritsar-jaldrishti/actions/workflows/deploy.yml/badge.svg" alt="Deploy status"/></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT licence"/>
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178c6.svg" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF.svg" alt="Vite"/>
  <img src="https://img.shields.io/badge/data-Open--Meteo%20·%20OSM%20·%20RainViewer-15803d.svg" alt="Open data sources"/>
</p>

**Live demo:** <https://vishalvc950.github.io/amritsar-jaldrishti/>

A single-page flood early-warning dashboard for Amritsar. Every number on screen is fetched live in the visitor's browser from open APIs — Open-Meteo forecasts, IMD colour-code thresholds, OpenStreetMap geometry and RainViewer radar. Nothing is mocked; if a source is unreachable the UI shows "—", not sample data.

Built for judges who open the network tab: one client-side app, no backend, no API keys, no fabricated figures.

---

## Why

Amritsar's urban flooding is hyperlocal — a cloudburst that floods one ward can leave the next dry. Official bulletins are city-scale and lag behind. JalDrishti turns open rainfall forecasts into **ward-level risk circles** using the same colour thresholds IMD issues to the public, so a resident can see in five seconds whether the next 24 hours are green, yellow, orange or red *for their point on the map*.

## Features

- **Live district status** — next-6 h / next-24 h rainfall totals colour-coded with IMD warning thresholds (yellow > 64.4 mm, orange > 115.5 mm, red > 204.4 mm per 24 h)
- **10 flood-sensitive monitoring points** — each with its own live forecast and clickable risk circle
- **Interactive Leaflet map** — OpenStreetMap street/light basemaps, canal & drain polylines from the OSM Overpass API, landmark pins, optional RainViewer radar overlay
- **Hourly and 7-day rainfall outlook** for the city, plus observed monsoon totals (2026 vs 2025 vs 10-year mean) from the Open-Meteo archive
- **Alert cards** ranked by forecast rainfall, with emergency helplines (112, 1077, 1078)
- **Shared 10-minute refresh cycle** aligned to wall-clock boundaries; last payload cached in `localStorage` so reloads are instant and the countdown never lies
- **Bilingual** — English / हिंदी toggle across the entire UI
- **Accessibility** — skip link, text-size control, high-contrast mode, ARIA live regions, keyboard-navigable map cards
- **Offline-honest** — failed requests degrade to "—", never to sample numbers

## IMD colour code

| Colour | Next 24 h rainfall | Meaning |
|---|---|---|
| 🟩 Green | ≤ 64.4 mm | Normal |
| 🟨 Yellow | 64.5 – 115.5 mm | Be aware |
| 🟧 Orange | 115.6 – 204.4 mm | Be prepared |
| 🟥 Red | > 204.4 mm | Take action |

Thresholds as published by the India Meteorological Department for urban flood warnings.

## Architecture

```
Open-Meteo forecast ──┐
Open-Meteo archive  ──┼──▶ api.ts (fetch · match · threshold) ──▶ React hooks ──▶ UI
RainViewer radar    ──┤         │
OSM Overpass        ──┘         └── localStorage cache (stale-while-revalidate)
```

- `src/api.ts` — the entire data layer: typed fetchers, greedy nearest-coordinate matching so grid snapping cannot mis-assign points, IMD level function, refresh scheduling
- `src/data/geo.ts` — ward coordinates, waterways and landmarks exported from OpenStreetMap
- `src/components/RiskMap.tsx` — Leaflet map, radar overlay, popups
- `src/i18n.tsx` — bilingual string table and UI preferences (language, text size, contrast)

No server, no database, no API keys. The whole system is a static bundle plus open APIs.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle in dist/
npm run preview    # serve dist/ on http://localhost:4173
```

Node 18+ required.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the app and publishes it to **GitHub Pages**. After the first push:

1. Repo → *Settings* → *Pages*
2. *Source*: **GitHub Actions**

The live URL appears in the Actions run summary within a couple of minutes.

## Data sources & attribution

| Source | Used for |
|---|---|
| [Open-Meteo](https://open-meteo.com/) forecast API | Current conditions, hourly & 7-day rainfall |
| [Open-Meteo archive API](https://open-meteo.com/en/docs/historical-weather-api) | Observed monsoon totals |
| [RainViewer](https://www.rainviewer.com/) | Composite weather-radar overlay |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors | Basemap, waterways, landmarks (ODbL) |
| [IMD](https://mausam.imd.gov.in/) | Public colour-code thresholds (cited, not scraped) |

Place coordinates were geocoded with OSM Nominatim; waterway geometry via the Overpass API.

## Licence

[MIT](LICENSE) — see the full text. Map data © OpenStreetMap contributors, ODbL.

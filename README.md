# Weather App (Vite + React 18 + TypeScript)

Desktop-first weather app mirroring iOS Weather layout using only free/open data.

## Tech
- Vite + React 18 + TypeScript
- Tailwind CSS v4, Framer Motion, React Query, Zustand (persist), Zod, date-fns
- Leaflet + react-leaflet (v4) for radar overlays (RainViewer)

## Quick Start

### Prereqs
- Node.js 18+ (recommend 20 LTS)
- npm 9+

### Debian/Ubuntu
```bash
# 1) Install Node (Node 20 via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2) Clone and install deps
git clone <your_repo_url> weatherApp
cd weatherApp
npm ci

# 3) Run dev server
npm run dev
# Open the printed local URL (e.g., http://localhost:5173)

# 4) Production build + preview
npm run build
npm run preview
```

### Windows (PowerShell)
```powershell
# 1) Install Node.js 20 LTS from https://nodejs.org
# 2) Clone and install deps
cd $env:USERPROFILE
git clone <your_repo_url> weatherApp
cd weatherApp
npm ci

# 3) Run dev server
npm run dev
# Open the printed local URL

# 4) Production build + preview
npm run build
npm run preview
```

## Env
Create `.env.development` (optional) in project root:
```bash
VITE_ENABLE_N8N_INSIGHTS=false
VITE_N8N_INSIGHTS_URL=
```
Notes:
- If you enable Insights later, set both vars and restart `npm run dev`.

## Data Sources
- Open-Meteo Forecast/Air/Astronomy APIs
- Open-Meteo Geocoding API
- RainViewer public radar tiles

## n8n Insights (template only)
- Import `templates/n8n/insight-workflow.json` into n8n.
- Set workflow active and copy the public webhook URL.
- Update `.env.development`:
```bash
VITE_ENABLE_N8N_INSIGHTS=true
VITE_N8N_INSIGHTS_URL=<public_webhook_url>
```
- Restart dev server. Insight card will render a placeholder and can be wired to `lib/n8n.ts`.

## Notes
- Preferences and location persist in localStorage.
- On first load, the app requests geolocation; if denied, use the search box.
- Radar overlay uses RainViewer tiles (last ~hour).

## Common Commands
```bash
# Start dev server
npm run dev

# Type checking happens during build
npm run build

# Preview production build
npm run preview
```
